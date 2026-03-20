import os
import json
import logging
import uuid
from datetime import datetime, timedelta
from homeassistant.components.sensor import SensorEntity
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect

from .const import DOMAIN, FILE_EVENTS, SIGNAL_RELOAD_EVENTS
from .amlich_core import (
    get_lunar_date, get_year_can_chi, get_month_name, get_lunar_month_length, THU,
    get_can_chi_day_month_year, get_can_hour_0, get_tiet_khi, get_gio_hoang_dao,
    get_gio_hac_dao, get_huong_xuat_hanh, get_thap_nhi_truc, get_nhi_thap_bat_tu,
    NGAY_THONG_TIN, NGAY_LE_DL, NGAY_LE_AL, get_year_info
)

_LOGGER = logging.getLogger(__name__)

def load_events_from_file(hass):
    file_path = hass.config.path(DOMAIN, FILE_EVENTS)
    try:
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception as e:
        _LOGGER.error(f"Lỗi đọc file sự kiện JSON: {e}")
    return []

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback):
    is_main = entry.data.get("is_main", entry.data.get("event_name") is None)
    
    if is_main:
        async_add_entities([AmLichSensor(entry)], True)
        active_entities = {}

        async def load_and_add_entities():
            events = await hass.async_add_executor_job(load_events_from_file, hass)
            new_entities = []
            file_needs_update = False 
            
            # 1. Quét và thêm/cập nhật sự kiện
            current_ids = set()
            for ev in events:
                ev_id = ev.get("id")
                if not ev_id: 
                    ev_id = str(uuid.uuid4())
                    ev["id"] = ev_id
                    file_needs_update = True
                
                current_ids.add(ev_id)
                
                if ev_id not in active_entities:
                    entity = DuongLichEventSensor(ev_id, ev) if ev.get("type") == "solar" else AmLichEventSensor(ev_id, ev)
                    new_entities.append(entity)
                    active_entities[ev_id] = entity
                else:
                    entity = active_entities[ev_id]
                    entity.update_data(ev)
                    entity.async_schedule_update_ha_state(True)

            if new_entities:
                async_add_entities(new_entities, True)

            # 2. XÓA các sensor nếu người dùng đã xóa sự kiện trong file JSON/UI
            for ev_id in list(active_entities.keys()):
                if ev_id not in current_ids:
                    entity = active_entities.pop(ev_id)
                    hass.async_create_task(entity.async_remove(force_remove=True))

            # 3. Ghi lại file nếu có cấp ID mới
            if file_needs_update:
                def save_corrected_json():
                    file_path = hass.config.path(DOMAIN, FILE_EVENTS)
                    with open(file_path, "w", encoding="utf-8") as f:
                        json.dump(events, f, ensure_ascii=False, indent=4)
                await hass.async_add_executor_job(save_corrected_json)

        @callback
        def handle_reload_signal():
            hass.async_create_task(load_and_add_entities())

        async_dispatcher_connect(hass, SIGNAL_RELOAD_EVENTS, handle_reload_signal)
        await load_and_add_entities()
        
    else:
        # Tương thích ngược cũ
        event_type = entry.data.get("event_type", "lunar")
        if event_type == "solar":
            async_add_entities([DuongLichEventSensor(entry.entry_id, entry.data)], True)
        else:
            async_add_entities([AmLichEventSensor(entry.entry_id, entry.data)], True)

# --- Class AmLichSensor GIỮ NGUYÊN HOÀN TOÀN NHƯ CỦA BẠN (Mình thu gọn đoạn này để tránh lặp) ---
class AmLichSensor(SensorEntity):
    # (BẠN COPY NGUYÊN HÀM AmLichSensor CŨ CỦA BẠN VÀO ĐÂY, KHÔNG ĐỔI GÌ NHÉ)
    pass

