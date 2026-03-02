from datetime import datetime
import logging
from homeassistant.components.sensor import SensorEntity
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import CONF_CUSTOM_EVENTS

from .amlich_core import (
    get_lunar_date, get_year_can_chi, get_month_name, get_lunar_month_length, THU,
    get_can_chi_day_month_year, get_can_hour_0, get_tiet_khi, get_gio_hoang_dao,
    get_gio_hac_dao, get_huong_xuat_hanh, get_thap_nhi_truc, get_nhi_thap_bat_tu,
    NGAY_THONG_TIN, NGAY_LE_DL, NGAY_LE_AL, get_year_info
)

_LOGGER = logging.getLogger(__name__)

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback):
    """Set up the sensor from a config entry."""
    async_add_entities([AmLichSensor(entry)], True)

class AmLichSensor(SensorEntity):

    def __init__(self, entry: ConfigEntry):
        """Initialize the sensor."""
        self._entry = entry
        self._attr_name = "Âm lịch hằng ngày"
        self._attr_unique_id = "amlich_hangngay"
        self._attr_icon = "mdi:calendar-today-outline"
        self._attr_native_value = None
        self._attr_extra_state_attributes = {}

    async def async_update(self):
        """Fetch new state data for the sensor."""
        now = datetime.now()
        lunar = get_lunar_date(now.day, now.month, now.year)

        if not lunar:
            self._attr_native_value = "Lỗi: Không thể tính toán ngày âm lịch"
            return
            
        jd = lunar.jd

        # 1. Đọc và nhóm các sự kiện cá nhân (Xử lý trùng ngày)
        custom_events_text = self._entry.options.get(CONF_CUSTOM_EVENTS, "")
        custom_events = {}
        if custom_events_text:
            for line in custom_events_text.split('\n'):
                line = line.strip()
                if ':' in line:
                    parts = line.split(':', 1)
                    date_key = parts[0].strip()  # ví dụ: "13/2"
                    event_name = parts[1].strip() # ví dụ: "Giỗ Mẹ"
                    
                    if date_key not in custom_events:
                        custom_events[date_key] = []
                    custom_events[date_key].append(event_name)

        # 2. Hàm tính Julian Day cho một ngày sự kiện âm lịch (để đếm ngược)
        def get_lunar_event_jd(t_day, t_month, s_year, cur_jd):
            # Quét năm hiện tại và 2 năm tiếp theo để đảm bảo luôn tìm được sự kiện tương lai
            for year_offset in range(3):
                try:
                    ly = get_year_info(s_year + year_offset)
                    for i in range(len(ly)):
                        m_info = ly[i]
                        # Tìm đúng tháng âm lịch (không tính tháng nhuận cho giỗ chạp)
                        if m_info.month == t_month and m_info.leap == 0:
                            if i + 1 < len(ly):
                                m_len = ly[i+1].jd - m_info.jd
                            else:
                                next_ly = get_year_info(s_year + year_offset + 1)
                                m_len = next_ly[0].jd - m_info.jd
                            
                            # Xử lý trường hợp nhập ngày 30 nhưng tháng đó thiếu (chỉ có 29 ngày)
                            actual_day = min(t_day, m_len)
                            event_jd = m_info.jd + actual_day - 1
                            
                            # Nếu ngày này lớn hơn hoặc bằng hôm nay -> Trả về kết quả JD
                            if event_jd >= cur_jd:
                                return event_jd
                except ValueError:
                    continue
            return None

        # 3. Phân loại sự kiện: Hôm nay và Đếm ngược
        today_events = []
        events_countdown = {}

        lunar_holiday_key = f"{lunar.day}/{lunar.month}"
        
        for date_key, ev_list in custom_events.items():
            # Gom sự kiện hôm nay (days_left = 0)
            if date_key == lunar_holiday_key:
                today_events.extend(ev_list)

            # Tính đếm ngược cho tất cả các sự kiện
            try:
                parts = date_key.split('/')
                if len(parts) == 2:
                    t_day = int(parts[0])
                    t_month = int(parts[1])
                    # Dùng lunar.year làm mốc tính toán (tránh lấn cấn năm dương và âm)
                    ev_jd = get_lunar_event_jd(t_day, t_month, lunar.year, jd)
                    
                    if ev_jd is not None:
                        days_left = int(ev_jd - jd)
                        for ev in ev_list:
                            # Lưu vào dictionary đếm ngược theo định dạng {"Tên sự kiện": số_ngày}
                            events_countdown[ev] = days_left
            except ValueError:
                continue

        # Sắp xếp dictionary theo số ngày còn lại (từ gần nhất đến xa nhất)
        events_countdown = dict(sorted(events_countdown.items(), key=lambda item: item[1]))

        # Format sự kiện hôm nay thành chuỗi (để dễ hiển thị lên giao diện nếu cần)
        custom_event_today_str = ", ".join(today_events) if today_events else None

        # --- CÁC THÔNG TIN KHÁC GIỮ NGUYÊN ---
        thu = THU[now.weekday()]
        thang_chu = get_month_name(lunar.month, lunar.leap == 1)
        thang_am_length = get_lunar_month_length(lunar)
        thang_am_day_type = "Tháng Đủ (30 ngày)" if thang_am_length == 30 else "Tháng Thiếu (29 ngày)"
        
        can_chi_day, can_chi_month, can_chi_year = get_can_chi_day_month_year(lunar)
        can_chi_hour_0 = get_can_hour_0(jd)
        
        solar_holiday_key = f"{now.day}/{now.month}"
        solar_holiday = NGAY_LE_DL.get(solar_holiday_key)
        lunar_holiday = NGAY_LE_AL.get(lunar_holiday_key)
        
        tiet_khi = get_tiet_khi(jd)
        gio_hoang_dao = get_gio_hoang_dao(jd)
        gio_hac_dao = get_gio_hac_dao(jd)
        huong_xuat_hanh = get_huong_xuat_hanh(jd)
        thap_nhi_truc = get_thap_nhi_truc(jd)
        nhi_thap_bat_tu = get_nhi_thap_bat_tu(jd)

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
            
            # --- ATTRIBUTES MỚI CHO SỰ KIỆN ---
            "custom_event_today": custom_event_today_str,
            "custom_events_countdown": events_countdown,
            
            "tiet_khi": tiet_khi,
            "gio_hoang_dao": gio_hoang_dao,
            "gio_hac_dao": gio_hac_dao,
            "huong_xuat_hanh": huong_xuat_hanh,
            
            "thap_nhi_truc": thap_nhi_truc,
            "nhi_thap_bat_tu": nhi_thap_bat_tu,
            
            "ngay_chi_tiet": ngay_thong_tin.get('chiTiet', []),
            "ngay_mo_ta": ngay_thong_tin.get('moTa', '')
        }
