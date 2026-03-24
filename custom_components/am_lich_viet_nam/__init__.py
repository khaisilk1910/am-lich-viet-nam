"""The Vietnamese Lunar Calendar integration."""
import voluptuous as vol
import datetime
from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse
from homeassistant.config_entries import ConfigEntry
from homeassistant.helpers import config_validation as cv

from .const import DOMAIN
from .amlich_core import get_lunar_date, lunar_to_solar_extended, get_year_can_chi, get_lunar_leap_info

# Định nghĩa cấu trúc dữ liệu đầu vào (Bỏ is_leap_month đi)
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
        """Xử lý yêu cầu chuyển đổi ngày."""
        conv_type = call.data["conversion_type"]
        d = call.data["day"]
        m = call.data["month"]
        y = call.data["year"]

        try:
            if conv_type == "solar_to_lunar":
                # Kịch bản 1: Dương sang Âm
                try:
                    datetime.datetime(y, m, d)
                except ValueError:
                    return {"error": f"Ngày dương lịch {d}/{m}/{y} không tồn tại!"}

                lunar = await hass.async_add_executor_job(get_lunar_date, d, m, y)
                if not lunar:
                    return {"error": "Nằm ngoài phạm vi hỗ trợ (1800-2199)."}
                
                can_chi = get_year_can_chi(lunar.year)
                is_lunar_leap = (lunar.leap == 1)
                leap_month_of_year = await hass.async_add_executor_job(get_lunar_leap_info, lunar.year)
                
                response = {
                    "day": lunar.day,
                    "month": lunar.month,
                    "year": lunar.year,
                    "is_leap_month": is_lunar_leap,
                    "nam_can_chi": can_chi,
                    "formatted_date": f"{lunar.day}/{lunar.month}/{lunar.year}" + (" (Nhuận)" if is_lunar_leap else "")
                }
                
                # Logic phân tích nhuận cho chiều Dương -> Âm
                if leap_month_of_year > 0:
                    msg = f"Năm âm lịch {can_chi} ({lunar.year}) có nhuận tháng {leap_month_of_year}."
                    if lunar.month == leap_month_of_year:
                        msg += " Tháng bạn tra trùng ngay vào tháng Nhuận này!"
                        both_solar, _ = await hass.async_add_executor_job(lunar_to_solar_extended, lunar.day, lunar.month, lunar.year)
                        if is_lunar_leap:
                            response["ngay_duong_thang_thuong"] = both_solar.get("regular", "Không hợp lệ")
                            response["ngay_duong_thang_nhuan_la_ngay"] = f"{d}/{m}/{y}" # Chính là ngày đang tra
                        else:
                            response["ngay_duong_thang_thuong_la_ngay"] = f"{d}/{m}/{y}" # Chính là ngày đang tra
                            response["ngay_duong_thang_nhuan"] = both_solar.get("leap", "Không hợp lệ")
                    response["thong_bao_nhuan"] = msg
                    response["thang_nhuan_cua_nam"] = leap_month_of_year
                else:
                    response["thong_bao_nhuan"] = f"Năm âm lịch {can_chi} ({lunar.year}) không có tháng nhuận."
                    response["thang_nhuan_cua_nam"] = 0
                    
                return response
                
            else:
                # Kịch bản 2: Âm sang Dương
                both_solar, leap_month_of_year = await hass.async_add_executor_job(lunar_to_solar_extended, d, m, y)
                can_chi = get_year_can_chi(y)
                
                if not both_solar:
                     return {"error": f"Ngày {d}/{m}/{y} âm lịch không tồn tại (hãy kiểm tra lại số ngày trong tháng)."}
                     
                response = {
                    "nam_can_chi": can_chi,
                    "thang_nhuan_cua_nam": leap_month_of_year
                }
                
                if leap_month_of_year > 0:
                    msg = f"Năm âm lịch {can_chi} ({y}) có nhuận tháng {leap_month_of_year}."
                    if m == leap_month_of_year:
                        msg += " Tháng bạn đang quy đổi chính là tháng nhuận! Dưới đây là 2 kết quả:"
                        response["thong_bao_nhuan"] = msg
                        response["ngay_duong_cua_thang_thuong"] = both_solar.get("regular", "Ngày này không tồn tại trong tháng thường (tháng thiếu)")
                        response["ngay_duong_cua_thang_nhuan"] = both_solar.get("leap", "Ngày này không tồn tại trong tháng nhuận")
                        # Dự phòng 1 trường mặc định
                        response["formatted_date"] = both_solar.get("regular", both_solar.get("leap"))
                    else:
                        response["thong_bao_nhuan"] = msg
                        response["formatted_date"] = both_solar.get("regular", "Lỗi")
                else:
                    response["thong_bao_nhuan"] = f"Năm âm lịch {can_chi} ({y}) không có tháng nhuận."
                    response["formatted_date"] = both_solar.get("regular", "Lỗi")

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
