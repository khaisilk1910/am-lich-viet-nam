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
            return self.async_create_entry(
                title="Âm lịch Việt Nam", 
                data={}, 
                options={CONF_EVENTS: []}
            )

        # Thêm data_schema trống để tránh cảnh báo form từ HA
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({})
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        return AmLichOptionsFlowHandler(config_entry)


class AmLichOptionsFlowHandler(config_entries.OptionsFlow):
    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        """Initialize options flow."""
        self.config_entry = config_entry

    async def async_step_init(self, user_input=None):
        """Bước 1: Menu chính (Sử dụng Form thay cho Menu để tránh lỗi 500)"""
        events = self.config_entry.options.get(CONF_EVENTS)
        if not isinstance(events, list):
            events = []

        if user_input is not None:
            if user_input.get("hanh_dong") == "Thêm sự kiện":
                return await self.async_step_add_event()
            elif user_input.get("hanh_dong") == "Xóa sự kiện":
                return await self.async_step_remove_event()

        actions = ["Thêm sự kiện"]
        if len(events) > 0:
            actions.append("Xóa sự kiện")

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema({
                vol.Required("hanh_dong", default="Thêm sự kiện"): vol.In(actions)
            })
        )

    async def async_step_add_event(self, user_input=None):
        """Bước 2: Form nhập sự kiện mới"""
        events = list(self.config_entry.options.get(CONF_EVENTS, []))
        
        if user_input is not None:
            events.append({
                "name": user_input.get("ten_su_kien", ""),
                "date": user_input.get("ngay_am_lich", "")
            })
            return self.async_create_entry(title="", data={CONF_EVENTS: events})

        return self.async_show_form(
            step_id="add_event",
            data_schema=vol.Schema({
                vol.Required("ten_su_kien"): str,
                vol.Required("ngay_am_lich"): str,
            })
        )

    async def async_step_remove_event(self, user_input=None):
        """Bước 3: Form Xóa sự kiện"""
        events = list(self.config_entry.options.get(CONF_EVENTS, []))
        
        if not events:
            return await self.async_step_init()

        event_list = [f"{e.get('name')} ({e.get('date')})" for e in events]
        # Loại bỏ các chuỗi trùng lặp để tránh thư viện voluptuous báo lỗi
        event_list = list(dict.fromkeys(event_list))

        if user_input is not None:
            selected = user_input.get("chon_su_kien_de_xoa")
            new_events = [
                e for e in events 
                if f"{e.get('name')} ({e.get('date')})" != selected
            ]
            return self.async_create_entry(title="", data={CONF_EVENTS: new_events})
        
        return self.async_show_form(
            step_id="remove_event",
            data_schema=vol.Schema({
                vol.Required("chon_su_kien_de_xoa"): vol.In(event_list)
            })
        )
