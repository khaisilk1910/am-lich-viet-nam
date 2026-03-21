import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from .const import DOMAIN

class AmLichOptionsFlowHandler(config_entries.OptionsFlow):
    """Xử lý cấu hình lại (sửa chữa) các Entry đã tạo."""
    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        self.config_entry = config_entry

    async def async_step_init(self, user_input=None):
        """Quản lý các tuỳ chọn sửa đổi."""
        is_main = self.config_entry.data.get("is_main", self.config_entry.data.get("event_name") is None)
        
        # Xử lý cho cảm biến chính
        if is_main:
            if user_input is not None:
                return self.async_create_entry(title="", data={})
            return self.async_show_form(
                step_id="init", 
                data_schema=vol.Schema({
                    vol.Optional("thong_bao", default="Đây là cảm biến ngày tháng chính, không có thông số nào cần chỉnh sửa. Bấm SUBMIT/LƯU để đóng."): str
                })
            )

        # Xử lý cho cảm biến sự kiện khi có dữ liệu mới nhập vào
        if user_input is not None:
            new_data = dict(self.config_entry.data)
            # Lấy data dựa trên key chuẩn (không dấu)
            new_data["event_name"] = user_input.get("event_name")
            new_data["event_date"] = user_input.get("event_date")
            new_data["event_description"] = user_input.get("event_description", "")
            
            # Ghi đè lại data của config_entry thay vì lưu vào options
            self.hass.config_entries.async_update_entry(
                self.config_entry, 
                title=new_data["event_name"], 
                data=new_data
            )
            return self.async_create_entry(title="", data={})

        # Nạp dữ liệu cũ để hiển thị ra form
        cur_name = str(self.config_entry.data.get("event_name", self.config_entry.title) or "Sự kiện")
        cur_date = str(self.config_entry.data.get("event_date", "") or "")
        cur_desc = str(self.config_entry.data.get("event_description", "") or "")

        # SỬA LỖI 500 Ở ĐÂY: Sử dụng keys là biến chuẩn tiếng Anh (không khoảng trắng, không dấu)
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema({
                vol.Required("event_name", default=cur_name): str,
                vol.Required("event_date", default=cur_date): str,
                vol.Optional("event_description", default=cur_desc): str,
            })
        )


class AmLichConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        return AmLichOptionsFlowHandler(config_entry)

    async def async_step_user(self, user_input=None):
        if user_input is not None:
            action = user_input.get("action")
            if action == "su_kien_am_lich":
                return await self.async_step_event_am_lich()
            elif action == "su_kien_duong_lich":
                return await self.async_step_event_duong_lich()
            else:
                await self.async_set_unique_id("amlich_main")
                self._abort_if_unique_id_configured()
                return self.async_create_entry(
                    title="Âm lịch Việt Nam", 
                    data={"is_main": True}
                )

        actions_dict = {
            "main": "Lịch Âm Chính (Thông tin hằng ngày)",
            "su_kien_am_lich": "Sự kiện Âm lịch (Giỗ, Lễ Âm lịch...)",
            "su_kien_duong_lich": "Sự kiện Dương lịch (Sinh nhật, Kỷ niệm...)"
        }

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({
                vol.Required("action", default="su_kien_am_lich"): vol.In(actions_dict)
            })
        )

    async def async_step_event_am_lich(self, user_input=None):
        if user_input is not None:
            return self.async_create_entry(
                title=user_input.get("event_name"), 
                data={
                    "is_main": False,
                    "event_type": "lunar",
                    "event_name": str(user_input.get("event_name") or ""),
                    "event_date": str(user_input.get("event_date") or ""),
                    "event_description": str(user_input.get("event_description") or "")
                }
            )

        return self.async_show_form(
            step_id="event_am_lich",
            data_schema=vol.Schema({
                vol.Required("event_name"): str,
                vol.Required("event_date", description={"suggested_value": "15/8"}): str,
                vol.Optional("event_description", default=""): str,
            })
        )

    async def async_step_event_duong_lich(self, user_input=None):
        if user_input is not None:
            return self.async_create_entry(
                title=user_input.get("event_name"), 
                data={
                    "is_main": False,
                    "event_type": "solar",
                    "event_name": str(user_input.get("event_name") or ""),
                    "event_date": str(user_input.get("event_date") or ""),
                    "event_description": str(user_input.get("event_description") or "")
                }
            )

        return self.async_show_form(
            step_id="event_duong_lich",
            data_schema=vol.Schema({
                vol.Required("event_name"): str,
                vol.Required("event_date", description={"suggested_value": "1/1"}): str,
                vol.Optional("event_description", default=""): str,
            })
        )
