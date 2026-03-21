import voluptuous as vol
from homeassistant import config_entries
from .const import DOMAIN

class AmLichConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

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
                    "event_name": user_input.get("event_name"),
                    "event_date": user_input.get("event_date"),
                    "event_description": user_input.get("event_description")
                }
            )

        return self.async_show_form(
            step_id="event_am_lich",
            data_schema=vol.Schema({
                vol.Required("event_name", description={"suggested_value": "Tên sự kiện"}): str,
                vol.Required("event_date", description={"suggested_value": "Ngày tháng (Ngày/Tháng)"}): str,
                vol.Optional("event_description", description={"suggested_value": "Chi tiết sự kiện"}): str,
            })
        )

    async def async_step_event_duong_lich(self, user_input=None):
        if user_input is not None:
            return self.async_create_entry(
                title=user_input.get("event_name"), 
                data={
                    "is_main": False,
                    "event_type": "solar",
                    "event_name": user_input.get("event_name"),
                    "event_date": user_input.get("event_date"),
                    "event_description": user_input.get("event_description")
                }
            )

        return self.async_show_form(
            step_id="event_duong_lich",
            data_schema=vol.Schema({
                vol.Required("event_name", description={"suggested_value": "Tên sự kiện"}): str,
                vol.Required("event_date", description={"suggested_value": "Ngày tháng (Ngày/Tháng)"}): str,
                vol.Optional("event_description", description={"suggested_value": "Chi tiết sự kiện"}): str,
            })
        )
