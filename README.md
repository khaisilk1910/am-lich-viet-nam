# Âm lịch Việt Nam cho Home Assistant

**Custom integration:**
- Cung cấp thông tin âm lịch hằng ngày vào sensor
- Thêm và hiển thị sự kiện âm lịch(giỗ, lễ,..), dương lịch(sinh nhật, ngày cưới,...)
- Chỉnh sửa sự kiện trên UI của tích hợp dễ dàng.
- Chỉnh sửa màu sắc hiển thị của thẻ tự động hoặc tùy ý trên giao diện dễ dàng
- Tra cứu, qui đổi ngày âm dương dễ dàng


<img width="506" height="700" alt="image" src="https://github.com/user-attachments/assets/8d418b9f-0b07-4b58-8348-f2f008c89d58" /><img width="506" height="700" alt="image" src="https://github.com/user-attachments/assets/27d45333-d0d3-4efb-8e2a-14fa234a86eb" />




## Cài đặt

1. Nhấn nút bên dưới để thêm vào HACS trên Home Assistant.

   [![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=khaisilk1910&repository=am-lich-viet-nam&category=integration)

   - Sau khi thêm trong HACS và khởi động lại Home Assistant
     
   - Vào Settings -> Integrations -> Add integration nhập `Âm lịch Việt Nam` để thêm
  
   - Sau khi thêm xong tích hợp vào tích hợp nhấn `Add Entry` chọn `Sự kiện Âm lịch (Đếm ngược ngày lễ, giỗ)` điền tên sự kiện âm lịch và các thông tin khác nếu có
     
     
     <img width="580" height="789" alt="image" src="https://github.com/user-attachments/assets/e657ffd3-29b7-4518-b5c9-eef7befc7f47" />





## Automation để thông báo khi 30 ngày Sau sẽ có sự kiện ( các bạn có thể tùy biến theo khả năng dựa vào các sensor)
<img width="648" height="643" alt="image" src="https://github.com/user-attachments/assets/643d2a26-a3e0-4c0c-b2a9-af555f71a930" />


```
alias: "Thông báo Sự kiện Âm và Dương lịch (Trước 7 ngày)"
description: "Gửi thông báo sự kiện đếm ngược còn 7 ngày"
mode: single
trigger:
  - platform: time
    at: "08:00:00"
variables:
  su_kien_sap_toi: >
   {% set ns = namespace(output="") %}
   {# Bộ từ điển ánh xạ tên attribute sang Emoji #}
   {% set emoji_map = {
     'ngay_duong_lich_su_kien': '📅 Ngày DL sự kiện',
     'ngay_am_lich_su_kien': '🌙 Ngày AL sự kiện',
     'thu_su_kien': '📆 Thứ sự kiện',
     'nam_can_chi_su_kien': '🐉 Năm can chi',
     'ngay_am_lich_hien_tai': '🏮 Ngày AL năm nay',
     'ngay_duong_lich_hien_tai': '🗓️ Ngày DL năm nay',
     'thu_hien_tai': '📅 Thứ năm nay',
     'so_nam': '⏳ Kỷ niệm (năm)',
     'so_tuoi': '🎂 Tuổi',
     'chi_tiet': '📝 Chi tiết'
   } %}
   {# Quét sự kiện Âm lịch #}
   {% for state in states.sensor | selectattr('attributes.ngay_duong_lich_hien_tai', 'defined') %}
     {% if state.state | is_number and state.state | int <= 30 %}
       {# Xác định emoji tiêu đề dựa trên từ khóa trong tên sự kiện #}
       {% set name_lower = state.name | lower %}
       {% if 'giỗ' in name_lower %}
         {% set title_emoji = '🕯️' %}
       {% elif 'sinh nhật' in name_lower %}
         {% set title_emoji = '🥳🎂' %}
       {% elif 'cưới' in name_lower %}
         {% set title_emoji = '🎉💍' %}
       {% else %}
         {% set title_emoji = '📌' %}
       {% endif %}
       {% set ns.output = ns.output ~ title_emoji ~ ' ' ~ state.name ~ ' (Âm lịch - Còn ' ~ state.state ~ ' ngày)\n' %}
       {% for key, value in state.attributes.items() %}
         {# Lọc bỏ các giá trị rỗng, không rõ hoặc không cần thiết #}
         {% if value | string != "" and value | string != "0" and value | string != "Không rõ" and key not in ['icon', 'friendly_name', 'unit_of_measurement'] %}
           {% set label = emoji_map.get(key, '🔹 ' ~ key) %}
           {% set ns.output = ns.output ~ '  - ' ~ label ~ ': ' ~ value ~ '\n' %}
         {% endif %}
       {% endfor %}
       {% set ns.output = ns.output ~ '\n' %}
     {% endif %}
   {% endfor %}
   {# Quét sự kiện Dương lịch #}
   {% for state in states.sensor | selectattr('attributes.ngay_am_lich_hien_tai', 'defined') %}
     {% if state.state | is_number and state.state | int <= 30 %}
       {# Xác định emoji tiêu đề dựa trên từ khóa trong tên sự kiện #}
       {% set name_lower = state.name | lower %}
       {% if 'giỗ' in name_lower %}
         {% set title_emoji = '🕯️' %}
       {% elif 'sinh nhật' in name_lower %}
         {% set title_emoji = '🥳🎂' %}
       {% elif 'cưới' in name_lower %}
         {% set title_emoji = '🎉💍' %}
       {% else %}
         {% set title_emoji = '📌' %}
       {% endif %}
       {% set ns.output = ns.output ~ title_emoji ~ '' ~ state.name ~ ' (Dương lịch - Còn ' ~ state.state ~ ' ngày)\n' %}
       {% for key, value in state.attributes.items() %}
         {% if value | string != "" and value | string != "0" and value | string != "Không rõ" and key not in ['icon', 'friendly_name', 'unit_of_measurement'] %}
           {% set label = emoji_map.get(key, '🔹 ' ~ key) %}
           {% set ns.output = ns.output ~ '  - ' ~ label ~ ': ' ~ value ~ '\n' %}
         {% endif %}
       {% endfor %}
       {% set ns.output = ns.output ~ '\n' %}
     {% endif %}
   {% endfor %}
   {# Hiển thị kết quả #}
   {{ ns.output if ns.output | length > 0 else 'Không có sự kiện nào diễn ra trong vòng 30 ngày tới.' }}    
condition:
  - condition: template
    value_template: "{{ su_kien_sap_toi | length > 0 }}"
action:
  - service: notify.notify
    data:
      title: "📅 Sắp đến sự kiện quan trọng!"
      message: >
        Trong vòng 30 ngày nữa là đến các sự kiện sau:
        
        {{ su_kien_sap_toi }}
        
        Bạn hãy chuẩn bị nhé!
```


## Thẻ hiển thị
- Thêm thẻ trực tiếp trên giao diện Home assistant 
<img width="901" height="640" alt="image" src="https://github.com/user-attachments/assets/c41f483d-c1f8-419b-8b28-e0fc788441f6" />

<img width="1029" height="860" alt="image" src="https://github.com/user-attachments/assets/d65e44e2-f97a-4038-b891-03e2d0c27718" />



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
        height: 60px !important;
        border: 2.2px outset rgba(255,165,0,.8) !important;
      }
    ha-tile-icon$: |
      .container {
        width: 60px !important;
        height: 60px !important;
        margin-top: -11px !important;
        margin-left: -10px !important;
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
        margin-top: -5px !important;
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

  

