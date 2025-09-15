# Âm lịch Việt Nam cho Home Assistant

Custom integration hiển thị thông tin âm lịch hằng ngày

<img width="509" height="64" alt="image" src="https://github.com/user-attachments/assets/2634ba4a-cd92-499d-a76e-f95cf46a04fe" />


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
features_position: bottom
entity: sensor.am_lich_hang_ngay
grid_options:
  columns: full
picture: /local/am_lich_viet_nam.png
badge_text: "{{state_attr(entity,'lunar_day_type')}}"
secondary: Dương Lịch, {{ now().day }}/{{ now().month }}/{{ now().year }}
badge_color: "{{ 'green' if state_attr(entity,'lunar_day_type')=='Đ' else 'red' }}"
color: blue
icon: mdi:mushroom
card_mod:
  style:
    ha-tile-icon$: |
      .container {
        width: 40px !important;
        height: 40px !important;
        animation: rotate-center 0.6s ease-in-out infinite alternate-reverse both;
      }
      @keyframes rotate-center {
        0% {
          -webkit-transform: rotate(0);
                  transform: rotate(0);
        }
        100% {
          -webkit-transform: rotate(360deg);
                  transform: rotate(360deg);
        }
      }
    ha-tile-info$: |
      .primary {
        color: rgba(255,165,0,1) !important;
        font-weight: bold !important;
      }
      .secondary {
        color:  rgba(255,255,255,1) !important;
      }
    ha-tile-badge$: |
      .badge {
        width: 18px !important;
        height: 18px !important;
        font-weight: bold !important;
        background-color: rgba(255,255,255,0) !important;
        --tile-badge-icon-color: rgba(255,165,0,1) !important;
      }
```

- Các bạn cần cài thẻ Mush Room https://github.com/piitaya/lovelace-mushroom
- Tải ảnh `am_lich_viet_nam.png` và lưu vào thư mục `www`
  

