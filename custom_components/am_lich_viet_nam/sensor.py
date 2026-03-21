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
    NGAY_THONG_TIN, NGAY_LE_DL, NGAY_LE_AL, get_year_info, jd_to_date
)

_LOGGER = logging.getLogger(__name__)

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback):
    """Set up the sensor from a config entry."""
    is_main = entry.data.get("is_main", entry.data.get("event_name") is None)
    
    if is_main:
        async_add_entities([AmLichSensor(entry)], True)
    else:
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
        self._attr_unique_id = f"amlich_event_{entry.entry_id}"
        self._attr_icon = "mdi:calendar-clock"
        self._attr_native_unit_of_measurement = "ngày"
        self._attr_name = entry.options.get("event_name", entry.data.get("event_name", "Sự kiện"))

    async def async_update(self):
        event_name = self._entry.options.get("event_name", self._entry.data.get("event_name", "Sự kiện"))
        event_day = self._entry.options.get("event_day", self._entry.data.get("event_day"))
        event_month = self._entry.options.get("event_month", self._entry.data.get("event_month"))
        event_year = self._entry.options.get("event_year", self._entry.data.get("event_year"))
        event_description = self._entry.options.get("event_description", self._entry.data.get("event_description", ""))
        
        birth_day = self._entry.options.get("birth_day", self._entry.data.get("birth_day"))
        birth_month = self._entry.options.get("birth_month", self._entry.data.get("birth_month"))
        birth_year = self._entry.options.get("birth_year", self._entry.data.get("birth_year"))

        if event_day is None or event_month is None:
            old_date = self._entry.options.get("event_date", self._entry.data.get("event_date", "1/1"))
            try:
                parts = old_date.replace("-", "/").split('/')
                event_day = int(parts[0])
                event_month = int(parts[1])
            except:
                event_day = 1
                event_month = 1
                
        try:
            t_day = int(event_day)
            t_month = int(event_month)
        except ValueError:
            t_day = 1
            t_month = 1

        try:
            event_year = int(event_year) if event_year else None
        except ValueError:
            event_year = None
            
        try:
            birth_year = int(birth_year) if birth_year else None
        except ValueError:
            birth_year = None

        self._attr_name = event_name

        # --- 1. TÍNH TOÁN DỮ LIỆU SỰ KIỆN GỐC (TRONG QUÁ KHỨ) ---
        ngay_am_str = f"{t_day}/{t_month}"
        hist_solar_str = "Không rõ"
        hist_weekday = "Không rõ"
        nam_can_chi_str = "Không rõ"

        if event_year is not None:
            ngay_am_str = f"{t_day}/{t_month}/{event_year}"
            nam_can_chi_str = f"{get_year_can_chi(event_year)}/{event_year}"
            
            try:
                ly_hist = get_year_info(event_year)
                for i in range(len(ly_hist)):
                    m_info = ly_hist[i]
                    if m_info.month == t_month and m_info.leap == 0:
                        # Giới hạn số ngày nếu rơi vào tháng âm thiếu (29 ngày) ở quá khứ
                        if i + 1 < len(ly_hist):
                            m_len = ly_hist[i+1].jd - m_info.jd
                        else:
                            try:
                                next_ly = get_year_info(event_year + 1)
                                m_len = next_ly[0].jd - m_info.jd
                            except ValueError:
                                m_len = 30
                        
                        actual_day = min(t_day, m_len)
                        hist_jd = m_info.jd + actual_day - 1
                        h_d, h_m, h_y = jd_to_date(hist_jd)
                        hist_dt = datetime(h_y, h_m, h_d)
                        
                        hist_solar_str = hist_dt.strftime("%d/%m/%Y")
                        hist_weekday = THU[hist_dt.weekday()]
                        break
            except Exception:
                pass

        # --- 2. TÍNH TOÁN DỮ LIỆU SỰ KIỆN SẮP TỚI TƯƠNG LAI ---
        now = datetime.now()
        lunar = get_lunar_date(now.day, now.month, now.year)
        if not lunar:
            self._attr_native_value = "Lỗi"
            return

        cur_jd = lunar.jd
        ev_jd = None
        event_occurrence_year = None

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
                            event_occurrence_year = lunar.year + year_offset
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
            
            so_nam = 0
            if birth_year is not None:
                so_nam = event_occurrence_year - birth_year
            elif event_year is not None:
                so_nam = event_occurrence_year - event_year

            # Tính số tuổi = năm sự kiện (nếu có) - năm sinh (nếu có)
            so_tuoi = 0
            if event_year is not None and birth_year is not None:
                so_tuoi = event_year - birth_year
            
            attributes = {
                "ngay_am_lich_su_kien": ngay_am_str,
                "ngay_duong_lich_su_kien": hist_solar_str,
                "thu_su_kien": hist_weekday,
                "nam_can_chi_su_kien": nam_can_chi_str,
                
                "ngay_duong_lich_hien_tai": event_datetime.strftime("%d/%m/%Y"),
                "thu_hien_tai": THU[event_datetime.weekday()],
                "so_nam": so_nam,
                "so_tuoi": so_tuoi,
                
                "chi_tiet": event_description
            }
            
            if birth_day or birth_month or birth_year:
                bd_str = f"{birth_day}/" if birth_day else ""
                bm_str = f"{birth_month}/" if birth_month else ""
                by_str = f"{birth_year}" if birth_year else ""
                attributes["ngay_thang_nam_sinh"] = f"{bd_str}{bm_str}{by_str}".strip("/")
                
            self._attr_extra_state_attributes = attributes
        else:
            self._attr_native_value = "Không tính được"
            self._attr_extra_state_attributes = {}

