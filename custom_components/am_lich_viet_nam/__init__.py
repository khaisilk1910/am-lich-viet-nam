"""The Vietnamese Lunar Calendar integration."""

from __future__ import annotations

from datetime import date
import hashlib
import logging
from pathlib import Path
from typing import Any

import voluptuous as vol

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers import config_validation as cv

from .amlich_core import (
    NGAY_THONG_TIN,
    THU,
    get_can_chi_day_month_year,
    get_gio_hac_dao,
    get_gio_hoang_dao,
    get_huong_xuat_hanh,
    get_lunar_date,
    get_lunar_leap_info,
    get_month_name,
    get_nhi_thap_bat_tu,
    get_thap_nhi_truc,
    get_tiet_khi,
    get_year_can_chi,
    lunar_to_solar_extended,
)
from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

UI_URL_BASE = "/am_lich_viet_nam_ui"
UI_DIR_PATH = "frontend"
PLATFORMS: list[Platform] = [Platform.SENSOR]

FRONTEND_RESOURCES = (
    "lich-block-am-duong-viet-nam.js",
    "su-kien-am-lich-card.js",
    "lich-block-am-duong-viet-nam-bubble.js",
    "lich-tuan-am-duong-viet-nam.js",
)

SERVICE_CONVERT_SCHEMA = vol.Schema(
    {
        vol.Required("conversion_type"): vol.In(
            ["solar_to_lunar", "lunar_to_solar"]
        ),
        vol.Required("day"): vol.All(cv.positive_int, vol.Range(min=1, max=31)),
        vol.Required("month"): vol.All(cv.positive_int, vol.Range(min=1, max=12)),
        vol.Required("year"): vol.All(
            cv.positive_int, vol.Range(min=1800, max=2199)
        ),
    }
)


def _get_frontend_versions(frontend_path: str) -> dict[str, str]:
    """Return content hashes for all frontend resources in one executor job."""
    versions: dict[str, str] = {}
    base_path = Path(frontend_path)

    for file_name in FRONTEND_RESOURCES:
        file_path = base_path / file_name
        try:
            digest = hashlib.sha256()
            with file_path.open("rb") as resource_file:
                for chunk in iter(lambda: resource_file.read(128 * 1024), b""):
                    digest.update(chunk)
        except OSError as err:
            _LOGGER.warning(
                "Không thể đọc tài nguyên frontend %s; bỏ qua đăng ký (%s)",
                file_path,
                err,
            )
            continue

        versions[file_name] = digest.hexdigest()[:16]

    return versions


async def _async_register_frontend_resources(hass: HomeAssistant) -> None:
    """Register frontend modules once without mutating Lovelace storage."""
    domain_data = hass.data.setdefault(DOMAIN, {})
    if domain_data.get("frontend_resources_registered"):
        return

    frontend_path = hass.config.path("custom_components", DOMAIN, UI_DIR_PATH)
    versions = await hass.async_add_executor_job(
        _get_frontend_versions, frontend_path
    )

    for file_name, version in versions.items():
        add_extra_js_url(
            hass, f"{UI_URL_BASE}/{file_name}?hacstag={version}"
        )

    domain_data["frontend_resources_registered"] = bool(versions)


def _get_date_details(jd: int, lunar_obj: Any) -> dict[str, Any]:
    """Build detailed calendar information for an action response."""
    can_chi_day, can_chi_month, can_chi_year = get_can_chi_day_month_year(
        lunar_obj
    )
    day_info = NGAY_THONG_TIN.get(can_chi_day, {})
    return {
        "lunar_day": lunar_obj.day,
        "month_name": get_month_name(lunar_obj.month, lunar_obj.leap == 1),
        "can_chi_day": can_chi_day,
        "can_chi_month": can_chi_month,
        "can_chi_year": can_chi_year,
        "tiet_khi": get_tiet_khi(jd),
        "gio_hoang_dao": get_gio_hoang_dao(jd),
        "gio_hac_dao": get_gio_hac_dao(jd),
        "huong_xuat_hanh": get_huong_xuat_hanh(jd),
        "thap_nhi_truc": get_thap_nhi_truc(jd),
        "nhi_thap_bat_tu": get_nhi_thap_bat_tu(jd),
        "ngay_mo_ta": day_info.get("moTa", ""),
        "ngay_chi_tiet": day_info.get("chiTiet", []),
    }


