# Báo cáo cập nhật Marketplace - 2026.11.7

## Phạm vi

- Home Assistant 2026.11.0+, Marketplace tích hợp sẵn thay thế HACS cũ.
- Giữ nguyên domain `am_lich_viet_nam`, các entity, action `convert_date`,
  tên bốn custom card, editor và các khoá cấu hình để hạn chế ảnh hưởng dashboard cũ.
- Nguồn cài đặt là `custom_components/am_lich_viet_nam` cùng `hacs.json` tại gốc.

## Điều chỉnh

1. **Khởi động:** bỏ SHA-256 của toàn bộ JavaScript khỏi setup, kiểm tra tồn tại
   bốn JS bằng một executor job, không chạy vòng lặp lấy dữ liệu từ mạng,
   đăng ký URL theo phiên bản và hạn chế đăng ký lặp cho từng entry.
2. **Sensor:** tính toán trong executor theo ngày địa phương, cho phép update_entity,
   log lỗi có traceback, tránh trả chuỗi vào sensor đơn vị ngày, trạng thái
   unavailable khi tính toán thất bại, sửa sự kiện gốc ở năm tương lai.
3. **Dữ liệu:** tính động Phục Sinh, Ngày của Mẹ, Ngày của Cha, Lễ Tạ Ơn,
   Black Friday; bổ sung ngày Vía Thần Tài 10/1 âm lịch, tránh đánh dấu
   ngày lễ theo tháng âm nhuận; sửa điều kiện trang trí Vía Thần Tài.
4. **Frontend:** URL module và tài nguyên SVG có cache bust theo phiên bản,
   giữ bốn bộ editor và Masonry/Sections grid options, tránh can thiệp global
   `window.Date`, xử lý thông báo lỗi không nhúng HTML từ dữ liệu lỗi.
5. **Tích hợp chuẩn:** config flow, options flow sự kiện, diagnostics có ẩn dữ
   liệu cá nhân, action đổi ngày, thông báo có bản dịch Việt/Anh.
6. **Phát hành:** manifest + hacs.json theo cấu trúc Marketplace; GitHub Actions
   chỉ kiểm tra source, không tự ghi đè Git tag của release.
7. **Hướng dẫn:** README cập nhật cài mới bằng Marketplace, cài từ link, dùng
   card, xử lý cache, logs, diagnostics và quy tắc phát hành.

## Các kiểm tra đã thực hiện

- `python -m unittest discover -s tests -v`: **8 bài kiểm thử PASS**.
  Bao gồm bảng tháng âm 1800–2199, các mẫu chuyển âm↔dương, tháng nhuận,
  những ngày Tết đã biết, lễ thay đổi theo năm và metadata gói cài đặt.
- `python -m compileall -q custom_components tests`: **PASS**.
- `node --input-type=module --check` trên mọi `frontend/*.js`: **PASS**.
- `node --experimental-default-type=module tests/test_frontend.mjs`: **PASS**.
- `python tests/smoke_lovelace.py` với Chromium + Playwright: **PASS**.
  Bốn thẻ được đăng ký, render, sinh editor, trả grid/card sizing;
  không có pageerror hoặc console.error trong trình duyệt giả lập.

## Giới hạn cần kiểm tra sau khi triển khai

- Chưa chạy Home Assistant Core 2026.11 thật trong môi trường này nên không thể
  chứng nhận kiểm thử end-to-end, cập nhật từ HACS sang Marketplace hoặc kết quả
  UI trên từng bản ứng dụng iOS/Android. Hãy thử trên HA thử nghiệm trước.
- Không cam kết các tệp ảnh trang trí Tết **tuỳ chọn** do người dùng đặt ở
  `/config/www/images/lich-block-am-duong-viet-nam`; bộ ảnh đó không có trong
  kho đã cung cấp và không ảnh hưởng logic âm lịch/các thẻ.
- Ở bản Core mới hơn, API Home Assistant/Marketplace có thể thay đổi;
  chạy lại test và kiểm tra release notes khi nâng cấp.
- Để người dùng nhận bản cập nhật, nhà phát hành cần push mã nguồn, tạo
  GitHub Release với tag `v2026.11.7` tương ứng manifest. File ZIP riêng lẻ
  chưa phải bản phát hành đã công bố trên Marketplace.
