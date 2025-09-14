"""The Vietnamese Lunar Calendar integration."""
from homeassistant.core import HomeAssistant
from homeassistant.config_entries import ConfigEntry

from .const import DOMAIN

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Âm lịch Việt Nam from a config entry."""
    await hass.config_entries.async_forward_entry_setups(entry, ["sensor"])
    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    # SỬA DÒNG BÊN DƯỚI
    return await hass.config_entries.async_forward_entry_unloads(entry, ["sensor"])
