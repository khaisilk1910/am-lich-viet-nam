import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers.selector import TextSelector, TextSelectorConfig, TextSelectorType

from .const import DOMAIN, CONF_CUSTOM_EVENTS

class AmLichConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input=None):
        """Handle the initial step."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is not None:
            # Lưu user_input vào options để đồng bộ với OptionsFlow sau này
            return self.async_create_entry(title="Âm lịch Việt Nam", data={}, options=user_input)

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({
                vol.Optional(CONF_CUSTOM_EVENTS, default=""): TextSelector(
                    TextSelectorConfig(type=TextSelectorType.TEXT, multiline=True)
                )
            })
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        """Get the options flow for this handler."""
        return AmLichOptionsFlowHandler(config_entry)

class AmLichOptionsFlowHandler(config_entries.OptionsFlow):
    """Handle options flow."""

    def __init__(self, config_entry: config_entries.ConfigEntry):
        """Initialize options flow."""
        self.config_entry = config_entry

    async def async_step_init(self, user_input=None):
        """Manage the options."""
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        # Đọc dữ liệu sự kiện đã nhập trước đó (nếu có)
        current_events = self.config_entry.options.get(CONF_CUSTOM_EVENTS, "")

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema({
                vol.Optional(CONF_CUSTOM_EVENTS, default=current_events): TextSelector(
                    TextSelectorConfig(type=TextSelectorType.TEXT, multiline=True)
                )
            })
        )
