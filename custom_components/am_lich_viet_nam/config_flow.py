import os
import json
import uuid
import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers import selector
from homeassistant.helpers.dispatcher import async_dispatcher_send
from .const import DOMAIN, FILE_EVENTS, SIGNAL_RELOAD_EVENTS

class AmLichConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        # Kích hoạt nút Cấu hình (Configure) trên giao diện tích hợp
        return AmLichOptionsFlowHandler(config_entry)

    def _save_event_to_json(self, event_data):
        file_path = self.hass.config.path(DOMAIN, FILE_EVENTS)
        events = []
        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as f:
                try:
                    events = json.load(f)
                except ValueError:
                    pass
        
        event_data["id"] = str(uuid.uuid4())
        events.append(event_data)
        
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(events, f, ensure_ascii=False, indent=4)

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
                return self.async_create_entry(title="Âm lịch Việt Nam", data={"is_main": True})

        actions_dict = {
            "main": "Lịch Âm Chính (Thông tin hằng ngày)",
            "su_kien_am_lich": "Thêm Sự kiện Âm lịch (Giỗ, Lễ...)",
            "su_kien_duong_lich": "Thêm Sự kiện Dương lịch (Sinh nhật...)"
        }

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({vol.Required("action", default="su_kien_am_lich"): vol.In(actions_dict)})
        )

    async def async_step_event_am_lich(self, user_input=None):
        if user_input is not None:
            event_data = {
                "type": "lunar",
                "event_name": user_input.get("event_name"),
                "event_date": user_input.get("event_date"),
                "remind_before": user_input.get("remind_before", 0),
                "event_details": user_input.get("event_details", "")
            }
            await self.hass.async_add_executor_job(self._save_event_to_json, event_data)
            async_dispatcher_send(self.hass, SIGNAL_RELOAD_EVENTS)
            return self.async_abort(reason="event_saved_to_json")

        return self.async_show_form(
            step_id="event_am_lich",
            data_schema=vol.Schema({
                vol.Required("event_name"): str,
                vol.Required("event_date", description={"suggested_value": "15/8"}): str,
                vol.Optional("remind_before", default=0): selector.NumberSelector(
                    selector.NumberSelectorConfig(min=0, max=30, step=1, mode=selector.NumberSelectorMode.BOX)
                ),
                vol.Optional("event_details"): selector.TextSelector(selector.TextSelectorConfig(multiline=True)),
            })
        )

    async def async_step_event_duong_lich(self, user_input=None):
        if user_input is not None:
            event_data = {
                "type": "solar",
                "event_name": user_input.get("event_name"),
                "event_date": user_input.get("event_date"),
                "remind_before": user_input.get("remind_before", 0),
                "event_details": user_input.get("event_details", "")
            }
            await self.hass.async_add_executor_job(self._save_event_to_json, event_data)
            async_dispatcher_send(self.hass, SIGNAL_RELOAD_EVENTS)
            return self.async_abort(reason="event_saved_to_json")

        return self.async_show_form(
            step_id="event_duong_lich",
            data_schema=vol.Schema({
                vol.Required("event_name"): str,
                vol.Required("event_date", description={"suggested_value": "1/1"}): str,
                vol.Optional("remind_before", default=0): selector.NumberSelector(
                    selector.NumberSelectorConfig(min=0, max=30, step=1, mode=selector.NumberSelectorMode.BOX)
                ),
                vol.Optional("event_details"): selector.TextSelector(selector.TextSelectorConfig(multiline=True)),
            })
        )

class AmLichOptionsFlowHandler(config_entries.OptionsFlow):
    """Giao diện quản lý sự kiện (Xóa sự kiện trực quan)"""
    def __init__(self, config_entry):
        self.config_entry = config_entry

    async def async_step_init(self, user_input=None):
        file_path = self.hass.config.path(DOMAIN, FILE_EVENTS)
        
        def _read_events():
            if os.path.exists(file_path):
                with open(file_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            return []

        events = await self.hass.async_add_executor_job(_read_events)

        if user_input is not None:
            events_to_delete = user_input.get("delete_events", [])
            if events_to_delete:
                new_events = [ev for ev in events if ev.get("id") not in events_to_delete]
                def _write_events():
                    with open(file_path, "w", encoding="utf-8") as f:
                        json.dump(new_events, f, ensure_ascii=False, indent=4)
                await self.hass.async_add_executor_job(_write_events)
                async_dispatcher_send(self.hass, SIGNAL_RELOAD_EVENTS)
            
            return self.async_create_entry(title="", data={})

        options = [
            selector.SelectOptionDict(value=ev.get("id", ""), label=f"{ev.get('event_name')} ({ev.get('event_date')})")
            for ev in events if ev.get("id")
        ]

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema({
                vol.Optional("delete_events"): selector.SelectSelector(
                    selector.SelectSelectorConfig(options=options, multiple=True, mode=selector.SelectSelectorMode.LIST)
                )
            })
        )
