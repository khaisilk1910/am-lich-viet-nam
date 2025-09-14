from homeassistant import config_entries
from .const import DOMAIN # Make sure to create a const.py or just use the string

class AmLichConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input=None):
        """Handle the initial step."""
        # Ensure only one instance of the integration can be configured
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is not None:
            return self.async_create_entry(title="Âm lịch Việt Nam", data={})

        return self.async_show_form(step_id="user")
