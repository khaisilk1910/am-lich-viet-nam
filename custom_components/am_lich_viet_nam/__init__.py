"""The Vietnamese Lunar Calendar integration."""
from homeassistant.core import HomeAssistant
from homeassistant.config_entries import ConfigEntry

from .const import DOMAIN

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Âm lịch Việt Nam from a config entry."""
    await hass.config_entries.async_forward_entry_setups(entry, ["sensor"])
    
    # Lắng nghe sự kiện thay đổi tùy chọn (options update)
    entry.async_on_unload(entry.add_update_listener(update_listener))
    
    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    return await hass.config_entries.async_forward_entry_unloads(entry, ["sensor"])

async def update_listener(hass: HomeAssistant, entry: ConfigEntry):
    """Handle options update."""
    # Tải lại entry khi người dùng thay đổi dữ liệu từ UI
    await hass.config_entries.async_reload(entry.entry_id)
