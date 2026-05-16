// ==========================================
// LUNAR CALENDAR FLOATING SVG BUBBLE
// Custom card: lich-am-duong-bubble
// ==========================================

import { svg_12congiap, svg_12congiap_names } from './lich-block-am-duong-viet-nam-bubble-data.js';
import { getLichAmDuongTodayInfo } from './lich-block-am-duong-viet-nam-popup.js';

const SVG_ITEMS = Array.isArray(svg_12congiap) ? svg_12congiap : [];
const SVG_NAMES = Array.isArray(svg_12congiap_names) ? svg_12congiap_names : [];

const CHAT_FONT_OPTIONS = [
    { value: 'system', label: 'Hiện đại / System', family: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
    { value: 'segoe', label: 'Segoe UI mềm mại', family: '"Segoe UI", Arial, sans-serif' },
    { value: 'arial', label: 'Arial rõ nét', family: 'Arial, Helvetica, sans-serif' },
    { value: 'verdana', label: 'Verdana dễ đọc', family: 'Verdana, Geneva, sans-serif' },
    { value: 'tahoma', label: 'Tahoma gọn gàng', family: 'Tahoma, Geneva, sans-serif' },
    { value: 'trebuchet', label: 'Trebuchet MS hiện đại', family: '"Trebuchet MS", Arial, sans-serif' },
    { value: 'georgia', label: 'Georgia sang trọng', family: 'Georgia, "Times New Roman", serif' },
    { value: 'times', label: 'Times New Roman cổ điển', family: '"Times New Roman", Times, serif' },
    { value: 'courier', label: 'Courier New công nghệ', family: '"Courier New", Courier, monospace' },
    { value: 'comic', label: 'Comic Sans vui vẻ', family: '"Comic Sans MS", "Comic Sans", cursive' }
];

const CHAT_FONT_MAP = CHAT_FONT_OPTIONS.reduce((acc, item) => {
    acc[item.value] = item.family;
    return acc;
}, {});


const CHAT_STYLE_OPTIONS = [
    {
        value: 'glass_light',
        label: 'K\u00ednh tr\u1eafng hi\u1ec7n \u0111\u1ea1i',
        background: 'linear-gradient(135deg, CHAT_BG 0%, rgba(255,255,255,0.74) 100%)',
        border: 'rgba(255,255,255,0.82)',
        shadow: '0 18px 44px rgba(15,23,42,0.22), inset 0 1px 0 rgba(255,255,255,0.54)',
        rowBg: 'rgba(255,255,255,0.28)',
        rowBorder: 'rgba(255,255,255,0.26)',
        headerBg: 'rgba(255,255,255,0.34)',
        iconBg: 'rgba(255,255,255,0.58)',
        iconColor: 'inherit',
        beforeBg: 'linear-gradient(135deg, rgba(255,255,255,0.42), rgba(255,255,255,0.04))',
        accent: 'rgba(59,130,246,0.18)'
    },
    {
        value: 'rose_soft',
        label: 'H\u1ed3ng pastel d\u1ecbu m\u1eaft',
        background: 'linear-gradient(135deg, rgba(255,228,230,0.95), CHAT_BG 58%, rgba(254,205,211,0.82))',
        border: 'rgba(255,255,255,0.68)',
        shadow: '0 20px 46px rgba(190,24,93,0.18), inset 0 1px 0 rgba(255,255,255,0.48)',
        rowBg: 'rgba(255,255,255,0.30)',
        rowBorder: 'rgba(255,255,255,0.22)',
        headerBg: 'linear-gradient(135deg, rgba(255,255,255,0.44), rgba(251,113,133,0.14))',
        iconBg: 'rgba(255,255,255,0.62)',
        iconColor: 'inherit',
        beforeBg: 'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.52), transparent 42%)',
        accent: 'rgba(244,63,94,0.22)'
    },
    {
        value: 'sky_blue',
        label: 'Xanh b\u1ea7u tr\u1eddi glass',
        background: 'linear-gradient(135deg, rgba(224,242,254,0.94), CHAT_BG 52%, rgba(186,230,253,0.82))',
        border: 'rgba(125,211,252,0.44)',
        shadow: '0 20px 48px rgba(14,165,233,0.20), inset 0 1px 0 rgba(255,255,255,0.50)',
        rowBg: 'rgba(255,255,255,0.30)',
        rowBorder: 'rgba(125,211,252,0.22)',
        headerBg: 'linear-gradient(135deg, rgba(255,255,255,0.46), rgba(56,189,248,0.16))',
        iconBg: 'rgba(255,255,255,0.62)',
        iconColor: 'inherit',
        beforeBg: 'linear-gradient(160deg, rgba(255,255,255,0.48), rgba(56,189,248,0.08))',
        accent: 'rgba(14,165,233,0.22)'
    },
    {
        value: 'midnight_neon',
        label: 'T\u1ed1i neon n\u1ed5i b\u1eadt',
        background: 'linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,41,59,0.92))',
        border: 'rgba(129,140,248,0.58)',
        shadow: '0 22px 56px rgba(30,41,59,0.38), 0 0 22px rgba(129,140,248,0.24)',
        rowBg: 'rgba(255,255,255,0.08)',
        rowBorder: 'rgba(255,255,255,0.10)',
        headerBg: 'linear-gradient(135deg, rgba(129,140,248,0.24), rgba(34,211,238,0.12))',
        iconBg: 'rgba(255,255,255,0.12)',
        iconColor: '#f8fafc',
        beforeBg: 'radial-gradient(circle at 18% 0%, rgba(129,140,248,0.28), transparent 38%)',
        accent: 'rgba(129,140,248,0.32)'
    },
    {
        value: 'sunset_orange',
        label: 'Ho\u00e0ng h\u00f4n cam \u1ea5m',
        background: 'linear-gradient(135deg, rgba(255,237,213,0.96), rgba(254,215,170,0.90), CHAT_BG)',
        border: 'rgba(253,186,116,0.50)',
        shadow: '0 22px 48px rgba(249,115,22,0.20), inset 0 1px 0 rgba(255,255,255,0.52)',
        rowBg: 'rgba(255,255,255,0.30)',
        rowBorder: 'rgba(251,146,60,0.18)',
        headerBg: 'linear-gradient(135deg, rgba(255,255,255,0.46), rgba(251,146,60,0.14))',
        iconBg: 'rgba(255,255,255,0.64)',
        iconColor: 'inherit',
        beforeBg: 'radial-gradient(circle at 15% 0%, rgba(255,255,255,0.50), transparent 42%)',
        accent: 'rgba(249,115,22,0.22)'
    },
    {
        value: 'mint_fresh',
        label: 'Xanh mint trong tr\u1ebb',
        background: 'linear-gradient(135deg, rgba(220,252,231,0.95), rgba(187,247,208,0.84), CHAT_BG)',
        border: 'rgba(74,222,128,0.38)',
        shadow: '0 20px 46px rgba(34,197,94,0.18), inset 0 1px 0 rgba(255,255,255,0.52)',
        rowBg: 'rgba(255,255,255,0.30)',
        rowBorder: 'rgba(74,222,128,0.20)',
        headerBg: 'linear-gradient(135deg, rgba(255,255,255,0.48), rgba(74,222,128,0.14))',
        iconBg: 'rgba(255,255,255,0.62)',
        iconColor: 'inherit',
        beforeBg: 'linear-gradient(145deg, rgba(255,255,255,0.44), rgba(74,222,128,0.08))',
        accent: 'rgba(34,197,94,0.22)'
    },
    {
        value: 'royal_purple',
        label: 'T\u00edm royal sang tr\u1ecdng',
        background: 'linear-gradient(135deg, rgba(250,245,255,0.94), rgba(233,213,255,0.86), CHAT_BG)',
        border: 'rgba(192,132,252,0.46)',
        shadow: '0 22px 54px rgba(147,51,234,0.20), inset 0 1px 0 rgba(255,255,255,0.50)',
        rowBg: 'rgba(255,255,255,0.28)',
        rowBorder: 'rgba(192,132,252,0.20)',
        headerBg: 'linear-gradient(135deg, rgba(255,255,255,0.46), rgba(168,85,247,0.16))',
        iconBg: 'rgba(255,255,255,0.62)',
        iconColor: 'inherit',
        beforeBg: 'radial-gradient(circle at 18% 0%, rgba(255,255,255,0.52), transparent 40%)',
        accent: 'rgba(147,51,234,0.22)'
    },
    {
        value: 'clean_card',
        label: 'T\u1ed1i gi\u1ea3n card s\u1ea1ch',
        background: 'CHAT_BG',
        border: 'rgba(226,232,240,0.90)',
        shadow: '0 14px 36px rgba(15,23,42,0.16), inset 0 1px 0 rgba(255,255,255,0.52)',
        rowBg: 'rgba(248,250,252,0.74)',
        rowBorder: 'rgba(226,232,240,0.74)',
        headerBg: 'rgba(248,250,252,0.82)',
        iconBg: 'rgba(255,255,255,0.92)',
        iconColor: 'inherit',
        beforeBg: 'linear-gradient(135deg, rgba(255,255,255,0.22), transparent)',
        accent: 'rgba(100,116,139,0.12)'
    },
    {
        value: 'bubble_cute',
        label: 'Bong b\u00f3ng cute vui v\u1ebb',
        background: 'linear-gradient(135deg, rgba(254,243,199,0.96), rgba(252,231,243,0.92), CHAT_BG)',
        border: 'rgba(255,255,255,0.78)',
        shadow: '0 22px 48px rgba(236,72,153,0.16), 0 8px 20px rgba(251,191,36,0.14)',
        rowBg: 'rgba(255,255,255,0.38)',
        rowBorder: 'rgba(255,255,255,0.32)',
        headerBg: 'linear-gradient(135deg, rgba(255,255,255,0.54), rgba(251,191,36,0.14))',
        iconBg: 'rgba(255,255,255,0.72)',
        iconColor: 'inherit',
        beforeBg: 'radial-gradient(circle at 16% 12%, rgba(255,255,255,0.60), transparent 36%)',
        accent: 'rgba(236,72,153,0.20)'
    },
    {
        value: 'crystal_aqua',
        label: 'Pha l\u00ea aqua cao c\u1ea5p',
        background: 'linear-gradient(135deg, rgba(236,254,255,0.94), rgba(207,250,254,0.78), CHAT_BG)',
        border: 'rgba(103,232,249,0.48)',
        shadow: '0 24px 58px rgba(6,182,212,0.18), inset 0 1px 0 rgba(255,255,255,0.58)',
        rowBg: 'rgba(255,255,255,0.26)',
        rowBorder: 'rgba(103,232,249,0.20)',
        headerBg: 'linear-gradient(135deg, rgba(255,255,255,0.50), rgba(34,211,238,0.14))',
        iconBg: 'rgba(255,255,255,0.62)',
        iconColor: 'inherit',
        beforeBg: 'linear-gradient(120deg, rgba(255,255,255,0.50), rgba(255,255,255,0.06) 36%, rgba(34,211,238,0.08))',
        accent: 'rgba(6,182,212,0.22)'
    }
];

const CHAT_STYLE_MAP = CHAT_STYLE_OPTIONS.reduce((acc, item) => {
    acc[item.value] = item;
    return acc;
}, {});

// One preset per SVG. The card still falls back to automatic placement if a new SVG is added.
const CHAT_PLACEMENTS = [
    { left: '-238px', top: '8px', tail: 'right', origin: 'right top' },
    { left: '-232px', top: '4px', tail: 'right', origin: 'right top' },
    { left: '-232px', top: '0px', tail: 'right', origin: 'right top' },
    { left: '-225px', top: '4px', tail: 'right', origin: 'right top' },
    { left: '-220px', top: '-2px', tail: 'right', origin: 'right top' },
    { left: '-232px', top: '0px', tail: 'right', origin: 'right top' },
    { left: '-246px', top: '18px', tail: 'right', origin: 'right top' },
    { left: '-238px', top: '18px', tail: 'right', origin: 'right top' },
    { left: '50%', top: '-106px', tail: 'bottom', origin: 'center bottom', x: '-50%' },
    { left: '50%', top: '-106px', tail: 'bottom', origin: 'center bottom', x: '-50%' },
    { left: '-238px', top: '10px', tail: 'right', origin: 'right top' },
    { left: '-248px', top: '12px', tail: 'right', origin: 'right top' },
    { left: '-248px', top: '12px', tail: 'right', origin: 'right top' },
    { left: '-235px', top: '16px', tail: 'right', origin: 'right top' },
    { left: '-238px', top: '8px', tail: 'right', origin: 'right top' },
    { left: '-245px', top: '18px', tail: 'right', origin: 'right top' },
    { left: '-246px', top: '20px', tail: 'right', origin: 'right top' },
    { left: '50%', top: '-114px', tail: 'bottom', origin: 'center bottom', x: '-50%' },
    { left: '50%', top: '-114px', tail: 'bottom', origin: 'center bottom', x: '-50%' },
    { left: '-246px', top: '12px', tail: 'right', origin: 'right top' },
    { left: '-246px', top: '10px', tail: 'right', origin: 'right top' },
    { left: '-240px', top: '18px', tail: 'right', origin: 'right top' },
    { left: '-240px', top: '18px', tail: 'right', origin: 'right top' },
    { left: '-244px', top: '10px', tail: 'right', origin: 'right top' },
    { left: '-244px', top: '10px', tail: 'right', origin: 'right top' },
    { left: '-238px', top: '12px', tail: 'right', origin: 'right top' },
    { left: '-238px', top: '12px', tail: 'right', origin: 'right top' }
];

class LunarCalendarBubbleCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._greetingTimer = null;
        this._greetingHideTimer = null;
        this._greetingRepeatTimer = null;
        this._typingTimers = [];
        this._isTypingGreeting = false;
        this._isHovering = false;
        this._isTouchHolding = false;
        this._suppressNextClick = false;
        this._resizeHandler = null;
        this._placementRaf = null;
    }

    static getStubConfig() {
        return {
            type: 'custom:lich-am-duong-bubble',
            position: 'bottom-right',
            offset_x: 20,
            offset_y: 200,
            svg_style: 0,
            svg_size: 80,
            greeting_enabled: true,
            greeting_delay: 850,
            greeting_timeout: 15000,
            greeting_timeout_s: 15,
            greeting_repeat_enabled: false,
            greeting_user: '',
            chat_width: 245,
            chat_bg_color: '#ffffff',
            chat_bg_opacity: 0.96,
            chat_font_family: 'system',
            chat_style: 'glass_light',
            chat_text_color: '#111827',
            chat_border_color: '#ffffff',
            chat_shadow_opacity: 0.22,
            animation_type: 'float',
            compact_mode: false,
            bg_color: '#ffffff',
            bg_opacity: 0.9,
            color_primary: '#03a9f4',
            color_secondary: '#757575',
            border_width: 2,
            border_color: '#03a9f4',
            border_opacity: 0.8,
            shadow_color: '#000000',
            shadow_opacity: 0.3,
            shadow_size: 15,
            divider_color: '#388e3c',
            divider_thickness: 1.5
        };
    }

    static getConfigElement() {
        return document.createElement('lich-am-duong-bubble-editor');
    }

    setConfig(config) {
        if (!config || !config.type) throw new Error('Invalid configuration');
        const mergedConfig = { ...LunarCalendarBubbleCard.getStubConfig(), ...config };
        if (config.greeting_timeout_s === undefined && config.greeting_timeout !== undefined) {
            const legacyTimeout = Number(config.greeting_timeout) || 0;
            mergedConfig.greeting_timeout_s = legacyTimeout > 120 ? Math.round(legacyTimeout / 1000) : legacyTimeout;
        }
        this.config = mergedConfig;
        this.render();
    }

    set hass(hass) {
        this._hass = hass;
        if (this.mainCard) this.mainCard.hass = hass;
        this.updateDates();

        const modal = this.shadowRoot.getElementById('modal');
        if (modal) {
            if (hass && hass.themes && hass.themes.darkMode === false) {
                modal.classList.add('is-light-theme');
            } else {
                modal.classList.remove('is-light-theme');
            }
        }
    }

    disconnectedCallback() {
        window.clearTimeout(this._greetingTimer);
        window.clearTimeout(this._greetingHideTimer);
        window.clearTimeout(this._greetingRepeatTimer);
        this.clearTypingTimers();
        if (this._resizeHandler) {
            window.removeEventListener('resize', this._resizeHandler);
            this._resizeHandler = null;
        }
        if (this._placementRaf) {
            window.cancelAnimationFrame(this._placementRaf);
            this._placementRaf = null;
        }
    }

    getRGBA(hex, opacity) {
        const safeHex = /^#[0-9a-fA-F]{6}$/.test(hex || '') ? hex : '#000000';
        const r = parseInt(safeHex.slice(1, 3), 16) || 0;
        const g = parseInt(safeHex.slice(3, 5), 16) || 0;
        const b = parseInt(safeHex.slice(5, 7), 16) || 0;
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    sanitizeSvg(svg) {
        return String(svg || '')
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .replace(/\son\w+=("[^"]*"|'[^']*')/gi, '')
            .replace(/javascript:/gi, '');
    }

    getSelectedSvgIndex() {
        const count = SVG_ITEMS.length || 1;
        const parsed = Number.parseInt(this.config.svg_style, 10);
        if (Number.isNaN(parsed)) return 0;
        return Math.max(0, Math.min(count - 1, parsed));
    }

    getSvgViewBox(index) {
        const svg = SVG_ITEMS[index] || '';
        const match = svg.match(/viewBox=["']\s*([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s*["']/i);
        if (!match) return { width: 1, height: 1 };
        return {
            width: Math.abs(Number.parseFloat(match[3])) || 1,
            height: Math.abs(Number.parseFloat(match[4])) || 1
        };
    }

    getChatPlacement(index) {
        const preset = CHAT_PLACEMENTS[index];
        if (preset) return { x: '0px', y: '0px', ...preset };

        const box = this.getSvgViewBox(index);
        const ratio = box.width / box.height;
        if (ratio > 1.15) {
            return { left: '50%', top: '-108px', tail: 'bottom', origin: 'center bottom', x: '-50%', y: '0px' };
        }
        return { left: '-238px', top: '10px', tail: 'right', origin: 'right top', x: '0px', y: '0px' };
    }

    getCanChi(year) {
        if (!year || Number.isNaN(year)) return '';
        const cans = ['Canh', 'T\u00e2n', 'Nh\u00e2m', 'Qu\u00fd', 'Gi\u00e1p', '\u1ea4t', 'B\u00ednh', '\u0110inh', 'M\u1eadu', 'K\u1ef7'];
        const chis = ['Th\u00e2n', 'D\u1eadu', 'Tu\u1ea5t', 'H\u1ee3i', 'T\u00fd', 'S\u1eedu', 'D\u1ea7n', 'M\u00e3o', 'Th\u00ecn', 'T\u1ef5', 'Ng\u1ecd', 'M\u00f9i'];
        const can = cans[year % 10];
        const chi = chis[year % 12];
        return `${can} ${chi}`;
    }

    getDateInfo() {
        try {
            const exactInfo = getLichAmDuongTodayInfo();
            if (exactInfo && exactInfo.solarLine && exactInfo.lunarLine) {
                return {
                    solarLine: exactInfo.solarLine,
                    lunarLine: exactInfo.lunarLine,
                    source: exactInfo.source || 'popup_today'
                };
            }
        } catch (err) {
            console.warn('Cannot calculate Vietnamese lunar date from popup module:', err);
        }

        return {
            solarLine: '-- - -- - ----',
            lunarLine: '-- Tháng --',
            source: 'unavailable'
        };
    }

    getGreetingName() {
        const configured = String(this.config.greeting_user || '').trim();
        if (configured) return configured;
        return this._hass?.user?.name || this._hass?.user?.displayName || 'b\u1ea1n';
    }

    clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    getPx(value, fallback = 0) {
        const parsed = Number.parseFloat(String(value || '').replace('px', ''));
        return Number.isFinite(parsed) ? parsed : fallback;
    }

    getGreetingLines() {
        const info = this.getDateInfo();
        return {
            main: `Xin chào ${this.getGreetingName()}`,
            date: info.solarLine,
            lunar: info.lunarLine
        };
    }


    getChatStyleVars(chatBg) {
        const selected = CHAT_STYLE_MAP[this.config.chat_style] || CHAT_STYLE_MAP.glass_light;
        const replaceBg = (value) => String(value || '').replace(/CHAT_BG/g, chatBg);
        return {
            background: replaceBg(selected.background),
            border: replaceBg(selected.border),
            shadow: replaceBg(selected.shadow),
            rowBg: replaceBg(selected.rowBg),
            rowBorder: replaceBg(selected.rowBorder),
            headerBg: replaceBg(selected.headerBg),
            iconBg: replaceBg(selected.iconBg),
            iconColor: replaceBg(selected.iconColor),
            beforeBg: replaceBg(selected.beforeBg),
            accent: replaceBg(selected.accent)
        };
    }


    getGreetingTimeoutSeconds() {
        if (this.config && this.config.greeting_timeout_s !== undefined) {
            const seconds = Number(this.config.greeting_timeout_s);
            return Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
        }
        const legacy = Number(this.config?.greeting_timeout) || 0;
        return legacy > 120 ? Math.round(legacy / 1000) : Math.max(0, legacy);
    }

    getGreetingTimeoutMs() {
        return Math.round(this.getGreetingTimeoutSeconds() * 1000);
    }

    clearTypingTimers() {
        (this._typingTimers || []).forEach((timer) => window.clearTimeout(timer));
        this._typingTimers = [];
        this._isTypingGreeting = false;
    }

    setGreetingFullText() {
        const main = this.shadowRoot.getElementById('greetingMain');
        const date = this.shadowRoot.getElementById('greetingDate');
        const lunar = this.shadowRoot.getElementById('greetingLunar');
        if (!main || !date || !lunar) return;
        const lines = this.getGreetingLines();
        main.textContent = lines.main;
        date.textContent = lines.date;
        lunar.textContent = lines.lunar;
    }

    typeText(element, text, speed, done) {
        if (!element) {
            if (typeof done === 'function') done();
            return;
        }
        element.textContent = '';
        let index = 0;
        const write = () => {
            if (!this._isTypingGreeting) return;
            element.textContent = text.slice(0, index);
            if (index <= text.length) {
                index += 1;
                const timer = window.setTimeout(write, speed);
                this._typingTimers.push(timer);
            } else if (typeof done === 'function') {
                done();
            }
        };
        write();
    }

    typeGreetingText() {
        const main = this.shadowRoot.getElementById('greetingMain');
        const date = this.shadowRoot.getElementById('greetingDate');
        const lunar = this.shadowRoot.getElementById('greetingLunar');
        const chat = this.shadowRoot.getElementById('chatBubble');
        if (!main || !date || !lunar || !chat) return;

        this.clearTypingTimers();
        this._isTypingGreeting = true;
        chat.dataset.typed = '0';
        const lines = this.getGreetingLines();
        main.textContent = '';
        date.textContent = '';
        lunar.textContent = '';

        const speed = this.clamp(Math.round(30 * (170 / Math.max(40, Number(this.config.svg_size) || 80))), 14, 42);
        this.typeText(main, lines.main, speed, () => {
            const pause1 = window.setTimeout(() => {
                this.typeText(date, lines.date, speed, () => {
                    const pause2 = window.setTimeout(() => {
                        this.typeText(lunar, lines.lunar, speed, () => {
                            chat.dataset.typed = '1';
                            this._isTypingGreeting = false;
                        });
                    }, 110);
                    this._typingTimers.push(pause2);
                });
            }, 120);
            this._typingTimers.push(pause1);
        });
    }

    showGreeting(options = {}) {
        if (!this.config.greeting_enabled) return;
        const chat = this.shadowRoot.getElementById('chatBubble');
        if (!chat) return;
        this.updateChatPlacement();
        chat.classList.add('show');
        if (options.restartTyping || chat.dataset.typed !== '1') {
            this.typeGreetingText();
        } else {
            this.setGreetingFullText();
        }
    }

    hideGreeting() {
        const chat = this.shadowRoot.getElementById('chatBubble');
        if (!chat) return;
        chat.classList.remove('show');
        this.clearTypingTimers();
    }

    updateChatPlacement() {
        const wrapper = this.shadowRoot.getElementById('wrapper');
        const bubble = this.shadowRoot.getElementById('bubble');
        const chat = this.shadowRoot.getElementById('chatBubble');
        if (!wrapper || !bubble || !chat) return;

        const index = this.getSelectedSvgIndex();
        const preset = this.getChatPlacement(index);
        const svgSize = Math.max(40, Number(this.config.svg_size) || 80);
        const scale = this.clamp(svgSize / 170, 0.48, 1.55);
        const gap = Math.round(12 * scale);
        const rect = bubble.getBoundingClientRect();
        const viewportW = window.innerWidth || document.documentElement.clientWidth || 1024;
        const viewportH = window.innerHeight || document.documentElement.clientHeight || 768;
        const chatWidth = chat.offsetWidth || Math.round((Number(this.config.chat_width) || 245) * scale);
        const chatHeight = chat.offsetHeight || Math.round(88 * scale);
        let side = 'left';

        if (viewportW <= 600) {
            side = 'top';
        } else if (rect.left < chatWidth + gap + 12) {
            side = 'right';
        } else if (rect.right + chatWidth + gap + 12 > viewportW) {
            side = 'left';
        } else if (preset.tail === 'bottom') {
            side = 'top';
        }

        const topBase = this.getPx(preset.top, 8);
        let top = Math.round(topBase * scale);
        top = this.clamp(top, Math.round(-26 * scale), Math.max(0, Math.round(rect.height - chatHeight - 4)));

        chat.classList.remove('tail-left', 'tail-right', 'tail-bottom');
        if (side === 'right') {
            wrapper.style.setProperty('--chat-left', `${Math.round(rect.width + gap)}px`);
            wrapper.style.setProperty('--chat-top', `${top}px`);
            wrapper.style.setProperty('--chat-x', '0px');
            wrapper.style.setProperty('--chat-y', '0px');
            wrapper.style.setProperty('--tail-top', `${this.clamp(Math.round(30 * scale), 18, Math.max(20, chatHeight - 20))}px`);
            chat.classList.add('tail-left');
            chat.style.transformOrigin = 'left top';
        } else if (side === 'top') {
            const topOffset = Math.max(chatHeight + Math.round(16 * scale), Math.round(106 * scale));
            wrapper.style.setProperty('--chat-left', '50%');
            wrapper.style.setProperty('--chat-top', `-${topOffset}px`);
            wrapper.style.setProperty('--chat-x', '-50%');
            wrapper.style.setProperty('--chat-y', '0px');
            chat.classList.add('tail-bottom');
            chat.style.transformOrigin = 'center bottom';
        } else {
            wrapper.style.setProperty('--chat-left', `-${Math.round(chatWidth + gap)}px`);
            wrapper.style.setProperty('--chat-top', `${top}px`);
            wrapper.style.setProperty('--chat-x', '0px');
            wrapper.style.setProperty('--chat-y', '0px');
            wrapper.style.setProperty('--tail-top', `${this.clamp(Math.round(30 * scale), 18, Math.max(20, chatHeight - 20))}px`);
            chat.classList.add('tail-right');
            chat.style.transformOrigin = 'right top';
        }

        const nextRect = chat.getBoundingClientRect();
        if (nextRect.top < 6) {
            const currentTop = this.getPx(wrapper.style.getPropertyValue('--chat-top'), 0);
            wrapper.style.setProperty('--chat-top', `${Math.round(currentTop + (6 - nextRect.top))}px`);
        }
        if (nextRect.bottom > viewportH - 6 && side !== 'top') {
            const currentTop = this.getPx(wrapper.style.getPropertyValue('--chat-top'), 0);
            wrapper.style.setProperty('--chat-top', `${Math.round(currentTop - (nextRect.bottom - viewportH + 6))}px`);
        }
    }

    requestChatPlacementUpdate() {
        if (this._placementRaf) return;
        this._placementRaf = window.requestAnimationFrame(() => {
            this._placementRaf = null;
            this.updateChatPlacement();
        });
    }

    render() {
        if (!this.config) return;
        this.style.display = 'block';

        const posCSS = this.config.position === 'top-right'
            ? `top: ${Number(this.config.offset_y) || 0}px; right: ${Number(this.config.offset_x) || 0}px;`
            : `bottom: ${Number(this.config.offset_y) || 0}px; right: ${Number(this.config.offset_x) || 0}px;`;

        const animations = {
            none: 'none',
            breathe: 'anim-breathe 3s ease-in-out infinite',
            float: 'anim-float 3s ease-in-out infinite',
            pulse_glow: 'anim-pulse_glow 2s ease-in-out infinite',
            swing: 'anim-swing 4s ease-in-out infinite',
            heartbeat: 'anim-heartbeat 2s ease-in-out infinite',
            bounce: 'anim-bounce 2.5s ease-in-out infinite',
            jelly: 'anim-jelly 2.5s ease-in-out infinite',
            wobble: 'anim-wobble 3.5s ease-in-out infinite',
            squeeze: 'anim-squeeze 2s ease-in-out infinite',
            rubber_band: 'anim-rubber_band 3s ease-in-out infinite'
        };

        const index = this.getSelectedSvgIndex();
        const selectedSvg = this.sanitizeSvg(SVG_ITEMS[index] || SVG_ITEMS[0] || '');
        const box = this.getSvgViewBox(index);
        const svgSize = Math.max(40, Number(this.config.svg_size) || 80);
        const stageHeight = Math.max(svgSize, Math.min(svgSize * 1.75, svgSize * (box.height / Math.max(box.width, 1))));
        const placement = this.getChatPlacement(index);
        const shadowSize = Math.max(0, Number(this.config.shadow_size) || 15);
        const shadowColor = this.getRGBA(this.config.shadow_color, this.config.shadow_opacity);
        const glowColor = this.getRGBA(this.config.chat_border_color, 0.65);
        const chatBgBase = this.getRGBA(this.config.chat_bg_color || '#ffffff', this.clamp(Number(this.config.chat_bg_opacity), 0, 1));
        const chatStyle = this.getChatStyleVars(chatBgBase);
        const chatBg = chatStyle.background;
        const chatText = this.config.chat_text_color || '#111827';
        const chatFontFamily = CHAT_FONT_MAP[this.config.chat_font_family] || CHAT_FONT_MAP.system;
        const chatScale = this.clamp(svgSize / 170, 0.48, 1.55);
        const chatWidth = Math.round(Math.max(170, Number(this.config.chat_width) || 245) * chatScale);
        const chatFontSize = Math.round(this.clamp(16 * chatScale, 10, 24));
        const chatPaddingY = Math.round(this.clamp(12 * chatScale, 6, 20));
        const chatPaddingX = Math.round(this.clamp(16 * chatScale, 8, 26));
        const chatRadius = Math.round(this.clamp(22 * chatScale, 10, 32));

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
                    --chat-bg: ${chatBg};
                    --chat-border-color: ${chatStyle.border};
                    --chat-shadow: ${chatStyle.shadow};
                    --chat-row-bg: ${chatStyle.rowBg};
                    --chat-row-border: ${chatStyle.rowBorder};
                    --chat-header-bg: ${chatStyle.headerBg};
                    --chat-icon-bg: ${chatStyle.iconBg};
                    --chat-icon-color: ${chatStyle.iconColor};
                    --chat-before-bg: ${chatStyle.beforeBg};
                    --chat-accent: ${chatStyle.accent};
                    --chat-left: ${placement.left};
                    --chat-top: ${placement.top};
                    --chat-x: ${placement.x || '0px'};
                    --chat-y: ${placement.y || '0px'};
                    --chat-width: ${chatWidth}px;
                    --chat-font-size: ${chatFontSize}px;
                    --chat-padding-y: ${chatPaddingY}px;
                    --chat-padding-x: ${chatPaddingX}px;
                    --chat-radius: ${chatRadius}px;
                    --tail-top: ${Math.round(32 * chatScale)}px;
                }

                .tooltip {
                    background: rgba(0, 0, 0, 0.78);
                    color: #fff;
                    padding: 6px 12px;
                    border-radius: 999px;
                    font-size: 11px;
                    margin-bottom: 8px;
                    opacity: 0;
                    transform: translateY(10px);
                    transition: all 0.25s ease;
                    white-space: nowrap;
                    pointer-events: none;
                    box-shadow: 0 6px 16px rgba(0,0,0,0.28);
                }

                @keyframes anim-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
                @keyframes anim-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
                @keyframes anim-pulse_glow { 0%, 100% { filter: drop-shadow(0 8px ${shadowSize}px ${shadowColor}); } 50% { filter: drop-shadow(0 10px ${shadowSize + 10}px ${glowColor}); } }
                @keyframes anim-swing { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(4deg); } 75% { transform: rotate(-4deg); } }
                @keyframes anim-heartbeat { 0%, 100%, 70% { transform: scale(1); } 14%, 42% { transform: scale(1.05); } 28% { transform: scale(1.02); } }
                @keyframes anim-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
                @keyframes anim-jelly { 0%, 100% { transform: scale(1, 1); } 25% { transform: scale(1.03, 0.97); } 50% { transform: scale(0.97, 1.03); } 75% { transform: scale(1.01, 0.99); } }
                @keyframes anim-wobble { 0%, 100% { transform: translateX(0%) rotate(0deg); } 15% { transform: translateX(-3px) rotate(-3deg); } 30% { transform: translateX(2px) rotate(2deg); } 45% { transform: translateX(-2px) rotate(-1deg); } 60% { transform: translateX(1px) rotate(1deg); } }
                @keyframes anim-squeeze { 0%, 100% { transform: scale(1, 1); } 50% { transform: scale(0.96, 1.04); } }
                @keyframes anim-rubber_band { 0%, 100% { transform: scale(1); } 30% { transform: scale(1.06, 0.94); } 40% { transform: scale(0.94, 1.06); } 50% { transform: scale(1.03, 0.97); } 65% { transform: scale(0.98, 1.02); } 75% { transform: scale(1.01, 0.99); } }
                @keyframes chatIn { from { opacity: 0; transform: translate(var(--chat-x), 14px) scale(0.96); } to { opacity: 1; transform: translate(var(--chat-x), var(--chat-y)) scale(1); } }

                .avatar-stage {
                    position: relative;
                    width: ${svgSize}px;
                    min-height: ${stageHeight}px;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    cursor: grab;
                    user-select: none;
                    animation: ${animations[this.config.animation_type] || animations.float};
                    transform-origin: center bottom;
                    transition: transform 0.25s ease, filter 0.25s ease;
                    filter: drop-shadow(0 10px ${shadowSize}px ${shadowColor});
                }

                .avatar-stage:active { cursor: grabbing; }
                .bubble-wrapper:hover .avatar-stage { transform: scale(1.05) !important; animation-play-state: paused; }
                .bubble-wrapper:hover .tooltip { opacity: 1; transform: translateY(0); }

                .svg-avatar {
                    width: ${svgSize}px;
                    max-width: ${svgSize}px;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    pointer-events: none;
                }

                .svg-avatar svg {
                    width: 100%;
                    height: auto;
                    max-height: ${stageHeight}px;
                    overflow: visible;
                    display: block;
                }

                .chat-bubble {
                    position: absolute;
                    left: var(--chat-left);
                    top: var(--chat-top);
                    width: var(--chat-width);
                    max-width: calc(100vw - 24px);
                    box-sizing: border-box;
                    background: var(--chat-bg);
                    color: ${chatText};
                    font-family: ${chatFontFamily};
                    border: 1px solid var(--chat-border-color);
                    border-radius: var(--chat-radius);
                    padding: var(--chat-padding-y) var(--chat-padding-x);
                    font-size: var(--chat-font-size);
                    line-height: 1.34;
                    font-weight: 520;
                    text-align: left;
                    box-shadow: var(--chat-shadow);
                    opacity: 0;
                    transform: translate(var(--chat-x), 14px) scale(0.96);
                    transform-origin: ${placement.origin || 'right top'};
                    pointer-events: none;
                    transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), left 0.2s ease, top 0.2s ease;
                    backdrop-filter: blur(14px) saturate(1.16);
                    -webkit-backdrop-filter: blur(14px) saturate(1.16);
                    overflow-wrap: anywhere;
                    letter-spacing: -0.01em;
                }

                .chat-bubble::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: inherit;
                    background: var(--chat-before-bg);
                    pointer-events: none;
                }

                .chat-bubble > * { position: relative; z-index: 1; }

                .chat-bubble.show {
                    opacity: 1;
                    transform: translate(var(--chat-x), var(--chat-y)) scale(1);
                    animation: chatIn 0.45s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .chat-bubble::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 0;
                }

                .chat-bubble.tail-right::after {
                    right: -12px;
                    top: var(--tail-top);
                    border-top: 10px solid transparent;
                    border-bottom: 10px solid transparent;
                    border-left: 13px solid var(--chat-bg);
                }

                .chat-bubble.tail-left::after {
                    left: -12px;
                    top: var(--tail-top);
                    border-top: 10px solid transparent;
                    border-bottom: 10px solid transparent;
                    border-right: 13px solid var(--chat-bg);
                }

                .chat-bubble.tail-bottom::after {
                    left: 50%;
                    bottom: -12px;
                    transform: translateX(-50%);
                    border-left: 10px solid transparent;
                    border-right: 10px solid transparent;
                    border-top: 13px solid var(--chat-bg);
                }

                .greeting-main {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 1.04em;
                    font-weight: 850;
                    margin-bottom: 7px;
                    letter-spacing: -0.02em;
                }

                .greeting-main.greeting-row {
                    background: var(--chat-header-bg);
                    box-shadow: inset 0 1px 0 rgba(255,255,255,0.26);
                    margin-top: 0;
                    margin-bottom: 6px;
                }

                .greeting-dot {
                    width: 0.58em;
                    height: 0.58em;
                    border-radius: 999px;
                    flex: 0 0 auto;
                    background: currentColor;
                    opacity: 0.72;
                    box-shadow: 0 0 0 4px rgba(255,255,255,0.28);
                }

                .greeting-row {
                    display: grid;
                    grid-template-columns: 1.55em 1fr;
                    align-items: start;
                    gap: 8px;
                    margin-top: 5px;
                    padding: 0.42em 0.52em;
                    border-radius: calc(var(--chat-radius) * 0.55);
                    background: var(--chat-row-bg);
                    border: 1px solid var(--chat-row-border);
                    opacity: 0.96;
                }

                .chat-icon {
                    width: 1.62em;
                    height: 1.62em;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 999px;
                    background: var(--chat-icon-bg);
                    color: var(--chat-icon-color);
                    box-shadow: inset 0 0 0 1px var(--chat-row-border), 0 5px 14px rgba(0,0,0,0.08);
                    font-size: 0.9em;
                    line-height: 1;
                    filter: saturate(1.15);
                }

                .emoji-icon {
                    font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
                }

                .greeting-date, .greeting-lunar { min-height: 1.28em; }
                .greeting-lunar { font-weight: 700; }

                .modal { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 10000; display: none; align-items: center; justify-content: center; }
                .modal-overlay { position: absolute; width: 100%; height: 100%; background: transparent; }
                .modal-content { position: relative; width: 95%; max-width: 480px; max-height: 85vh; border-radius: 28px; animation: popInModal 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; box-shadow: 0 25px 50px rgba(0,0,0,0.5); overflow: hidden; }
                @keyframes popInModal { 0% { opacity: 0; transform: scale(0.7) translateY(30px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
                .close-btn { position: absolute; top: 15px; right: 15px; z-index: 101; background: rgba(0,0,0,0.2); color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; display: flex; align-items: center; justify-content: center; }

                #card-container { overflow-y: auto; background: var(--card-background-color); border-radius: 28px; }
                .is-light-theme #card-container {
                    background: rgba(0, 0, 0, 0.75) !important;
                    --ha-card-background: transparent !important;
                    --card-background-color: transparent !important;
                    --paper-card-background-color: transparent !important;
                    --primary-background-color: transparent !important;
                    --secondary-background-color: transparent !important;
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                }

                @media (max-width: 600px) {
                    .avatar-stage { width: ${Math.round(svgSize * 0.82)}px; min-height: ${Math.round(stageHeight * 0.82)}px; }
                    .svg-avatar { width: ${Math.round(svgSize * 0.82)}px; max-width: ${Math.round(svgSize * 0.82)}px; }
                    .svg-avatar svg { max-height: ${Math.round(stageHeight * 0.82)}px; }
                    .chat-bubble {
                        left: 50% !important;
                        top: -112px !important;
                        width: min(var(--chat-width), 78vw);
                        font-size: ${Math.max(13, Math.round(chatFontSize * 0.9))}px;
                        padding: ${Math.max(9, Math.round(chatPaddingY * 0.9))}px ${Math.max(12, Math.round(chatPaddingX * 0.9))}px;
                        transform-origin: center bottom;
                        transform: translate(-50%, 14px) scale(0.96) !important;
                    }
                    .chat-bubble.show { transform: translate(-50%, 0) scale(1) !important; }
                    .chat-bubble::after {
                        left: 50% !important;
                        right: auto !important;
                        top: auto !important;
                        bottom: -12px !important;
                        transform: translateX(-50%) !important;
                        border-left: 10px solid transparent !important;
                        border-right: 10px solid transparent !important;
                        border-top: 13px solid var(--chat-bg) !important;
                        border-bottom: 0 !important;
                    }
                }
            </style>

            <div class="bubble-wrapper" id="wrapper">
                <div class="tooltip">Nh&#7845;n &#273;&#7875; xem / K&#233;o &#273;&#7875; di chuy&#7875;n</div>
                <div class="avatar-stage" id="bubble" aria-label="Lunar calendar SVG bubble">
                    <div class="svg-avatar" id="svgAvatar">${selectedSvg}</div>
                    <div class="chat-bubble tail-${placement.tail}" id="chatBubble" aria-live="polite">
                        <div class="greeting-main greeting-row"><span class="chat-icon emoji-icon">👑</span><span id="greetingMain"></span></div>
                        <div class="greeting-row"><span class="chat-icon emoji-icon">☀️</span><span class="greeting-date" id="greetingDate"></span></div>
                        <div class="greeting-row"><span class="chat-icon emoji-icon">🌙</span><span class="greeting-lunar" id="greetingLunar"></span></div>
                    </div>
                </div>
            </div>

            <div class="modal" id="modal">
                <div class="modal-overlay" id="overlay"></div>
                <div class="modal-content">
                    <button class="close-btn" id="close">&#10005;</button>
                    <div id="card-container"></div>
                </div>
            </div>
        `;

        this.setupDragAndDrop();
        this.shadowRoot.getElementById('overlay')?.addEventListener('click', () => this.closeModal());
        this.shadowRoot.getElementById('close')?.addEventListener('click', () => this.closeModal());
        if (this._resizeHandler) window.removeEventListener('resize', this._resizeHandler);
        this._resizeHandler = () => this.requestChatPlacementUpdate();
        window.addEventListener('resize', this._resizeHandler, { passive: true });
        this.updateDates();
        this.requestChatPlacementUpdate();
        this.scheduleGreeting();
    }

    getGreetingRepeatIntervalMs() {
        return 5 * 60 * 1000;
    }

    scheduleGreetingHide(options = {}) {
        window.clearTimeout(this._greetingHideTimer);
        const timeout = this.getGreetingTimeoutMs();
        if (timeout <= 0) return;

        const tryHide = () => {
            if (this._isHovering || this._isTouchHolding) {
                this._greetingHideTimer = window.setTimeout(tryHide, 500);
                return;
            }
            this.hideGreeting();
            if (options.thenRepeat) this.scheduleNextRepeatedGreeting();
        };

        this._greetingHideTimer = window.setTimeout(tryHide, timeout);
    }

    scheduleNextRepeatedGreeting() {
        window.clearTimeout(this._greetingRepeatTimer);
        if (!this.config.greeting_enabled || !this.config.greeting_repeat_enabled) return;
        if (this.getGreetingTimeoutMs() <= 0) return;

        this._greetingRepeatTimer = window.setTimeout(() => {
            if (!this.isConnected || !this.config.greeting_enabled || !this.config.greeting_repeat_enabled) return;
            this.showGreeting({ restartTyping: true });
            this.scheduleGreetingHide({ thenRepeat: true });
        }, this.getGreetingRepeatIntervalMs());
    }

    scheduleGreeting() {
        window.clearTimeout(this._greetingTimer);
        window.clearTimeout(this._greetingHideTimer);
        window.clearTimeout(this._greetingRepeatTimer);
        this.clearTypingTimers();
        const chat = this.shadowRoot.getElementById('chatBubble');
        if (!chat) return;
        chat.classList.remove('show');
        chat.dataset.typed = '0';
        this.setGreetingFullText();
        if (!this.config.greeting_enabled) return;

        const delay = Math.max(0, Number(this.config.greeting_delay) || 0);
        this._greetingTimer = window.setTimeout(() => {
            this.showGreeting({ restartTyping: true });
            this.scheduleGreetingHide({ thenRepeat: !!this.config.greeting_repeat_enabled });
        }, delay);
    }

    setupDragAndDrop() {
        const wrapper = this.shadowRoot.getElementById('wrapper');
        const bubble = this.shadowRoot.getElementById('bubble');
        if (!wrapper || !bubble) return;

        let isDragging = false;
        let initialX = 0;
        let initialY = 0;
        let currentX = 0;
        let currentY = 0;
        let xOffset = 0;
        let yOffset = 0;
        let hasDragged = false;

        const dragStart = (e) => {
            const point = e.type === 'touchstart' ? e.touches[0] : e;
            initialX = point.clientX - xOffset;
            initialY = point.clientY - yOffset;
            isDragging = true;
            hasDragged = false;
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('touchend', dragEnd);
        };

        const drag = (e) => {
            if (!isDragging) return;
            const point = e.type === 'touchmove' ? e.touches[0] : e;
            currentX = point.clientX - initialX;
            currentY = point.clientY - initialY;

            if (Math.abs(currentX - xOffset) > 5 || Math.abs(currentY - yOffset) > 5) {
                hasDragged = true;
            }

            xOffset = currentX;
            yOffset = currentY;
            wrapper.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            this.requestChatPlacementUpdate();
            if (e.cancelable) e.preventDefault();
        };

        const dragEnd = () => {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', dragEnd);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('touchend', dragEnd);
        };

        const touchHoldStart = (e) => {
            this._isTouchHolding = true;
            this._isHovering = true;
            this.requestChatPlacementUpdate();
            window.clearTimeout(this._greetingHideTimer);
            if (this.config.greeting_enabled) {
                this.showGreeting({ restartTyping: true });
            }
        };

        const touchHoldEnd = () => {
            if (!this._isTouchHolding) return;
            this._isTouchHolding = false;
            this._isHovering = false;
            this.hideGreeting();
            this._suppressNextClick = true;
            window.setTimeout(() => { this._suppressNextClick = false; }, 450);
        };

        bubble.addEventListener('mousedown', dragStart);
        bubble.addEventListener('touchstart', (e) => {
            touchHoldStart(e);
            dragStart(e);
            document.addEventListener('touchend', touchHoldEnd, { once: true });
            document.addEventListener('touchcancel', touchHoldEnd, { once: true });
        }, { passive: false });
        bubble.addEventListener('mouseenter', () => {
            this._isHovering = true;
            this.requestChatPlacementUpdate();
            if (this.getGreetingTimeoutMs() > 0) {
                window.clearTimeout(this._greetingHideTimer);
                this.showGreeting({ restartTyping: true });
            }
        });
        bubble.addEventListener('mouseleave', () => {
            this._isHovering = false;
            if (this.getGreetingTimeoutMs() > 0 && !isDragging) {
                this.hideGreeting();
            }
        });
        bubble.addEventListener('click', (e) => {
            if (this._suppressNextClick) {
                e.preventDefault();
                e.stopPropagation();
                this._suppressNextClick = false;
                return;
            }
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
        if (this._isTypingGreeting) return;
        this.setGreetingFullText();
    }

    openModal() {
        const container = this.shadowRoot.getElementById('card-container');
        if (container && !container.firstChild) {
            this.mainCard = document.createElement('lich-block-am-duong-viet-nam');
            if (customElements.get('lich-block-am-duong-viet-nam')) {
                this.mainCard.setConfig({ type: 'custom:lich-block-am-duong-viet-nam' });
                this.mainCard.hass = this._hass;
                container.appendChild(this.mainCard);
            } else {
                container.innerHTML = '<div style="padding: 22px; color: var(--primary-text-color);">Kh&#244;ng t&#236;m th&#7845;y card <b>lich-block-am-duong-viet-nam</b>.</div>';
            }
        }
        const modal = this.shadowRoot.getElementById('modal');
        if (modal) modal.style.display = 'flex';
    }

    closeModal() {
        const modal = this.shadowRoot.getElementById('modal');
        if (modal) modal.style.display = 'none';
    }
}

class LunarCalendarBubbleEditor extends HTMLElement {
    setConfig(config) {
        const mergedConfig = { ...LunarCalendarBubbleCard.getStubConfig(), ...config };
        if (config.greeting_timeout_s === undefined && config.greeting_timeout !== undefined) {
            const legacyTimeout = Number(config.greeting_timeout) || 0;
            mergedConfig.greeting_timeout_s = legacyTimeout > 120 ? Math.round(legacyTimeout / 1000) : legacyTimeout;
        }
        this.config = mergedConfig;
        this.render();
    }

    getFontOptions() {
        const current = this.config.chat_font_family || 'system';
        return CHAT_FONT_OPTIONS.map((item) => `<option value="${item.value}" ${current === item.value ? 'selected' : ''}>${item.label}</option>`).join('');
    }


    getChatStyleOptions() {
        const current = this.config.chat_style || 'glass_light';
        return CHAT_STYLE_OPTIONS.map((item) => `<option value="${item.value}" ${current === item.value ? 'selected' : ''}>${item.label}</option>`).join('');
    }

    getSvgOptions() {
        const count = SVG_ITEMS.length || 1;
        const current = Number.parseInt(this.config.svg_style, 10) || 0;
        return Array.from({ length: count }, (_, index) => {
            const name = SVG_NAMES[index] || `Mau SVG ${String(index + 1).padStart(2, '0')}`;
            return `<option value="${index}" ${current === index ? 'selected' : ''}>${name}</option>`;
        }).join('');
    }

    render() {
        if (!this.config) return;
        this.innerHTML = `
            <style>
                .config-container { display: flex; flex-direction: column; gap: 12px; padding: 10px 0; }
                .section { border: 1px solid var(--divider-color); padding: 12px; border-radius: 12px; background: var(--secondary-background-color); }
                .section-title { font-weight: 700; margin-bottom: 12px; color: var(--primary-color); font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; }
                .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
                .field label { font-size: 12px; font-weight: 700; color: var(--primary-text-color); }
                .input-group { display: flex; align-items: center; gap: 10px; }
                input[type="color"] { width: 38px; height: 38px; border: none; border-radius: 50%; cursor: pointer; padding: 0; background: none; }
                input[type="number"], input[type="range"], select { padding: 8px; border-radius: 6px; border: 1px solid var(--divider-color); flex: 1; color: var(--primary-text-color); background: var(--card-background-color); }
                .value-badge { font-family: monospace; font-size: 11px; background: var(--divider-color); padding: 3px 7px; border-radius: 5px; min-width: 48px; text-align: center; color: var(--primary-text-color); }
                .checkbox-group { display: flex; align-items: center; gap: 8px; cursor: pointer; margin-bottom: 6px; }
                .checkbox-group input { width: 16px; height: 16px; accent-color: var(--primary-color); cursor: pointer; }
                .checkbox-group label { cursor: pointer; font-size: 13px; font-weight: 400; color: var(--primary-text-color); }
                .hint { color: var(--secondary-text-color); font-size: 12px; line-height: 1.35; margin-top: 4px; }
            </style>
            <div class="config-container">
                <div class="section">
                    <div class="section-title">M&#7851;u SVG &amp; khung chat</div>
                    <div class="field">
                        <label>Ch&#7885;n m&#7851;u SVG hi&#7875;n th&#7883;</label>
                        <select id="svg_style">${this.getSvgOptions()}</select>
                        <div class="hint">Danh s&#225;ch n&#224;y l&#7845;y t&#7921; &#273;&#7897;ng t&#7915; file <b>lich-block-am-duong-viet-nam-bubble-data.js</b>.</div>
                    </div>
                    <div class="field">
                        <label>K&#237;ch th&#432;&#7899;c SVG</label>
                        <div class="input-group">
                            <input type="range" id="svg_size" min="40" max="280" step="5" value="${this.config.svg_size}">
                            <span class="value-badge">${this.config.svg_size}px</span>
                        </div>
                    </div>
                    <div class="field">
                        <div class="checkbox-group">
                            <input type="checkbox" id="greeting_enabled" ${this.config.greeting_enabled ? 'checked' : ''}>
                            <label for="greeting_enabled">Hi&#7879;n khung chat ch&#224;o sau khi SVG load</label>
                        </div>
                    </div>
                    <div class="field">
                        <label>T&#234;n hi&#7875;n th&#7883; trong c&#226;u ch&#224;o (b&#7887; tr&#7889;ng = user Home Assistant)</label>
                        <input type="text" id="greeting_user" value="${String(this.config.greeting_user || '').replace(/"/g, '&quot;')}">
                    </div>
                    <div class="field">
                        <label>&#272;&#7897; tr&#7877; hi&#7879;n khung chat</label>
                        <div class="input-group">
                            <input type="number" id="greeting_delay" min="0" step="50" value="${this.config.greeting_delay}">
                            <span class="value-badge">ms</span>
                        </div>
                    </div>
                    <div class="field">
                        <label>T&#7921; &#7849;n khung chat sau (0 = kh&#244;ng t&#7921; &#7849;n)</label>
                        <div class="input-group">
                            <input type="number" id="greeting_timeout_s" min="0" step="1" value="${this.config.greeting_timeout_s}">
                            <span class="value-badge">s</span>
                        </div>
                        <div class="hint">M&#7863;c &#273;&#7883;nh 15 gi&#226;y. V&#237; d&#7909;: 15 = t&#7921; &#7849;n sau 15 gi&#226;y.</div>
                    </div>
                    <div class="field">
                        <div class="checkbox-group">
                            <input type="checkbox" id="greeting_repeat_enabled" ${this.config.greeting_repeat_enabled ? 'checked' : ''}>
                            <label for="greeting_repeat_enabled">T&#7921; hi&#7879;n l&#7841;i khung chat sau m&#7895;i 5 ph&#250;t</label>
                        </div>
                        <div class="hint">Khi b&#7853;t: khung chat s&#7869; hi&#7879;n, &#7849;n theo s&#7889; gi&#226;y b&#234;n tr&#234;n, r&#7891;i ch&#7901; 5 ph&#250;t &#273;&#7875; t&#7921; hi&#7879;n l&#7841;i.</div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">V&#7883; tr&#237; &amp; hi&#7879;u &#7913;ng</div>
                    <div class="field">
                        <label>Hi&#7879;u &#7913;ng SVG</label>
                        <select id="animation_type">
                            <option value="none" ${this.config.animation_type === 'none' ? 'selected' : ''}>T&#297;nh</option>
                            <option value="breathe" ${this.config.animation_type === 'breathe' ? 'selected' : ''}>Nh&#7883;p th&#7903;</option>
                            <option value="float" ${this.config.animation_type === 'float' ? 'selected' : ''}>Tr&#244;i n&#7893;i</option>
                            <option value="pulse_glow" ${this.config.animation_type === 'pulse_glow' ? 'selected' : ''}>T&#7887;a s&#225;ng</option>
                            <option value="swing" ${this.config.animation_type === 'swing' ? 'selected' : ''}>L&#7855;c l&#432;</option>
                            <option value="heartbeat" ${this.config.animation_type === 'heartbeat' ? 'selected' : ''}>Nh&#7883;p tim</option>
                            <option value="bounce" ${this.config.animation_type === 'bounce' ? 'selected' : ''}>N&#7843;y nh&#7865;</option>
                            <option value="jelly" ${this.config.animation_type === 'jelly' ? 'selected' : ''}>Kh&#7889;i th&#7841;ch</option>
                            <option value="wobble" ${this.config.animation_type === 'wobble' ? 'selected' : ''}>Chao &#273;&#7843;o</option>
                            <option value="squeeze" ${this.config.animation_type === 'squeeze' ? 'selected' : ''}>Co gi&#227;n</option>
                            <option value="rubber_band" ${this.config.animation_type === 'rubber_band' ? 'selected' : ''}>D&#226;y thun</option>
                        </select>
                    </div>
                    <div class="field">
                        <label>V&#7883; tr&#237; hi&#7875;n th&#7883; m&#7863;c &#273;&#7883;nh</label>
                        <select id="position">
                            <option value="bottom-right" ${this.config.position === 'bottom-right' ? 'selected' : ''}>D&#432;&#7899;i c&#249;ng b&#234;n ph&#7843;i</option>
                            <option value="top-right" ${this.config.position === 'top-right' ? 'selected' : ''}>Tr&#234;n c&#249;ng b&#234;n ph&#7843;i</option>
                        </select>
                    </div>
                    <div class="field">
                        <label>Kho&#7843;ng c&#225;ch l&#234;n/xu&#7889;ng</label>
                        <div class="input-group">
                            <input type="range" id="offset_y" min="20" max="600" step="10" value="${this.config.offset_y}">
                            <span class="value-badge">${this.config.offset_y}px</span>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">M&#224;u khung chat</div>
                    <div class="field">
                        <label>M&#7851;u khung chat</label>
                        <select id="chat_style">${this.getChatStyleOptions()}</select>
                        <div class="hint">G&#7891;m 10 m&#7851;u giao di&#7879;n: glass, pastel, neon, sunset, mint, royal, clean, cute, aqua...</div>
                    </div>
                    <div class="field">
                        <label>N&#7873;n khung chat</label>
                        <div class="input-group">
                            <input type="color" id="chat_bg_color" value="${this.config.chat_bg_color}">
                            <span class="value-badge">${String(this.config.chat_bg_color).toUpperCase()}</span>
                        </div>
                    </div>
                    <div class="field">
                        <label>&#272;&#7897; trong su&#7889;t n&#7873;n khung chat</label>
                        <div class="input-group">
                            <input type="range" id="chat_bg_opacity" min="0" max="1" step="0.05" value="${this.config.chat_bg_opacity}">
                            <span class="value-badge">${this.config.chat_bg_opacity}</span>
                        </div>
                    </div>
                    <div class="field">
                        <label>Font ch&#7919; n&#7897;i dung chat</label>
                        <select id="chat_font_family">${this.getFontOptions()}</select>
                        <div class="hint">G&#7891;m 10 ki&#7875;u font, d&#249;ng font c&#243; s&#7861;n tr&#234;n tr&#236;nh duy&#7879;t/thi&#7871;t b&#7883;.</div>
                    </div>

                    <div class="field">
                        <label>M&#224;u ch&#7919;</label>
                        <div class="input-group">
                            <input type="color" id="chat_text_color" value="${this.config.chat_text_color}">
                            <span class="value-badge">${String(this.config.chat_text_color).toUpperCase()}</span>
                        </div>
                    </div>
                    <div class="field">
                        <label>&#272;&#7897; r&#7897;ng khung chat</label>
                        <div class="input-group">
                            <input type="range" id="chat_width" min="180" max="360" step="5" value="${this.config.chat_width}">
                            <span class="value-badge">${this.config.chat_width}px</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const dispatchConfig = () => {
            const newConfig = {
                ...this.config,
                svg_style: Number.parseInt(this.querySelector('#svg_style').value, 10) || 0,
                svg_size: Number.parseInt(this.querySelector('#svg_size').value, 10) || 80,
                greeting_enabled: this.querySelector('#greeting_enabled').checked,
                greeting_user: this.querySelector('#greeting_user').value || '',
                greeting_delay: Number.parseInt(this.querySelector('#greeting_delay').value, 10) || 0,
                greeting_timeout_s: Number.parseFloat(this.querySelector('#greeting_timeout_s').value) || 0,
                greeting_timeout: Math.round((Number.parseFloat(this.querySelector('#greeting_timeout_s').value) || 0) * 1000),
                greeting_repeat_enabled: this.querySelector('#greeting_repeat_enabled').checked,
                animation_type: this.querySelector('#animation_type').value,
                position: this.querySelector('#position').value,
                offset_y: Number.parseInt(this.querySelector('#offset_y').value, 10) || 200,
                chat_style: this.querySelector('#chat_style').value,
                chat_bg_color: this.querySelector('#chat_bg_color').value,
                chat_bg_opacity: Number.parseFloat(this.querySelector('#chat_bg_opacity').value),
                chat_font_family: this.querySelector('#chat_font_family').value,
                chat_text_color: this.querySelector('#chat_text_color').value,
                chat_width: Number.parseInt(this.querySelector('#chat_width').value, 10) || 245,
                offset_x: this.config.offset_x
            };
            this.config = newConfig;
            this.dispatchEvent(new CustomEvent('config-changed', {
                detail: { config: newConfig },
                bubbles: true,
                composed: true
            }));
        };

        this.querySelectorAll('input, select').forEach((el) => {
            const updateBadge = () => {
                const badge = el.parentElement?.querySelector('.value-badge');
                if (!badge) return;
                if (el.type === 'color') badge.textContent = el.value.toUpperCase();
                if (el.type === 'range') badge.textContent = el.id.includes('opacity') ? el.value : `${el.value}px`;
            };
            el.addEventListener('input', updateBadge);
            el.addEventListener('change', () => {
                updateBadge();
                dispatchConfig();
            });
        });
    }
}

customElements.define('lich-am-duong-bubble-editor', LunarCalendarBubbleEditor);
customElements.define('lich-am-duong-bubble', LunarCalendarBubbleCard);

window.customCards = window.customCards || [];
window.customCards.push({
    type: 'lich-am-duong-bubble',
    name: 'Bong Bong Lich Am Duong SVG',
    description: 'Bong bong SVG noi, tu doi vi tri khung chat, hieu ung go chu va ngay am duong.',
    preview: false
});
