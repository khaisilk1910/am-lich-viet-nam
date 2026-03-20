"""The Vietnamese Lunar Calendar integration."""
import os
import logging
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.config_entries import ConfigEntry
from homeassistant.helpers.dispatcher import async_dispatcher_send

from .const import DOMAIN, FILE_EVENTS, SIGNAL_RELOAD_EVENTS

_LOGGER = logging.getLogger(__name__)

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Âm lịch Việt Nam from a config entry."""
    hass.data.setdefault(DOMAIN, {})

    # 1. Đảm bảo thư mục config/am_lich_viet_nam tồn tại bằng luồng phụ (tránh nghẽn)
    config_dir = hass.config.path(DOMAIN)
    if not await hass.async_add_executor_job(os.path.exists, config_dir):
        await hass.async_add_executor_job(os.makedirs, config_dir)
        
    # 2. Đảm bảo file events.json tồn tại
    file_path = hass.config.path(DOMAIN, FILE_EVENTS)
    if not await hass.async_add_executor_job(os.path.exists, file_path):
        await hass.async_add_executor_job(
            lambda: open(file_path, "w", encoding="utf-8").write("[]")
        )

    await hass.config_entries.async_forward_entry_setups(entry, ["sensor"])

    # 3. Đăng ký Service để người dùng có thể gọi quét lại file JSON thủ công
    async def handle_reload(call: ServiceCall):
        _LOGGER.info("Đang gọi service quét lại file sự kiện Âm Lịch JSON...")
        async_dispatcher_send(hass, SIGNAL_RELOAD_EVENTS)

    hass.services.async_register(DOMAIN, "reload_events", handle_reload)

    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    # Gỡ bỏ service khi gỡ tích hợp
    hass.services.async_remove(DOMAIN, "reload_events")
    return await hass.config_entries.async_forward_entry_unloads(entry, ["sensor"])