class AmLichEventSensor(SensorEntity):
    def __init__(self, unique_id, data):
        self._data = data
        self._attr_unique_id = f"amlich_event_{unique_id}"
        self._attr_icon = "mdi:calendar-clock"
        self._attr_native_unit_of_measurement = "ngày"
        self._update_internal_data()

    def update_data(self, new_data):
        self._data = new_data
        self._update_internal_data()

    def _update_internal_data(self):
        self._event_name = self._data.get("event_name", "Sự kiện")
        self._event_date = self._data.get("event_date", "1/1")
        self._event_details = self._data.get("event_details", "")
        self._remind_before = int(self._data.get("remind_before", 0)) # Lấy số ngày nhắc
        self._attr_name = self._event_name

    async def async_update(self):
        now = datetime.now()
        lunar = get_lunar_date(now.day, now.month, now.year)
        if not lunar:
            self._attr_native_value = "Lỗi"
            return

        try:
            parts = self._event_date.replace("-", "/").split('/')
            t_day, t_month = int(parts[0]), int(parts[1])
        except (ValueError, IndexError):
            self._attr_native_value = "Sai định dạng"
            return

        cur_jd = lunar.jd
        ev_jd = None

        for year_offset in range(3):
            try:
                ly = get_year_info(lunar.year + year_offset)
                for i in range(len(ly)):
                    m_info = ly[i]
                    if m_info.month == t_month and m_info.leap == 0:
                        m_len = ly[i+1].jd - m_info.jd if i + 1 < len(ly) else (get_year_info(lunar.year + year_offset + 1)[0].jd - m_info.jd)
                        actual_day = min(t_day, m_len)
                        temp_jd = m_info.jd + actual_day - 1
                        if temp_jd >= cur_jd:
                            ev_jd = temp_jd
                            break
                if ev_jd is not None: break
            except ValueError: continue

        if ev_jd is not None:
            days_left = int(ev_jd - cur_jd)
            self._attr_native_value = days_left
            today_start = datetime(now.year, now.month, now.day)
            event_datetime = today_start + timedelta(days=days_left)
            
            # TÍNH NGÀY CHUẨN BỊ (Nhắc nhở)
            prep_date = event_datetime - timedelta(days=self._remind_before)

            self._attr_extra_state_attributes = {
                "ngay_am_lich_su_kien": self._event_date,
                "ngay_duong_lich_tuong_ung": event_datetime.strftime("%d/%m/%Y"),
                "thu_trong_tuan": THU[event_datetime.weekday()],
                "ngay_chuan_bi": prep_date.strftime("%d/%m/%Y") if self._remind_before > 0 else "Không cài đặt",
                "chi_tiet": self._event_details
            }
        else:
            self._attr_native_value = "Không tính được"

class DuongLichEventSensor(SensorEntity):
    def __init__(self, unique_id, data):
        self._data = data
        self._attr_unique_id = f"duonglich_event_{unique_id}"
        self._attr_icon = "mdi:calendar-star"
        self._attr_native_unit_of_measurement = "ngày"
        self._update_internal_data()

    def update_data(self, new_data):
        self._data = new_data
        self._update_internal_data()

    def _update_internal_data(self):
        self._event_name = self._data.get("event_name", "Sự kiện")
        self._event_date = self._data.get("event_date", "1/1")
        self._event_details = self._data.get("event_details", "")
        self._remind_before = int(self._data.get("remind_before", 0)) # Lấy số ngày nhắc
        self._attr_name = self._event_name

    async def async_update(self):
        now = datetime.now()
        try:
            parts = self._event_date.replace("-", "/").split('/')
            t_day, t_month = int(parts[0]), int(parts[1])
        except:
            self._attr_native_value = "Sai định dạng"
            return

        target_year = now.year
        try:
            event_date_this_year = datetime(target_year, t_month, t_day)
        except ValueError:
            event_date_this_year = datetime(target_year, 3, 1) if t_month == 2 and t_day == 29 else None
            
        if not event_date_this_year: return

        today_start = datetime(now.year, now.month, now.day)
        
        if event_date_this_year < today_start:
            target_year += 1
            try:
                event_date_this_year = datetime(target_year, t_month, t_day)
            except ValueError:
                event_date_this_year = datetime(target_year, 3, 1)

        days_left = (event_date_this_year - today_start).days
        self._attr_native_value = days_left
        
        lunar_equiv = get_lunar_date(event_date_this_year.day, event_date_this_year.month, event_date_this_year.year)
        ngay_am_str = f"{lunar_equiv.day}/{lunar_equiv.month}" + (" (Nhuận)" if lunar_equiv and lunar_equiv.leap == 1 else "") if lunar_equiv else "Lỗi"

        # TÍNH NGÀY CHUẨN BỊ
        prep_date = event_date_this_year - timedelta(days=self._remind_before)

        self._attr_extra_state_attributes = {
            "ngay_duong_lich_su_kien": self._event_date,
            "ngay_am_lich_tuong_ung": ngay_am_str,
            "thu_trong_tuan": THU[event_date_this_year.weekday()],
            "ngay_chuan_bi": prep_date.strftime("%d/%m/%Y") if self._remind_before > 0 else "Không cài đặt",
            "chi_tiet": self._event_details
        }
