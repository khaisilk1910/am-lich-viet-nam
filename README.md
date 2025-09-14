# Âm lịch Việt Nam cho Home Assistant

Custom integration hiển thị thông tin âm lịch hằng ngày (ngày, tháng, năm, Can Chi...).

## Cài đặt

1. Copy thư mục `custom_components/amlich` vào thư mục `custom_components/` của Home Assistant.
2. Hoặc add repo này vào HACS → Custom repositories → Type: Integration.

## Sensor

Sau khi cài đặt, bạn sẽ có sensor:

`sensor.thong_tin_am_lich_hang_ngay`

Với các thuộc tính:
- `lunar_day`
- `lunar_month`
- `lunar_year`
- `is_leap_month`
- `month_name`
- `lunar_day_type`
- `can_chi_year`
- `solar_date`
- `lunar_date`
