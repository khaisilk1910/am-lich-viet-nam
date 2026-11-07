"""Regression checks independent of the Home Assistant runtime."""

from __future__ import annotations

from datetime import date, timedelta
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
import json
import unittest


ROOT = Path(__file__).resolve().parents[1]
COMPONENT = ROOT / "custom_components" / "am_lich_viet_nam"
spec = spec_from_file_location("calendar_core_under_test", COMPONENT / "amlich_core.py")
assert spec and spec.loader
calendar = module_from_spec(spec)
spec.loader.exec_module(calendar)


class CalendarCoreTests(unittest.TestCase):
    def test_known_tet_dates(self) -> None:
        for solar in (date(2000, 2, 5), date(2024, 2, 10), date(2025, 1, 29), date(2026, 2, 17)):
            with self.subTest(solar=solar):
                lunar = calendar.get_lunar_date(solar.day, solar.month, solar.year)
                self.assertIsNotNone(lunar)
                self.assertEqual((lunar.day, lunar.month, lunar.year, lunar.leap), (1, 1, solar.year, 0))

    def test_month_lengths_are_consistent_with_encoded_years(self) -> None:
        for year in range(1800, 2200):
            months = calendar.get_year_info(year)
            self.assertIn(len(months), (12, 13))
            for index, lunar in enumerate(months):
                length = calendar.get_lunar_month_length(lunar)
                self.assertIn(length, (29, 30))
                if index + 1 < len(months):
                    self.assertEqual(months[index + 1].jd - lunar.jd, length)

    def test_roundtrip_solar_lunar_across_supported_years(self) -> None:
        for year in range(1801, 2199, 7):
            for month in range(1, 13):
                solar = date(year, month, 15)
                lunar = calendar.get_lunar_date(solar.day, solar.month, solar.year)
                self.assertIsNotNone(lunar)
                matches, leap_month = calendar.lunar_to_solar_extended(lunar.day, lunar.month, lunar.year)
                key = "leap" if lunar.leap else "regular"
                actual = matches[key]
                self.assertEqual((actual["ngay"], actual["thang"], actual["nam"]), (solar.day, solar.month, solar.year))

    def test_leap_month_converts_to_two_distinct_dates(self) -> None:
        year = 2023
        leap_month = calendar.get_lunar_leap_info(year)
        self.assertGreater(leap_month, 0)
        results, reported_leap = calendar.lunar_to_solar_extended(1, leap_month, year)
        self.assertEqual(reported_leap, leap_month)
        self.assertEqual(set(results), {"regular", "leap"})
        self.assertNotEqual(results["regular"]["ngay_duong_lich"], results["leap"]["ngay_duong_lich"])

    def test_invalid_lunar_dates_rejected(self) -> None:
        with self.assertRaises(ValueError):
            calendar.get_year_info(2200)
        with self.assertRaises(ValueError):
            calendar.get_year_info(1799)
        results, _ = calendar.lunar_to_solar_extended(31, 1, 2026)
        self.assertEqual(results, {})

    def test_moving_holidays_match_actual_2026_dates(self) -> None:
        holidays = {
            date(2026, 4, 5): "Lễ Phục Sinh",
            date(2026, 5, 10): "Ngày của Mẹ",
            date(2026, 6, 21): "Ngày của Cha",
            date(2026, 11, 26): "Lễ Tạ Ơn",
            date(2026, 11, 27): "Black Friday",
        }
        for solar, holiday in holidays.items():
            with self.subTest(solar=solar):
                self.assertIn(holiday, calendar.get_solar_holiday(solar))
        self.assertNotIn("Lễ Phục Sinh", calendar.get_solar_holiday(date(2026, 3, 31)))
        self.assertNotIn("Ngày của Mẹ", calendar.get_solar_holiday(date(2026, 5, 12)))
        self.assertEqual(calendar.NGAY_LE_AL["10/1"], "Vía Thần Tài")

    def test_frontend_dependencies_exist(self) -> None:
        import re

        frontend = COMPONENT / "frontend"
        for file in frontend.glob("*.js"):
            source = file.read_text(encoding="utf-8")
            for module in re.findall(r"(?:from\s+|import\s*\()\s*['\"](\./[^'\"]+\.js)['\"]", source):
                with self.subTest(file=file.name, module=module):
                    self.assertTrue((frontend / module).is_file())
            self.assertNotIn("?v=20261005", source)

    def test_marketplace_package_metadata(self) -> None:
        manifest = json.loads((COMPONENT / "manifest.json").read_text())
        hacs = json.loads((ROOT / "hacs.json").read_text())
        self.assertEqual(manifest["domain"], "am_lich_viet_nam")
        self.assertTrue(manifest["config_flow"])
        for field in ("version", "documentation", "codeowners", "issue_tracker", "categories"):
            self.assertTrue(manifest[field], field)
        self.assertTrue(hacs["name"])
        self.assertTrue(hacs["homeassistant"])
        files = ("lich-block-am-duong-viet-nam.js", "su-kien-am-lich-card.js", "lich-block-am-duong-viet-nam-bubble.js", "lich-tuan-am-duong-viet-nam.js")
        for file in files:
            self.assertTrue((COMPONENT / "frontend" / file).is_file(), file)
        for lang in ("vi", "en"):
            translations = json.loads((COMPONENT / "translations" / f"{lang}.json").read_text())
            self.assertIn("convert_date", translations["services"])


if __name__ == "__main__":
    unittest.main()
