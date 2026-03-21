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
        
        # SỬA LỖI 500: Giao diện HA không chấp nhận Form rỗng vol.Schema({}). 
        # Cần ít nhất 1 trường để hiển thị nếu là lịch chính.
        if is_main:
            if user_input is not None:
                return self.async_create_entry(title="", data={})
            return self.async_show_form(
                step_id="init", 
                data_schema=vol.Schema({
                    vol.Optional("thong_bao", default="Đây là cảm biến ngày tháng chính, không có thông số nào cần chỉnh sửa. Bấm SUBMIT/LƯU để đóng."): str
                })
            )

        if user_input is not None:
            # Lấy data cũ, cập nhật bằng data mới nhập
            new_data = dict(self.config_entry.data)
            new_data["event_name"] = user_input.get("Tên sự kiện")
            new_data["event_date"] = user_input.get("Ngày diễn ra")
            new_data["event_description"] = user_input.get("Chi tiết", "")
            
            # Ghi đè lại data của config_entry thay vì lưu vào options
            self.hass.config_entries.async_update_entry(
                self.config_entry, 
                title=new_data["event_name"], 
                data=new_data
            )
            return self.async_create_entry(title="", data={})

        # SỬA LỖI 500: Ép kiểu str() và bọc điều kiện or "" để đảm bảo giá trị nạp vào Form không bao giờ bị None
        cur_name = str(self.config_entry.data.get("event_name", self.config_entry.title) or "Sự kiện")
        cur_date = str(self.config_entry.data.get("event_date", "") or "")
        cur_desc = str(self.config_entry.data.get("event_description", "") or "")

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema({
                vol.Required("Tên sự kiện", default=cur_name): str,
                vol.Required("Ngày diễn ra", default=cur_date): str,
                vol.Optional("Chi tiết", default=cur_desc): str,
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
                title=user_input.get("Tên sự kiện"), 
                data={
                    "is_main": False,
                    "event_type": "lunar",
                    "event_name": str(user_input.get("Tên sự kiện") or ""),
                    "event_date": str(user_input.get("Ngày diễn ra") or ""),
                    "event_description": str(user_input.get("Chi tiết") or "")
                }
            )

        return self.async_show_form(
            step_id="event_am_lich",
            data_schema=vol.Schema({
                vol.Required("Tên sự kiện"): str,
                vol.Required("Ngày diễn ra", description={"suggested_value": "15/8"}): str,
                vol.Optional("Chi tiết", default=""): str,
            })
        )

    async def async_step_event_duong_lich(self, user_input=None):
        if user_input is not None:
            return self.async_create_entry(
                title=user_input.get("Tên sự kiện"), 
                data={
                    "is_main": False,
                    "event_type": "solar",
                    "event_name": str(user_input.get("Tên sự kiện") or ""),
                    "event_date": str(user_input.get("Ngày diễn ra") or ""),
                    "event_description": str(user_input.get("Chi tiết") or "")
                }
            )

        return self.async_show_form(
            step_id="event_duong_lich",
            data_schema=vol.Schema({
                vol.Required("Tên sự kiện"): str,
                vol.Required("Ngày diễn ra", description={"suggested_value": "1/1"}): str,
                vol.Optional("Chi tiết", default=""): str,
            })
        )
