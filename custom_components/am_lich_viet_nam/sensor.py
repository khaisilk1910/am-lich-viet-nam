from datetime import datetime, timedelta
import logging
from homeassistant.components.sensor import SensorEntity
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import CONF_EVENTS

from .amlich_core import (
    get_lunar_date, get_year_can_chi, get_month_name, get_lunar_month_length, THU,
    get_can_chi_day_month_year, get_can_hour_0, get_tiet_khi, get_gio_hoang_dao,
    get_gio_hac_dao, get_huong_xuat_hanh, get_thap_nhi_truc, get_nhi_thap_bat_tu,
    NGAY_THONG_TIN, NGAY_LE_DL, NGAY_LE_AL, get_year_info
)

_LOGGER = logging.getLogger(__name__)

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback):
    """Set up the sensor from a config entry."""
    is_main = entry.data.get("is_main", entry.data.get("event_name") is None)
    
    if is_main:
        async_add_entities([AmLichSensor(entry)], True)
    else:
        # Nhận diện loại sự kiện (mặc định lunar để tương thích ngược với các sự kiện cũ)
        event_type = entry.data.get("event_type", "lunar")
        if event_type == "solar":
            async_add_entities([DuongLichEventSensor(entry)], True)
        else:
            async_add_entities([AmLichEventSensor(entry)], True)

class AmLichSensor(SensorEntity):
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
                "chi_tiet": self._event_description
            }
        else:
            self._attr_native_value = "Không tính được"
            self._attr_extra_state_attributes = {}

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
        now = datetime.now()
        try:
            parts = self._event_date.replace("-", "/").split('/')
            t_day = int(parts[0])
            t_month = int(parts[1])
        except (ValueError, IndexError):
            self._attr_native_value = "Sai định dạng ngày"
            return

        target_year = now.year
        
        # Xử lý an toàn cho ngày 29/2
        try:
            event_date_this_year = datetime(target_year, t_month, t_day)
        except ValueError:
            if t_month == 2 and t_day == 29:
                event_date_this_year = datetime(target_year, 3, 1) # Không nhuận thì dời sang 1/3
            else:
                self._attr_native_value = "Ngày không hợp lệ"
                return

        today_start = datetime(now.year, now.month, now.day)
        
        # Nếu ngày sự kiện trong năm nay đã qua, tính cho năm sau
        if event_date_this_year < today_start:
            target_year += 1
            try:
                event_date_this_year = datetime(target_year, t_month, t_day)
            except ValueError:
                if t_month == 2 and t_day == 29:
                    event_date_this_year = datetime(target_year, 3, 1)

        days_left = (event_date_this_year - today_start).days
        self._attr_native_value = days_left
        
        # Tính ngày Âm lịch tương ứng (cho ngầu)
        lunar_equiv = get_lunar_date(event_date_this_year.day, event_date_this_year.month, event_date_this_year.year)
        ngay_am_str = f"{lunar_equiv.day}/{lunar_equiv.month}" if lunar_equiv else "Không tính được"
        if lunar_equiv and lunar_equiv.leap == 1:
            ngay_am_str += " (Nhuận)"

        self._attr_extra_state_attributes = {
            "ngay_duong_lich_su_kien": self._event_date,
            "ngay_am_lich_tuong_ung": ngay_am_str,
            "thu_trong_tuan": THU[event_date_this_year.weekday()],
            "chi_tiet": self._event_description
        }
