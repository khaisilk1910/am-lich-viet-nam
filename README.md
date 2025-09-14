# Âm lịch Việt Nam cho Home Assistant

Custom integration hiển thị thông tin âm lịch hằng ngày
<img width="733" height="802" alt="image" src="https://github.com/user-attachments/assets/e6bcaf30-2ee2-4930-8194-5447d28efb30" />



## Cài đặt


1. Nhấn nút bên dưới để thêm vào HACS trên Home Assistant.

   [![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=khaisilk1910&repository=am-lich-viet-nam&category=integration)

   - Sau khi thêm trong HACS và khởi động lại Home Assistant
     
   - Vào Settings -> Integrations -> Add integration nhập `Âm lịch Việt Nam` để thêm
  
     <img width="633" height="810" alt="image" src="https://github.com/user-attachments/assets/6d1baaaf-444f-4405-8559-1a78cccfb672" />


## Sensor

Sau khi cài đặt, bạn sẽ có sensor:

<img width="733" height="802" alt="image" src="https://github.com/user-attachments/assets/78d81e97-8391-4512-bafb-bff8b34b26f8" />


## Thêm thẻ hiển thị lịch âm 

<img width="483" height="79" alt="image" src="https://github.com/user-attachments/assets/53fc11e0-b090-4ce3-8cbd-e37bf4541e76" />

```
type: custom:mushroom-template-card
primary: "{{states(entity)}}"
icon: mdi:mushroom
features_position: bottom
entity: sensor.am_lich_hang_ngay
grid_options:
  columns: full
color: red
picture: /local/am_lich_viet_nam.png
badge_text: "{{state_attr(entity,'lunar_day_type')}}"
secondary: Dương Lịch, {{now().day}}/{{now().month}}/{{now().year}}
badge_color: red

```

- Các bạn cần cài thẻ Mush Room https://github.com/piitaya/lovelace-mushroom
- Tải ảnh `am_lich_viet_nam.png` và lưu vào thư mục `www`
  

