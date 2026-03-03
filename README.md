# Âm lịch Việt Nam cho Home Assistant

Custom integration hiển thị thông tin âm lịch hằng ngày

![20250915-0721-35 5325033](https://github.com/user-attachments/assets/7d96d243-e18f-48a5-8672-4bb73c466fbd)

<img width="1043" height="655" alt="image" src="https://github.com/user-attachments/assets/1e8ae33b-ffac-497e-890d-aeac2e48734c" />




## Cài đặt

1. Nhấn nút bên dưới để thêm vào HACS trên Home Assistant.

   [![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=khaisilk1910&repository=am-lich-viet-nam&category=integration)

   - Sau khi thêm trong HACS và khởi động lại Home Assistant
     
   - Vào Settings -> Integrations -> Add integration nhập `Âm lịch Việt Nam` để thêm
  
   - Sau khi thêm xong tích hợp vào tích hợp nhấn `Add Entry` chọn `Sự kiện Âm lịch (Đếm ngược ngày lễ, giỗ)` điền tên sự kiện âm lịch và ngày theo định dạng `ngay/thang`
     
     **Ví dụ:** **20/3**
     
     <img width="408" height="342" alt="image" src="https://github.com/user-attachments/assets/c0781c02-89bd-4a16-a1aa-58ec6552ee75" />




## Automation để thông báo khi 1 Tuần Sau sẽ có sự kiện ( các bạn có thể tùy biến theo khả năng dựa vào các sensor)
```
alias: "Thông báo Sự kiện Âm lịch (Trước 7 ngày)"
description: "Gửi thông báo các sự kiện âm lịch còn 7 ngày nữa là tới"
mode: single
trigger:
  - platform: time
    at: "08:00:00"
variables:
  su_kien_sap_toi: >
    {% set ns = namespace(events=[]) %}
    {% for state in states.sensor | selectattr('attributes.ngay_am_lich_su_kien', 'defined') %}
      {% if state.state == '7' %}
        {% set ns.events = ns.events + ['- ' ~ state.name ~ ' (Âm lịch: ' ~ state.attributes.ngay_am_lich_su_kien ~ ' | Dương lịch: ' ~ state.attributes.thu_trong_tuan ~ ', ' ~ state.attributes.ngay_duong_lich_tuong_ung ~ ')'] %}
      {% endif %}
    {% endfor %}
    {{ ns.events | join('\n') }}
condition:
  - condition: template
    value_template: "{{ su_kien_sap_toi | length > 0 }}"
action:
  - service: notify.notify
    data:
      title: "📅 Sắp đến sự kiện âm lịch!"
      message: >
        Chỉ còn 1 tuần nữa là đến các sự kiện sau:
        
        {{ su_kien_sap_toi }}
        
        Bạn hãy chuẩn bị nhé!
```




## Sensor

Sau khi cài đặt, bạn sẽ có sensor:

<img width="573" height="923" alt="image" src="https://github.com/user-attachments/assets/fc385557-2145-40a7-8572-b8cd0a339738" />



## Thêm thẻ hiển thị lịch âm 

![20250915-0721-35 5325033](https://github.com/user-attachments/assets/b4f0585a-81c9-402b-b762-04fce674f69e)


- Các bạn cần cài thêm trong HACS https://github.com/piitaya/lovelace-mushroom và https://github.com/thomasloven/lovelace-card-mod
  
- Tải ảnh `am_lich_viet_nam.png` (hoặc ảnh bạn thích đổi đúng tên am_lich_viet_nam.png) và lưu vào thư mục `www`
  
```
type: custom:mushroom-template-card
primary: "{{states(entity)}}"
features_position: bottom
entity: sensor.am_lich_hang_ngay
grid_options:
  columns: full
picture: /local/am_lich_viet_nam.png
secondary: >-
  Dương Lịch, {{ now().day }}/{{ now().month }}/{{ now().year }}{% if
  state_attr('sensor.am_lich_hang_ngay','lunar_holiday') != none or
  state_attr('sensor.am_lich_hang_ngay','solar_holiday') != none %}

  - 📅 Có sự kiện

  {%endif%}
badge_color: "{{ 'green' if 'Đủ' in state_attr(entity,'lunar_month_type') else 'red' }}"
color: blue
icon: mdi:mushroom
tap_action:
  action: navigate
  navigation_path: "#chitietamlich"
badge_icon: >-
  {{ 'mdi:moon-full' if 'Đủ' in state_attr(entity,'lunar_month_type') else
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
        --tile-badge-icon-color: rgba(255,255,0,1) !important;
        animation: ping 2s infinite;
      }
      @keyframes ping {
        0% {box-shadow: 0 0 0 0 rgba(255,2555,0,2);}
        70% {box-shadow: 0 0 0 10px transparent;}
        100% {box-shadow: 0 0 0 0 transparent;}
      }
```




## Thêm thẻ popup khi nhấn vào thẻ trên sẽ hiện chi tiết Âm Lịch

- Cần cài thêm: https://github.com/Clooos/Bubble-Card

<img width="504" height="983" alt="image" src="https://github.com/user-attachments/assets/6095236a-d310-4850-88d8-27459e55aee7" />

```
type: vertical-stack
cards:
  - type: custom:bubble-card
    card_type: pop-up
    hash: "#chitietamlich"
    button_type: name
    close_on_click: true
    background_update: true
    show_header: false
  - type: markdown
    content: >-
      ## 📅 <font color="orange">{{ states('sensor.am_lich_hang_ngay') }}</font>

      📖 **Tháng:** <font color="orange">{{
      state_attr('sensor.am_lich_hang_ngay','lunar_month_type') }}</font>

      ☀️ **Dương lịch:** <font color="gold">{{
      state_attr('sensor.am_lich_hang_ngay','solar_date') }}</font>

      🎊 **Sự kiện:** <font color="gold">{% if
      state_attr('sensor.am_lich_hang_ngay','lunar_holiday') != none %}- {{
      state_attr('sensor.am_lich_hang_ngay','lunar_holiday')}} {%endif%}{% if
      state_attr('sensor.am_lich_hang_ngay','solar_holiday') != none %}- {{
      state_attr('sensor.am_lich_hang_ngay','solar_holiday')}}{%endif%}</font>

      🪧 **Ngày:** <font color="orange">{{
      state_attr('sensor.am_lich_hang_ngay','can_chi_day') }}</font> |
      **Tháng:** <font color="orange">{{
      state_attr('sensor.am_lich_hang_ngay','can_chi_month') }}</font>

      🍃 **Tiết khí:** <font color="orange">{{
      state_attr('sensor.am_lich_hang_ngay','tiet_khi') }}</font>

      ⏰ **Giờ Hoàng đạo:** <font color="limegreen">{{
      state_attr('sensor.am_lich_hang_ngay','gio_hoang_dao') }}</font>  

      🌑 **Giờ Hắc đạo:** <font color="red">{{
      state_attr('sensor.am_lich_hang_ngay','gio_hac_dao') }}</font>  

      🧭 **Hướng xuất hành:**  

      - 🎉 Hỷ Thần: <font color="orange">{{
      state_attr('sensor.am_lich_hang_ngay','huong_xuat_hanh')['Hỷ Thần']
      }}</font>

      - 💰 Tài Thần: <font color="orange">{{
      state_attr('sensor.am_lich_hang_ngay','huong_xuat_hanh')['Tài Thần']
      }}</font>

      - 🪶 Hạc Thần: <font color="red">{{
      state_attr('sensor.am_lich_hang_ngay','huong_xuat_hanh')['Hạc Thần']
      }}</font>


      🌀 **Thập Nhị Trực: <font color="orange">{{
      state_attr('sensor.am_lich_hang_ngay','thap_nhi_truc')['name']
      }}</font>**  

      - ✅ **Tốt:** <font color="limegreen">{{
      state_attr('sensor.am_lich_hang_ngay','thap_nhi_truc')['details']['tot']
      }}</font>

      - ❌ **Xấu:** <font color="red">{{
      state_attr('sensor.am_lich_hang_ngay','thap_nhi_truc')['details']['xau']
      }}</font>


      ✨ **Nhị Thập Bát Tú: <font color="orange">Sao {{
      state_attr('sensor.am_lich_hang_ngay','nhi_thap_bat_tu')['name']
      }}</font>**  

      - 🌟 **{{
      state_attr('sensor.am_lich_hang_ngay','nhi_thap_bat_tu')['details']['tenNgay']
      }}**

      - 📋 **{{
      state_attr('sensor.am_lich_hang_ngay','nhi_thap_bat_tu')['details']['danhGia']
      }}**   

      - ✅ **Nên làm:** {{
      state_attr('sensor.am_lich_hang_ngay','nhi_thap_bat_tu')['details']['nenLam']
      }}   

      - ❌ **Kiêng cữ:** {{
      state_attr('sensor.am_lich_hang_ngay','nhi_thap_bat_tu')['details']['kiengCu']
      }} 


      🔮 **Ngũ Hành:**

      - {{ state_attr('sensor.am_lich_hang_ngay','ngay_mo_ta') }}

      {%- for dong in state_attr('sensor.am_lich_hang_ngay','ngay_chi_tiet') %}

      {{ dong }} {% endfor %}
    grid_options:
      columns: full
```

  

