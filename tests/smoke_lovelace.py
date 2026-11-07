from pathlib import Path
from playwright.sync_api import sync_playwright
from urllib.parse import quote
import shutil
import re

# Optional browser test: python -m pip install playwright && python tests/smoke_lovelace.py
# A Chromium executable must be installed separately.
repo = Path(__file__).resolve().parents[1]
folder=repo/'custom_components/am_lich_viet_nam/frontend'
filenames=['lich-block-am-duong-viet-nam.js','su-kien-am-lich-card.js','lich-block-am-duong-viet-nam-bubble.js','lich-tuan-am-duong-viet-nam.js']
cache={}
def module_uri(name):
    if name in cache:return cache[name]
    src=(folder/name).read_text(encoding='utf-8')
    def repl(m):
        imported=m.group(2)
        return m.group(1)+module_uri(imported.removeprefix('./'))+m.group(3)
    src=re.sub(r"(\bfrom\s+['\"])(\./[^'\"]+\.js)(['\"])",repl,src)
    src=re.sub(r"(\bimport\(\s*['\"])(\./[^'\"]+\.js)(['\"]\s*\))",repl,src)
    uri='data:text/javascript;charset=utf-8,'+quote(src,safe='')
    cache[name]=uri
    return uri

with sync_playwright() as p:
    chromium_path = shutil.which('chromium') or shutil.which('google-chrome') or shutil.which('chromium-browser')
    browser = p.chromium.launch(headless=True, executable_path=chromium_path, args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1400,'height':1000})
    errors=[]
    console_errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.on('console',lambda msg:console_errors.append(msg.text) if msg.type == 'error' else None)
    page.set_content('<!doctype html><html><head><meta charset="utf-8"></head><body style="background:#edf1f6"></body></html>')
    page.evaluate("""() => {if(!customElements.get('home-assistant'))customElements.define('home-assistant',class extends HTMLElement {});window.customCards=[];}""")
    for filename in filenames:
        uri=module_uri(filename)
        print('Loading',filename,'import length',len(uri))
        result=page.evaluate('''async (url) => {try{await import(url);return 'OK'}catch(e){return 'FAILED: '+e.stack}}''',uri)
        print(result[:1500])
    print('Registered:',page.evaluate('window.customCards.map(c=>c.type)'))
    out=page.evaluate('''async () => {
        const names=['lich-block-am-duong-viet-nam','su-kien-am-lich-card','lich-tuan-am-duong-viet-nam','lich-am-duong-bubble'];
        const outputs=[];
        const hass={states:{'sensor.am_lich_hang_ngay':{entity_id:'sensor.am_lich_hang_ngay',state:'Thứ Bảy, 29 Tháng Chín năm Bính Ngọ',attributes:{friendly_name:'Âm lịch hằng ngày',lunar_day:29,lunar_month:9,lunar_year:2026}},'sensor.event_test':{entity_id:'sensor.event_test',state:'10',attributes:{friendly_name:'Sự kiện mẫu',ngay_am_lich_su_kien:'1/1/2026',ngay_duong_lich_hien_tai:'17/02/2026'}}},themes:{darkMode:false},user:{name:'Tester'},config:{time_zone:'Asia/Ho_Chi_Minh',language:'vi'},locale:{language:'vi'},callWS:async()=>({}),callService:async()=>({})};
        for(const name of names){
            try{
                const Card=customElements.get(name), card=document.createElement(name);
                if(!Card)throw Error('CustomElement not registered');
                const cfg=Card.getStubConfig?.()||{};
                card.setConfig(cfg);
                const wrapper=document.createElement('div');wrapper.className='test-card';wrapper.style.width='550px';wrapper.appendChild(card);document.body.appendChild(wrapper);
                card.hass=hass;
                const editor=Card.getConfigElement?.();
                if(editor){editor.setConfig(cfg);editor.hass=hass;}
                outputs.push({name,rendered:!!(card.shadowRoot?.innerHTML || card.innerHTML),editor:!!editor,cardSize:card.getCardSize?.(),grid:card.getGridOptions?.()});
            }catch(e){outputs.push({name,error:String(e),stack:e.stack?.slice(0,900)});}
        }
        return outputs;
    }''')
    page.wait_for_timeout(1000)
    for item in out:print(item)
    print('PAGE ERRORS',errors[:6],'total',len(errors))
    print('CONSOLE ERRORS',console_errors[:6],'total',len(console_errors))
    browser.close()
    if errors or console_errors or any('error' in card or not card['rendered'] or not card['editor'] for card in out):
        raise SystemExit(1)
    print('PASS: all four Lovelace cards and editors rendered without JS errors')
