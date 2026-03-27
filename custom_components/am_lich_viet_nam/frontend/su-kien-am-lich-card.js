(function() {
  'use strict';

  // HÀM TIỆN ÍCH CHUNG
  const hexToRgba = (hex, opacity) => {
    let c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
      c= hex.substring(1).split('');
      if(c.length === 3) c= [c[0], c[0], c[1], c[1], c[2], c[2]];
      c= '0x'+c.join('');
      return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+(opacity/100)+')';
    }
    return hex; 
  };

  // ==========================================
  // 1. LỚP CHỈNH SỬA GIAO DIỆN UI (EDITOR)
  // ==========================================
  class SuKienAmLichCardEditor extends HTMLElement {
    setConfig(config) {
      this._config = config || {};
      if (this._rendered) {
        this.updateUI();
      }
    }

    set hass(hass) {
      this._hass = hass;
    }

    connectedCallback() {
      if (this._rendered) return;
      this._config = this._config || {};
      this._rendered = true;
      
      this.innerHTML = `
        <style>
          .editor-container { padding: 12px 0; font-family: var(--paper-font-body1_-_font-family, sans-serif); }
          .row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
          .row:last-child { margin-bottom: 0; }
          .label { font-weight: 500; color: var(--primary-text-color); font-size: 14px; }
          .input-group { display: flex; align-items: center; gap: 12px; }
          input[type=color] { cursor: pointer; border: 1px solid var(--divider-color, #e0e0e0); border-radius: 6px; padding: 2px; width: 40px; height: 32px; background: transparent; }
          input[type=number] { width: 60px; padding: 6px; border: 1px solid var(--divider-color, #ccc); border-radius: 6px; text-align: center; background: var(--card-background-color, transparent); color: var(--primary-text-color);}
          input[type=range] { flex-grow: 1; cursor: pointer; }
          .val-badge { background: var(--primary-color); color: var(--text-primary-color, white); padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: bold; min-width: 48px; text-align: center; }
          select.ha-select { background: var(--card-background-color, transparent); color: var(--primary-text-color); border: 1px solid var(--divider-color, #e0e0e0); padding: 6px 8px; border-radius: 6px; font-family: inherit; font-size: 14px; flex-grow: 1; max-width: 200px; cursor: pointer; }
          
          /* CSS CHO TÍNH NĂNG ẨN/HIỆN KHỐI */
          .section { border: 1px solid var(--divider-color, #e0e0e0); border-radius: 12px; padding: 16px; margin-bottom: 16px; background: var(--card-background-color, transparent); box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: padding 0.3s ease; }
          .section.collapsed { padding-bottom: 16px; }
          .section-title { font-weight: 600; display: flex; align-items: center; justify-content: space-between; font-size: 16px; color: var(--primary-text-color); border-bottom: 1px solid var(--divider-color, #e0e0e0); padding-bottom: 8px; margin-bottom: 16px; cursor: pointer; user-select: none; }
          .section-title:hover { opacity: 0.8; }
          .section.collapsed .section-title { margin-bottom: 0; border-bottom: none; padding-bottom: 0; }
          .section-content { display: block; overflow: hidden; animation: slideDown 0.3s ease-out forwards; }
          .section.collapsed .section-content { display: none; }
          .section-icon { font-size: 12px; opacity: 0.6; transition: transform 0.3s ease; }
          .section.collapsed .section-icon { transform: rotate(-90deg); }
          .title-left { display: flex; align-items: center; gap: 8px; pointer-events: none; }
          .title-right { display: flex; align-items: center; gap: 12px; }
          @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        </style>

        <div class="editor-container">
          
          <div class="section">
            <div class="section-title">
              <div class="title-left">⚙️ Cài đặt chung</div>
              <div class="title-right"><span class="section-icon">▼</span></div>
            </div>
            <div class="section-content">
              <div class="row">
                <span class="label">Hiển thị sự kiện trong (ngày) tới</span>
                <input type="number" id="so_ngay" min="1" max="365">
              </div>
              <div class="row">
                <span class="label" style="min-width: 120px;">Chiều cao tối đa (px)</span>
                <input type="range" id="chieu_cao_the" min="200" max="600" step="50">
                <span class="val-badge" id="chieu_cao_the_val"></span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">
              <div class="title-left">🎨 Nền (Background)</div>
              <div class="title-right"><span class="section-icon">▼</span></div>
            </div>
            <div class="section-content">
              <div class="row">
                <span class="label" style="min-width: 120px;">Loại nền</span>
                <select id="bg_type" class="ha-select">
                  <option value="solid">Màu đơn sắc (Solid)</option>
                  <option value="gradient">Màu dải (Gradient)</option>
                </select>
              </div>

              <div class="row">
                <span class="label" style="min-width: 120px;">Độ trong suốt nền (%)</span>
                <input type="range" id="bg_opacity" min="0" max="100">
                <span class="val-badge" id="bg_opacity_val"></span>
              </div>

              <div id="solid_settings">
                <div class="row" style="margin-top: 16px; border-top: 1px dashed var(--divider-color, #e0e0e0); padding-top: 16px;">
                  <span class="label">Màu nền</span>
                  <div class="input-group">
                    <input type="color" id="bg_color">
                    <span class="val-badge" id="bg_color_val"></span>
                  </div>
                </div>
              </div>

              <div id="gradient_settings" style="display:none;">
                <div class="row" style="margin-top: 16px; border-top: 1px dashed var(--divider-color, #e0e0e0); padding-top: 16px;">
                  <span class="label" style="min-width: 120px;">Mẫu Gradient</span>
                  <select id="bg_gradient_preset" class="ha-select">
                    <option value="linear-gradient(135deg, #141e30, #243b55)">🌌 Royal Night (Đêm hoàng gia)</option>
                    <option value="linear-gradient(135deg, #0f2027, #203a43, #2c5364)">🌊 Deep Ocean (Đại dương sâu)</option>
                    <option value="linear-gradient(135deg, #232526, #414345)">🏙️ Midnight City (Thành phố đêm)</option>
                    <option value="linear-gradient(135deg, #1a1a1a, #000000)">⚫ Dark Elegance (Đen thanh lịch)</option>
                    <option value="linear-gradient(135deg, #ff0099, #493240)">🔮 Cosmic Fusion (Vũ trụ)</option>
                    <option value="linear-gradient(135deg, #ff512f, #dd2476)">🌅 Sunset Vibes (Hoàng hôn)</option>
                    <option value="linear-gradient(135deg, #134e5e, #71b280)">🌲 Forest Mist (Sương rừng)</option>
                    <option value="linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))">🪟 Glassmorphism (Kính mờ)</option>
                    <option value="linear-gradient(135deg, #0f0c29, #302b63, #24243e)">🚀 Deep Space (Không gian rực rỡ)</option>
                    <option value="linear-gradient(135deg, #667eea, #764ba2)">💜 Plum Plate (Tím khói)</option>
                    <option value="linear-gradient(135deg, #ff9a9e, #fecfef)">🌸 Cherry Blossom (Hoa anh đào)</option>
                    <option value="linear-gradient(135deg, #f12711, #f5af19)">🔥 Fire Glow (Rực lửa)</option>
                    <option value="linear-gradient(135deg, #11998e, #38ef7d)">🌿 Neon Life (Sức sống Neon)</option>
                    <option value="linear-gradient(135deg, #00c6ff, #0072ff)">❄️ Winter Sky (Bầu trời mùa đông)</option>
                    <option value="linear-gradient(135deg, #f6d365, #fda085)">🍑 Sunrise Peach (Bình minh quả đào)</option>
                    <option value="linear-gradient(135deg, #9D50BB, #6E48AA)">💎 Amethyst (Đá thạch anh tím)</option>
                    <option value="linear-gradient(135deg, #2b5876, #4e4376)">🌠 Starry Night (Đêm đầy sao)</option>
                    <option value="linear-gradient(135deg, #ff758c, #ff7eb3)">🍉 Sweet Pink (Hồng ngọt ngào)</option>
                    <option value="linear-gradient(135deg, #4facfe, #00f2fe)">🏝️ Tropical Blue (Xanh nhiệt đới)</option>
                    <option value="linear-gradient(135deg, #870000, #190a05)">🍷 Blood Moon (Trăng máu)</option>
                    <option value="custom">✍️ Tùy chỉnh (Custom)</option>
                  </select>
                </div>

                <div id="custom_gradient_row" style="display:none; flex-direction: column; gap: 12px; margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--divider-color, #e0e0e0);">
                  <div class="row" style="width: 100%;">
                    <span class="label">Màu 1</span>
                    <div class="input-group"><input type="color" id="bg_gradient_color1"><span class="val-badge" id="bg_gradient_color1_val"></span></div>
                  </div>
                  <div class="row" style="width: 100%;">
                    <span class="label">Màu 2</span>
                    <div class="input-group"><input type="color" id="bg_gradient_color2"><span class="val-badge" id="bg_gradient_color2_val"></span></div>
                  </div>
                  <div class="row" style="width: 100%;">
                    <span class="label" style="min-width: 120px;">Góc độ (°)</span>
                    <input type="range" id="bg_gradient_angle" min="0" max="360" step="1">
                    <span class="val-badge" id="bg_gradient_angle_val"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="section collapsed">
            <div class="section-title">
              <div class="title-left">🔲 Viền (Border)</div>
              <div class="title-right"><span class="section-icon">▼</span></div>
            </div>
            <div class="section-content">
              <div class="row"><span class="label">Màu viền</span><div class="input-group"><input type="color" id="border_color"><span class="val-badge" id="border_color_val"></span></div></div>
              <div class="row"><span class="label" style="min-width: 120px;">Độ dày viền (px)</span><input type="range" id="border_width" min="0" max="10" step="1"><span class="val-badge" id="border_width_val"></span></div>
              <div class="row"><span class="label" style="min-width: 120px;">Độ trong suốt (%)</span><input type="range" id="border_opacity" min="0" max="100"><span class="val-badge" id="border_opacity_val"></span></div>
            </div>
          </div>

          <div class="section collapsed">
            <div class="section-title">
              <div class="title-left">☁️ Đổ bóng (Shadow)</div>
              <div class="title-right">
                <input type="checkbox" id="shadow_enable" style="transform: scale(1.2); cursor: pointer;" title="Bật/Tắt hiệu ứng đổ bóng">
                <span class="section-icon">▼</span>
              </div>
            </div>
            <div class="section-content">
              <div id="shadow_settings">
                <div class="row"><span class="label">Màu đổ bóng</span><div class="input-group"><input type="color" id="shadow_color"><span class="val-badge" id="shadow_color_val"></span></div></div>
                <div class="row"><span class="label" style="min-width: 120px;">Độ trong suốt (%)</span><input type="range" id="shadow_opacity" min="0" max="100"><span class="val-badge" id="shadow_opacity_val"></span></div>
                <div class="row"><span class="label" style="min-width: 120px;">Độ nhòe (Blur)</span><input type="range" id="shadow_blur" min="0" max="100"><span class="val-badge" id="shadow_blur_val"></span></div>
                <div class="row"><span class="label" style="min-width: 120px;">Khoảng cách (X)</span><input type="range" id="shadow_offset_x" min="-50" max="50"><span class="val-badge" id="shadow_offset_x_val"></span></div>
                <div class="row"><span class="label" style="min-width: 120px;">Khoảng cách (Y)</span><input type="range" id="shadow_offset_y" min="-50" max="50"><span class="val-badge" id="shadow_offset_y_val"></span></div>
              </div>
            </div>
          </div>

          <div class="section collapsed">
            <div class="section-title">
              <div class="title-left">🖋️ Tuỳ chỉnh Màu Nội Dung</div>
              <div class="title-right">
                <input type="checkbox" id="auto_contrast" style="transform: scale(1.2); cursor: pointer;" title="Tự động tương phản màu chữ theo Nền và Độ trong suốt">
                <span class="section-icon">▼</span>
              </div>
            </div>
            <div class="section-content">
              <div id="custom_colors_settings">
                <div class="row"><span class="label">Màu Tiêu đề chính</span><div class="input-group"><input type="color" id="mau_tieu_de_chinh"></div></div>
                <div class="row"><span class="label">Màu Thứ, Ngày Âm, Số ngày</span><div class="input-group"><input type="color" id="mau_thu_ngayam_songay"></div></div>
                <div class="row"><span class="label">Màu Ngày Dương (Số to)</span><div class="input-group"><input type="color" id="mau_ngay_duong"></div></div>
                <div class="row"><span class="label">Màu Tên Sự Kiện</span><div class="input-group"><input type="color" id="mau_ten_su_kien"></div></div>
                
                <div class="row" style="margin-top: 16px; border-top: 1px dashed var(--divider-color, #e0e0e0); padding-top: 16px;">
                  <span class="label">Màu Nền khối Chi tiết</span><div class="input-group"><input type="color" id="mau_nen_chi_tiet"></div>
                </div>
                <div class="row"><span class="label" style="min-width: 120px;">Độ trong suốt nền Chi tiết</span><input type="range" id="opacity_nen_chi_tiet" min="0" max="100"><span class="val-badge" id="opacity_nen_chi_tiet_val"></span></div>
                
                <div class="row"><span class="label">Màu Tiêu đề Chi tiết</span><div class="input-group"><input type="color" id="mau_tieu_de_chi_tiet"></div></div>
                <div class="row"><span class="label">Màu Text Chi tiết</span><div class="input-group"><input type="color" id="mau_chi_tiet"></div></div>
              </div>
            </div>
          </div>

        </div>
      `;

      this.updateUI();
      this.addListeners();
    }

    get _so_ngay() { return this._config.so_ngay !== undefined ? this._config.so_ngay : 30; }
    get _chieu_cao_the() { return this._config.chieu_cao_the !== undefined ? this._config.chieu_cao_the : 350; }

    get _bg_type() { return this._config.bg_type || 'solid'; }
    get _bg_color() { return this._config.bg_color || '#000000'; }
    get _bg_opacity() { return this._config.bg_opacity !== undefined ? this._config.bg_opacity : 30; }
    get _bg_gradient_preset() { return this._config.bg_gradient_preset || 'linear-gradient(135deg, #141e30, #243b55)'; }
    get _bg_gradient_color1() { return this._config.bg_gradient_color1 || '#ff0000'; }
    get _bg_gradient_color2() { return this._config.bg_gradient_color2 || '#0000ff'; }
    get _bg_gradient_angle() { return this._config.bg_gradient_angle !== undefined ? this._config.bg_gradient_angle : 135; }

    get _border_color() { return this._config.border_color || '#ffffff'; }
    get _border_width() { return this._config.border_width !== undefined ? this._config.border_width : 0; }
    get _border_opacity() { return this._config.border_opacity !== undefined ? this._config.border_opacity : 0; }
    
    get _shadow_enable() { return this._config.shadow_enable || false; }
    get _shadow_color() { return this._config.shadow_color || '#000000'; }
    get _shadow_opacity() { return this._config.shadow_opacity !== undefined ? this._config.shadow_opacity : 50; }
    get _shadow_blur() { return this._config.shadow_blur !== undefined ? this._config.shadow_blur : 16; }
    get _shadow_offset_x() { return this._config.shadow_offset_x !== undefined ? this._config.shadow_offset_x : 0; }
    get _shadow_offset_y() { return this._config.shadow_offset_y !== undefined ? this._config.shadow_offset_y : 4; }

    get _auto_contrast() { return this._config.auto_contrast !== undefined ? this._config.auto_contrast : false; }
    get _mau_tieu_de_chinh() { return this._config.mau_tieu_de_chinh || '#ffffff'; }
    get _mau_thu_ngayam_songay() { return this._config.mau_thu_ngayam_songay || '#ffa500'; }
    get _mau_ngay_duong() { return this._config.mau_ngay_duong || '#ffffff'; }
    get _mau_ten_su_kien() { return this._config.mau_ten_su_kien || '#4dabf7'; }
    
    get _mau_nen_chi_tiet() { return this._config.mau_nen_chi_tiet || '#000000'; }
    get _opacity_nen_chi_tiet() { return this._config.opacity_nen_chi_tiet !== undefined ? this._config.opacity_nen_chi_tiet : 40; }
    
    get _mau_tieu_de_chi_tiet() { return this._config.mau_tieu_de_chi_tiet || '#adb5bd'; }
    get _mau_chi_tiet() { return this._config.mau_chi_tiet || '#e9ecef'; }

    updateUI() {
      if (!this.querySelector('#so_ngay')) return;

      this.querySelector('#so_ngay').value = this._so_ngay;
      this.querySelector('#chieu_cao_the').value = this._chieu_cao_the;
      this.querySelector('#chieu_cao_the_val').textContent = this._chieu_cao_the + 'px';

      // Nền
      this.querySelector('#bg_type').value = this._bg_type;
      this.querySelector('#bg_opacity').value = this._bg_opacity;
      this.querySelector('#bg_opacity_val').textContent = this._bg_opacity + '%';

      if (this._bg_type === 'gradient') {
        this.querySelector('#solid_settings').style.display = 'none';
        this.querySelector('#gradient_settings').style.display = 'block';
      } else {
        this.querySelector('#solid_settings').style.display = 'block';
        this.querySelector('#gradient_settings').style.display = 'none';
      }

      this.querySelector('#bg_color').value = this._bg_color;
      this.querySelector('#bg_color_val').textContent = this._bg_color.toUpperCase();
      this.querySelector('#bg_gradient_preset').value = this._bg_gradient_preset;
      
      if (this._bg_gradient_preset === 'custom') {
        this.querySelector('#custom_gradient_row').style.display = 'flex';
      } else {
        this.querySelector('#custom_gradient_row').style.display = 'none';
      }
      
      this.querySelector('#bg_gradient_color1').value = this._bg_gradient_color1;
      this.querySelector('#bg_gradient_color1_val').textContent = this._bg_gradient_color1.toUpperCase();
      this.querySelector('#bg_gradient_color2').value = this._bg_gradient_color2;
      this.querySelector('#bg_gradient_color2_val').textContent = this._bg_gradient_color2.toUpperCase();
      this.querySelector('#bg_gradient_angle').value = this._bg_gradient_angle;
      this.querySelector('#bg_gradient_angle_val').textContent = this._bg_gradient_angle + '°';

      // Viền
      this.querySelector('#border_color').value = this._border_color;
      this.querySelector('#border_color_val').textContent = this._border_color.toUpperCase();
      this.querySelector('#border_width').value = this._border_width;
      this.querySelector('#border_width_val').textContent = this._border_width + 'px';
      this.querySelector('#border_opacity').value = this._border_opacity;
      this.querySelector('#border_opacity_val').textContent = this._border_opacity + '%';

      // Bóng
      this.querySelector('#shadow_enable').checked = this._shadow_enable;
      this.querySelector('#shadow_settings').style.display = this._shadow_enable ? 'block' : 'none';
      this.querySelector('#shadow_color').value = this._shadow_color;
      this.querySelector('#shadow_color_val').textContent = this._shadow_color.toUpperCase();
      this.querySelector('#shadow_opacity').value = this._shadow_opacity;
      this.querySelector('#shadow_opacity_val').textContent = this._shadow_opacity + '%';
      this.querySelector('#shadow_blur').value = this._shadow_blur;
      this.querySelector('#shadow_blur_val').textContent = this._shadow_blur + 'px';
      this.querySelector('#shadow_offset_x').value = this._shadow_offset_x;
      this.querySelector('#shadow_offset_x_val').textContent = this._shadow_offset_x + 'px';
      this.querySelector('#shadow_offset_y').value = this._shadow_offset_y;
      this.querySelector('#shadow_offset_y_val').textContent = this._shadow_offset_y + 'px';

      // Màu chữ
      this.querySelector('#auto_contrast').checked = this._auto_contrast;
      if (this._auto_contrast) {
          this.querySelector('#custom_colors_settings').style.opacity = '0.4';
          this.querySelector('#custom_colors_settings').style.pointerEvents = 'none';
      } else {
          this.querySelector('#custom_colors_settings').style.opacity = '1';
          this.querySelector('#custom_colors_settings').style.pointerEvents = 'auto';
      }

      this.querySelector('#mau_tieu_de_chinh').value = this._mau_tieu_de_chinh;
      this.querySelector('#mau_thu_ngayam_songay').value = this._mau_thu_ngayam_songay;
      this.querySelector('#mau_ngay_duong').value = this._mau_ngay_duong;
      this.querySelector('#mau_ten_su_kien').value = this._mau_ten_su_kien;
      
      this.querySelector('#mau_nen_chi_tiet').value = this._mau_nen_chi_tiet;
      this.querySelector('#opacity_nen_chi_tiet').value = this._opacity_nen_chi_tiet;
      this.querySelector('#opacity_nen_chi_tiet_val').textContent = this._opacity_nen_chi_tiet + '%';

      this.querySelector('#mau_tieu_de_chi_tiet').value = this._mau_tieu_de_chi_tiet;
      this.querySelector('#mau_chi_tiet').value = this._mau_chi_tiet;
    }

    addListeners() {
      // 1. Lắng nghe thay đổi Cấu hình
      const dispatchUpdate = () => {
        const newConfig = { 
            ...this._config, 
            so_ngay: parseInt(this.querySelector('#so_ngay').value, 10),
            chieu_cao_the: parseInt(this.querySelector('#chieu_cao_the').value, 10),

            bg_type: this.querySelector('#bg_type').value,
            bg_color: this.querySelector('#bg_color').value,
            bg_opacity: parseInt(this.querySelector('#bg_opacity').value, 10),
            bg_gradient_preset: this.querySelector('#bg_gradient_preset').value,
            bg_gradient_color1: this.querySelector('#bg_gradient_color1').value,
            bg_gradient_color2: this.querySelector('#bg_gradient_color2').value,
            bg_gradient_angle: parseInt(this.querySelector('#bg_gradient_angle').value, 10),

            border_color: this.querySelector('#border_color').value,
            border_width: parseInt(this.querySelector('#border_width').value, 10),
            border_opacity: parseInt(this.querySelector('#border_opacity').value, 10),
            shadow_enable: this.querySelector('#shadow_enable').checked,
            shadow_color: this.querySelector('#shadow_color').value,
            shadow_opacity: parseInt(this.querySelector('#shadow_opacity').value, 10),
            shadow_blur: parseInt(this.querySelector('#shadow_blur').value, 10),
            shadow_offset_x: parseInt(this.querySelector('#shadow_offset_x').value, 10),
            shadow_offset_y: parseInt(this.querySelector('#shadow_offset_y').value, 10),

            auto_contrast: this.querySelector('#auto_contrast').checked,
            mau_tieu_de_chinh: this.querySelector('#mau_tieu_de_chinh').value,
            mau_thu_ngayam_songay: this.querySelector('#mau_thu_ngayam_songay').value,
            mau_ngay_duong: this.querySelector('#mau_ngay_duong').value,
            mau_ten_su_kien: this.querySelector('#mau_ten_su_kien').value,
            
            mau_nen_chi_tiet: this.querySelector('#mau_nen_chi_tiet').value,
            opacity_nen_chi_tiet: parseInt(this.querySelector('#opacity_nen_chi_tiet').value, 10),

            mau_tieu_de_chi_tiet: this.querySelector('#mau_tieu_de_chi_tiet').value,
            mau_chi_tiet: this.querySelector('#mau_chi_tiet').value,
        };
        
        const event = new CustomEvent("config-changed", { detail: { config: newConfig }, bubbles: true, composed: true });
        this.dispatchEvent(event);
        this.updateUI();
      };

      this.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', dispatchUpdate);
        el.addEventListener('change', dispatchUpdate); 
      });

      // 2. Logic cho Tính năng Thu gọn/Mở rộng (Collapse/Expand)
      this.querySelectorAll('.section-title').forEach(titleEl => {
        const inputs = titleEl.querySelectorAll('input, select, button');
        inputs.forEach(input => {
          input.addEventListener('click', (e) => e.stopPropagation());
        });

        titleEl.addEventListener('click', () => {
          const section = titleEl.closest('.section');
          section.classList.toggle('collapsed');
        });
      });
    }
  }

  // ==========================================
  // 2. LỚP HIỂN THỊ GIAO DIỆN THẺ (CARD)
  // ==========================================
  class SuKienAmLichCard extends HTMLElement {
    static getConfigElement() { return document.createElement('su-kien-am-lich-editor'); }
    static getStubConfig() { return { so_ngay: 30, chieu_cao_the: 350, bg_type: 'solid', bg_color: '#000000', bg_opacity: 30 }; }

    constructor() {
      super();
      this.expandedRows = new Set();
      this._lastDataString = null;
      this._handleDocumentClick = this._handleDocumentClick.bind(this);
    }

    connectedCallback() {
      document.addEventListener('click', this._handleDocumentClick);
    }

    disconnectedCallback() {
      document.removeEventListener('click', this._handleDocumentClick);
    }

    _handleDocumentClick(event) {
      if (this.expandedRows.size === 0) return; 
      
      const path = event.composedPath();
      
      if (path.includes(this)) {
        const isInsideRow = path.some(el => el.classList && (el.classList.contains('event-row') || el.classList.contains('detail-row')));
        if (!isInsideRow) {
          this._closeAll();
        }
      } else {
        this._closeAll();
      }
    }

    _closeAll() {
      if (!this.card) return;
      this.expandedRows.forEach(expandedId => {
        const detail = this.card.querySelector(`[id="detail-${expandedId}"]`);
        const rowElement = this.card.querySelector(`.event-row[data-id="${expandedId}"]`);
        if (detail) detail.style.display = 'none';
        if (rowElement) {
          const icon = rowElement.querySelector('.toggle-icon');
          if (icon) icon.style.transform = 'rotate(0deg)';
        }
      });
      this.expandedRows.clear();
    }

    setConfig(config) {
      if (!config) throw new Error("Invalid configuration");
      this.config = config;

      if (!this.shadowRoot) {
        this.attachShadow({ mode: 'open' });
      }

      if (!this.card) {
        this.card = document.createElement('ha-card');
        this.shadowRoot.appendChild(this.card);
      }
      
      const applyOpacityToGradientStr = (str, opacity) => {
          return str.replace(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/gi, (match) => hexToRgba(match, opacity));
      };

      const bgType = this.config.bg_type || 'solid';
      const bgOpacity = this.config.bg_opacity !== undefined ? this.config.bg_opacity : 30;

      if (bgType === 'gradient') {
          const preset = this.config.bg_gradient_preset || 'linear-gradient(135deg, #141e30, #243b55)';
          if (preset === 'custom') {
              const color1 = this.config.bg_gradient_color1 || '#ff0000';
              const color2 = this.config.bg_gradient_color2 || '#0000ff';
              const angle = this.config.bg_gradient_angle !== undefined ? this.config.bg_gradient_angle : 135;
              this.card.style.background = `linear-gradient(${angle}deg, ${hexToRgba(color1, bgOpacity)}, ${hexToRgba(color2, bgOpacity)})`;
          } else {
              this.card.style.background = applyOpacityToGradientStr(preset, bgOpacity);
          }
      } else {
          const bgColor = this.config.bg_color || '#000000';
          this.card.style.background = hexToRgba(bgColor, bgOpacity);
      }

      const borderWidth = this.config.border_width !== undefined ? this.config.border_width : 0;
      if (this.config.border_opacity !== undefined && this.config.border_opacity > 0 && borderWidth > 0) {
          const borderColor = this.config.border_color || '#ffffff';
          const borderOpacity = this.config.border_opacity;
          this.card.style.border = `${borderWidth}px solid ${hexToRgba(borderColor, borderOpacity)}`;
      } else {
          this.card.style.border = 'none';
      }

      if (this.config.shadow_enable) {
          const shadowColor = this.config.shadow_color || '#000000';
          const shadowOpacity = this.config.shadow_opacity !== undefined ? this.config.shadow_opacity : 50;
          const blur = this.config.shadow_blur !== undefined ? this.config.shadow_blur : 16;
          const offsetX = this.config.shadow_offset_x !== undefined ? this.config.shadow_offset_x : 0;
          const offsetY = this.config.shadow_offset_y !== undefined ? this.config.shadow_offset_y : 4;
          this.card.style.boxShadow = `${offsetX}px ${offsetY}px ${blur}px ${hexToRgba(shadowColor, shadowOpacity)}`;
      } else {
          this.card.style.boxShadow = 'none';
      }

      this.card.style.borderRadius = 'var(--ha-card-border-radius, 12px)';
      this.card.style.overflow = 'hidden';
      
      if (this._hass) this.updateData();
    }

    set hass(hass) {
      this._hass = hass;
      this.updateData();
    }

    updateData() {
      if (!this._hass || !this.config) return;

      const soNgay = this.config.so_ngay !== undefined ? this.config.so_ngay : 30;
      let events = [];
      let hasIntegrationData = false; 

      for (const [entityId, stateObj] of Object.entries(this._hass.states)) {
        if (!entityId.startsWith('sensor.')) continue;
        
        const attrs = stateObj.attributes;
        if (!attrs) continue;

        if (attrs.ngay_am_lich_su_kien !== undefined || attrs.ngay_duong_lich_su_kien !== undefined || attrs.thu_su_kien !== undefined) {
            hasIntegrationData = true;
        }

        const daysLeft = parseInt(stateObj.state);
        if (isNaN(daysLeft) || daysLeft < 0 || daysLeft > soNgay) continue;

        try {
          const am_su_kien = String(attrs.ngay_am_lich_su_kien || "");
          const duong_hien_tai = String(attrs.ngay_duong_lich_hien_tai || "");
          const duong_su_kien = String(attrs.ngay_duong_lich_su_kien || "");
          const am_hien_tai = String(attrs.ngay_am_lich_hien_tai || "");

          let eventData = null;
          if (am_su_kien && duong_hien_tai) {
            eventData = { entity_id: entityId, days: daysLeft, name: attrs.friendly_name || stateObj.name || "Sự kiện", thu: attrs.thu_hien_tai || "", duong: duong_hien_tai.substring(0, 5), am: am_su_kien.split('/').slice(0, 2).join('/'), attrs: attrs };
          } else if (duong_su_kien && am_hien_tai) {
            eventData = { entity_id: entityId, days: daysLeft, name: attrs.friendly_name || stateObj.name || "Sự kiện", thu: attrs.thu_hien_tai || "", duong: duong_su_kien.substring(0, 5), am: am_hien_tai.split('/').slice(0, 2).join('/'), attrs: attrs };
          }
          if (eventData) events.push(eventData);
        } catch (err) { }
      }

      events.sort((a, b) => a.days - b.days);

      const dataHash = JSON.stringify(events.map(e => `${e.entity_id}_${e.days}`)) + JSON.stringify(this.config) + hasIntegrationData;
      if (this._lastDataString === dataHash) return;
      this._lastDataString = dataHash;

      this.renderEvents(events, soNgay, hasIntegrationData);
    }

    renderEvents(events, soNgay, hasIntegrationData) {
      const cfg = Object.assign({
        auto_contrast: false,
        mau_tieu_de_chinh: '#ffffff',
        mau_thu_ngayam_songay: '#ffa500', 
        mau_ngay_duong: '#ffffff', 
        mau_ten_su_kien: '#4dabf7',
        mau_tieu_de_chi_tiet: '#adb5bd', 
        mau_chi_tiet: '#e9ecef',
        mau_nen_chi_tiet: '#000000',
        opacity_nen_chi_tiet: 40,
        chieu_cao_the: 350
      }, this.config);

      // ==========================================
      // THUẬT TOÁN AUTO CONTRAST NÂNG CAO
      // ==========================================
      if (cfg.auto_contrast) {
          let strToExtract = "";
          if (this.config.bg_type === 'solid' && this.config.bg_color) {
              strToExtract = this.config.bg_color;
          } else if (this.config.bg_type === 'gradient') {
              const preset = this.config.bg_gradient_preset || 'linear-gradient(135deg, #141e30, #243b55)';
              if (preset === 'custom') {
                  strToExtract = (this.config.bg_gradient_color1 || '#ff0000') + " " + (this.config.bg_gradient_color2 || '#0000ff');
              } else strToExtract = preset;
          }

          const hexRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/gi;
          let match;
          let colorsToCheck = [];
          while ((match = hexRegex.exec(strToExtract)) !== null) {
              let hex = match[1];
              if (hex.length === 3) hex = hex.split('').map(x => x+x).join('');
              colorsToCheck.push({ r: parseInt(hex.substring(0,2), 16), g: parseInt(hex.substring(2,4), 16), b: parseInt(hex.substring(4,6), 16) });
          }
          const rgbRegex = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/gi;
          while ((match = rgbRegex.exec(strToExtract)) !== null) {
              colorsToCheck.push({ r: parseInt(match[1], 10), g: parseInt(match[2], 10), b: parseInt(match[3], 10) });
          }

          if (colorsToCheck.length > 0) {
              let avgR = 0, avgG = 0, avgB = 0;
              colorsToCheck.forEach(c => { avgR += c.r; avgG += c.g; avgB += c.b; });
              avgR = Math.round(avgR / colorsToCheck.length);
              avgG = Math.round(avgG / colorsToCheck.length);
              avgB = Math.round(avgB / colorsToCheck.length);

              let isDarkTheme = true;
              if (this._hass && this._hass.themes && this._hass.themes.darkMode !== undefined) {
                  isDarkTheme = this._hass.themes.darkMode;
              } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  isDarkTheme = true;
              } else {
                  isDarkTheme = false;
              }

              const op = (this.config.bg_opacity !== undefined ? this.config.bg_opacity : 30) / 100;
              const baseBg = isDarkTheme ? 30 : 240; 
              
              const effR = Math.round(avgR * op + baseBg * (1 - op));
              const effG = Math.round(avgG * op + baseBg * (1 - op));
              const effB = Math.round(avgB * op + baseBg * (1 - op));

              const yiq = ((effR * 299) + (effG * 587) + (effB * 114)) / 1000;
              const isLightBackground = yiq >= 128;

              let r = effR / 255, g = effG / 255, b = effB / 255;
              let max = Math.max(r, g, b), min = Math.min(r, g, b);
              let h, s, l = (max + min) / 2;
              if (max == min) { h = s = 0; }
              else {
                  let d = max - min;
                  s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                  switch(max) {
                      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                      case g: h = (b - r) / d + 2; break;
                      case b: h = (r - g) / d + 4; break;
                  }
                  h /= 6;
              }
              let hue = Math.round(h * 360);

              if (isLightBackground) {
                  cfg.mau_tieu_de_chinh = '#1a1a1a';
                  cfg.mau_ngay_duong = '#111111';
                  cfg.mau_tieu_de_chi_tiet = '#555555';
                  cfg.mau_chi_tiet = '#222222';
                  cfg.mau_nen_chi_tiet = '#ffffff';
                  cfg.opacity_nen_chi_tiet = 75; 

                  if (s < 0.15) { 
                      cfg.mau_thu_ngayam_songay = '#D32F2F'; 
                      cfg.mau_ten_su_kien = '#1976D2'; 
                  } else if (hue >= 0 && hue < 60) { 
                      cfg.mau_thu_ngayam_songay = '#0D47A1'; 
                      cfg.mau_ten_su_kien = '#006064';
                  } else if (hue >= 60 && hue < 160) { 
                      cfg.mau_thu_ngayam_songay = '#4A148C'; 
                      cfg.mau_ten_su_kien = '#B71C1C';
                  } else if (hue >= 160 && hue < 260) { 
                      cfg.mau_thu_ngayam_songay = '#E65100'; 
                      cfg.mau_ten_su_kien = '#C2185B';
                  } else { 
                      cfg.mau_thu_ngayam_songay = '#004D40'; 
                      cfg.mau_ten_su_kien = '#E64A19';
                  }
              } else {
                  cfg.mau_tieu_de_chinh = '#ffffff';
                  cfg.mau_ngay_duong = '#ffffff';
                  cfg.mau_tieu_de_chi_tiet = '#adb5bd';
                  cfg.mau_chi_tiet = '#f8f9fa';
                  cfg.mau_nen_chi_tiet = '#000000';
                  cfg.opacity_nen_chi_tiet = 50; 

                  if (s < 0.15) { 
                      cfg.mau_thu_ngayam_songay = '#FFCA28'; 
                      cfg.mau_ten_su_kien = '#29B6F6'; 
                  } else if (hue >= 0 && hue < 60) { 
                      cfg.mau_thu_ngayam_songay = '#FFEA00'; 
                      cfg.mau_ten_su_kien = '#00E5FF';
                  } else if (hue >= 60 && hue < 160) { 
                      cfg.mau_thu_ngayam_songay = '#FF9100'; 
                      cfg.mau_ten_su_kien = '#FF4081';
                  } else if (hue >= 160 && hue < 260) { 
                      cfg.mau_thu_ngayam_songay = '#C6FF00'; 
                      cfg.mau_ten_su_kien = '#40C4FF';
                  } else { 
                      cfg.mau_thu_ngayam_songay = '#69F0AE'; 
                      cfg.mau_ten_su_kien = '#FFAB40';
                  }
              }
          }
      }

      // Xử lý riêng độ trong suốt của Nền Chi tiết
      const detailBgRgba = hexToRgba(cfg.mau_nen_chi_tiet, cfg.opacity_nen_chi_tiet);

      // SỬ DỤNG CSS CONTAINER QUERIES (cqi) ĐỂ RESPONSIVE MỌI KÍCH THƯỚC CHỮ
      let html = `
        <style>
          .card-wrapper {
            container-type: inline-size;
            width: 100%;
            display: flex;
            flex-direction: column;
            max-height: ${cfg.chieu_cao_the}px; /* Áp dụng giới hạn cho tổng toàn bộ thẻ */
          }
          .scroll-area { 
            flex: 1; 
            min-height: 0; /* Quan trọng để flexbox cuộn được đúng */
            overflow-y: auto; 
            overflow-x: hidden; 
            padding: 0 10px 10px 10px; 
            scroll-behavior: smooth; /* Thêm tính năng cuộn mượt cho container */
          }
          .scroll-area::-webkit-scrollbar { width: 4px; }
          .scroll-area::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
          .scroll-area::-webkit-scrollbar-thumb { background: rgba(255, 165, 0, 0.6); border-radius: 4px; }
          
          .header-title { padding: 8px 16px 8px 16px; font-weight: bold; font-size: clamp(16px, 6cqi, 26px); color: ${cfg.mau_tieu_de_chinh}; text-shadow: 0 1px 3px rgba(0,0,0,0.3); }
          
          .flip-emoji { display: inline-block; animation: flip-hourglass 6s ease-in-out infinite; }
          @keyframes flip-hourglass { 0% { transform: rotate(0deg); } 12.5%, 50% { transform: rotate(180deg); } 62.5%, 100% { transform: rotate(0deg); } }
          
          tr.event-row { cursor: pointer; transition: background-color 0.2s; }
          tr.event-row:hover { background-color: rgba(255, 255, 255, 0.05); }
          
          .detail-content { background: ${detailBgRgba}; border-radius: 8px; margin-top: 5px; padding: clamp(8px, 3cqi, 15px); box-shadow: inset 0 2px 8px rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); animation: expandIn 0.3s ease-out; }
          @keyframes expandIn { 0% { opacity: 0; transform: translateY(-5px); } 100% { opacity: 1; transform: translateY(0); } }
          
          .attr-row { display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.15); padding: 6px 0; font-size: clamp(11px, 3.8cqi, 15px); }
          .attr-row:last-child { border-bottom: none; }
          .attr-box { background: rgba(255,255,255,0.05); padding: 10px 12px; border-radius: 6px; margin-top: 8px; font-size: clamp(11px, 3.8cqi, 15px); } 
          .attr-label { font-weight: 500; } 
          .attr-value { font-weight: 500; text-align: right; } 
          .attr-value-full { font-weight: normal; font-style: italic; margin-top: 4px; line-height: 1.4; }
          
          /* KÍCH THƯỚC CHỮ TỰ CO DÃN & CANH GIỮA EMOJI */
          .txt-thu-am { font-size: clamp(11px, 3.5cqi, 15px); line-height: 1.1; font-weight: 500; }
          .txt-duong { font-size: clamp(22px, 7cqi, 34px); font-weight: bold; line-height: 1; }
          .txt-ten-sk { font-size: clamp(13px, 4.5cqi, 20px); font-weight: 600; line-height: 1.2; }
          .txt-so-ngay { font-size: clamp(11px, 3.8cqi, 16px); font-style: italic; font-weight: 500; }
          .emoji-sk { font-size: clamp(24px, 7cqi, 34px); margin-right: 10px; flex-shrink: 0; }
        </style>
        <div class="card-wrapper">
          <div class="header-title">⏰ Sự kiện sắp đến</div>
          <div class="scroll-area" id="event-container">
      `;

      if (!hasIntegrationData) {
        html += `
          <div style="padding: 25px 15px; text-align: center; color: ${cfg.mau_tieu_de_chinh}; font-size: clamp(14px, 4cqi, 16px);">
            <div style="font-size: 36px; margin-bottom: 12px;">📭</div>
            <strong style="display:block; margin-bottom: 8px;">Chưa có dữ liệu</strong>
            <span style="opacity: 0.8; font-size: 0.9em;">Tích hợp Lịch Âm Dương chưa được cài đặt hoặc các cảm biến sự kiện đang bị tắt. Vui lòng kiểm tra lại cấu hình.</span>
          </div>`;
      } else if (events.length === 0) {
        html += `<div style="padding: 15px; color: ${cfg.mau_tieu_de_chinh}; font-size: clamp(14px, 4cqi, 18px);">Không có sự kiện nào trong <span style="color:${cfg.mau_thu_ngayam_songay}; font-weight:bold;">${soNgay}</span> ngày tới</div>`;
      } else {
        html += '<table border="0" cellpadding="2" cellspacing="4" width="100%" style="margin-top: -5px;">';
        events.forEach(ev => {
          let mau_td = ev.days <= 2 ? "red" : ev.days <= 7 ? "orange" : ev.days <= 15 ? "yellow" : "blue";
          const ten_su_kien = String(ev.name || "").toLowerCase();
          let icon = "🎉";
          if (ten_su_kien.includes("sinh nhật")) icon = "🎂";
          else if (ten_su_kien.includes("giỗ")) icon = "🕯️";
          else if (ten_su_kien.includes("cưới")) icon = "💍";

          // --- LOGIC ĐỔI TÊN NHÃN ĐỘNG ---
          const eventLabels = {
            ngay_am_lich_su_kien: 'Ngày Âm', 
            ngay_duong_lich_su_kien: 'Ngày Dương', 
            thu_su_kien: 'Thứ',
            nam_can_chi_su_kien: 'Năm Can Chi', 
            so_nam: 'Số Năm kỷ niệm', 
            so_tuoi: 'Số Tuổi', 
            chi_tiet: 'Chi Tiết'
          };

          if (ten_su_kien.includes("giỗ")) {
            eventLabels.so_tuoi = 'Hưởng dương';
            eventLabels.so_nam = 'Số năm đã mất';
          } else if (ten_su_kien.includes("sinh nhật")) {
            eventLabels.so_nam = 'Tuổi';
          }
          // ---------------------------------

          const isExp = this.expandedRows.has(ev.entity_id);
          html += `
            <tr class="event-row" data-id="${ev.entity_id}">
              <td align="center" width="20%" style="border-bottom: solid 1px rgba(255,255,255,0.2); vertical-align: middle; padding: 8px 0;">
                <div class="txt-thu-am" style="color:${cfg.mau_thu_ngayam_songay}; margin-bottom: 2px;">${ev.thu}</div>
                <div class="txt-duong" style="color:${cfg.mau_ngay_duong}; margin-bottom: 2px;">${ev.duong}</div>
                <div class="txt-thu-am" style="color:${cfg.mau_thu_ngayam_songay};">${ev.am}</div>
              </td>
              <td align="center" style="background:${mau_td}; width: 4px; border-radius: 2px; margin-bottom: 5px;"></td>
              <td align="center" width="80%" style="border-bottom: solid 1px rgba(255,255,255,0.2);">
                <div style="display: flex; align-items: center; width: 100%; height: 100%; padding-left: 4px;">
                  <div class="emoji-sk">${icon}</div>
                  <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center;">
                    <div style="color:${cfg.mau_ten_su_kien}; text-align: left;">
                      <span class="txt-ten-sk">${ev.name}</span>
                    </div>
                    <div style="color:${cfg.mau_thu_ngayam_songay}; text-align: right; padding-right: 10px; margin-top: 4px;">
                      <span class="txt-so-ngay">${ev.days} ngày</span>
                      <span class="flip-emoji" style="font-size: clamp(14px, 4cqi, 18px); margin: 0 4px;">⏳</span>
                      <span class="toggle-icon" style="font-size: 12px; color: #888; display: inline-block; transition: transform 0.3s; transform: rotate(${isExp ? '180deg' : '0deg'});">▼</span>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr class="detail-row" id="detail-${ev.entity_id}" style="display: ${isExp ? 'table-row' : 'none'};">
              <td colspan="3" style="border-bottom: solid 1px rgba(255,255,255,0.2); padding: 0 5px 10px 5px;"><div class="detail-content">
          `;
          for (const [key, label] of Object.entries(eventLabels)) {
            const val = ev.attrs[key];
            
            // Lọc bỏ undefined và null trước
            if (val !== undefined && val !== null) {
              const valStr = String(val).trim();
              const valLower = valStr.toLowerCase();
              
              // Điều kiện lọc bổ sung: Khác rỗng, khác "không rõ", khác "unknown" và khác "0"
              if (valStr !== '' && valLower !== 'không rõ' && valLower !== 'unknown' && valStr !== '0') {
                if (key === 'chi_tiet') {
                  html += `<div class="attr-box" style="border-left: 3px solid ${cfg.mau_thu_ngayam_songay};"><div class="attr-label" style="color:${cfg.mau_tieu_de_chi_tiet}">${label}:</div><div class="attr-value-full" style="color:${cfg.mau_chi_tiet}">${val}</div></div>`;
                } else {
                  html += `<div class="attr-row"><span class="attr-label" style="color:${cfg.mau_tieu_de_chi_tiet}">${label}:</span><span class="attr-value" style="color:${cfg.mau_chi_tiet}">${val}</span></div>`;
                }
              }
            }
          }
          html += `</div></td></tr>`;
        });
        html += '</table>';
      }
      
      html += '</div></div>';
      
      this.card.innerHTML = html;

      // Cập nhật sự kiện Click cho từng dòng
      this.card.querySelectorAll('.event-row').forEach(row => {
        row.addEventListener('click', () => {
          const id = row.getAttribute('data-id');
          const isCurrentlyExpanded = this.expandedRows.has(id);
          
          this._closeAll();

          if (!isCurrentlyExpanded) {
            this.expandedRows.add(id);
            const detail = this.card.querySelector(`[id="detail-${id}"]`);
            const icon = row.querySelector('.toggle-icon');
            
            if(detail) detail.style.display = 'table-row';
            if(icon) icon.style.transform = 'rotate(180deg)';

            // THÊM TÍNH NĂNG TỰ ĐỘNG CUỘN LÊN
            setTimeout(() => {
              const container = this.card.querySelector('#event-container');
              if (container && row) {
                // Cuộn mượt mà đưa dòng được chọn lên đầu container
                container.scrollTo({
                  top: row.offsetTop,
                  behavior: 'smooth'
                });
              }
            }, 50); // Độ trễ 50ms đợi CSS hiển thị khối chi tiết
          }
        });
      });
    }

    getCardSize() { return 3; }
  }

  if (!customElements.get('su-kien-am-lich-editor')) {
    customElements.define('su-kien-am-lich-editor', SuKienAmLichCardEditor);
  }
  if (!customElements.get('su-kien-am-lich-card')) {
    customElements.define('su-kien-am-lich-card', SuKienAmLichCard);
  }

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: "su-kien-am-lich-card",
    name: "Danh sách Sự Kiện",
    description: "Thẻ hiển thị danh sách đếm ngược sự kiện cho Lịch Âm Việt Nam.",
    preview: true,
  });

})();