class DuongLichEventSensor(SensorEntity):
    def __init__(self, entry: ConfigEntry):
        self._entry = entry
        self._attr_unique_id = f"duonglich_event_{entry.entry_id}"
        self._attr_icon = "mdi:calendar-star"
        self._attr_native_unit_of_measurement = "ngày"
        self._attr_name = entry.options.get("event_name", entry.data.get("event_name", "Sự kiện"))

    async def async_update(self):
        event_name = self._entry.options.get("event_name", self._entry.data.get("event_name", "Sự kiện"))
        event_day = self._entry.options.get("event_day", self._entry.data.get("event_day"))
        event_month = self._entry.options.get("event_month", self._entry.data.get("event_month"))
        event_year = self._entry.options.get("event_year", self._entry.data.get("event_year"))
        event_description = self._entry.options.get("event_description", self._entry.data.get("event_description", ""))
        
        if event_day is None or event_month is None:
            old_date = self._entry.options.get("event_date", self._entry.data.get("event_date", "1/1"))
            try:
                parts = old_date.replace("-", "/").split('/')
                event_day = int(parts[0])
                event_month = int(parts[1])
            except:
                event_day = 1
                event_month = 1
                
        try:
            t_day = int(event_day)
            t_month = int(event_month)
        except ValueError:
            t_day = 1
            t_month = 1

        try:
            event_year = int(event_year) if event_year else None
        except ValueError:
            event_year = None
        
        self._attr_name = event_name

        # --- 1. TÍNH TOÁN DỮ LIỆU SỰ KIỆN GỐC (TRONG QUÁ KHỨ) ---
        ngay_duong_str = f"{t_day}/{t_month}"
        hist_lunar_str = "Không rõ"
        hist_weekday = "Không rõ"
        nam_can_chi_str = "Không rõ"

        if event_year is not None:
            ngay_duong_str = f"{t_day}/{t_month}/{event_year}"
            nam_can_chi_str = f"{get_year_can_chi(event_year)}/{event_year}"
            
            try:
                hist_dt = datetime(event_year, t_month, t_day)
                hist_weekday = THU[hist_dt.weekday()]
                
                # Chuyển đổi Ngày Dương sang Âm lịch ở thời điểm quá khứ
                hist_lunar = get_lunar_date(t_day, t_month, event_year)
                if hist_lunar:
                    hist_lunar_str = f"{hist_lunar.day}/{hist_lunar.month}/{hist_lunar.year}"
                    if hist_lunar.leap == 1:
                        hist_lunar_str += " (Nhuận)"
                        
            except ValueError:
                if t_month == 2 and t_day == 29:
                    pass

        # --- 2. TÍNH TOÁN DỮ LIỆU SỰ KIỆN SẮP TỚI TƯƠNG LAI ---
        now = datetime.now()
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
        
        so_nam = 0
        if event_year is not None:
            so_nam = target_year - event_year
        
        lunar_equiv = get_lunar_date(event_date_this_year.day, event_date_this_year.month, event_date_this_year.year)
        
        # Thêm can chi năm cho ngày âm lịch hiện tại
        ngay_am_hien_tai = "Không tính được"
        if lunar_equiv:
            ngay_am_hien_tai = f"{lunar_equiv.day}/{lunar_equiv.month}"
            if lunar_equiv.leap == 1:
                ngay_am_hien_tai += " (Nhuận)"
            ngay_am_hien_tai += f"/{get_year_can_chi(lunar_equiv.year)}"

        self._attr_extra_state_attributes = {
            "ngay_duong_lich_su_kien": ngay_duong_str,
            "ngay_am_lich_su_kien": hist_lunar_str,
            "thu_su_kien": hist_weekday,
            "nam_can_chi_su_kien": nam_can_chi_str,
            
            "ngay_am_lich_hien_tai": ngay_am_hien_tai,
            "thu_hien_tai": THU[event_date_this_year.weekday()],
            "so_nam": so_nam,
            
            "chi_tiet": event_description
        }
