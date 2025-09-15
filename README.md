# Âm lịch Việt Nam cho Home Assistant

Custom integration hiển thị thông tin âm lịch hằng ngày

![20250915-0721-35 5325033](https://github.com/user-attachments/assets/7d96d243-e18f-48a5-8672-4bb73c466fbd)


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

![20250915-0721-35 5325033](https://github.com/user-attachments/assets/b4f0585a-81c9-402b-b762-04fce674f69e)


```
type: custom:mushroom-template-card
primary: "{{states(entity)}}"
features_position: bottom
entity: sensor.am_lich_hang_ngay
grid_options:
  columns: full
picture: /local/am_lich_viet_nam.png
secondary: Dương Lịch, {{ now().day }}/{{ now().month }}/{{ now().year }}
badge_color: "{{ 'green' if state_attr(entity,'lunar_day_type')=='Đ' else 'red' }}"
color: blue
icon: mdi:mushroom
badge_icon: >-
  {{ 'mdi:moon-full' if state_attr(entity,'lunar_day_type')=='Đ' else
  'mdi:moon-waning-crescent' }}
card_mod:
  style:
    .: |
      ha-card {
        border: 2.2px outset rgba(255,165,0,.8) !important;
      }
    ha-tile-icon$: |
      .container {
        width: 60px !important;
        height: 60px !important;
        margin-top: -13px !important;
        animation: rotate-center 1s ease-in-out infinite alternate-reverse both;
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
        margin-top: -11px !important;
        margin-left: 5px !important;
        font-size: clamp(12px, 16px, 18px) !important;
      }
      .secondary {
        margin-left: 5px !important;
        color:  rgba(255,255,255,1) !important;
      }
    ha-tile-badge$: |
      .badge {
        width: 15px !important;
        height: 15px !important;
        margin-right: -5px !important;
        background-color: rgba(255,255,255,.1) !important;
        --tile-badge-icon-color: rgba(255,165,0,1) !important;
        animation: ping 2s infinite;
      }
      @keyframes ping {
        0% {box-shadow: 0 0 0 0 rgba(255,165,0,3);}
        70% {box-shadow: 0 0 0 10px transparent;}
        100% {box-shadow: 0 0 0 0 transparent;}
      }
```

- Các bạn cần cài thêm trong HACS https://github.com/piitaya/lovelace-mushroom và https://github.com/thomasloven/lovelace-card-mod
- Tải ảnh `am_lich_viet_nam.png` (hoặc ảnh bạn thích đổi đúng tên am_lich_viet_nam.png) và lưu vào thư mục `www`
  

