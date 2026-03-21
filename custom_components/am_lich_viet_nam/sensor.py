class AmLichEventSensor(SensorEntity):
    def __init__(self, entry: ConfigEntry):
        self._entry = entry
        self._event_name = entry.data.get("event_name", "Sự kiện")
        self._event_date = entry.data.get("event_date", "1/1")
        self._event_description = entry.data.get("event_description", "")
        
        self._attr_name = self._event_name
        self._attr_unique_id = f"amlich_event_{entry.entry_id}"
        self._attr_icon = "mdi:calendar-clock"
        self._attr_native_unit_of_measurement = "ngày"

    async def async_update(self):
        # ... (giữ nguyên logic tính toán ev_jd của bạn)
        # Trong phần gán self._attr_extra_state_attributes:
        self._attr_extra_state_attributes = {
            "chi_tiet": self._event_description,
            "ngay_am_lich_su_kien": self._event_date,
            "ngay_duong_lich_tuong_ung": event_datetime.strftime("%d/%m/%Y"),
            "thu_trong_tuan": THU[event_datetime.weekday()]
        }

class DuongLichEventSensor(SensorEntity):
    def __init__(self, entry: ConfigEntry):
        self._entry = entry
        self._event_name = entry.data.get("event_name", "Sự kiện")
        self._event_date = entry.data.get("event_date", "1/1")
        self._event_description = entry.data.get("event_description", "")
        
        self._attr_name = self._event_name
        self._attr_unique_id = f"duonglich_event_{entry.entry_id}"
        self._attr_icon = "mdi:calendar-star"
        self._attr_native_unit_of_measurement = "ngày"

    async def async_update(self):
        # ... (giữ nguyên logic tính toán của bạn)
        # Trong phần gán self._attr_extra_state_attributes:
        self._attr_extra_state_attributes = {
            "chi_tiet": self._event_description,
            "ngay_duong_lich_su_kien": self._event_date,
            "ngay_am_lich_tuong_ung": ngay_am_str,
            "thu_trong_tuan": THU[event_date_this_year.weekday()]
        }
