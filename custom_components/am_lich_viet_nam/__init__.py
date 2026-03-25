"""The Vietnamese Lunar Calendar integration."""
import voluptuous as vol
import datetime
from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse
from homeassistant.config_entries import ConfigEntry
from homeassistant.helpers import config_validation as cv
from homeassistant.components.frontend import add_extra_js_url

from .const import DOMAIN
from .amlich_core import (
    get_lunar_date, lunar_to_solar_extended, get_year_can_chi, get_lunar_leap_info,
    get_can_chi_day_month_year, get_month_name, get_tiet_khi, get_gio_hoang_dao,
    get_gio_hac_dao, get_huong_xuat_hanh, get_thap_nhi_truc, get_nhi_thap_bat_tu,
    NGAY_THONG_TIN
)

# Khai báo đường dẫn ảo trên web và thư mục thực tế chứa UI
UI_URL_BASE = "/am_lich_viet_nam_ui"
UI_DIR_PATH = "frontend"

SERVICE_CONVERT_SCHEMA = vol.Schema({
    vol.Required("conversion_type"): vol.In(["solar_to_lunar", "lunar_to_solar"]),
    vol.Required("day"): cv.positive_int,
    vol.Required("month"): cv.positive_int,
    vol.Required("year"): cv.positive_int,
})

