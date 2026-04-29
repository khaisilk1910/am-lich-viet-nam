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
            animation_type: "float" // Hiệu ứng mặc định
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

        // Map hiệu ứng
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

                /* --- TẬP HỢP 10 HIỆU ỨNG IDLE --- */
                @keyframes anim-breathe { 0%, 100% { transform: scale(1) translateZ(0); } 50% { transform: scale(1.04) translateZ(0); } }
                @keyframes anim-float { 0%, 100% { transform: translateY(0) translateZ(0); } 50% { transform: translateY(-8px) translateZ(0); } }
                @keyframes anim-pulse_glow { 0%, 100% { box-shadow: 0 0 ${this.config.shadow_size}px ${shadowColor}; transform: translateZ(0); } 50% { box-shadow: 0 0 ${this.config.shadow_size + 12}px ${borderColor}; transform: translateZ(0); } }
                @keyframes anim-swing { 0%, 100% { transform: rotate(0deg) translateZ(0); } 25% { transform: rotate(4deg) translateZ(0); } 75% { transform: rotate(-4deg) translateZ(0); } }
                @keyframes anim-heartbeat { 0%, 100%, 70% { transform: scale(1) translateZ(0); } 14%, 42% { transform: scale(1.05) translateZ(0); } 28% { transform: scale(1.02) translateZ(0); } }
                @keyframes anim-bounce { 0%, 100% { transform: translateY(0) translateZ(0); } 50% { transform: translateY(-5px) translateZ(0); } }
                @keyframes anim-jelly { 0%, 100% { transform: scale(1, 1) translateZ(0); } 25% { transform: scale(1.03, 0.97) translateZ(0); } 50% { transform: scale(0.97, 1.03) translateZ(0); } 75% { transform: scale(1.01, 0.99) translateZ(0); } }
                @keyframes anim-wobble { 0%, 100% { transform: translateX(0%) rotate(0deg) translateZ(0); } 15% { transform: translateX(-3px) rotate(-3deg) translateZ(0); } 30% { transform: translateX(2px) rotate(2deg) translateZ(0); } 45% { transform: translateX(-2px) rotate(-1deg) translateZ(0); } 60% { transform: translateX(1px) rotate(1deg) translateZ(0); } }
                @keyframes anim-squeeze { 0%, 100% { transform: scale(1, 1) translateZ(0); } 50% { transform: scale(0.96, 1.04) translateZ(0); } }
                @keyframes anim-rubber_band { 0%, 100% { transform: scale(1) translateZ(0); } 30% { transform: scale(1.06, 0.94) translateZ(0); } 40% { transform: scale(0.94, 1.06) translateZ(0); } 50% { transform: scale(1.03, 0.97) translateZ(0); } 65% { transform: scale(0.98, 1.02) translateZ(0); } 75% { transform: scale(1.01, 0.99) translateZ(0); } }

                .bubble {
                    width: 108px; height: 108px;
                    background: ${bgColor};
                    border-radius: 50%;
                    border: ${this.config.border_width}px solid ${borderColor};
                    box-shadow: 0 0 ${this.config.shadow_size}px ${shadowColor};
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    cursor: pointer; 
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
                    user-select: none; box-sizing: border-box; text-align: center;
                    position: relative;
                    
                    /* Fix lỗi mờ chữ (Anti-aliasing & Hardware Acceleration) */
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    backface-visibility: hidden;
                    transform: translateZ(0);
                    will-change: transform, box-shadow;
                    
                    /* Áp dụng hiệu ứng được chọn */
                    animation: ${currentAnim};
                }
                
                .bubble-wrapper:hover .bubble {
                    /* Dùng !important để ghi đè hiệu ứng idle, bỏ xoay (rotate) để chữ sắc nét tuyệt đối */
                    transform: scale(1.12) translateZ(0) !important;
                    box-shadow: 0 0 ${this.config.shadow_size + 12}px ${borderColor} !important;
                    border-color: ${this.config.color_primary};
                    animation: none !important; 
                }

                .bubble-wrapper:hover .tooltip {
                    opacity: 1;
                    transform: translateY(0);
                }

                .color-p { color: ${this.config.color_primary}; }
                .color-s { color: ${this.config.color_secondary}; }

                .solar-day { font-size: 34px; font-weight: 900; line-height: 1; }
                .solar-ym { font-size: 10px; font-weight: bold; opacity: 0.9; margin-bottom: 2px; }
                
                .divider { 
                    width: 60%; 
                    height: ${this.config.divider_thickness}px; 
                    background: ${this.config.divider_color}; 
                    margin: 4px 0; 
                    border-radius: 2px;
                }

                .lunar-date { font-size: 14px; font-weight: 800; line-height: 1.2; }
                .lunar-year { font-size: 10px; font-weight: bold; opacity: 0.9; margin-top: -2px; }

                /* MODAL */
                .modal { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 10000; display: none; align-items: center; justify-content: center; }
                .modal-overlay { position: absolute; width: 100%; height: 100%; background: transparent; }
                .modal-content { position: relative; width: 95%; max-width: 480px; max-height: 85vh; border-radius: 28px; animation: popInModal 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; box-shadow: 0 25px 50px rgba(0,0,0,0.5); overflow: hidden;}
                @keyframes popInModal { 0% { opacity: 0; transform: scale(0.7) translateY(30px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
                .close-btn { position: absolute; top: 15px; right: 15px; z-index: 101; background: rgba(0,0,0,0.2); color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                #card-container { overflow-y: auto; background: var(--card-background-color); }

                /* RESPONSIVE CHO ĐIỆN THOẠI */
                @media (max-width: 600px) {
                    .bubble { width: 85px; height: 85px; }
                    .solar-day { font-size: 26px; }
                    .solar-ym { font-size: 9px; margin-bottom: 1px; }
                    .divider { margin: 3px 0; }
                    .lunar-date { font-size: 12px; }
                    .lunar-year { font-size: 9px; margin-top: -1px; }
                }
            </style>

            <div class="bubble-wrapper">
                <div class="tooltip">Nhấn để xem chi tiết</div>
                <div class="bubble" id="bubble">
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

        this.shadowRoot.getElementById('bubble').addEventListener('click', () => this.openModal());
        this.shadowRoot.getElementById('overlay').addEventListener('click', () => this.closeModal());
        this.shadowRoot.getElementById('close').addEventListener('click', () => this.closeModal());

        this.updateDates();
    }

    updateDates() {
        const sDayEl = this.shadowRoot.getElementById('s_day');
        const sYmEl = this.shadowRoot.getElementById('s_ym');
        const lDateEl = this.shadowRoot.getElementById('l_date');
        const lYearEl = this.shadowRoot.getElementById('l_year');
        if (!sDayEl) return;

        const now = new Date();
        sDayEl.innerText = now.getDate();
        sYmEl.innerText = `Tháng ${now.getMonth() + 1}, ${now.getFullYear()}`;

        try {
            const options = { calendar: 'chinese', day: 'numeric', month: 'numeric', year: 'numeric' };
            const parts = new Intl.DateTimeFormat('vi-VN', options).formatToParts(now);
            
            let day = parts.find(p => p.type === 'day')?.value;
            let month = parts.find(p => p.type === 'month')?.value;
            let year = parts.find(p => p.type === 'year')?.value;

            const yearForCanChi = (year && year.length === 4) ? parseInt(year) : now.getFullYear();

            if (day && month) {
                lDateEl.innerText = `${day}/${month}`;
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
            </style>
            <div class="config-container">
                <div class="section">
                    <div class="section-title">Trạng thái & Hiển thị</div>
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
                        <label>Vị trí hiển thị</label>
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
                        <label>Màu chính (Ngày Dương & Ngày/Tháng Âm)</label>
                        <div class="input-group">
                            <input type="color" id="color_primary" value="${this.config.color_primary}">
                            <span class="value-badge">${this.config.color_primary.toUpperCase()}</span>
                        </div>
                    </div>
                    <div class="field">
                        <label>Màu phụ (Tháng/Năm Dương & Năm Can Chi)</label>
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
    description: "Bong bóng nổi tự động co giãn kích thước, có tùy biến vạch phân cách và 10 hiệu ứng sinh động.",
    preview: true,
});