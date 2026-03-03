import voluptuous as vol
from homeassistant import config_entries
from .const import DOMAIN

class AmLichConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input=None):
        if user_input is not None:
            action = user_input.get("action")
            if action == "su_kien":
                return await self.async_step_event()
            else:
                # Ngăn người dùng tạo 2 Lịch Âm Chính
                await self.async_set_unique_id("amlich_main")
                self._abort_if_unique_id_configured()
                return self.async_create_entry(
                    title="Âm lịch Việt Nam", 
                    data={"is_main": True}
                )

        actions_dict = {
            "main": "Lịch Âm Chính (Thông tin hằng ngày)",
            "su_kien": "Sự kiện Âm lịch (Đếm ngược ngày lễ, giỗ)"
        }

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({
                vol.Required("action", default="su_kien"): vol.In(actions_dict)
            })
        )

    async def async_step_event(self, user_input=None):
        """Bước tạo sự kiện mới"""
        if user_input is not None:
            return self.async_create_entry(
                title=user_input.get("event_name"), 
                data={
                    "is_main": False,
                    "event_name": user_input.get("event_name"),
                    "event_date": user_input.get("event_date")
                }
            )

        return self.async_show_form(
            step_id="event",
            data_schema=vol.Schema({
                vol.Required("event_name"): str,
                vol.Required("event_date"): str,
            })
        )
