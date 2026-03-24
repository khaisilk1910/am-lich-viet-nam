"""The Vietnamese Lunar Calendar integration."""
import voluptuous as vol
import datetime
from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse
from homeassistant.config_entries import ConfigEntry
from homeassistant.helpers import config_validation as cv

from .const import DOMAIN
from .amlich_core import get_lunar_date, lunar_to_solar_extended, get_year_can_chi, get_lunar_leap_info

SERVICE_CONVERT_SCHEMA = vol.Schema({
    vol.Required("conversion_type"): vol.In(["solar_to_lunar", "lunar_to_solar"]),
    vol.Required("day"): cv.positive_int,
    vol.Required("month"): cv.positive_int,
    vol.Required("year"): cv.positive_int,
})

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Âm lịch Việt Nam from a config entry."""
    await hass.config_entries.async_forward_entry_setups(entry, ["sensor"])
    entry.async_on_unload(entry.add_update_listener(update_listener))
    
    async def handle_convert_date(call: ServiceCall) -> ServiceResponse:
        conv_type = call.data["conversion_type"]
        d = call.data["day"]
        m = call.data["month"]
        y = call.data["year"]

        try:
            if conv_type == "solar_to_lunar":
                # Đổi Dương sang Âm
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
                # Đổi Âm sang Dương
                both_solar, leap_month_of_year = await hass.async_add_executor_job(lunar_to_solar_extended, d, m, y)
                can_chi = get_year_can_chi(y)
                
                if not both_solar:
                     return {"error": f"Ngày {d}/{m}/{y} âm lịch không tồn tại."}
                     
                default_res = both_solar.get("regular", both_solar.get("leap"))
                     
                response = {
                    "ngay": default_res["ngay"],
                    "thang": default_res["thang"],
                    "nam": default_res["nam"],
                    "nam_can_chi": can_chi,
                    "ngay_am_lich": f"{int(d)}/{int(m)}/{int(y)}",
                    "ngay_duong_lich": default_res["ngay_duong_lich"]
                }
                
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
