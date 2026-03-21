import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers import selector
from .const import DOMAIN

class AmLichOptionsFlowHandler(config_entries.OptionsFlow):
    """Xử lý cấu hình lại (sửa chữa) các Entry đã tạo."""
    
    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        """Khởi tạo options flow."""
        super().__init__() # Bắt buộc phải có để HA không bị lỗi 500
        self.config_entry = config_entry

    async def async_step_init(self, user_input=None):
        """Quản lý các tuỳ chọn sửa đổi."""
        # Kiểm tra đây là lịch chính hay sự kiện
        is_main = self.config_entry.data.get("is_main")
        if is_main is None:
            is_main = self.config_entry.data.get("event_name") is None
        
        # Nếu là lịch chính -> Chỉ hiện thông báo
        if is_main:
            if user_input is not None:
                return self.async_create_entry(title="", data={})
            return self.async_show_form(
                step_id="init", 
                data_schema=vol.Schema({
                    vol.Optional("thong_bao", default="Cảm biến chính không cần cấu hình thêm. Bấm LƯU/SUBMIT để đóng."): selector.TextSelector(
                        selector.TextSelectorConfig(multiline=True)
                    )
                })
            )

        # Xử lý cập nhật cho sự kiện (Âm/Dương lịch)
        if user_input is not None:
            new_data = dict(self.config_entry.data)
            new_data["event_name"] = user_input.get("event_name")
            new_data["event_date"] = user_input.get("event_date")
            new_data["event_description"] = user_input.get("event_description", "")
            
            # Ghi đè vào config_entry gốc để lưu trữ dài hạn
            self.hass.config_entries.async_update_entry(
                self.config_entry, 
                title=new_data["event_name"], 
                data=new_data
            )
            return self.async_create_entry(title="", data={})

        # Nạp dữ liệu cũ để hiện lên Form
        cur_name = str(self.config_entry.data.get("event_name") or self.config_entry.title or "Sự kiện")
        cur_date = str(self.config_entry.data.get("event_date") or "")
        cur_desc = str(self.config_entry.data.get("event_description") or "")

        # Trả về form với native selector của HA thay vì str thuần túy
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema({
                vol.Required("event_name", default=cur_name): selector.TextSelector(),
                vol.Required("event_date", default=cur_date): selector.TextSelector(),
                vol.Optional("event_description", default=cur_desc): selector.TextSelector(
                    selector.TextSelectorConfig(multiline=True)
                ),
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

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({
                vol.Required("action", default="su_kien_am_lich"): vol.In({
                    "main": "Lịch Âm Chính",
                    "su_kien_am_lich": "Sự kiện Âm lịch",
                    "su_kien_duong_lich": "Sự kiện Dương lịch"
                })
            })
        )

    async def async_step_event_am_lich(self, user_input=None):
        if user_input is not None:
            return self.async_create_entry(
                title=str(user_input.get("event_name", "Sự kiện")), 
                data={
                    "is_main": False,
                    "event_type": "lunar",
                    "event_name": str(user_input.get("event_name", "")),
                    "event_date": str(user_input.get("event_date", "")),
                    "event_description": str(user_input.get("event_description", ""))
                }
            )

        return self.async_show_form(
            step_id="event_am_lich",
            data_schema=vol.Schema({
                vol.Required("event_name"): selector.TextSelector(),
                vol.Required("event_date", default="15/8"): selector.TextSelector(),
                vol.Optional("event_description", default=""): selector.TextSelector(
                    selector.TextSelectorConfig(multiline=True)
                ),
            })
        )

    async def async_step_event_duong_lich(self, user_input=None):
        if user_input is not None:
            return self.async_create_entry(
                title=str(user_input.get("event_name", "Sự kiện")), 
                data={
                    "is_main": False,
                    "event_type": "solar",
                    "event_name": str(user_input.get("event_name", "")),
                    "event_date": str(user_input.get("event_date", "")),
                    "event_description": str(user_input.get("event_description", ""))
                }
            )

        return self.async_show_form(
            step_id="event_duong_lich",
            data_schema=vol.Schema({
                vol.Required("event_name"): selector.TextSelector(),
                vol.Required("event_date", default="1/1"): selector.TextSelector(),
                vol.Optional("event_description", default=""): selector.TextSelector(
                    selector.TextSelectorConfig(multiline=True)
                ),
            })
        )
