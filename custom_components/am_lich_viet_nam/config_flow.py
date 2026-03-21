import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from .const import DOMAIN

# Bắt buộc cho ngày/tháng sự kiện (không có lựa chọn "Không chọn")
DAY_OPTIONS = {str(i): str(i) for i in range(1, 32)}
MONTH_OPTIONS = {str(i): str(i) for i in range(1, 13)}

# Tuỳ chọn cho năm sự kiện và ngày/tháng/năm sinh
DAY_OPTIONS_OPTIONAL = {"none": "Không chọn"}
DAY_OPTIONS_OPTIONAL.update({str(i): str(i) for i in range(1, 32)})

MONTH_OPTIONS_OPTIONAL = {"none": "Không chọn"}
MONTH_OPTIONS_OPTIONAL.update({str(i): str(i) for i in range(1, 13)})

YEAR_OPTIONS = {"none": "Không chọn"}
YEAR_OPTIONS.update({str(y): str(y) for y in range(1900, 2200)})

class AmLichOptionsFlowHandler(config_entries.OptionsFlow):
    """Xử lý cấu hình lại (sửa chữa) các Entry đã tạo."""
    
    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        """Khởi tạo options flow."""
        self._entry = config_entry

    async def async_step_init(self, user_input=None):
        """Quản lý các tuỳ chọn sửa đổi."""
        is_main = self._entry.data.get("is_main")
        if is_main is None:
            is_main = self._entry.data.get("event_name") is None
        
        if is_main:
            if user_input is not None:
                return self.async_create_entry(title="", data={})
            return self.async_show_form(
                step_id="init", 
                data_schema=vol.Schema({
                    vol.Optional("thong_bao", default="Cảm biến chính không cần cấu hình thêm. Bấm LƯU/SUBMIT để đóng."): str
                })
            )

        # Xử lý cập nhật cho sự kiện
        if user_input is not None:
            # Ép kiểu dữ liệu về Int để lưu trữ đồng nhất, bỏ qua "none"
            for key in ["event_day", "event_month", "event_year", "birth_day", "birth_month", "birth_year"]:
                val = user_input.get(key)
                if val == "none" or val == "":
                    user_input.pop(key, None)
                elif val is not None:
                    try:
                        user_input[key] = int(val)
                    except ValueError:
                        user_input.pop(key, None)

            self.hass.config_entries.async_update_entry(
                self._entry, 
                title=str(user_input.get("event_name", "Sự kiện")),
                options=user_input
            )
            return self.async_create_entry(title="", data=user_input)

        # Nạp dữ liệu cũ để hiện lên Form
        is_lunar = self._entry.options.get("event_type", self._entry.data.get("event_type", "lunar")) == "lunar"
        
        cur_name = str(self._entry.options.get("event_name", self._entry.data.get("event_name", self._entry.title or "Sự kiện")))
        cur_desc = str(self._entry.options.get("event_description", self._entry.data.get("event_description", "")))
        
        # Đọc dữ liệu (ép về string để hiển thị mượt trên UI dropdown)
        cur_day = self._entry.options.get("event_day", self._entry.data.get("event_day"))
        cur_month = self._entry.options.get("event_month", self._entry.data.get("event_month"))
        cur_year = self._entry.options.get("event_year", self._entry.data.get("event_year"))

        # Tương thích ngược với các entry cũ sử dụng "event_date"
        if cur_day is None or cur_month is None:
            old_date = self._entry.options.get("event_date", self._entry.data.get("event_date", "1/1"))
            try:
                parts = old_date.replace("-", "/").split('/')
                cur_day = parts[0]
                cur_month = parts[1]
            except:
                cur_day = "1"
                cur_month = "1"

        schema_dict = {
            vol.Required("event_name", default=cur_name): str,
            vol.Required("event_day", default=str(cur_day)): vol.In(DAY_OPTIONS),
            vol.Required("event_month", default=str(cur_month)): vol.In(MONTH_OPTIONS),
            vol.Optional("event_year", default=str(cur_year) if cur_year else "none"): vol.In(YEAR_OPTIONS),
        }

        # Hiển thị thêm các trường Năm sinh nếu là sự kiện Âm Lịch
        if is_lunar:
            b_day = self._entry.options.get("birth_day", self._entry.data.get("birth_day"))
            b_month = self._entry.options.get("birth_month", self._entry.data.get("birth_month"))
            b_year = self._entry.options.get("birth_year", self._entry.data.get("birth_year"))
            
            schema_dict.update({
                vol.Optional("birth_day", default=str(b_day) if b_day else "none"): vol.In(DAY_OPTIONS_OPTIONAL),
                vol.Optional("birth_month", default=str(b_month) if b_month else "none"): vol.In(MONTH_OPTIONS_OPTIONAL),
                vol.Optional("birth_year", default=str(b_year) if b_year else "none"): vol.In(YEAR_OPTIONS),
            })

        schema_dict[vol.Optional("event_description", default=cur_desc)] = str

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(schema_dict)
        )

class AmLichConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        return AmLichOptionsFlowHandler(config_entry)

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

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({
                vol.Required("action", default="su_kien_am_lich"): vol.In({
                    "main": "Lịch Âm Chính",
                    "su_kien_am_lich": "Sự kiện Âm lịch",
                    "su_kien_duong_lich": "Sự kiện Dương lịch"
                })
            })
        )

    async def async_step_event_am_lich(self, user_input=None):
        if user_input is not None:
            for key in ["event_day", "event_month", "event_year", "birth_day", "birth_month", "birth_year"]:
                val = user_input.get(key)
                if val == "none" or val == "":
                    user_input.pop(key, None)
                elif val is not None:
                    try:
                        user_input[key] = int(val)
                    except ValueError:
                        user_input.pop(key, None)

            return self.async_create_entry(
                title=str(user_input.get("event_name", "Sự kiện")), 
                data={
                    "is_main": False,
                    "event_type": "lunar",
                    "event_name": str(user_input.get("event_name", "")),
                    "event_day": user_input.get("event_day"),
                    "event_month": user_input.get("event_month"),
                    "event_year": user_input.get("event_year"),
                    "birth_day": user_input.get("birth_day"),
                    "birth_month": user_input.get("birth_month"),
                    "birth_year": user_input.get("birth_year"),
                    "event_description": str(user_input.get("event_description", ""))
                }
            )

        return self.async_show_form(
            step_id="event_am_lich",
            data_schema=vol.Schema({
                vol.Required("event_name"): str,
                vol.Required("event_day", default="15"): vol.In(DAY_OPTIONS),
                vol.Required("event_month", default="8"): vol.In(MONTH_OPTIONS),
                vol.Optional("event_year", default="none"): vol.In(YEAR_OPTIONS),
                vol.Optional("birth_day", default="none"): vol.In(DAY_OPTIONS_OPTIONAL),
                vol.Optional("birth_month", default="none"): vol.In(MONTH_OPTIONS_OPTIONAL),
                vol.Optional("birth_year", default="none"): vol.In(YEAR_OPTIONS),
                vol.Optional("event_description", default=""): str,
            })
        )

    async def async_step_event_duong_lich(self, user_input=None):
        if user_input is not None:
            for key in ["event_day", "event_month", "event_year"]:
                val = user_input.get(key)
                if val == "none" or val == "":
                    user_input.pop(key, None)
                elif val is not None:
                    try:
                        user_input[key] = int(val)
                    except ValueError:
                        user_input.pop(key, None)

            return self.async_create_entry(
                title=str(user_input.get("event_name", "Sự kiện")), 
                data={
                    "is_main": False,
                    "event_type": "solar",
                    "event_name": str(user_input.get("event_name", "")),
                    "event_day": user_input.get("event_day"),
                    "event_month": user_input.get("event_month"),
                    "event_year": user_input.get("event_year"),
                    "event_description": str(user_input.get("event_description", ""))
                }
            )

        return self.async_show_form(
            step_id="event_duong_lich",
            data_schema=vol.Schema({
                vol.Required("event_name"): str,
                vol.Required("event_day", default="1"): vol.In(DAY_OPTIONS),
                vol.Required("event_month", default="1"): vol.In(MONTH_OPTIONS),
                vol.Optional("event_year", default="none"): vol.In(YEAR_OPTIONS),
                vol.Optional("event_description", default=""): str,
            })
        )
