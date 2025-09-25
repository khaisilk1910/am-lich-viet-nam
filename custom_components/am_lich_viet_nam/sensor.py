from datetime import datetime
import logging
from homeassistant.components.sensor import SensorEntity
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant


from .amlich_core import (
    get_lunar_date, get_year_can_chi, get_month_name, get_lunar_month_length, THU,
    get_can_chi_day_month_year, get_can_hour_0, get_tiet_khi, get_gio_hoang_dao,
    get_gio_hac_dao, get_huong_xuat_hanh, get_thap_nhi_truc, get_nhi_thap_bat_tu,
    NGAY_THONG_TIN, VIEC_NEN_LAM, VIEC_KIENGLAM, NGAY_LE_DL, NGAY_LE_AL
)

_LOGGER = logging.getLogger(__name__)

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback):
    """Set up the sensor from a config entry."""
    async_add_entities([AmLichSensor()], True)

class AmLichSensor(SensorEntity):

    def __init__(self):
        """Initialize the sensor."""
        self._attr_name = "Âm lịch Việt Nam"
        self._attr_unique_id = "amlich_vietnam_daily"
        self._attr_icon = "mdi:calendar-star"
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

        # Thông tin cơ bản
        thu = THU[now.weekday()]
        thang_chu = get_month_name(lunar.month, lunar.leap == 1)
        thang_am_length = get_lunar_month_length(lunar)
        thang_am_day_type = "Tháng Đủ (30 ngày)" if thang_am_length == 30 else "Tháng Thiếu (29 ngày)"
        
        # Can Chi
        can_chi_day, can_chi_month, can_chi_year = get_can_chi_day_month_year(lunar)
        can_chi_hour_0 = get_can_hour_0(jd)
        
        # Ngày lễ
        solar_holiday_key = f"{now.day}/{now.month}"
        lunar_holiday_key = f"{lunar.day}/{lunar.month}"
        solar_holiday = NGAY_LE_DL.get(solar_holiday_key)
        lunar_holiday = NGAY_LE_AL.get(lunar_holiday_key)
        
        # Thông tin phong thủy, chiêm tinh
        tiet_khi = get_tiet_khi(jd)
        gio_hoang_dao = get_gio_hoang_dao(jd)
        gio_hac_dao = get_gio_hac_dao(jd)
        huong_xuat_hanh = get_huong_xuat_hanh(jd)
        thap_nhi_truc = get_thap_nhi_truc(jd)
        nhi_thap_bat_tu = get_nhi_thap_bat_tu(jd)

        # Thông tin ngày
        ngay_thong_tin = NGAY_THONG_TIN.get(can_chi_day, {})
        viec_nen_lam = VIEC_NEN_LAM.get(can_chi_day, "Không có thông tin")
        viec_kieng_lam = VIEC_KIENGLAM.get(can_chi_day, "Không có thông tin")
        
        # Cập nhật trạng thái chính
        summary = f"{thu}, {lunar.day} {thang_chu} năm {can_chi_year}"
        self._attr_native_value = summary
        
        # Cập nhật các thuộc tính
        self._attr_extra_state_attributes = {
            "solar_date": now.strftime("%d/%m/%Y"),
            "weekday": thu,
            
            "lunar_day": lunar.day,
            "lunar_month": lunar.month,
            "lunar_year": lunar.year,
            "is_leap_month": lunar.leap == 1,
            "month_name": thang_chu,
            "lunar_month_type": thang_am_day_type,
            
            "can_chi_day": can_chi_day,
            "can_chi_month": can_chi_month,
            "can_chi_year": can_chi_year,
            "can_chi_hour_0": can_chi_hour_0,
            
            "solar_holiday": solar_holiday,
            "lunar_holiday": lunar_holiday,
            
            "tiet_khi": tiet_khi,
            "gio_hoang_dao": gio_hoang_dao,
            "gio_hac_dao": gio_hac_dao,
            "huong_xuat_hanh": huong_xuat_hanh,
            
            "thap_nhi_truc": thap_nhi_truc,
            "nhi_thap_bat_tu": nhi_thap_bat_tu,
            
            "viec_nen_lam": viec_nen_lam,
            "viec_kieng_lam": viec_kieng_lam,
            "ngay_chi_tiet": ngay_thong_tin.get('chiTiet', []),
            "ngay_mo_ta": ngay_thong_tin.get('moTa', '')
        }
