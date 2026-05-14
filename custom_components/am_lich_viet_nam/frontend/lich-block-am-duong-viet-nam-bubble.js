// ==========================================
// LUNAR CALENDAR FLOATING BUBBLE - FINAL PRO
// Thẻ bong bóng nổi Lịch Âm Dương Việt Nam
// ==========================================

class LunarCalendarBubbleCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static getStubConfig() {
        return {
            type: "custom:lich-am-duong-bubble",
            position: "bottom-right",
            offset_x: 20,
            offset_y: 200, 
            bg_color: "#ffffff",
            bg_opacity: 0.9,
            color_primary: "#03a9f4",   
            color_secondary: "#757575", 
            border_width: 2,
            border_color: "#03a9f4",
            border_opacity: 0.8,
            shadow_color: "#000000",
            shadow_opacity: 0.3,
            shadow_size: 15,
            divider_color: "#388e3c", 
            divider_thickness: 1.5,
            animation_type: "float", 
            compact_mode: false      
        };
    }

    static getConfigElement() {
        return document.createElement("lich-am-duong-bubble-editor");
    }

    setConfig(config) {
        if (!config.type) throw new Error("Cấu hình không hợp lệ");
        this.config = { ...LunarCalendarBubbleCard.getStubConfig(), ...config };
        this.render();
    }

    set hass(hass) {
        this._hass = hass;
        if (this.mainCard) this.mainCard.hass = hass;
        this.updateDates();

        // Xử lý tự động nhận diện Theme Light và áp dụng nền tối
        const modal = this.shadowRoot.getElementById('modal');
        if (modal) {
            if (hass.themes && hass.themes.darkMode === false) {
                modal.classList.add('is-light-theme');
            } else {
                modal.classList.remove('is-light-theme');
            }
        }
    }

    getRGBA(hex, opacity) {
        let r = parseInt(hex.slice(1, 3), 16) || 0;
        let g = parseInt(hex.slice(3, 5), 16) || 0;
        let b = parseInt(hex.slice(5, 7), 16) || 0;
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    getCanChi(year) {
        if (!year || isNaN(year)) return "";
        const cans = ["Canh", "Tân", "Nhâm", "Quý", "Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ"];
        const chis = ["Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi"];
        return `${cans[year % 10]} ${chis[year % 12]}`;
    }

    render() {
        this.style.display = 'block';
        let posCSS = this.config.position === 'top-right' 
            ? `top: ${this.config.offset_y}px; right: ${this.config.offset_x}px;`
            : `bottom: ${this.config.offset_y}px; right: ${this.config.offset_x}px;`;

        const bgColor = this.getRGBA(this.config.bg_color, this.config.bg_opacity);
        const borderColor = this.getRGBA(this.config.border_color, this.config.border_opacity);
        const shadowColor = this.getRGBA(this.config.shadow_color, this.config.shadow_opacity);
        const isCompact = this.config.compact_mode;

        const animations = {
            "none": "none",
            "breathe": "anim-breathe 3s ease-in-out infinite",
            "float": "anim-float 3s ease-in-out infinite",
            "pulse_glow": "anim-pulse_glow 2s ease-in-out infinite",
            "swing": "anim-swing 4s ease-in-out infinite",
            "heartbeat": "anim-heartbeat 2s ease-in-out infinite",
            "bounce": "anim-bounce 2.5s ease-in-out infinite",
            "jelly": "anim-jelly 2.5s ease-in-out infinite",
            "wobble": "anim-wobble 3.5s ease-in-out infinite",
            "squeeze": "anim-squeeze 2s ease-in-out infinite",
            "rubber_band": "anim-rubber_band 3s ease-in-out infinite"
        };
        const currentAnim = animations[this.config.animation_type] || "none";

        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; position: fixed; z-index: 999; width: 0; height: 0; }
                
                .bubble-wrapper {
                    position: fixed;
                    ${posCSS}
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    transform: translate3d(0, 0, 0); 
                }

                .tooltip {
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 5px 12px;
                    border-radius: 8px;
                    font-size: 11px;
                    margin-bottom: 10px;
                    opacity: 0;
                    transform: translateY(10px);
                    transition: all 0.3s ease;
                    white-space: nowrap;
                    pointer-events: none;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                }

                @keyframes anim-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
                @keyframes anim-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
                @keyframes anim-pulse_glow { 0%, 100% { box-shadow: 0 0 ${this.config.shadow_size}px ${shadowColor}; } 50% { box-shadow: 0 0 ${this.config.shadow_size + 12}px ${borderColor}; } }
                @keyframes anim-swing { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(4deg); } 75% { transform: rotate(-4deg); } }
                @keyframes anim-heartbeat { 0%, 100%, 70% { transform: scale(1); } 14%, 42% { transform: scale(1.05); } 28% { transform: scale(1.02); } }
                @keyframes anim-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
                @keyframes anim-jelly { 0%, 100% { transform: scale(1, 1); } 25% { transform: scale(1.03, 0.97); } 50% { transform: scale(0.97, 1.03); } 75% { transform: scale(1.01, 0.99); } }
                @keyframes anim-wobble { 0%, 100% { transform: translateX(0%) rotate(0deg); } 15% { transform: translateX(-3px) rotate(-3deg); } 30% { transform: translateX(2px) rotate(2deg); } 45% { transform: translateX(-2px) rotate(-1deg); } 60% { transform: translateX(1px) rotate(1deg); } }
                @keyframes anim-squeeze { 0%, 100% { transform: scale(1, 1); } 50% { transform: scale(0.96, 1.04); } }
                @keyframes anim-rubber_band { 0%, 100% { transform: scale(1); } 30% { transform: scale(1.06, 0.94); } 40% { transform: scale(0.94, 1.06); } 50% { transform: scale(1.03, 0.97); } 65% { transform: scale(0.98, 1.02); } 75% { transform: scale(1.01, 0.99); } }

                .bubble {
                    width: 108px; height: 108px;
                    background: ${bgColor};
                    border-radius: 50%;
                    border: ${this.config.border_width}px solid ${borderColor};
                    box-shadow: 0 0 ${this.config.shadow_size}px ${shadowColor};
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    cursor: grab; 
                    transition: width 0.3s, height 0.3s, box-shadow 0.3s, border-color 0.3s;
                    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
                    user-select: none; box-sizing: border-box; text-align: center;
                    position: relative;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    backface-visibility: hidden;
                    animation: ${currentAnim};
                }
                
                .bubble:active { cursor: grabbing; }

                .bubble-wrapper:hover .bubble {
                    transform: scale(1.1) !important;
                    box-shadow: 0 0 ${this.config.shadow_size + 12}px ${borderColor} !important;
                    border-color: ${this.config.color_primary};
                    animation: none !important; 
                }

                .bubble-wrapper:hover .tooltip { opacity: 1; transform: translateY(0); }
                .color-p { color: ${this.config.color_primary}; }
                .color-s { color: ${this.config.color_secondary}; }
                .solar-day { font-size: 34px; font-weight: 900; line-height: 1; }
                .solar-ym { font-size: 10px; font-weight: bold; opacity: 0.9; margin-bottom: 2px; }
                
                .divider { 
                    width: 60%; height: ${this.config.divider_thickness}px; 
                    background: ${this.config.divider_color}; 
                    margin: 4px 0; border-radius: 2px;
                }

                .lunar-date { font-size: 14px; font-weight: 800; line-height: 1.2; }
                .lunar-year { font-size: 10px; font-weight: bold; opacity: 0.9; margin-top: -2px; }

                .bubble.compact { width: 72px; height: 72px; padding: 0; }
                .bubble.compact .solar-ym { order: 1; font-size: 10px; font-weight: 900; line-height: 1; margin: 0 0 2px 0; color: ${this.config.color_primary}; opacity: 1; }
                .bubble.compact .solar-day { order: 2; font-size: 36px; font-weight: 900; line-height: 0.85; margin: 0; letter-spacing: -1px; }
                .bubble.compact .lunar-date { order: 3; font-size: 10px; font-weight: 900; line-height: 1; margin: 2px 0 0 0; color: ${this.config.color_secondary}; }
                .bubble.compact .divider, .bubble.compact .lunar-year { display: none; }

                /* MODAL OVERLAY CHÍNH */
                .modal { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 10000; display: none; align-items: center; justify-content: center; }
                .modal-overlay { position: absolute; width: 100%; height: 100%; background: transparent; }
                .modal-content { position: relative; width: 95%; max-width: 480px; max-height: 85vh; border-radius: 28px; animation: popInModal 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; box-shadow: 0 25px 50px rgba(0,0,0,0.5); overflow: hidden;}
                @keyframes popInModal { 0% { opacity: 0; transform: scale(0.7) translateY(30px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
                .close-btn { position: absolute; top: 15px; right: 15px; z-index: 101; background: rgba(0,0,0,0.2); color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                
                #card-container { 
                    overflow-y: auto; 
                    background: var(--card-background-color); 
                    border-radius: 28px;
                }

                /* TỐI ƯU CỰC MẠNH CHO THEME SÁNG (LIGHT THEME) */
                .is-light-theme #card-container {
                    /* Nền đen trong suốt hiển thị sau lớp kính mờ */
                    background: rgba(0, 0, 0, 0.75) !important;
                    
                    /* Ép thẻ con xuyên thấu màu để nhận nền đen ở trên */
                    --ha-card-background: transparent !important;
                    --card-background-color: transparent !important;
                    --paper-card-background-color: transparent !important;
                    --primary-background-color: transparent !important;
                    --secondary-background-color: transparent !important;
                    
                    /* Hiệu ứng kính (Glassmorphism) */
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                }

                @media (max-width: 600px) {
                    .bubble:not(.compact) { width: 85px; height: 85px; }
                    .bubble:not(.compact) .solar-day { font-size: 26px; }
                    .bubble:not(.compact) .solar-ym { font-size: 9px; margin-bottom: 1px; }
                    .bubble:not(.compact) .divider { margin: 3px 0; }
                    .bubble:not(.compact) .lunar-date { font-size: 12px; }
                    .bubble:not(.compact) .lunar-year { font-size: 9px; margin-top: -1px; }
                }
            </style>

            <div class="bubble-wrapper" id="wrapper">
                <div class="tooltip">Nhấn để xem / Kéo để di chuyển</div>
                <div class="bubble ${isCompact ? 'compact' : ''}" id="bubble">
                    <div class="solar-day color-p" id="s_day">--</div>
                    <div class="solar-ym color-s" id="s_ym">--/----</div>
                    <div class="divider"></div>
                    <div class="lunar-date color-p" id="l_date">--/--</div>
                    <div class="lunar-year color-s" id="l_year">----</div>
                </div>
            </div>

            <div class="modal" id="modal">
                <div class="modal-overlay" id="overlay"></div>
                <div class="modal-content">
                    <button class="close-btn" id="close">✕</button>
                    <div id="card-container"></div>
                </div>
            </div>
        `;

        this.setupDragAndDrop();
        this.shadowRoot.getElementById('overlay').addEventListener('click', () => this.closeModal());
        this.shadowRoot.getElementById('close').addEventListener('click', () => this.closeModal());
        this.updateDates();
    }

    setupDragAndDrop() {
        const wrapper = this.shadowRoot.getElementById('wrapper');
        const bubble = this.shadowRoot.getElementById('bubble');
        
        let isDragging = false;
        let initialX, initialY, currentX, currentY;
        let xOffset = 0, yOffset = 0;
        let hasDragged = false; 

        const dragStart = (e) => {
            if (e.type === "touchstart") {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }
            isDragging = true;
            hasDragged = false;
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('touchend', dragEnd);
        };

        const drag = (e) => {
            if (isDragging) {
                let clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
                let clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

                currentX = clientX - initialX;
                currentY = clientY - initialY;

                if (Math.abs(clientX - (initialX + xOffset)) > 5 || Math.abs(clientY - (initialY + yOffset)) > 5) {
                    hasDragged = true;
                }

                xOffset = currentX;
                yOffset = currentY;
                wrapper.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
                
                if (e.cancelable) e.preventDefault(); 
            }
        };

        const dragEnd = () => {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', dragEnd);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('touchend', dragEnd);
        };

        bubble.addEventListener('mousedown', dragStart);
        bubble.addEventListener('touchstart', dragStart, { passive: false });

        bubble.addEventListener('click', (e) => {
            if (hasDragged) {
                e.preventDefault();
                e.stopPropagation();
                hasDragged = false; 
                return;
            }
            this.openModal();
        });
    }

    updateDates() {
        const sDayEl = this.shadowRoot.getElementById('s_day');
        const sYmEl = this.shadowRoot.getElementById('s_ym');
        const lDateEl = this.shadowRoot.getElementById('l_date');
        const lYearEl = this.shadowRoot.getElementById('l_year');
        if (!sDayEl) return;

        const now = new Date();
        sDayEl.innerText = now.getDate();
        
        if (this.config.compact_mode) {
            const m = (now.getMonth() + 1).toString().padStart(2, '0');
            sYmEl.innerText = `${m}/${now.getFullYear()}`;
        } else {
            sYmEl.innerText = `Tháng ${now.getMonth() + 1}, ${now.getFullYear()}`;
        }

        try {
            const options = { calendar: 'chinese', day: 'numeric', month: 'numeric', year: 'numeric' };
            const parts = new Intl.DateTimeFormat('vi-VN', options).formatToParts(now);
            
            let day = parts.find(p => p.type === 'day')?.value;
            let month = parts.find(p => p.type === 'month')?.value;
            let year = parts.find(p => p.type === 'year')?.value;

            const yearForCanChi = (year && year.length === 4) ? parseInt(year) : now.getFullYear();

            if (day && month) {
                const fDay = day.padStart(2, '0');
                const fMonth = month.padStart(2, '0');
                lDateEl.innerText = `${fDay}/${fMonth}`;
                lYearEl.innerText = this.getCanChi(yearForCanChi);
            }
        } catch (e) {
            console.error("Lỗi cập nhật lịch:", e);
            lDateEl.innerText = "--/--";
            lYearEl.innerText = this.getCanChi(now.getFullYear());
        }
    }

    openModal() {
        const container = this.shadowRoot.getElementById('card-container');
        if (!container.firstChild) {
            this.mainCard = document.createElement('lich-block-am-duong-viet-nam');
            if (customElements.get('lich-block-am-duong-viet-nam')) {
                this.mainCard.setConfig({ type: 'custom:lich-block-am-duong-viet-nam' });
                this.mainCard.hass = this._hass;
                container.appendChild(this.mainCard);
            }
        }
        this.shadowRoot.getElementById('modal').style.display = 'flex';
    }

    closeModal() { this.shadowRoot.getElementById('modal').style.display = 'none'; }
}

// ==========================================
// EDITOR GUI (Giao diện cấu hình)
// ==========================================
class LunarCalendarBubbleEditor extends HTMLElement {
    setConfig(config) {
        this.config = { ...LunarCalendarBubbleCard.getStubConfig(), ...config };
        this.render();
    }

    render() {
        if (!this.config) return;
        this.innerHTML = `
            <style>
                .config-container { display: flex; flex-direction: column; gap: 12px; padding: 10px 0; }
                .section { border: 1px solid var(--divider-color); padding: 12px; border-radius: 12px; background: var(--secondary-background-color); }
                .section-title { font-weight: bold; margin-bottom: 12px; color: var(--primary-color); font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
                .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
                .field label { font-size: 12px; font-weight: bold; color: var(--primary-text-color); }
                .input-group { display: flex; align-items: center; gap: 10px; }
                input[type="color"] { width: 38px; height: 38px; border: none; border-radius: 50%; cursor: pointer; padding: 0; background: none; }
                input[type="number"], input[type="range"], select { padding: 8px; border-radius: 6px; border: 1px solid var(--divider-color); flex: 1; color: var(--primary-text-color); background: var(--card-background-color); }
                .value-badge { font-family: monospace; font-size: 11px; background: var(--divider-color); padding: 2px 6px; border-radius: 4px; min-width: 45px; text-align: center; color: var(--primary-text-color); }
                .checkbox-group { display: flex; align-items: center; gap: 8px; cursor: pointer; margin-bottom: 6px;}
                .checkbox-group input { width: 16px; height: 16px; accent-color: var(--primary-color); cursor: pointer;}
                .checkbox-group label { cursor: pointer; font-size: 13px; font-weight: normal; color: var(--primary-text-color); }
            </style>
            <div class="config-container">
                <div class="section">
                    <div class="section-title">Trạng thái & Hiển thị</div>
                    
                    <div class="field">
                        <label>Chế độ hiển thị</label>
                        <div class="checkbox-group">
                            <input type="checkbox" id="compact_mode" ${this.config.compact_mode ? 'checked' : ''}>
                            <label for="compact_mode">Kích hoạt giao diện rút gọn (Chỉ hiển thị số, nhỏ gọn)</label>
                        </div>
                    </div>

                    <div class="field">
                        <label>Hiệu ứng Bong bóng (Idle Animation)</label>
                        <select id="animation_type">
                            <option value="none" ${this.config.animation_type === 'none' ? 'selected' : ''}>Tĩnh (Không hiệu ứng)</option>
                            <option value="breathe" ${this.config.animation_type === 'breathe' ? 'selected' : ''}>1. Nhịp thở (Breathe)</option>
                            <option value="float" ${this.config.animation_type === 'float' ? 'selected' : ''}>2. Trôi nổi (Float)</option>
                            <option value="pulse_glow" ${this.config.animation_type === 'pulse_glow' ? 'selected' : ''}>3. Tỏa sáng (Pulse Glow)</option>
                            <option value="swing" ${this.config.animation_type === 'swing' ? 'selected' : ''}>4. Lắc lư (Swing)</option>
                            <option value="heartbeat" ${this.config.animation_type === 'heartbeat' ? 'selected' : ''}>5. Nhịp tim (Heartbeat)</option>
                            <option value="bounce" ${this.config.animation_type === 'bounce' ? 'selected' : ''}>6. Nảy nhẹ (Bounce)</option>
                            <option value="jelly" ${this.config.animation_type === 'jelly' ? 'selected' : ''}>7. Khối thạch (Jelly)</option>
                            <option value="wobble" ${this.config.animation_type === 'wobble' ? 'selected' : ''}>8. Chao đảo (Wobble)</option>
                            <option value="squeeze" ${this.config.animation_type === 'squeeze' ? 'selected' : ''}>9. Co giãn (Squeeze)</option>
                            <option value="rubber_band" ${this.config.animation_type === 'rubber_band' ? 'selected' : ''}>10. Dây thun (Rubber Band)</option>
                        </select>
                    </div>
                    <div class="field">
                        <label>Vị trí hiển thị mặc định</label>
                        <select id="position">
                            <option value="bottom-right" ${this.config.position === 'bottom-right' ? 'selected' : ''}>Dưới cùng bên phải</option>
                            <option value="top-right" ${this.config.position === 'top-right' ? 'selected' : ''}>Trên cùng bên phải</option>
                        </select>
                    </div>
                    <div class="field">
                        <label>Khoảng cách Lên/Xuống (50px - 500px)</label>
                        <div class="input-group">
                            <input type="range" id="offset_y" min="50" max="500" step="10" value="${this.config.offset_y}">
                            <span class="value-badge">${this.config.offset_y}px</span>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Cấu hình Màu sắc Chữ</div>
                    <div class="field">
                        <label>Màu chính (Ngày Dương & MM/YYYY nếu rút gọn)</label>
                        <div class="input-group">
                            <input type="color" id="color_primary" value="${this.config.color_primary}">
                            <span class="value-badge">${this.config.color_primary.toUpperCase()}</span>
                        </div>
                    </div>
                    <div class="field">
                        <label>Màu phụ (Tháng/Năm Dương & Ngày Âm nếu rút gọn)</label>
                        <div class="input-group">
                            <input type="color" id="color_secondary" value="${this.config.color_secondary}">
                            <span class="value-badge">${this.config.color_secondary.toUpperCase()}</span>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Nền & Viền</div>
                    <div class="field">
                        <label>Màu Nền & Độ mờ</label>
                        <div class="input-group">
                            <input type="color" id="bg_color" value="${this.config.bg_color}">
                            <input type="range" id="bg_opacity" min="0" max="1" step="0.1" value="${this.config.bg_opacity}" style="flex:1">
                            <span class="value-badge">${this.config.bg_opacity}</span>
                        </div>
                    </div>
                    <div class="field">
                        <label>Độ dày & Màu viền</label>
                        <div class="input-group">
                            <input type="number" id="border_width" value="${this.config.border_width}" style="width: 60px; flex: none;">
                            <input type="color" id="border_color" value="${this.config.border_color}">
                            <input type="range" id="border_opacity" min="0" max="1" step="0.1" value="${this.config.border_opacity}">
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Đường phân cách & Đổ bóng</div>
                    <div class="field">
                        <label>Màu sắc & Độ dày Vạch Phân Cách</label>
                        <div class="input-group">
                            <input type="color" id="divider_color" value="${this.config.divider_color}">
                            <input type="range" id="divider_thickness" min="0" max="5" step="0.5" value="${this.config.divider_thickness}">
                            <span class="value-badge">${this.config.divider_thickness}px</span>
                        </div>
                    </div>
                    <div class="field">
                        <label>Màu sắc & Kích thước Đổ bóng</label>
                        <div class="input-group">
                            <input type="number" id="shadow_size" value="${this.config.shadow_size}" style="width: 60px; flex: none;">
                            <input type="color" id="shadow_color" value="${this.config.shadow_color}">
                            <span class="value-badge">Shadow</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.querySelectorAll('input, select').forEach(el => {
            el.addEventListener('change', () => {
                const newConfig = {
                    ...this.config,
                    compact_mode: this.querySelector('#compact_mode').checked,
                    animation_type: this.querySelector('#animation_type').value,
                    position: this.querySelector('#position').value,
                    offset_y: parseInt(this.querySelector('#offset_y').value),
                    color_primary: this.querySelector('#color_primary').value,
                    color_secondary: this.querySelector('#color_secondary').value,
                    bg_color: this.querySelector('#bg_color').value,
                    bg_opacity: parseFloat(this.querySelector('#bg_opacity').value),
                    border_width: parseInt(this.querySelector('#border_width').value) || 0,
                    border_color: this.querySelector('#border_color').value,
                    border_opacity: parseFloat(this.querySelector('#border_opacity').value),
                    shadow_size: parseInt(this.querySelector('#shadow_size').value) || 0,
                    shadow_color: this.querySelector('#shadow_color').value,
                    divider_color: this.querySelector('#divider_color').value,
                    divider_thickness: parseFloat(this.querySelector('#divider_thickness').value),
                    offset_x: this.config.offset_x
                };
                
                if (el.type === 'range') {
                    const badge = el.nextElementSibling;
                    if (badge && badge.classList.contains('value-badge')) {
                        badge.textContent = el.id.includes('opacity') ? el.value : el.value + 'px';
                    }
                }

                this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: newConfig } }));
            });
        });
    }
}

customElements.define('lich-am-duong-bubble-editor', LunarCalendarBubbleEditor);
customElements.define('lich-am-duong-bubble', LunarCalendarBubbleCard);

window.customCards = window.customCards || [];
window.customCards.push({
    type: "lich-am-duong-bubble",
    name: "Bong Bóng Lịch Âm Dương",
    description: "Bong bóng nổi tự động co giãn, có kéo thả tự do, vạch phân cách và 10 hiệu ứng sinh động.",
    preview: false,
});
