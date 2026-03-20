import os
import json
import logging
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
    """Đọc file ở luồng phụ"""
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
        # 1. Thêm Sensor lịch hằng ngày
        async_add_entities([AmLichSensor(entry)], True)
        
        # 2. Quản lý danh sách các entity sự kiện để không bị trùng lặp
        active_entities = {}

        async def load_and_add_entities():
            # Đọc file không gây nghẽn Home Assistant
            events = await hass.async_add_executor_job(load_events_from_file, hass)
            new_entities = []
            
            for ev in events:
                ev_id = ev.get("id")
                if not ev_id: continue # Bỏ qua nếu lỗi không có ID
                
                if ev_id not in active_entities:
                    # Tạo sensor mới
                    if ev.get("type") == "solar":
                        entity = DuongLichEventSensor(ev_id, ev)
                    else:
                        entity = AmLichEventSensor(ev_id, ev)
                    
                    new_entities.append(entity)
                    active_entities[ev_id] = entity
                else:
                    # Nếu đã tồn tại, cập nhật dữ liệu (phục vụ cho trường hợp reload)
                    entity = active_entities[ev_id]
                    entity.update_data(ev)
                    entity.async_schedule_update_ha_state(True)

            # Thêm hàng loạt các entity mới vào HA
            if new_entities:
                async_add_entities(new_entities, True)

        @callback
        def handle_reload_signal():
            """Hàm mồi bắt tín hiệu để chạy tiến trình quét file"""
            hass.async_create_task(load_and_add_entities())

        # Lắng nghe tín hiệu khi user thêm sự kiện hoặc gọi service
        async_dispatcher_connect(hass, SIGNAL_RELOAD_EVENTS, handle_reload_signal)
        
        # Chạy quét file lần đầu khi khởi động HA
        await load_and_add_entities()
        
    else:
        # Giữ lại logic cũ để tương thích ngược với các sự kiện người dùng đã tạo từ phiên bản trước
        event_type = entry.data.get("event_type", "lunar")
        if event_type == "solar":
            async_add_entities([DuongLichEventSensor(entry.entry_id, entry.data)], True)
        else:
            async_add_entities([AmLichEventSensor(entry.entry_id, entry.data)], True)


