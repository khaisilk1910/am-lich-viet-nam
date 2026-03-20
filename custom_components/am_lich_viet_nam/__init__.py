"""The Vietnamese Lunar Calendar integration."""
import os
import json
import logging
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.config_entries import ConfigEntry
from homeassistant.helpers.dispatcher import async_dispatcher_send

from .const import DOMAIN, FILE_EVENTS, SIGNAL_RELOAD_EVENTS

_LOGGER = logging.getLogger(__name__)

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Âm lịch Việt Nam from a config entry."""
    hass.data.setdefault(DOMAIN, {})

    config_dir = hass.config.path(DOMAIN)
    if not await hass.async_add_executor_job(os.path.exists, config_dir):
        await hass.async_add_executor_job(os.makedirs, config_dir)
        
    file_path = hass.config.path(DOMAIN, FILE_EVENTS)
    if not await hass.async_add_executor_job(os.path.exists, file_path):
        await hass.async_add_executor_job(
            lambda: open(file_path, "w", encoding="utf-8").write("[]")
        )

    # Nạp cả Sensor và Calendar
    await hass.config_entries.async_forward_entry_setups(entry, ["sensor", "calendar"])

    # Service 1: Quét lại JSON
    async def handle_reload(call: ServiceCall):
        _LOGGER.info("Quét lại file sự kiện Âm Lịch JSON...")
        async_dispatcher_send(hass, SIGNAL_RELOAD_EVENTS)

    # Service 2: Xóa sự kiện theo ID
    async def handle_remove_event(call: ServiceCall):
        event_id = call.data.get("event_id")
        if not event_id:
            return

        def _delete_from_file():
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    events = json.load(f)
                
                new_events = [ev for ev in events if ev.get("id") != event_id]
                
                if len(new_events) < len(events):
                    with open(file_path, "w", encoding="utf-8") as f:
                        json.dump(new_events, f, ensure_ascii=False, indent=4)
                    return True
            except Exception as e:
                _LOGGER.error(f"Lỗi khi xóa sự kiện: {e}")
            return False

        success = await hass.async_add_executor_job(_delete_from_file)
        if success:
            async_dispatcher_send(hass, SIGNAL_RELOAD_EVENTS)

    hass.services.async_register(DOMAIN, "reload_events", handle_reload)
    hass.services.async_register(DOMAIN, "remove_event", handle_remove_event)

    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    hass.services.async_remove(DOMAIN, "reload_events")
    hass.services.async_remove(DOMAIN, "remove_event")
    return await hass.config_entries.async_forward_entry_unloads(entry, ["sensor", "calendar"])
