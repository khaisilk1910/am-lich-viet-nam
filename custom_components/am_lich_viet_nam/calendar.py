import os
import json
import logging
from datetime import datetime, timedelta, date
from homeassistant.components.calendar import CalendarEntity, CalendarEvent
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN, FILE_EVENTS
from .amlich_core import get_year_info, jd_to_date

_LOGGER = logging.getLogger(__name__)

def load_events_from_file(hass):
    file_path = hass.config.path(DOMAIN, FILE_EVENTS)
    try:
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception as e:
        _LOGGER.error(f"Lỗi đọc sự kiện cho Calendar: {e}")
    return []

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback):
    is_main = entry.data.get("is_main", entry.data.get("event_name") is None)
    if is_main:
        async_add_entities([AmLichCalendar(hass)], True)

class AmLichCalendar(CalendarEntity):
    _attr_has_entity_name = True
    _attr_name = "Sự kiện Âm/Dương lịch"
    _attr_icon = "mdi:calendar-heart"

    def __init__(self, hass: HomeAssistant):
        self.hass = hass
        self._events = []
        self._attr_unique_id = "amlich_vietnam_calendar"

    @property
    def event(self) -> CalendarEvent | None:
        if not self._events: return None
        now = datetime.now().date()
        upcoming = [e for e in self._events if e.start >= now]
        if upcoming:
            upcoming.sort(key=lambda e: e.start)
            return upcoming[0]
        return None

    async def async_get_events(self, hass: HomeAssistant, start_date: datetime, end_date: datetime) -> list[CalendarEvent]:
        raw_events = await hass.async_add_executor_job(load_events_from_file, hass)
        self._events = []
        
        years_to_check = list(set([start_date.year, end_date.year]))

        for ev in raw_events:
            ev_name = ev.get("event_name", "Sự kiện")
            ev_date_str = ev.get("event_date", "")
            ev_type = ev.get("type", "lunar")
            ev_details = ev.get("event_details", "")
            
            try:
                parts = ev_date_str.replace("-", "/").split('/')
                t_day, t_month = int(parts[0]), int(parts[1])
            except: continue

            for target_year in years_to_check:
                event_date_solar = None

                if ev_type == "solar":
                    try:
                        event_date_solar = date(target_year, t_month, t_day)
                    except ValueError:
                        if t_month == 2 and t_day == 29: event_date_solar = date(target_year, 3, 1)

                elif ev_type == "lunar":
                    try:
                        ly = get_year_info(target_year)
                        for i in range(len(ly)):
                            m_info = ly[i]
                            if m_info.month == t_month and m_info.leap == 0:
                                m_len = ly[i+1].jd - m_info.jd if i + 1 < len(ly) else (get_year_info(target_year + 1)[0].jd - m_info.jd)
                                actual_day = min(t_day, m_len)
                                ev_jd = m_info.jd + actual_day - 1
                                solar_dd, solar_mm, solar_yyyy = jd_to_date(ev_jd)
                                event_date_solar = date(solar_yyyy, solar_mm, solar_dd)
                                break
                    except ValueError: continue
                
                if event_date_solar:
                    dt_start = datetime(event_date_solar.year, event_date_solar.month, event_date_solar.day)
                    check_start = start_date.replace(tzinfo=None)
                    check_end = end_date.replace(tzinfo=None)

                    if check_start <= dt_start < check_end:
                        self._events.append(
                            CalendarEvent(
                                summary=ev_name,
                                start=event_date_solar,
                                end=event_date_solar + timedelta(days=1),
                                description=ev_details
                            )
                        )

        return self._events
