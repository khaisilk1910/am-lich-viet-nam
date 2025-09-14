from datetime import datetime
import logging
from homeassistant.components.sensor import SensorEntity
from .amlich_core import get_lunar_date, get_year_can_chi, get_month_name, get_lunar_month_length, THU

_LOGGER = logging.getLogger(__name__)

async def async_setup_platform(hass, config, async_add_entities, discovery_info=None):
    async_add_entities([AmLichSensor()], True)

async def async_setup_entry(hass, config_entry, async_add_entities):
    async_add_entities([AmLichSensor()], True)

class AmLichSensor(SensorEntity):
    def __init__(self):
        self._attr_name = "Âm lịch hằng ngày"
        self._attr_unique_id = "amlich_hangngay"
        self._attr_native_value = None
        self._attr_extra_state_attributes = {}

    def update(self):
        now = datetime.now()
        lunar = get_lunar_date(now.day, now.month, now.year)

        thu = THU[now.weekday()]
        thang_chu = get_month_name(lunar.month, lunar.leap)
        thang_am_length = get_lunar_month_length(lunar)
        thang_am_day_type = "(Đ)" if thang_am_length == 30 else "(T)"
        nam_can_chi = get_year_can_chi(lunar.year)

        summary = f"{thu}, ngày {lunar.day} {thang_chu} {thang_am_day_type}, {nam_can_chi}"

        self._attr_native_value = summary
        self._attr_extra_state_attributes = {
            "weekday": thu,
            "lunar_day": lunar.day,
            "lunar_month": lunar.month,
            "lunar_year": lunar.year,
            "is_leap_month": lunar.leap,
            "month_name": thang_chu,
            "lunar_day_type": thang_am_day_type,
            "can_chi_year": nam_can_chi,
            "solar_date": now.strftime("%d/%m/%Y"),
            "lunar_date": f"{lunar.day:02}/{lunar.month:02}/{lunar.year}"
        }