async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Được gọi khi Home Assistant khởi động để thiết lập các thành phần chung (Giao diện)."""
    
    # 1. Đăng ký đường dẫn tĩnh để Home Assistant đọc file từ thư mục /frontend
    hass.http.register_static_path(
        UI_URL_BASE,
        hass.config.path(f"custom_components/{DOMAIN}/{UI_DIR_PATH}"),
        False
    )

    # 2. Tự động thêm file JS chính vào tài nguyên Lovelace của người dùng
    add_extra_js_url(hass, f"{UI_URL_BASE}/lich-block-am-duong-viet-nam.js")

    return True

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Âm lịch Việt Nam from a config entry."""
    await hass.config_entries.async_forward_entry_setups(entry, ["sensor"])
    entry.async_on_unload(entry.add_update_listener(update_listener))
    
    async def handle_convert_date(call: ServiceCall) -> ServiceResponse:
        conv_type = call.data["conversion_type"]
        d = call.data["day"]
        m = call.data["month"]
        y = call.data["year"]

        def get_details(jd, lunar_obj):
            """Hàm tiện ích lấy chi tiết tử vi của một ngày Âm lịch"""
            can_chi_day, can_chi_month, can_chi_year = get_can_chi_day_month_year(lunar_obj)
            ngay_thong_tin = NGAY_THONG_TIN.get(can_chi_day, {})
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
                "ngay_mo_ta": ngay_thong_tin.get('moTa', ''),
                "ngay_chi_tiet": ngay_thong_tin.get('chiTiet', [])
            }

        try:
            if conv_type == "solar_to_lunar":
                try:
                    datetime.datetime(y, m, d)
                except ValueError:
                    return {"error": f"Ngày dương lịch {d}/{m}/{y} không tồn tại!"}

                lunar = await hass.async_add_executor_job(get_lunar_date, d, m, y)
                if not lunar:
                    return {"error": "Nằm ngoài phạm vi hỗ trợ (1800-2199)."}
                
                can_chi = get_year_can_chi(lunar.year)
                leap_month_of_year = await hass.async_add_executor_job(get_lunar_leap_info, lunar.year)
                
                response = {
                    "ngay": lunar.day,
                    "thang": lunar.month,
                    "nam": lunar.year,
                    "nam_can_chi": can_chi,
                    "ngay_duong_lich": f"{int(d)}/{int(m)}/{int(y)}",
                    "ngay_am_lich": f"{int(lunar.day)}/{int(lunar.month)}/{int(lunar.year)}" + (" (Nhuận)" if lunar.leap == 1 else "")
                }
                
                # Trích xuất chi tiết
                response["details"] = await hass.async_add_executor_job(get_details, lunar.jd, lunar)
                
                if leap_month_of_year > 0:
                    msg = f"Năm âm lịch {can_chi} ({lunar.year}) có nhuận tháng {leap_month_of_year}."
                    if lunar.month == leap_month_of_year:
                        msg += " Tháng bạn tra trùng ngay vào tháng Nhuận này!"
                        both_solar, _ = await hass.async_add_executor_job(lunar_to_solar_extended, lunar.day, lunar.month, lunar.year)
                        if lunar.leap == 1:
                            if "regular" in both_solar:
                                response["ngay_duong_thang_thuong"] = both_solar["regular"]["ngay_duong_lich"]
                            response["ngay_duong_thang_nhuan"] = f"{int(d)}/{int(m)}/{int(y)}"
                        else:
                            response["ngay_duong_thang_thuong"] = f"{int(d)}/{int(m)}/{int(y)}"
                            if "leap" in both_solar:
                                response["ngay_duong_thang_nhuan"] = both_solar["leap"]["ngay_duong_lich"]
                    response["thong_bao_nhuan"] = msg
                else:
                    response["thong_bao_nhuan"] = f"Năm âm lịch {can_chi} ({lunar.year}) không có tháng nhuận."
                    
                return response
                
            else:
                # Kịch bản 2: Âm sang Dương
                both_solar, leap_month_of_year = await hass.async_add_executor_job(lunar_to_solar_extended, d, m, y)
                can_chi = get_year_can_chi(y)
                
                if not both_solar:
                     return {"error": f"Ngày {d}/{m}/{y} âm lịch không tồn tại."}
                     
                default_res = both_solar.get("regular", both_solar.get("leap"))
                
                # Tính toán lại Object LunarDate để lấy JD phục vụ phong thủy
                lunar_obj_for_details = await hass.async_add_executor_job(
                    get_lunar_date, default_res["ngay"], default_res["thang"], default_res["nam"]
                )
                     
                response = {
                    "ngay": default_res["ngay"],
                    "thang": default_res["thang"],
                    "nam": default_res["nam"],
                    "nam_can_chi": can_chi,
                    "ngay_am_lich": f"{int(d)}/{int(m)}/{int(y)}",
                    "ngay_duong_lich": default_res["ngay_duong_lich"]
                }
                
                if lunar_obj_for_details:
                    response["details"] = await hass.async_add_executor_job(get_details, lunar_obj_for_details.jd, lunar_obj_for_details)
                
                if leap_month_of_year > 0:
                    msg = f"Năm âm lịch {can_chi} ({y}) có nhuận tháng {leap_month_of_year}."
                    if m == leap_month_of_year:
                        msg += " Tháng bạn đang quy đổi chính là tháng nhuận! Dưới đây là 2 kết quả:"
                        if "regular" in both_solar:
                            response["ngay_duong_thang_thuong"] = both_solar["regular"]["ngay_duong_lich"]
                        if "leap" in both_solar:
                            response["ngay_duong_thang_nhuan"] = both_solar["leap"]["ngay_duong_lich"]
                    response["thong_bao_nhuan"] = msg
                else:
                    response["thong_bao_nhuan"] = f"Năm âm lịch {can_chi} ({y}) không có tháng nhuận."

                return response
                
        except ValueError as e:
            return {"error": str(e)}
        except Exception as e:
            return {"error": f"Lỗi không xác định: {str(e)}"}

    hass.services.async_register(
        DOMAIN, "convert_date", handle_convert_date,
        schema=SERVICE_CONVERT_SCHEMA, supports_response=SupportsResponse.ONLY,
    )
    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, ["sensor"])
    if unload_ok:
        entries = hass.config_entries.async_entries(DOMAIN)
        if len([e for e in entries if e.state.name == "LOADED"]) == 1:
            hass.services.async_remove(DOMAIN, "convert_date")
    return unload_ok

async def update_listener(hass: HomeAssistant, entry: ConfigEntry):
    """Handle options update."""
    await hass.config_entries.async_reload(entry.entry_id)
