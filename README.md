# Âm lịch Việt Nam cho Home Assistant

**Custom integration:**
- Cung cấp thông tin âm lịch hằng ngày vào sensor
- Thêm sự kiện âm lịch(giỗ, lễ,..), thêm sự kiện dương lịch(sinh nhật, ngày cưới,...)
- Chỉnh sửa sự kiện trên UI của tích hợp dễ dàng.
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

<img width="494" height="802" alt="su_kien_tra_cuu_am_duong yaml" src="https://github.com/user-attachments/assets/f7b6a413-b5da-43ac-9e59-3d370ff99749" />


- Cài thêm: [Home-Assistant-Lovelace-HTML-Jinja2-Template-card](https://github.com/PiotrMachowski/Home-Assistant-Lovelace-HTML-Jinja2-Template-card) và [lovelace-card-mod](https://github.com/thomasloven/lovelace-card-mod)

```
type: custom:html-template-card
title: ⏰ Sự kiện sắp đến
ignore_line_breaks: true
content: |
  <div class="scroll-area">
    <table border="0" cellpadding="2" cellspacing="4" width="100%" style="margin-top: -10px;">
      {%- set ns = namespace(events=[]) -%}
      {%- set so_ngay = 30 -%}
      
      {%- set attr_labels = {
        'ngay_am_lich_su_kien': 'Ngày Âm Lịch',
        'ngay_duong_lich_su_kien': 'Ngày Dương Lịch',
        'thu_su_kien': 'Thứ',
        'nam_can_chi_su_kien': 'Năm Can Chi',
        'so_nam': 'Số Năm kỷ niệm',
        'so_tuoi': 'Số Tuổi',
        'chi_tiet': 'Chi Tiết'
      } -%}

      {%- for state in states.sensor | selectattr('attributes.ngay_am_lich_su_kien', 'defined') | selectattr('attributes.ngay_duong_lich_hien_tai', 'defined') -%}
        {%- if 0 <= state.state | int(-1) <= so_ngay -%}
          {%- set am_split = state.attributes.ngay_am_lich_su_kien.split('/') -%}
          {%- set am_short = am_split[0] ~ '/' ~ am_split[1] if am_split | length >= 2 else state.attributes.ngay_am_lich_su_kien -%}
          {%- set ns.events = ns.events + [{
            'entity_id': state.entity_id,
            'thu': state.attributes.thu_hien_tai, 
            'duong': state.attributes.ngay_duong_lich_hien_tai[:5], 
            'name': state.attributes.friendly_name | default(state.name),
            'am': am_short, 
            'days': state.state | int
          }] -%}
        {%- endif -%}
      {%- endfor -%}

      {%- for state in states.sensor | selectattr('attributes.ngay_duong_lich_su_kien', 'defined') | selectattr('attributes.ngay_am_lich_hien_tai', 'defined') -%}
        {%- if 0 <= state.state | int(-1) <= so_ngay -%}
          {%- set am_split = state.attributes.ngay_am_lich_hien_tai.split('/') -%}
          {%- set am_short = am_split[0] ~ '/' ~ am_split[1] if am_split | length >= 2 else state.attributes.ngay_am_lich_hien_tai -%}
          {%- set ns.events = ns.events + [{
            'entity_id': state.entity_id,
            'thu': state.attributes.thu_hien_tai, 
            'duong': state.attributes.ngay_duong_lich_su_kien[:5], 
            'name': state.attributes.friendly_name | default(state.name),
            'am': am_short, 
            'days': state.state | int
          }] -%}
        {%- endif -%}
      {%- endfor -%}
      
      {%- if ns.events | count > 0 -%}
        {%- for ev in ns.events | sort(attribute='days') -%}
            
        {%- set mau_td = "blue" -%}
        {%- if ev.days <= 2 -%}
          {%- set mau_td = "red" -%}
        {%- elif ev.days <= 7 -%}
          {%- set mau_td = "orange" -%}
        {%- elif 7 < ev.days <= 15  -%}
          {%- set mau_td = "yellow" -%}
        {%- endif -%}

        {%- set ten_su_kien = ev.name | lower -%}
        {%- set icon = "📌" -%} 
        {%- if "sinh nhật" in ten_su_kien -%}
          {%- set icon = "🥳🎂" -%}
        {%- elif "giỗ" in ten_su_kien -%}
          {%- set icon = "🕯️" -%}
        {%- elif "cưới" in ten_su_kien -%}
          {%- set icon = "🎉💍" -%}
        {%- endif -%}
        
        <tr class="event-row" onclick="const d = this.nextElementSibling; const i = this.querySelector('.toggle-icon'); if(d.style.display==='none' || d.style.display===''){ d.style.display='table-row'; i.style.transform='rotate(180deg)'; } else { d.style.display='none'; i.style.transform='rotate(0deg)'; }">
          <td align="center" width="20%" style="border-bottom: solid 1px gray; vertical-align: middle;">
            <div style="color:orange; margin-bottom: -8px;">{{ ev.thu }}</div>
            <div style="color:white; font-size:25px; font-weight:bold;">{{ ev.duong }}</div>
            <div style="color:orange; margin-top: -8px;">{{ ev.am }}</div>
          </td>
          
          <td align="center" style="background:{{mau_td}}; width: 4px; border-radius: 2px; vertical-align: middle; margin-bottom: 5px; padding-bottom: 5px;"></td>
          
          <td align="center" width="80%" style="border-bottom: solid 1px gray;">
            <div style="color:white; text-align: left; padding-left: 4px; display: flex; align-items: center;">
              <span style="font-size: 2em; margin-right: 4px;">{{ icon }}</span>
              <span>{{ev.name}}</span>
            </div>
            <div style="color:orange; text-align: right; padding-right: 10px;">
              <span style="font-style: italic;">{{ ev.days }} ngày</span>
              <span class="flip-emoji" style="font-size:18px;">⏳</span>
              <span class="toggle-icon" style="font-size: 14px; color: #888; margin-left: 8px; display: inline-block; transition: transform 0.3s;">▼</span>
            </div>
          </td>
        </tr>

        {%- set state_obj = states[ev.entity_id] -%}
        <tr style="display: none;" class="detail-row">
          <td colspan="3" style="border-bottom: solid 1px gray; padding: 0 5px 10px 5px;">
            <div class="detail-content">
              {%- for key, label in attr_labels.items() -%}
                {%- if state_obj.attributes[key] is defined -%}
                  {%- set attr_val = state_obj.attributes[key] | string | trim -%}
                  {%- if attr_val | length > 0 and attr_val != 'Không rõ' and attr_val != '0' and attr_val != 'None' -%}
                    {%- if key == 'chi_tiet' -%}
                      <div class="attr-box">
                        <div class="attr-label">{{ label }}:</div>
                        <div class="attr-value-full">{{ attr_val }}</div>
                      </div>
                    {%- else -%}
                      <div class="attr-row">
                        <span class="attr-label">{{ label }}:</span>
                        <span class="attr-value">{{ attr_val }}</span>
                      </div>
                    {%- endif -%}
                  {%- endif -%}
                {%- endif -%}
              {%- endfor -%}
            </div>
          </td>
        </tr>
        {%- endfor -%}
      {%- else -%}
        <tr cellpadding="2" cellspacing="4">
          <td colspan="3" align="left">
            Không có sự kiện nào trong <span style="color:red; font-size:25px; font-weight:bold;">{{ so_ngay }}</span> ngày tới
          </td>
        </tr>
      {%- endif -%}
    </table>
  </div>

  <div class="conv-wrapper">
    <div class="conv-header" onclick="const b = this.nextElementSibling; const i = this.querySelector('.conv-icon'); if(b.style.display==='none' || b.style.display===''){b.style.display='block'; i.style.transform='rotate(180deg)';}else{b.style.display='none'; i.style.transform='rotate(0deg)';}">
      <h3 style="margin: 0; font-size: 1.3em; color: orange; display: flex; align-items: center; gap: 8px;">
        <span>🔄</span> Tra cứu / Quy đổi ngày nhanh
      </h3>
      <span class="conv-icon" style="transition: transform 0.3s; color: gray;">▼</span>
    </div>

    <div class="conv-body" style="display: none; margin-top: 15px;">
      <select class="conv-type conv-input" style="width: 100%; margin-bottom: 10px; text-align: left; padding-left: 10px;">
        <option value="solar_to_lunar">☀️ Dương lịch ➡️ 🌙 Âm lịch</option>
        <option value="lunar_to_solar">🌙 Âm lịch ➡️ ☀️ Dương lịch</option>
      </select>

      <div style="display: flex; gap: 8px; margin-bottom: 15px;">
        <input type="number" class="conv-day conv-input" placeholder="Ngày" min="1" max="31" style="flex: 1;">
        <input type="number" class="conv-month conv-input" placeholder="Tháng" min="1" max="12" style="flex: 1;">
        <input type="number" class="conv-year conv-input" placeholder="Năm" min="1800" max="2199" style="flex: 1.2;">
      </div>

      <button class="conv-btn" onclick="(async (btn) => { 
        const body = btn.parentElement; 
        const resDiv = body.querySelector('.conv-result'); 
        const type = body.querySelector('.conv-type').value; 
        const d = body.querySelector('.conv-day').value; 
        const m = body.querySelector('.conv-month').value; 
        const y = body.querySelector('.conv-year').value; 
        
        if(!d || !m || !y) { 
          resDiv.style.display = 'block'; 
          resDiv.innerHTML = '<div class=\'alert-error\'>⚠️ Vui lòng nhập đầy đủ Ngày, Tháng, Năm!</div>'; 
          return; 
        } 
        
        btn.classList.add('loading');
        btn.innerText = '⏳ ĐANG TÍNH...'; 
        
        try { 
          const ha = document.querySelector('home-assistant'); 
          const response = await ha.hass.callWS({ 
            type: 'call_service', 
            domain: 'am_lich_viet_nam', 
            service: 'convert_date', 
            service_data: { conversion_type: type, day: parseInt(d), month: parseInt(m), year: parseInt(y) }, 
            return_response: true 
          }); 
          
          const data = response.response; 
          
          if(data.error) { 
            resDiv.innerHTML = '<div class=\'alert-error\'>❌ Lỗi: ' + data.error + '</div>'; 
          } else { 
            let html = '<div class=\'res-card glass-panel\'>' +
              '<div class=\'res-grid\'>' +
                '<div class=\'res-row\'><span class=\'res-label\'>☀️ Dương Lịch:</span> <span class=\'res-val highlight-blue\'>' + data.ngay_duong_lich + '</span></div>' +
                '<div class=\'res-row\'><span class=\'res-label\'>🌙 Âm Lịch:</span> <span class=\'res-val highlight-yellow\'>' + data.ngay_am_lich + '</span></div>' +
                '<div class=\'res-row full-width\'><span class=\'res-label\'>🐲 Năm Can Chi:</span> <span class=\'res-val highlight-white\'>' + data.nam_can_chi + '</span></div>' +
              '</div>' +
              '<div class=\'res-note\'>ℹ️ ' + data.thong_bao_nhuan + '</div>';
            
            if(data.ngay_duong_thang_thuong || data.ngay_duong_thang_nhuan) { 
              html += '<div class=\'res-leap-box\'>' +
                '<div class=\'res-leap-title\'>📌 Chi tiết mốc ngày Dương lịch:</div>';
                if(data.ngay_duong_thang_thuong) html += '<div class=\'res-leap-item\'>🔹 Tháng thường: <span class=\'highlight-white\'>' + data.ngay_duong_thang_thuong + '</span></div>';
                if(data.ngay_duong_thang_nhuan) html += '<div class=\'res-leap-item\'>🔹 Tháng nhuận: <span class=\'highlight-white\'>' + data.ngay_duong_thang_nhuan + '</span></div>';
              html += '</div>'; 
            }

            if(data.details) {
              let det = data.details;
              html += '<details class=\'lunar-details\'>' +
                '<summary class=\'btn-detail\' title=\'Nhấn để xem hoặc ẩn\'>Chi tiết phong thủy</summary>' +
                '<div class=\'details-content glass-panel-inner\'>' +
                  '<div class=\'tu-vi-grid\'>' +
                    '<div class=\'tv-grid-item\'><span class=\'tv-label\'>Tiết khí:</span> <span class=\'tv-val\'>' + det.tiet_khi + '</span></div>' +
                    '<div class=\'tv-grid-item\'><span class=\'tv-label\'>Âm lịch:</span> <span class=\'tv-val\'>' + det.lunar_day + ' ' + det.month_name + ' ' + det.can_chi_year + '</span></div>' +
                    '<div class=\'tv-grid-item\'><span class=\'tv-label\'>Can chi:</span> <span class=\'tv-val\'>Ngày ' + det.can_chi_day + ', Tháng ' + det.can_chi_month + '</span></div>' +
                  '</div>' +
                  
                  '<div class=\'tv-section\'>' +
                    '<div class=\'tv-title\'>✨ Giờ Hoàng/Hắc Đạo</div>' +
                    '<div class=\'tv-good\'>' + det.gio_hoang_dao + '</div>' +
                    '<div class=\'tv-bad\' style=\'margin-top:4px;\'>' + det.gio_hac_dao + '</div>' +
                  '</div>' +
                  
                  '<div class=\'tv-section\'>' +
                    '<div class=\'tv-title\'>🧭 Hướng xuất hành</div>' +
                    '<div class=\'tv-text\'>Hỷ Thần: <span class=\'badge badge-good\'>' + det.huong_xuat_hanh['Hỷ Thần'] + '</span> | Tài Thần: <span class=\'badge badge-good\'>' + det.huong_xuat_hanh['Tài Thần'] + '</span></div>' +
                    '<div class=\'tv-text mt-sm\'>Tránh: <span class=\'badge badge-bad\'>' + det.huong_xuat_hanh['Hạc Thần'] + '</span></div>' +
                  '</div>' +
                  
                  '<div class=\'tv-section\'>' +
                    '<div class=\'tv-title\'>🔥 Trực: <span class=\'badge badge-neutral\'>' + det.thap_nhi_truc.name + '</span></div>' +
                    '<div class=\'tv-text\'><span class=\'text-green\'>Nên:</span> ' + det.thap_nhi_truc.details.tot + '</div>' +
                    '<div class=\'tv-text mt-sm\'><span class=\'text-red\'>Kiêng:</span> ' + det.thap_nhi_truc.details.xau + '</div>' +
                  '</div>' +
                  
                  '<div class=\'tv-section\'>' +
                    '<div class=\'tv-title\'>💫 Nhị Thập Bát Tú: <span class=\'badge badge-neutral\'>' + det.nhi_thap_bat_tu.name + '</span> <span class=\'tv-tu-name\'>(' + det.nhi_thap_bat_tu.details.tenNgay + ')</span></div>' +
                    '<div class=\'tv-text tv-tu-desc\'>' + det.nhi_thap_bat_tu.details.danhGia + '</div>' +
                    '<div class=\'tv-text\'><span class=\'text-green\'>Nên:</span> ' + det.nhi_thap_bat_tu.details.nenLam + '</div>' +
                    '<div class=\'tv-text mt-sm\'><span class=\'text-red\'>Kiêng:</span> ' + det.nhi_thap_bat_tu.details.kiengCu + '</div>' +
                  '</div>' +
                '</div>' +
              '</details>';
            }
            html += '</div>';
            resDiv.innerHTML = html; 
          } 
          resDiv.style.display = 'block'; 
        } catch(e) { 
          console.error(e); 
          resDiv.style.display = 'block'; 
          resDiv.innerHTML = '<div class=\'alert-error\'>❌ Lỗi kết nối hệ thống. Hãy kiểm tra lại.</div>'; 
        } finally { 
          btn.classList.remove('loading');
          btn.innerText = 'TÍNH TOÁN QUY ĐỔI'; 
        } 
      })(this)">TÍNH TOÁN QUY ĐỔI</button>

      <div class="conv-result" style="display: none; margin-top: 15px;"></div>
    </div>
  </div>
card_mod:
  style: >
    ha-card {
      background: rgba(0,0,0,0.3) !important;
    }

    /* --- PHẦN 1: CSS SỰ KIỆN SẮP ĐẾN --- */  .scroll-area {
      max-height: 250px; 
      overflow-y: auto;
      overflow-x: hidden;
      padding-right: 5px;
    } .scroll-area::-webkit-scrollbar { width: 4px; }
    .scroll-area::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
    .scroll-area::-webkit-scrollbar-thumb { background: rgba(255, 165, 0, 0.6);
    border-radius: 4px; }

    .flip-emoji { display: inline-block; animation: flip-hourglass 6s
    ease-in-out infinite; } @keyframes flip-hourglass { 0% { transform:
    rotate(0deg); } 12.5% { transform: rotate(180deg); } 50% { transform:
    rotate(180deg); } 62.5% { transform: rotate(0deg); } 100% { transform:
    rotate(0deg); } }

    tr.event-row { cursor: pointer; transition: background-color 0.2s; }
    tr.event-row:hover { background: rgba(255, 255, 255, 0.05); }

    .detail-content { background: rgba(0, 0, 0, 0.4); border-radius: 8px;
    margin-top: 5px; padding: 12px 15px; box-shadow: inset 0 2px 8px
    rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.05); animation:
    expandIn 0.3s ease-out; } @keyframes expandIn { 0% { opacity: 0; transform:
    translateY(-5px); } 100% { opacity: 1; transform: translateY(0); } }

    .attr-row { display: flex; justify-content: space-between; border-bottom:
    1px dashed rgba(255,255,255,0.15); padding: 6px 0; } .attr-row:last-child {
    border-bottom: none; } .attr-box { background: rgba(255,255,255,0.05);
    padding: 10px 12px; border-radius: 6px; margin-top: 8px; border-left: 3px
    solid orange; } .attr-label { color: #aaa; font-size: 0.9em; } .attr-value {
    color: white; font-weight: 500; text-align: right; } .attr-value-full {
    color: white; font-weight: normal; font-style: italic; margin-top: 4px;
    line-height: 1.4; font-size: 0.95em; }

    /* --- PHẦN 2: CSS KHUNG QUY ĐỔI --- */  .conv-wrapper { margin-top: 10px; }
    .conv-header { display: flex; justify-content: space-between; align-items:
    center; cursor: pointer; padding: 5px 20px 5px 5px; border-radius: 6px;
    transition: background 0.2s; } .conv-header:hover { background:
    rgba(255,255,255,0.05); }

    .conv-body { max-height: 400px; overflow-y: auto; overflow-x: hidden;
    padding-right: 5px; } .conv-body::-webkit-scrollbar { width: 4px; }
    .conv-body::-webkit-scrollbar-track { background: rgba(0,0,0,0.1);
    border-radius: 4px; } .conv-body::-webkit-scrollbar-thumb { background:
    rgba(255, 165, 0, 0.6); border-radius: 4px; }

    .conv-input { background: rgba(0,0,0,0.4); border: 1px solid
    rgba(255,255,255,0.2); color: white; padding: 8px; border-radius: 6px;
    outline: none; text-align: center; font-size: 1em; transition: border-color
    0.2s; } .conv-input:focus { border-color: orange; }

    .conv-btn { width: 100%; background: rgba(255, 165, 0, 0.8); color: black;
    font-weight: bold; border-radius: 6px; padding: 10px; border: none; cursor:
    pointer; transition: background 0.2s; font-size: 1em; } .conv-btn:hover {
    background: rgba(255, 165, 0, 1); } .conv-btn.loading { opacity: 0.7;
    cursor: not-allowed; }

    /* --- PHẦN 3: CSS HIỂN THỊ KẾT QUẢ QUY ĐỔI --- */   .glass-panel {
      background: rgba(0,0,0,0.6); 
      border-radius: 10px; 
      border-left: 4px solid #ff9800; 
      box-shadow: 0 4px 15px rgba(0,0,0,0.5); 
      padding: 18px;
      animation: expandIn 0.3s ease-out; 
    } 

    .glass-panel-inner { 
      background: rgba(0,0,0,0.4); 
      border-radius: 8px; 
      padding: 12px; 
      margin-top: 12px;
      border: 1px solid rgba(255,255,255,0.08); 
    }

    .alert-error { 
      background: rgba(255, 107, 107, 0.15); 
      border: 1px solid rgba(255, 107, 107, 0.4); 
      color: #ffc9c9; 
      padding: 12px; 
      border-radius: 8px;
      text-align: center; 
      margin-top:15px; 
      font-weight: 500;
    } 

    /* Lưới co dãn tự động (Responsive) */  .res-grid { 
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); 
      gap: 15px; 
      margin-bottom: 15px; 
    } 

    /* Box hiển thị ngày */ .res-row {
      background: linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%); 
      padding: 12px 15px; 
      border-radius: 8px; 
      display: flex;
      flex-direction: column; 
      align-items: center; /* Căn giữa các phần tử theo chiều ngang */
      text-align: center;  /* Đảm bảo chữ được căn giữa */
      gap: 6px; 
      border: 1px solid rgba(255,255,255,0.05);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);
    }

    /* Box Năm Can Chi làm nổi bật riêng */ .res-row.full-width { 
      grid-column: 1 / -1; 
      flex-direction: row; 
      justify-content: space-between; 
      align-items: center; 
      background: linear-gradient(145deg, rgba(255, 165, 0, 0.15) 0%, rgba(0,0,0,0.3) 100%);
      border: 1px solid rgba(255, 165, 0, 0.3);
    }   .res-label { 
      font-size: 1em;
      color: #ced4da; 
      font-weight: 500;
    } 

    /* Chữ số kết quả to và rõ */ .res-val { 
      font-size: 1.5em; 
      font-weight: 700; 
      letter-spacing: 0.5px;
    }

    /* Màu sắc phát sáng nhẹ trên nền tối */  .highlight-blue { color: #66d9ef;
    text-shadow: 0 0 10px rgba(102, 217, 239, 0.3); }   .highlight-yellow {
    color: #fcc419; text-shadow: 0 0 10px rgba(252, 196, 25, 0.3); }  
    .highlight-white { color: #ffffff; text-shadow: 0 0 10px rgba(255, 255, 255,
    0.4); font-size: 1.1em;}  .text-green { color: #51cf66; }  .text-red {
    color: #ff6b6b; }

    /* Box thông báo tháng nhuận */  .res-note { 
      font-size: 1em; 
      color: #a5d8ff; 
      line-height: 1.5; 
      padding: 10px 15px; 
      background: rgba(24, 100, 171, 0.2); 
      border-left: 3px solid #339af0;
      border-radius: 6px; 
      margin-top: 10px;
    } 

    .res-leap-box { 
      margin-top: 15px; 
      padding-top: 15px;
      border-top: 1px dashed rgba(255,255,255,0.15); 
      color: #ced4da; 
      font-size: 0.95em; 
    } 

    .res-leap-title { color: #ffa94d; margin-bottom: 8px; font-weight: bold;} 
    .res-leap-item { margin-bottom: 6px; }

    .lunar-details { margin-top: 18px; }  .btn-detail { 
      display: inline-flex;
      align-items: center; 
      padding: 8px 15px; 
      background: rgba(255,255,255,0.08);
      color: #66d9ef; 
      border-radius: 6px; 
      font-weight: bold; 
      font-size: 0.95em;
      cursor: pointer; 
      user-select: none; 
      transition: all 0.2s; 
      border: 1px solid rgba(102, 217, 239, 0.2);
    }  .btn-detail:hover { background: rgba(102, 217, 239, 0.15); } 
    .btn-detail::marker { content: '▶ '; color: #ff9800;}  details[open] >
    .btn-detail::marker { content: '▼ '; color: #ff9800;}

    .tu-vi-grid { 
      display: grid; 
      grid-template-columns: 1fr; 
      gap: 8px;
      margin-bottom: 15px; 
      padding-bottom: 15px; 
      border-bottom: 1px dashed rgba(255,255,255,0.15); 
    } 

    .tv-grid-item { display: flex; align-items: flex-start; }  .tv-label {
    color: #adb5bd; font-size: 0.95em; width: 75px; flex-shrink: 0; }  .tv-val {
    color: white; font-weight: 500; font-size: 1em; }

    .tv-section { margin-bottom: 18px; }  .tv-section:last-child {
    margin-bottom: 0; }  .tv-title { color: #ffa94d; font-weight: 600;
    font-size: 1em; margin-bottom: 8px; display: flex; align-items: center; gap:
    6px; } .tv-tu-name { font-size: 0.9em; color: #fcc419; font-weight: normal;
    } .tv-tu-desc { font-style: italic; color: #ced4da; margin-bottom: 8px;
    line-height: 1.4; }

    .tv-good { color: white; font-size: 0.95em; line-height: 1.5; padding-left:
    10px; border-left: 3px solid #51cf66; margin-bottom: 8px;}  .tv-bad { color:
    #ffc9c9; font-size: 0.95em; line-height: 1.5; padding-left: 10px;
    border-left: 3px solid #ff6b6b; }  .tv-text { color: white; font-size:
    0.95em; line-height: 1.5; margin-bottom: 6px; }  .mt-sm { margin-top: 6px; }

    .badge { display: inline-block; padding: 3px 8px; border-radius: 4px;
    font-size: 0.9em; font-weight: 600; margin: 0 2px; }  .badge-good {
    background: rgba(43, 138, 62, 0.2); color: #51cf66; border: 1px solid
    rgba(43, 138, 62, 0.5); }  .badge-bad { background: rgba(201, 42, 42, 0.2);
    color: #ff6b6b; border: 1px solid rgba(201, 42, 42, 0.5); }   .badge-neutral
    { background: rgba(77, 171, 247, 0.2); color: #66d9ef; border: 1px solid
    rgba(77, 171, 247, 0.5); }

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

  