class AmLichSensor(SensorEntity):
    # ... (Giữ nguyên toàn bộ Class AmLichSensor của bạn không thay đổi) ...
    def __init__(self, entry: ConfigEntry):
        self._entry = entry
        self._attr_name = "Âm lịch hằng ngày"
        self._attr_unique_id = "amlich_hangngay"
        self._attr_icon = "mdi:calendar-today-outline"
        self._attr_native_value = None
        self._attr_extra_state_attributes = {}

    async def async_update(self):
        now = datetime.now()
        lunar = get_lunar_date(now.day, now.month, now.year)

        if not lunar:
            self._attr_native_value = "Lỗi: Không thể tính toán"
            return
            
        jd = lunar.jd
        thu = THU[now.weekday()]
        thang_chu = get_month_name(lunar.month, lunar.leap == 1)
        thang_am_length = get_lunar_month_length(lunar)
        thang_am_day_type = "Tháng Đủ (30 ngày)" if thang_am_length == 30 else "Tháng Thiếu (29 ngày)"
        
        can_chi_day, can_chi_month, can_chi_year = get_can_chi_day_month_year(lunar)
        can_chi_hour_0 = get_can_hour_0(jd)
        
        solar_holiday_key = f"{now.day}/{now.month}"
        solar_holiday = NGAY_LE_DL.get(solar_holiday_key, "Không Có")
        
        lunar_holiday = NGAY_LE_AL.get(f"{lunar.day}/{lunar.month}") if lunar.leap == 0 else None
        lunar_holiday = lunar_holiday if lunar_holiday else "Không Có"
        
        ngay_thong_tin = NGAY_THONG_TIN.get(can_chi_day, {})
        
        summary = f"{thu}, {lunar.day} {thang_chu} năm {can_chi_year}"
        self._attr_native_value = summary
        
        self._attr_extra_state_attributes = {
            "solar_date": now.strftime("%d/%m/%Y"),
            "weekday": thu,
            "lunar_day": lunar.day,
            "lunar_month": lunar.month,
            "lunar_year": lunar.year,
            "is_leap_month": lunar.leap == 1,
            "month_name": thang_chu,
            "lunar_month_type": thang_am_day_type,
            "lunar_date": f"{lunar.day:02}/{lunar.month:02}/{lunar.year}",
            "can_chi_day": can_chi_day,
            "can_chi_month": can_chi_month,
            "can_chi_year": can_chi_year,
            "can_chi_hour_0": can_chi_hour_0,
            "solar_holiday": solar_holiday,
            "lunar_holiday": lunar_holiday,
            "tiet_khi": get_tiet_khi(jd),
            "gio_hoang_dao": get_gio_hoang_dao(jd),
            "gio_hac_dao": get_gio_hac_dao(jd),
            "huong_xuat_hanh": get_huong_xuat_hanh(jd),
            "thap_nhi_truc": get_thap_nhi_truc(jd),
            "nhi_thap_bat_tu": get_nhi_thap_bat_tu(jd),
            "ngay_chi_tiet": ngay_thong_tin.get('chiTiet', []),
            "ngay_mo_ta": ngay_thong_tin.get('moTa', '')
        }

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
        self._attr_name = self._event_name

    async def async_update(self):
        # ... (Giữ nguyên phần tính toán cũ) ...
        now = datetime.now()
        lunar = get_lunar_date(now.day, now.month, now.year)
        if not lunar:
            self._attr_native_value = "Lỗi"
            return

        try:
            parts = self._event_date.replace("-", "/").split('/')
            t_day = int(parts[0])
            t_month = int(parts[1])
        except (ValueError, IndexError):
            self._attr_native_value = "Sai định dạng ngày"
            return

        cur_jd = lunar.jd
        ev_jd = None

        for year_offset in range(3):
            try:
                ly = get_year_info(lunar.year + year_offset)
                for i in range(len(ly)):
                    m_info = ly[i]
                    if m_info.month == t_month and m_info.leap == 0:
                        if i + 1 < len(ly):
                            m_len = ly[i+1].jd - m_info.jd
                        else:
                            try:
                                next_ly = get_year_info(lunar.year + year_offset + 1)
                                m_len = next_ly[0].jd - m_info.jd
                            except ValueError:
                                m_len = 30
                        
                        actual_day = min(t_day, m_len)
                        temp_jd = m_info.jd + actual_day - 1
                        
                        if temp_jd >= cur_jd:
                            ev_jd = temp_jd
                            break
                if ev_jd is not None:
                    break
            except ValueError:
                continue

        if ev_jd is not None:
            days_left = int(ev_jd - cur_jd)
            self._attr_native_value = days_left
            today_start = datetime(now.year, now.month, now.day)
            event_datetime = today_start + timedelta(days=days_left)
            
            self._attr_extra_state_attributes = {
                "ngay_am_lich_su_kien": self._event_date,
                "ngay_duong_lich_tuong_ung": event_datetime.strftime("%d/%m/%Y"),
                "thu_trong_tuan": THU[event_datetime.weekday()],
                "chi_tiet": self._event_details
            }
        else:
            self._attr_native_value = "Không tính được"
            self._attr_extra_state_attributes = {}

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
        self._attr_name = self._event_name

    async def async_update(self):
        # ... (Giữ nguyên phần tính toán cũ) ...
        now = datetime.now()
        try:
            parts = self._event_date.replace("-", "/").split('/')
            t_day = int(parts[0])
            t_month = int(parts[1])
        except (ValueError, IndexError):
            self._attr_native_value = "Sai định dạng ngày"
            return

        target_year = now.year
        
        try:
            event_date_this_year = datetime(target_year, t_month, t_day)
        except ValueError:
            if t_month == 2 and t_day == 29:
                event_date_this_year = datetime(target_year, 3, 1) 
            else:
                self._attr_native_value = "Ngày không hợp lệ"
                return

        today_start = datetime(now.year, now.month, now.day)
        
        if event_date_this_year < today_start:
            target_year += 1
            try:
                event_date_this_year = datetime(target_year, t_month, t_day)
            except ValueError:
                if t_month == 2 and t_day == 29:
                    event_date_this_year = datetime(target_year, 3, 1)

        days_left = (event_date_this_year - today_start).days
        self._attr_native_value = days_left
        
        lunar_equiv = get_lunar_date(event_date_this_year.day, event_date_this_year.month, event_date_this_year.year)
        ngay_am_str = f"{lunar_equiv.day}/{lunar_equiv.month}" if lunar_equiv else "Không tính được"
        if lunar_equiv and lunar_equiv.leap == 1:
            ngay_am_str += " (Nhuận)"

        self._attr_extra_state_attributes = {
            "ngay_duong_lich_su_kien": self._event_date,
            "ngay_am_lich_tuong_ung": ngay_am_str,
            "thu_trong_tuan": THU[event_date_this_year.weekday()],
            "chi_tiet": self._event_details
        }
