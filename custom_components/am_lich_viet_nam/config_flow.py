import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback

from .const import DOMAIN, CONF_EVENTS

ACTION_ADD = "Thêm sự kiện mới"
ACTION_REMOVE = "Xóa sự kiện (nếu có)"

class AmLichConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input=None):
        """Bước cài đặt ban đầu: Chỉ hiển thị nút Xác nhận, không hỏi thêm gì."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is not None:
            # Tạo Integration với mảng sự kiện rỗng
            return self.async_create_entry(title="Âm lịch Việt Nam", data={}, options={CONF_EVENTS: []})

        # Bảng xác nhận cài đặt trống (chỉ có nút Submit)
        return self.async_show_form(step_id="user")

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        return AmLichOptionsFlowHandler(config_entry)

class AmLichOptionsFlowHandler(config_entries.OptionsFlow):
    """Xử lý việc Thêm/Xóa sự kiện trong màn hình Cấu hình (Configure)."""

    def __init__(self, config_entry: config_entries.ConfigEntry):
        self.config_entry = config_entry
        # Đọc danh sách sự kiện hiện tại, nếu chưa có thì là mảng rỗng
        self.events = list(config_entry.options.get(CONF_EVENTS, []))

    async def async_step_init(self, user_input=None):
        """Bước chọn hành động (Thêm hoặc Xóa)."""
        if user_input is not None:
            if user_input["Hành động"] == ACTION_ADD:
                return await self.async_step_add_event()
            elif user_input["Hành động"] == ACTION_REMOVE:
                return await self.async_step_remove_event()

        actions = [ACTION_ADD]
        # Chỉ hiển thị lựa chọn Xóa nếu đang có ít nhất 1 sự kiện
        if self.events:
            actions.append(ACTION_REMOVE)

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema({
                vol.Required("Hành động", default=ACTION_ADD): vol.In(actions)
            })
        )

    async def async_step_add_event(self, user_input=None):
        """Bước nhập các trường cho sự kiện mới."""
        if user_input is not None:
            # Ghi nhận và lưu vào danh sách
            self.events.append({
                "name": user_input["Tên sự kiện (vd: Giỗ Mẹ)"],
                "date": user_input["Ngày âm lịch (vd: 13/2)"]
            })
            return self.async_create_entry(title="", data={CONF_EVENTS: self.events})

        # Hiển thị form gồm 2 trường nhập liệu riêng biệt
        return self.async_show_form(
            step_id="add_event",
            data_schema=vol.Schema({
                vol.Required("Tên sự kiện (vd: Giỗ Mẹ)"): str,
                vol.Required("Ngày âm lịch (vd: 13/2)"): str,
            })
        )

    async def async_step_remove_event(self, user_input=None):
        """Bước chọn và xóa sự kiện đã lưu."""
        if user_input is not None:
            selected = user_input["Chọn sự kiện để xóa"]
            # Lọc bỏ sự kiện vừa chọn
            self.events = [e for e in self.events if f"{e['name']} ({e['date']})" != selected]
            return self.async_create_entry(title="", data={CONF_EVENTS: self.events})

        # Tạo danh sách hiển thị cho dropdown
        event_list = [f"{e['name']} ({e['date']})" for e in self.events]
        return self.async_show_form(
            step_id="remove_event",
            data_schema=vol.Schema({
                vol.Required("Chọn sự kiện để xóa"): vol.In(event_list)
            })
        )
