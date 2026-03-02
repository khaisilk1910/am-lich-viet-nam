import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback

from .const import DOMAIN, CONF_EVENTS

class AmLichConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input=None):
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is not None:
            return self.async_create_entry(title="Âm lịch Việt Nam", data={}, options={CONF_EVENTS: []})

        return self.async_show_form(step_id="user")

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        return AmLichOptionsFlowHandler(config_entry)


class AmLichOptionsFlowHandler(config_entries.OptionsFlow):

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        """Initialize options flow."""
        self.config_entry = config_entry
        self.events = list(config_entry.options.get(CONF_EVENTS, []))

    async def async_step_init(self, user_input=None):
        """Bước 1: Chọn hành động"""
        if user_input is not None:
            if user_input["action"] == "Thêm sự kiện mới":
                return await self.async_step_add_event()
            elif user_input["action"] == "Xóa sự kiện đã lưu":
                return await self.async_step_remove_event()

        # Đổi thành kiểu List (mảng) thay vì Dict để chống lỗi 500 trên UI của HA
        actions = ["Thêm sự kiện mới"]
        if self.events:
            actions.append("Xóa sự kiện đã lưu")

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema({
                vol.Required("action", default="Thêm sự kiện mới"): vol.In(actions)
            })
        )

    async def async_step_add_event(self, user_input=None):
        """Bước 2: Form nhập sự kiện mới"""
        if user_input is not None:
            self.events.append({
                "name": user_input["ten_su_kien"],
                "date": user_input["ngay_am_lich"]
            })
            return self.async_create_entry(title="", data={CONF_EVENTS: self.events})

        return self.async_show_form(
            step_id="add_event",
            data_schema=vol.Schema({
                vol.Required("ten_su_kien", default=""): str,
                vol.Required("ngay_am_lich", default=""): str,
            })
        )

    async def async_step_remove_event(self, user_input=None):
        """Bước 3: Chọn và Xóa sự kiện"""
        if user_input is not None:
            selected = user_input["chon_su_kien_de_xoa"]
            self.events = [e for e in self.events if f"{e['name']} ({e['date']})" != selected]
            return self.async_create_entry(title="", data={CONF_EVENTS: self.events})

        # Dùng List cho an toàn
        event_list = [f"{e['name']} ({e['date']})" for e in self.events]
        
        return self.async_show_form(
            step_id="remove_event",
            data_schema=vol.Schema({
                vol.Required("chon_su_kien_de_xoa"): vol.In(event_list)
            })
        )