def _convert_date(data: dict[str, Any]) -> dict[str, Any]:
    """Convert a date synchronously outside the Home Assistant event loop."""
    conversion_type = data["conversion_type"]
    day = int(data["day"])
    month = int(data["month"])
    year = int(data["year"])

    if conversion_type == "solar_to_lunar":
        try:
            solar_date = date(year, month, day)
        except ValueError as err:
            raise ValueError(
                f"Ngày dương lịch {day}/{month}/{year} không tồn tại"
            ) from err

        lunar = get_lunar_date(day, month, year)
        if not lunar:
            raise ValueError("Ngày nằm ngoài phạm vi hỗ trợ 1800-2199")

        year_can_chi = get_year_can_chi(lunar.year)
        leap_month = get_lunar_leap_info(lunar.year)
        response: dict[str, Any] = {
            "ngay": lunar.day,
            "thang": lunar.month,
            "nam": lunar.year,
            "nam_can_chi": year_can_chi,
            "thu": THU[solar_date.weekday()],
            "ngay_duong_lich": f"{day}/{month}/{year}",
            "ngay_am_lich": (
                f"{lunar.day}/{lunar.month}/{lunar.year}"
                + (" (Nhuận)" if lunar.leap == 1 else "")
            ),
            "details": _get_date_details(lunar.jd, lunar),
        }

        if leap_month > 0:
            message = (
                f"Năm âm lịch {year_can_chi} ({lunar.year}) "
                f"có nhuận tháng {leap_month}."
            )
            if lunar.month == leap_month:
                message += " Tháng bạn tra trùng ngay vào tháng Nhuận này!"
                both_solar, _ = lunar_to_solar_extended(
                    lunar.day, lunar.month, lunar.year
                )
                if lunar.leap == 1:
                    if "regular" in both_solar:
                        response["ngay_duong_thang_thuong"] = both_solar[
                            "regular"
                        ]["ngay_duong_lich"]
                    response["ngay_duong_thang_nhuan"] = f"{day}/{month}/{year}"
                else:
                    response["ngay_duong_thang_thuong"] = f"{day}/{month}/{year}"
                    if "leap" in both_solar:
                        response["ngay_duong_thang_nhuan"] = both_solar["leap"][
                            "ngay_duong_lich"
                        ]
            response["thong_bao_nhuan"] = message
        else:
            response["thong_bao_nhuan"] = (
                f"Năm âm lịch {year_can_chi} ({lunar.year}) không có tháng nhuận."
            )

        return response

    both_solar, leap_month = lunar_to_solar_extended(day, month, year)
    if not both_solar:
        raise ValueError(f"Ngày {day}/{month}/{year} âm lịch không tồn tại")

    default_result = both_solar.get("regular", both_solar.get("leap"))
    if not default_result:
        raise ValueError(f"Không thể quy đổi ngày {day}/{month}/{year} âm lịch")

    solar_date = date(
        default_result["nam"], default_result["thang"], default_result["ngay"]
    )
    lunar_for_details = get_lunar_date(
        default_result["ngay"],
        default_result["thang"],
        default_result["nam"],
    )
    year_can_chi = get_year_can_chi(year)
    response = {
        "ngay": default_result["ngay"],
        "thang": default_result["thang"],
        "nam": default_result["nam"],
        "nam_can_chi": year_can_chi,
        "thu": THU[solar_date.weekday()],
        "ngay_am_lich": f"{day}/{month}/{year}",
        "ngay_duong_lich": default_result["ngay_duong_lich"],
    }

    if lunar_for_details:
        response["details"] = _get_date_details(
            lunar_for_details.jd, lunar_for_details
        )

    if leap_month > 0:
        message = (
            f"Năm âm lịch {year_can_chi} ({year}) có nhuận tháng {leap_month}."
        )
        if month == leap_month:
            message += (
                " Tháng bạn đang quy đổi chính là tháng nhuận! "
                "Dưới đây là 2 kết quả:"
            )
            if "regular" in both_solar:
                response["ngay_duong_thang_thuong"] = both_solar["regular"][
                    "ngay_duong_lich"
                ]
            if "leap" in both_solar:
                response["ngay_duong_thang_nhuan"] = both_solar["leap"][
                    "ngay_duong_lich"
                ]
        response["thong_bao_nhuan"] = message
    else:
        response["thong_bao_nhuan"] = (
            f"Năm âm lịch {year_can_chi} ({year}) không có tháng nhuận."
        )

    return response


async def _async_handle_convert_date(
    hass: HomeAssistant, call: ServiceCall
) -> ServiceResponse:
    """Handle the convert_date action."""
    try:
        return await hass.async_add_executor_job(_convert_date, dict(call.data))
    except ValueError as err:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="invalid_date",
            translation_placeholders={"message": str(err)},
        ) from err
    except Exception as err:
        _LOGGER.exception("Không thể quy đổi ngày")
        raise HomeAssistantError(
            translation_domain=DOMAIN,
            translation_key="conversion_failed",
        ) from err


async def async_setup(hass: HomeAssistant, config: dict[str, Any]) -> bool:
    """Set up shared integration resources."""
    try:
        await hass.http.async_register_static_paths(
            [
                StaticPathConfig(
                    UI_URL_BASE,
                    hass.config.path("custom_components", DOMAIN, UI_DIR_PATH),
                    True,
                )
            ]
        )
        await _async_register_frontend_resources(hass)
    except Exception:  # Frontend failure must not block sensor/action setup.
        _LOGGER.exception("Không thể đăng ký frontend của Âm lịch Việt Nam")

    if not hass.services.has_service(DOMAIN, "convert_date"):

        async def async_handle_convert_date(call: ServiceCall) -> ServiceResponse:
            return await _async_handle_convert_date(hass, call)

        hass.services.async_register(
            DOMAIN,
            "convert_date",
            async_handle_convert_date,
            schema=SERVICE_CONVERT_SCHEMA,
            supports_response=SupportsResponse.ONLY,
        )

    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up a Vietnamese Lunar Calendar config entry."""
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry without removing shared actions or resources."""
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

