// Lấy code âm dương từ HO NGOC DUC và https://www.xemlicham.com/
// Phát triển thẻ dành cho Home Assistant của Nguyễn Tiến Khải - khaisilk1910
// Lunar Calendar Custom Card for Home Assistant

import { 
  svg_12congiap, 
  THAP_NHI_TRUC, 
  NHI_THAP_BAT_TU, 
  NGAY_THONG_TIN, 
  CA_DAO_TUC_NGU 
} from './lich-block-am-duong-viet-nam-data.js';

// ---- IMPORT CÁC HÀM XỬ LÝ POPUP TỪ FILE MỚI ----
import { injectPopupDOM, initPopupCore } from './lich-block-am-duong-viet-nam-popup.js?v=2';

(function(){
  'use strict';

  // ===== Utilities =====
  const PI = Math.PI;
  function INT(d){ return Math.floor(d); }


  // ===== Data tables (Hồ Ngọc Đức) =====
  const ABOUT = "Âm lịch Việt Nam Home Assistant - Ver 20Aug2025 © 2025 Nguyễn Tiến Khải";

  const TK19 = [
    0x30baa3, 0x56ab50, 0x422ba0, 0x2cab61, 0x52a370, 0x3c51e8, 0x60d160, 0x4ae4b0, 0x376926, 0x58daa0,
    0x445b50, 0x3116d2, 0x562ae0, 0x3ea2e0, 0x28e2d2, 0x4ec950, 0x38d556, 0x5cb520, 0x46b690, 0x325da4,
    0x5855d0, 0x4225d0, 0x2ca5b3, 0x52a2b0, 0x3da8b7, 0x60a950, 0x4ab4a0, 0x35b2a5, 0x5aad50, 0x4455b0,
    0x302b74, 0x562570, 0x4052f9, 0x6452b0, 0x4e6950, 0x386d56, 0x5e5aa0, 0x46ab50, 0x3256d4, 0x584ae0,
    0x42a570, 0x2d4553, 0x50d2a0, 0x3be8a7, 0x60d550, 0x4a5aa0, 0x34ada5, 0x5a95d0, 0x464ae0, 0x2eaab4,
    0x54a4d0, 0x3ed2b8, 0x64b290, 0x4cb550, 0x385757, 0x5e2da0, 0x4895d0, 0x324d75, 0x5849b0, 0x42a4b0,
    0x2da4b3, 0x506a90, 0x3aad98, 0x606b50, 0x4c2b60, 0x359365, 0x5a9370, 0x464970, 0x306964, 0x52e4a0,
    0x3cea6a, 0x62da90, 0x4e5ad0, 0x392ad6, 0x5e2ae0, 0x4892e0, 0x32cad5, 0x56c950, 0x40d4a0, 0x2bd4a3,
    0x50b690, 0x3a57a7, 0x6055b0, 0x4c25d0, 0x3695b5, 0x5a92b0, 0x44a950, 0x2ed954, 0x54b4a0, 0x3cb550,
    0x286b52, 0x4e55b0, 0x3a2776, 0x5e2570, 0x4852b0, 0x32aaa5, 0x56e950, 0x406aa0, 0x2abaa3, 0x50ab50
  ];

  const TK20 = [
    0x3c4bd8, 0x624ae0, 0x4ca570, 0x3854d5, 0x5cd260, 0x44d950, 0x315554, 0x5656a0, 0x409ad0, 0x2a55d2,
    0x504ae0, 0x3aa5b6, 0x60a4d0, 0x48d250, 0x33d255, 0x58b540, 0x42d6a0, 0x2cada2, 0x5295b0, 0x3f4977,
    0x644970, 0x4ca4b0, 0x36b4b5, 0x5c6a50, 0x466d50, 0x312b54, 0x562b60, 0x409570, 0x2c52f2, 0x504970,
    0x3a6566, 0x5ed4a0, 0x48ea50, 0x336a95, 0x585ad0, 0x442b60, 0x2f86e3, 0x5292e0, 0x3dc8d7, 0x62c950,
    0x4cd4a0, 0x35d8a6, 0x5ab550, 0x4656a0, 0x31a5b4, 0x5625d0, 0x4092d0, 0x2ad2b2, 0x50a950, 0x38b557,
    0x5e6ca0, 0x48b550, 0x355355, 0x584da0, 0x42a5b0, 0x2f4573, 0x5452b0, 0x3ca9a8, 0x60e950, 0x4c6aa0,
    0x36aea6, 0x5aab50, 0x464b60, 0x30aae4, 0x56a570, 0x405260, 0x28f263, 0x4ed940, 0x38db47, 0x5cd6a0,
    0x4896d0, 0x344dd5, 0x5a4ad0, 0x42a4d0, 0x2cd4b4, 0x52b250, 0x3cd558, 0x60b540, 0x4ab5a0, 0x3755a6,
    0x5c95b0, 0x4649b0, 0x30a974, 0x56a4b0, 0x40aa50, 0x29aa52, 0x4e6d20, 0x39ad47, 0x5eab60, 0x489370,
    0x344af5, 0x5a4970, 0x4464b0, 0x2c74a3, 0x50ea50, 0x3d6a58, 0x6256a0, 0x4aaad0, 0x3696d5, 0x5c92e0
  ];

  const TK21 = [
    0x46c960, 0x2ed954, 0x54d4a0, 0x3eda50, 0x2a7552, 0x4e56a0, 0x38a7a7, 0x5ea5d0, 0x4a92b0, 0x32aab5,
    0x58a950, 0x42b4a0, 0x2cbaa4, 0x50ad50, 0x3c55d9, 0x624ba0, 0x4ca5b0, 0x375176, 0x5c5270, 0x466930,
    0x307934, 0x546aa0, 0x3ead50, 0x2a5b52, 0x504b60, 0x38a6e6, 0x5ea4e0, 0x48d260, 0x32ea65, 0x56d520,
    0x40daa0, 0x2d56a3, 0x5256d0, 0x3c4afb, 0x6249d0, 0x4ca4d0, 0x37d0b6, 0x5ab250, 0x44b520, 0x2edd25,
    0x54b5a0, 0x3e55d0, 0x2a55b2, 0x5049b0, 0x3aa577, 0x5ea4b0, 0x48aa50, 0x33b255, 0x586d20, 0x40ad60,
    0x2d4b63, 0x525370, 0x3e49e8, 0x60c970, 0x4c54b0, 0x3768a6, 0x5ada50, 0x445aa0, 0x2fa6a4, 0x54aad0,
    0x4052e0, 0x28d2e3, 0x4ec950, 0x38d557, 0x5ed4a0, 0x46d950, 0x325d55, 0x5856a0, 0x42a6d0, 0x2c55d4,
    0x5252b0, 0x3ca9b8, 0x62a930, 0x4ab490, 0x34b6a6, 0x5aad50, 0x4655a0, 0x2eab64, 0x54a570, 0x4052b0,
    0x2ab173, 0x4e6930, 0x386b37, 0x5e6aa0, 0x48ad50, 0x332ad5, 0x582b60, 0x42a570, 0x2e52e4, 0x50d160,
    0x3ae958, 0x60d520, 0x4ada90, 0x355aa6, 0x5a56d0, 0x462ae0, 0x30a9d4, 0x54a2d0, 0x3ed150, 0x28e952
  ];

  const TK22 = [
    0x4eb520, 0x38d727, 0x5eada0, 0x4a55b0, 0x362db5, 0x5a45b0, 0x44a2b0, 0x2eb2b4, 0x54a950, 0x3cb559,
    0x626b20, 0x4cad50, 0x385766, 0x5c5370, 0x484570, 0x326574, 0x5852b0, 0x406950, 0x2a7953, 0x505aa0,
    0x3baaa7, 0x5ea6d0, 0x4a4ae0, 0x35a2e5, 0x5aa550, 0x42d2a0, 0x2de2a4, 0x52d550, 0x3e5abb, 0x6256a0,
    0x4c96d0, 0x3949b6, 0x5e4ab0, 0x46a8d0, 0x30d4b5, 0x56b290, 0x40b550, 0x2a6d52, 0x504da0, 0x3b9567,
    0x609570, 0x4a49b0, 0x34a975, 0x5a64b0, 0x446a90, 0x2cba94, 0x526b50, 0x3e2b60, 0x28ab61, 0x4c9570,
    0x384ae6, 0x5cd160, 0x46e4a0, 0x2eed25, 0x54da90, 0x405b50, 0x2c36d3, 0x502ae0, 0x3a93d7, 0x6092d0,
    0x4ac950, 0x32d556, 0x58b4a0, 0x42b690, 0x2e5d94, 0x5255b0, 0x3e25fa, 0x6425b0, 0x4e92b0, 0x36aab6,
    0x5c6950, 0x4674a0, 0x31b2a5, 0x54ad50, 0x4055a0, 0x2aab73, 0x522570, 0x3a5377, 0x6052b0, 0x4a6950,
    0x346d56, 0x585aa0, 0x42ab50, 0x2e56d4, 0x544ae0, 0x3ca570, 0x2864d2, 0x4cd260, 0x36eaa6, 0x5ad550,
    0x465aa0, 0x30ada5, 0x5695d0, 0x404ad0, 0x2aa9b3, 0x50a4d0, 0x3ad2b7, 0x5eb250, 0x48b540, 0x33d556
  ];

  const CAN = ["Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý"];
  const CHI = ["Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];
  const CHI_EMOJI = ["🐭","🐂","🐯","🐱","🐲","🐍","🐴","🐐","🐵","🐔","🐶","🐷"];
  const TUAN = ["Chủ Nhật","Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy"];
  const TUAN_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  const GIO_HD = ["110100101100","001101001011","110011010010","101100110100","001011001101","010010110011"]; 

  const TIETKHI = [
    "Xuân Phân","Thanh Minh","Cốc Vũ","Lập Hạ","Tiểu Mãn","Mang Chủng",
    "Hạ Chí","Tiểu Thử","Đại Thử","Lập Thu","Xử Thử","Bạch Lộ",
    "Thu Phân","Hàn lộ","Sương Giáng","Lập đông","Tiểu Tuyết","Đại Tuyết",
    "Đông Chí","Tiểu Hàn","Đại Hàn","Lập Xuân","Vũ Thủy","Kinh Trập"
  ];

  const NGAY_LE_DL = [
    "1/1","9/1","3/2","14/2","26/2","27/2","8/3","20/3","22/3","26/3","31/3","1/4","30/4","1/5","7/5","12/5","19/5","1/6","18/6","21/6","28/6","11/7","27/7","28/7","19/8","2/9","10/9","1/10","10/10","13/10","16/10","17/10","20/10","31/10","9/11","19/11","20/11","23/11","28/11","29/11","1/12","19/12","25/12","22/12"
  ];
  const NGAY_LE_DL_STRING = [
    "Tết Dương lịch","Truyền thống học sinh, sinh viên Việt Nam","Thành lập Đảng Cộng Sản Việt Nam","Lễ tình nhân","Vía Thần Tài","Thầy thuốc Việt Nam","Quốc tế Phụ nữ","Quốc tế Hạnh phúc","Nước sạch Thế giới","Thành lập Đoàn TNCS Hồ Chí Minh","Lễ Phục Sinh","Cá tháng Tư","Giải phóng Miền Nam","Quốc tế Lao động","Chiến thắng Điện Biên Phủ","Ngày của Mẹ","Ngày sinh Chủ tịch Hồ Chí Minh","Quốc tế Thiếu Nhi","Ngày của Cha","Báo chí Việt Nam","Gia đình Việt Nam","Dân số thế giới","Thương binh liệt sĩ","Thành lập công đoàn Việt Nam","Kỷ niệm Cách mạng Tháng 8 thành công","Quốc Khánh","Thành lập Mặt trận Tổ quốc Việt Nam","Quốc tế người cao tuổi","Ngày giải phóng Thủ Đô","Doanh nhân Việt Nam","Ngày Lương thực thế giới","Ngày quốc tế xóa nghèo","Phụ nữ Việt Nam (20.10.1930)","Halloween","Pháp luật Việt Nam","Quốc tế Nam giới","Nhà giáo Việt Nam","Thành lập Hội chữ thập đỏ Việt Nam","Lễ Tạ Ơn","Black Friday","Thế giới phòng chống AIDS","Toàn quốc kháng chiến","Lễ Giáng Sinh","Thành lập Quân đội nhân dân Việt Nam"
  ];
  const NGAY_LE_AL = ["1/1","2/1","3/1","15/1","3/3","10/3","15/4","5/5","7/7","15/7","15/8","9/9","10/10","15/10","23/12"];
  const NGAY_LE_AL_STRING = ["Tết Nguyên Đán | Mùng Một Tết","Mùng 2 Tết","Mùng 3 Tết","Tết Nguyên Tiêu","Tết Hàn Thực, Tiết Thanh Minh","Giỗ tổ Hùng Vương","Lễ Phật Đản","Tết Đoan Ngọ","Lễ Thất Tịch","Lễ Vu Lan","Tết Trung Thu","Tết Trùng Cửu","Tết Trùng Thập","Tết Hạ Nguyên","Ông Táo Về Trời"];

  function getUniqueDailyContent(sourceArray, storageKey = 'cadao_tracker') {
    if (!sourceArray || sourceArray.length === 0) return "";
    const _todayObj = new Date();
    const _dateStr = _todayObj.getFullYear() + "" + (_todayObj.getMonth() + 1) + "" + _todayObj.getDate();
    let storedData;
    try { storedData = JSON.parse(localStorage.getItem(storageKey)) || {}; } 
    catch (e) { storedData = {}; }

    if (storedData.date !== _dateStr) { storedData = { date: _dateStr, shownIndices: [] }; }
    const totalItems = sourceArray.length;
    const availableIndices = [];

    for (let i = 0; i < totalItems; i++) {
        if (!storedData.shownIndices.includes(i)) availableIndices.push(i);
    }

    let _selectedIndex;
    if (availableIndices.length === 0) {
        _selectedIndex = Math.floor(Math.random() * totalItems);
        storedData.shownIndices = [_selectedIndex];
    } else {
        const randomPointer = Math.floor(Math.random() * availableIndices.length);
        _selectedIndex = availableIndices[randomPointer];
        storedData.shownIndices.push(_selectedIndex);
    }

    localStorage.setItem(storageKey, JSON.stringify(storedData));
    let content = sourceArray[_selectedIndex];
    return content ? content.replace(/\n/g, '<br>') : "";
  }

  // ===== Cát tinh / Hung tinh / Thần sát =====
  const CAT_TINH = { "Thiên Đức": "Tốt mọi việc, nhất là cầu tài, cầu phúc", "Nguyệt Đức": "Cưới hỏi, cầu phúc, khai trương", "Thiên Hỷ": "Hỷ sự, cưới hỏi, gặp gỡ", "Tam Hợp": "Mọi việc hanh thông, cầu tài lộc thuận", "Lục Hợp": "Hòa thuận, cưới hỏi, giao dịch" };
  const HUNG_TINH = { "Thiên Cương": "Hung sự, kỵ xây dựng, khai trương", "Địa Tặc": "Kỵ xuất hành, mất mát", "Nguyệt Kỵ": "Ngày xấu, đại kỵ khởi sự lớn", "Không Vong": "Kỵ giao dịch, ký kết", "Tiểu Hồng Sa": "Kỵ cưới hỏi" };

  // ===== Core astronomy helpers =====
  function jdn(dd, mm, yy){
    let a = INT((14 - mm) / 12);
    let y = yy + 4800 - a;
    let m = mm + 12 * a - 3;
    let jd = dd + INT((153*m+2)/5) + 365*y + INT(y/4) - INT(y/100) + INT(y/400) - 32045;
    return jd;
  }

  function jdn2dateFunc(jd){
    let Z, A, alpha, B, C, D, E, dd, mm, yyyy;
    Z = jd;
    if (Z < 2299161) { A = Z; } else { alpha = INT((Z-1867216.25)/36524.25); A = Z + 1 + alpha - INT(alpha/4); }
    B = A + 1524; C = INT((B-122.1)/365.25); D = INT(365.25*C); E = INT((B-D)/30.6001);
    dd = INT(B - D - INT(30.6001*E));
    if (E < 14) mm = E - 1; else mm = E - 13;
    if (mm < 3) yyyy = C - 4715; else yyyy = C - 4716;
    return [dd, mm, yyyy];
  }

  function decodeLunarYear(yy, k){
    let monthLengths = [29,30];
    let regularMonths = new Array(12);
    let offsetOfTet = k >> 17;
    let leapMonth = k & 0xf;
    let leapMonthLength = monthLengths[(k >> 16) & 0x1];
    let solarNY = jdn(1,1,yy);
    let currentJD = solarNY + offsetOfTet;
    let j = k >> 4;
    for (let i=0;i<12;i++){ regularMonths[12 - i - 1] = monthLengths[j & 0x1]; j >>= 1; }
    let ly = [];
    if (leapMonth === 0){
      for (let mm=1; mm<=12; mm++){ ly.push(new LunarDate(1, mm, yy, 0, currentJD)); currentJD += regularMonths[mm-1]; }
    } else {
      for (let mm=1; mm<=leapMonth; mm++){ ly.push(new LunarDate(1, mm, yy, 0, currentJD)); currentJD += regularMonths[mm-1]; }
      ly.push(new LunarDate(1, leapMonth, yy, 1, currentJD)); currentJD += leapMonthLength;
      for (let mm=leapMonth+1; mm<=12; mm++){ ly.push(new LunarDate(1, mm, yy, 0, currentJD)); currentJD += regularMonths[mm-1]; }
    }
    return ly;
  }

  function getYearInfo(yyyy){
    let yearCode;
    if (yyyy < 1900) yearCode = TK19[yyyy - 1800];
    else if (yyyy < 2000) yearCode = TK20[yyyy - 1900];
    else if (yyyy < 2100) yearCode = TK21[yyyy - 2000];
    else yearCode = TK22[yyyy - 2100];
    return decodeLunarYear(yyyy, yearCode);
  }

  function LunarDate(dd, mm, yy, leap, jd){ this.day = dd; this.month = mm; this.year = yy; this.leap = leap; this.jd = jd; }

  const FIRST_DAY = jdn(25,1,1800);
  const LAST_DAY = jdn(31,12,2199);

  function findLunarDate(jd, ly){
    if (jd > LAST_DAY || jd < FIRST_DAY || ly[0].jd > jd) return new LunarDate(0,0,0,0,jd);
    let i = ly.length-1;
    while (jd < ly[i].jd) i--;
    let off = jd - ly[i].jd;
    return new LunarDate(ly[i].day + off, ly[i].month, ly[i].year, ly[i].leap, jd);
  }

  function getLunarDate(dd, mm, yyyy){
    let ly = getYearInfo(yyyy);
    let jd = jdn(dd, mm, yyyy);
    if (jd < ly[0].jd) ly = getYearInfo(yyyy - 1);
    return findLunarDate(jd, ly);
  }

  function SunLongitude(jd){
    let T = (jd - 2451545.0) / 36525;
    let T2 = T*T;
    let dr = PI/180;
    let M = 357.52910 + 35999.05030*T - 0.0001559*T2 - 0.00000048*T*T2;
    let L0 = 280.46645 + 36000.76983*T + 0.0003032*T2;
    let DL = (1.914600 - 0.004817*T - 0.000014*T2)*Math.sin(dr*M);
    DL = DL + (0.019993 - 0.000101*T)*Math.sin(2*dr*M) + 0.000290*Math.sin(3*dr*M);
    let L = (L0 + DL) * dr;
    L = L - PI*2*INT(L/(PI*2));
    return L;
  }
  function getSunLongitude(dayNumber, timeZone){
    return INT(SunLongitude(dayNumber - 0.5 - timeZone/24.0) / PI * 12);
  }

  function getYearCanChi(year){ return CAN[(year+6) % 10] + " " + CHI[(year+8) % 12]; }
  function getCanHour0(jdnv){ return CAN[((jdnv-1)*2) % 10]; }
  
  function getCanChi(lunar){
    let dayName = CAN[(lunar.jd + 9) % 10] + " " + CHI[(lunar.jd+1)%12];
    let monthName = CAN[(lunar.year*12 + lunar.month + 3) % 10] + " " + CHI[(lunar.month+1)%12];
    if (lunar.leap === 1) monthName += " (nhuận)";
    let yearName = getYearCanChi(lunar.year);
    return [dayName, monthName, yearName];
  }

  function getDayName(lunarDate){
    if (lunarDate.day === 0) return "";
    const cc = getCanChi(lunarDate);
    return "Ngày " + cc[0] + ", tháng " + cc[1] + ", năm " + cc[2];
  }

  function getGioHoangDao(jd){
    const chiOfDay = (jd + 1) % 12;
    const gioHD = GIO_HD[chiOfDay % 6];
    let ret = ""; let count = 0;
    for (let i=0; i<12; i++){
      if (gioHD.charAt(i) === '1'){
        ret += CHI[i] + " " + CHI_EMOJI[i] + ' <b style="color: var(--popup-accent);">(' + ((i*2+23)%24) + '-' + ((i*2+1)%24) + 'h)</b>';
        if (count++ < 5) ret += ", ";
      }
    }
    return ret;
  }

  function getGioHacDao(jd){
    const chiOfDay = (jd + 1) % 12;
    const gioHD = GIO_HD[chiOfDay % 6]; 
    let ret = ""; let count = 0;
    for (let i=0; i<12; i++){
      if (gioHD.charAt(i) === '0'){ 
        ret += '<b style="color: var(--color-warn);">' + CHI[i] + '</b>' + " " + CHI_EMOJI[i] + ' <b style="color: var(--color-warn);">(' + ((i*2+23)%24) + '-' + ((i*2+1)%24) + 'h)</b>';
        if (count++ < 5) ret += ", ";
      }
    }
    return ret;
  }

	function getSvgConGiap(chiIndex) {
    const svgString = svg_12congiap[chiIndex] || ""; 
    return svgString.replace('<svg', '<svg style="width: 100%; height: 100%;"');
  }

	function getCanChiNgay(jd) {
		const can = CAN[(jd + 9) % 10];
		const chi = CHI[(jd + 1) % 12];
		return [can, chi];
	}

	const HUONG = { DONG_BAC: "Đông Bắc", TAY_BAC: "Tây Bắc", TAY_NAM: "Tây Nam", CHINH_NAM: "Chính Nam", DONG_NAM: "Đông Nam", CHINH_DONG: "Chính Đông", CHINH_BAC: "Chính Bắc", CHINH_TAY: "Chính Tây" };
	const HY_THAN_RULES = { [HUONG.DONG_BAC]: ["Giáp", "Kỷ"], [HUONG.TAY_BAC]: ["Ất", "Canh"], [HUONG.TAY_NAM]: ["Bính", "Tân"], [HUONG.CHINH_NAM]: ["Đinh", "Nhâm"], [HUONG.DONG_NAM]: ["Mậu", "Quý"] };
	const TAI_THAN_RULES = { [HUONG.DONG_NAM]: ["Giáp", "Ất"], [HUONG.CHINH_DONG]: ["Bính", "Đinh"], [HUONG.CHINH_BAC]: ["Mậu"], [HUONG.CHINH_NAM]: ["Kỷ"], [HUONG.TAY_NAM]: ["Canh", "Tân"], [HUONG.CHINH_TAY]: ["Nhâm"], [HUONG.TAY_BAC]: ["Quý"] };
	
	const HAC_THAN_FREE = new Set(["QuýTỵ", "GiápNgọ", "ẤtMùi", "BínhThân", "ĐinhDậu", "MậuTuất", "KỷHợi", "CanhTý", "TânSửu", "NhâmDần", "QuýMão", "GiápThìn", "ẤtTỵ", "BínhNgọ", "ĐinhMùi", "MậuThân"]);

	const HAC_THAN_MAP = new Map([
		["KỷDậu", HUONG.DONG_BAC], ["CanhTuất", HUONG.DONG_BAC], ["TânHợi", HUONG.DONG_BAC], ["NhâmTý", HUONG.DONG_BAC], ["QuýSửu", HUONG.DONG_BAC], ["GiápDần", HUONG.DONG_BAC],
		["ẤtMão", HUONG.CHINH_DONG], ["BínhThìn", HUONG.CHINH_DONG], ["ĐinhTỵ", HUONG.CHINH_DONG], ["MậuNgọ", HUONG.CHINH_DONG], ["KỷMùi", HUONG.CHINH_DONG],
		["CanhThân", HUONG.DONG_NAM], ["TânDậu", HUONG.DONG_NAM], ["NhâmTuất", HUONG.DONG_NAM], ["QuýHợi", HUONG.DONG_NAM], ["GiápTý", HUONG.DONG_NAM], ["ẤtSửu", HUONG.DONG_NAM],
		["BínhDần", HUONG.CHINH_NAM], ["ĐinhMão", HUONG.CHINH_NAM], ["MậuThìn", HUONG.CHINH_NAM], ["KỷTỵ", HUONG.CHINH_NAM], ["CanhNgọ", HUONG.CHINH_NAM],
		["TânMùi", HUONG.TAY_NAM], ["NhâmThân", HUONG.TAY_NAM], ["QuýDậu", HUONG.TAY_NAM], ["GiápTuất", HUONG.TAY_NAM], ["ẤtHợi", HUONG.TAY_NAM], ["BínhTý", HUONG.TAY_NAM],
		["ĐinhSửu", HUONG.CHINH_TAY], ["MậuDần", HUONG.CHINH_TAY], ["KỷMão", HUONG.CHINH_TAY], ["CanhThìn", HUONG.CHINH_TAY], ["TânTỵ", HUONG.CHINH_TAY],
		["NhâmNgọ", HUONG.TAY_BAC], ["QuýMùi", HUONG.TAY_BAC], ["GiápThân", HUONG.TAY_BAC], ["ẤtDậu", HUONG.TAY_BAC], ["BínhTuất", HUONG.TAY_BAC], ["ĐinhHợi", HUONG.TAY_BAC],
		["MậuTý", HUONG.CHINH_BAC], ["KỷSửu", HUONG.CHINH_BAC], ["CanhDần", HUONG.CHINH_BAC], ["TânMão", HUONG.CHINH_BAC], ["NhâmThìn", HUONG.CHINH_BAC]
	]);

	function getHuongXuatHanh(jd) {
		const cc = getCanChiNgay(jd);
		const can = cc[0];
		const chi = cc[1];
		const canChi = `${can}${chi}`;
		const findDirection = (rules, canNgay) => {
				for (const [direction, cans] of Object.entries(rules)) {
						if (cans.includes(canNgay)) return direction;
				}
				return "Không rõ";
		};
		const hyThan = findDirection(HY_THAN_RULES, can);
		const taiThan = findDirection(TAI_THAN_RULES, can);
		
		let hacThan;
		if (HAC_THAN_FREE.has(canChi)) {
				hacThan = "— Tránh xuất hành hướng Lên Trời gặp Hạc Thần (xấu)";
		} else {
				hacThan = HAC_THAN_MAP.get(canChi) || "Không rõ";
		}
		
		let tot = `Hỷ Thần: <b style="color: var(--color-good);">${hyThan}</b> - Tài Thần: <b style="color: var(--color-good);">${taiThan}</b>`;
		let xau = `Tránh: <b style="color: var(--color-warn);">${hacThan}</b>`;
		return `${tot} | ${xau}`;
	}

  function getThanSat(lunarDate) {
	  const TRUC_ORDER = ["Kiến","Trừ","Mãn","Bình","Định","Chấp","Phá","Nguy","Thành","Thu","Khai","Bế"];
    const st_index = getSunLongitude(lunarDate.jd, 7);
    const month_chi_list = [3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,0,0,1,1,2,2,3];
    const month_chi_index = month_chi_list[st_index];
    const day_chi_index = (lunarDate.jd + 1) % 12;
    const duty_index = (day_chi_index - month_chi_index+12) % 12;
	  const trucName = TRUC_ORDER[duty_index];
	  const trucInfo = THAP_NHI_TRUC[trucName];

    const saoNames = Object.keys(NHI_THAP_BAT_TU);
    const jd_ref = 2451545;
    const mansion_ref_index = 16;
    const day_diff = lunarDate.jd - jd_ref;
    const current_mansion_index = (mansion_ref_index + day_diff) % 28;
    const saoName = saoNames[current_mansion_index];
    const saoInfo = NHI_THAP_BAT_TU[saoName];

		const cc = getCanChi(lunarDate);
		const ngayCC = cc[0];
		const napAm = NGAY_THONG_TIN[ngayCC];
		let thongTin = "";
    if (napAm) {
        let rawString = napAm.moTa + "\n" + napAm.chiTiet.join("\n");
        thongTin = rawString.replace(/\n/g, '<br>');
		} else {
			thongTin = "Không có dữ liệu cho ngày này.";
		}

    const EMOJI_TRUC = {"Kiến":"🚪","Trừ":"✂️","Mãn":"🌕","Bình":"⚖️","Định":"📜","Chấp":"✍️","Phá":"💥","Nguy":"⚠️","Thành":"🏰","Thu":"🌾","Khai":"🔑","Bế":"🔒"};
    const EMOJI_SAO = {"Giác":"🐉","Cang":"🦄","Đê":"🏞️","Phòng":"🏠","Tâm":"❤️","Vĩ":"🦚","Cơ":"🧵","Đẩu":"🛶","Ngưu":"🐂","Nữ":"👩","Hư":"🌫️","Nguy":"⚠️","Thất":"7️⃣","Bích":"💎","Khuê":"📚","Lâu":"🏯","Vị":"🍽️","Mão":"🐇","Tất":"🧦","Chủy":"👄","Sâm":"🌱","Tỉnh":"💧","Quỷ":"👹","Liễu":"🌿","Tinh":"⭐","Trương":"📜","Dực":"🪽","Chẩn":"🩺"};

    return {
      truc: { name: trucName, info: trucInfo, emoji: EMOJI_TRUC[trucName] || "" },
      sao: { name: saoName, info: saoInfo, emoji: EMOJI_SAO[saoName] || "" },
      napAm: thongTin
    };
  }

  // ===== SVG Tết Config =====
  const basePath = "/local/images/lich-block-am-duong-viet-nam";
  const styleIMG = 'style="width:100%; height:100%;"';
  const getImg = (path) => `<img src="${basePath}/${path}" ${styleIMG}>`;
  const svg_tet = [getImg("dao.png"), getImg("mai.png")];
  const generateList = (side, count) => Array.from({ length: count }, (_, i) => getImg(`${side}/${side} (${i + 1}).png`));
  const svg_tet_left = generateList("left", 24);
  const svg_tet_right = generateList("right", 24);

  const DAYNAMES = ["T2","T3","T4","T5","T6","T7","CN"];
  const PRINT_OPTS = { fontSize: "13pt", tableWidth: "100%" };

  // ==========================================
  // HÀM PRINTSTYLE
  // ==========================================
  function printStyle(){
    let res = "";
    res += '<style>\n';
    res += `
      :host { 
        display: block; 
        --lc-text-main: var(--user-text-main, #ffffff);          
        --lc-text-accent: var(--user-text-accent, #ffff99);        
        --lc-saturday-color: var(--user-saturday-color, #00e600);     
        --lc-sunday-color: var(--user-sunday-color, #ff3333);       
        --lc-holiday-color: var(--user-holiday-color, var(--user-sunday-color));
        --lc-cadao-color: var(--user-cadao-color, var(--user-text-accent));
        --lc-bg-overlay: var(--user-bg-overlay, rgba(255, 255, 255, 0.18)); 
        --lc-bg-overlay-hover: var(--user-bg-overlay-hover, rgba(255, 255, 255, 0.25));
        --lc-border-color: rgba(255, 255, 255, 0.15);
        --lc-text-shadow-heavy: var(--user-text-shadow-heavy, 0 6px 10px rgba(0,0,0,0.28));
        --lc-text-shadow-light: var(--user-text-shadow-light, 0 1px 3px rgba(0,0,0,0.3));
        --lc-tet-bg: #ff3333;             
        --lc-tet-text-solar: #ffffff;     
        --lc-tet-text-lunar: #ffff99;     
        --lc-today-bg: rgba(255, 255, 255, 0.15);
        --lc-element-shadow: var(--user-element-shadow, 0 2px 8px rgba(0,0,0,0.12), inset 0 0.4px 0 rgba(255,255,255,0.35));
      }
      
      .lunar-card { position: relative; isolation: isolate; container-type: inline-size; }
      
      .tet_cell { background-color: var(--lc-tet-bg) !important; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); }
      .tet_cell .t2t6, .tet_cell .t7, .tet_cell .cn { color: var(--lc-tet-text-solar) !important; font-weight: bold; }
      .tet_cell .am, .tet_cell .am2 { color: var(--lc-tet-text-lunar) !important; }
      .td_tet_left { line-height: 0.9; align-items: flex-end; justify-content: center; position: relative; overflow: visible; }
      .show_left_tet { position: absolute; left: 50%; transform: translateX(-50%); bottom: -11px; display: flex; width: 85%; align-items: flex-end; justify-content: center; z-index: 3; }
      .td_tet_right { line-height: 0.9; align-items: flex-end; justify-content: center; position: relative; overflow: visible; }
      .show_right_tet { position: absolute; left: 50%; transform: translateX(-50%); bottom: -11px; display: flex; width: 75%; align-items: flex-end; justify-content: center; z-index: 3; }
      
      .show_mai_tet { position: absolute; top: 0; left: 0; display: flex; text-align: center; width: clamp(40px, 15cqi, 140px); align-items: center; justify-content: center; z-index: 3; }
      .show_dao_tet { position: absolute; top: 0; right: 0; display: flex; text-align: center; width: clamp(40px, 15cqi, 140px); align-items: center; justify-content: center; z-index: 3; }
      .show_dao_tet { transform-box: fill-box; transform-origin: 100px 20px; animation: lanternSwingSoft 4s ease-in-out infinite; }
      .show_mai_tet { transform-box: fill-box; transform-origin: 0% 35%; animation: lanternSwingSoft 4s ease-in-out infinite; }
      .show_mai_tet img, .show_dao_tet img, .show_right_tet img, .show_left_tet img { margin: 0 auto; display: block; height: auto !important; max-height: 70vh !important; max-width: 100% !important; width: auto !important; }
      
      /* Reset bảng để kiểm soát padding tốt hơn */
      .thang { font-size:${PRINT_OPTS.fontSize}; padding: 0; line-height: 1.2; font-family:Tahoma,Verdana,Arial; table-layout:fixed; background-color:transparent; border-collapse: collapse; border-spacing: 0; }
      .thang td { padding: 0; }
      
      .ngan_cach { font-family: 'Be Vietnam Pro', sans-serif; color: var(--user-element-base-color, #ffffff); opacity: 0.9; font-size: clamp(8px, 3cqi, 16px); text-align:center; padding: 0 4px; }
      .phan_cach { font-family: 'Be Vietnam Pro', sans-serif; color: var(--user-element-base-color, #ffffff); opacity: 0.9; vertical-align: middle; text-align:center; font-size: clamp(8px, 3cqi, 16px); padding: clamp(8px, 2.5cqi, 16px) 0; }
      .nam_top { font-family: 'Bebas Neue', sans-serif; padding: 0 1cqi; color: var(--lc-text-main); font-size: clamp(16px, 6cqi, 32px); font-weight:bold; text-align:center; text-shadow: var(--lc-text-shadow-light); }
      .thang_top, .thang_top_EN { font-family: 'Be Vietnam Pro', sans-serif; color: var(--lc-text-main); font-size: clamp(11px, 4cqi, 20px); line-height:120%; border-top-left-radius: 16px; border-top-right-radius: 16px; padding-top: 3cqi; position: relative; overflow: visible; }
      .thang_top { text-align:right; }
      .thang_top_EN { text-align:left; }
      
      /* Ngày Dương Lịch: Tinh chỉnh lại tỷ lệ vàng */
      .todayduonglich { color: var(--lc-text-main); font-family:'Bebas Neue', sans-serif; text-align:center; font-size: clamp(70px, 35cqi, 180px); line-height: 0.85; letter-spacing: 2px; font-weight: 600; text-shadow: var(--lc-text-shadow-heavy); position: relative; overflow: visible; cursor: pointer; padding: clamp(10px, 4cqi, 20px) 0; }
      
      /* Ca dao, lễ tết: Tỷ lệ margin, padding và font đẹp hơn */
      .thongtin_letet { font-family: 'Playfair Display', serif; color: var(--lc-holiday-color); line-height: 1.35; padding: clamp(6px, 2cqi, 12px) clamp(10px, 3cqi, 20px); margin: clamp(8px, 2.5cqi, 16px) auto; text-align:center; font-size: clamp(10px, 3.5cqi, 16px); letter-spacing: 0.5px; background: var(--lc-bg-overlay); border-radius:14px; border:0.4px solid var(--lc-border-color); box-shadow: var(--lc-element-shadow); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); text-shadow: var(--lc-text-shadow-light); font-weight: 500; width: fit-content; max-width: 90%; }
      .cadaotucngu { font-family: 'Playfair Display', serif; font-style:italic; color: var(--lc-cadao-color); line-height: 1.35; padding: clamp(6px, 2cqi, 12px) clamp(10px, 3cqi, 20px); margin: clamp(8px, 2.5cqi, 16px) auto; text-align:center; font-size: clamp(10px, 3.5cqi, 16px); letter-spacing: 0.5px; background: var(--lc-bg-overlay); border-radius:14px; border:0.4px solid var(--lc-border-color); box-shadow: var(--lc-element-shadow); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); text-shadow: var(--lc-text-shadow-light); width: fit-content; max-width: 95%; }
      
      /* Thứ trong tuần */
      .thutrongtuan, .thutrongtuan_EN { font-family: 'Playfair Display', serif; color: var(--lc-text-main); background: var(--lc-bg-overlay); box-shadow: var(--lc-element-shadow); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); text-align:center; vertical-align: middle; font-size: clamp(11px, 4.5cqi, 22px); line-height: 1.2; font-weight:bold; padding: clamp(4px, 1.5cqi, 10px); text-shadow: var(--lc-text-shadow-light); position: relative; z-index: 1;}
      .thutrongtuan { margin-right: 2px; border-bottom-right-radius: 16px; border-top-right-radius: 16px; }
      .thutrongtuan_EN { margin-left: 2px; border-bottom-left-radius: 16px; border-top-left-radius: 16px; }
      
      .svg_td { text-align:center; width:clamp(35px, 12cqi, 70px); position: relative; z-index: 5; transition: z-index 0.1s; }
      .svg_td:hover { z-index: 50; }
      .svg_circle_divider { width: 100%; aspect-ratio: 1/1; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto; background: var(--lc-bg-overlay); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); border: 1px solid var(--lc-border-color); box-shadow: var(--lc-element-shadow); position: relative; z-index: 2; overflow: visible; transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); }
      .svg-cell { width: 90%; height: 90%; object-fit: contain; display: flex; align-items: center; justify-content: center; transform-origin: bottom center; will-change: transform; transition: scale 0.3s ease; scale: 1; animation: popup-bouncy 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, wiggle-continuous 3s ease-in-out 0.8s infinite; position: relative; z-index: 3;}
      
      [data-hover="neon"] .svg_circle_divider:hover { transform: scale(1.08); background: rgba(255, 200, 0, 0.15); border-color: rgba(255, 200, 0, 0.9); box-shadow: 0 0 15px rgba(255, 200, 0, 0.6), 0 0 30px rgba(255, 200, 0, 0.4), inset 0 0 12px rgba(255, 200, 0, 0.4); z-index: 10; }
      [data-hover="glass"] .svg_circle_divider:hover { transform: translateY(-4px) scale(1.05); background: var(--lc-bg-overlay-hover); border: 1px solid rgba(255, 255, 255, 0.8); box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.8); z-index: 10; }
      [data-hover="aura"] .svg_circle_divider:hover { transform: scale(1.05); background: rgba(255, 255, 255, 0.25); border-color: #ffca28; box-shadow: 0 0 0 4px rgba(255, 200, 0, 0.25), 0 0 20px rgba(255, 200, 0, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.5); z-index: 10; }
      [data-hover="cyber"] .svg_circle_divider:hover { transform: scale(1.1); background: var(--lc-bg-overlay-hover); border: 2px solid #00f2fe; box-shadow: 0 0 15px #00f2fe, inset 0 0 10px rgba(0, 242, 254, 0.5); z-index: 10; }
      [data-hover="spin"] .svg_circle_divider:hover { transform: scale(1.1) rotate(360deg); background: rgba(255, 200, 0, 0.1); border-color: #ff9800; box-shadow: 0 0 20px rgba(255, 152, 0, 0.6); z-index: 10; }
      @keyframes heartbeatHover { 0% { transform: scale(1); } 25% { transform: scale(1.15); box-shadow: 0 0 20px #ff3333; } 50% { transform: scale(1.05); } 75% { transform: scale(1.15); box-shadow: 0 0 25px #ff3333; } 100% { transform: scale(1.1); box-shadow: 0 0 15px #ff3333; } }
      [data-hover="pulse"] .svg_circle_divider:hover { animation: heartbeatHover 1s infinite alternate; border-color: #ff3333; background: rgba(255, 51, 51, 0.1); z-index: 10; }
      @keyframes floatHover { 0% { transform: translateY(0px) scale(1.05); } 50% { transform: translateY(-6px) scale(1.05); box-shadow: 0 10px 15px rgba(0,255,255,0.4); } 100% { transform: translateY(0px) scale(1.05); } }
      [data-hover="float"] .svg_circle_divider:hover { animation: floatHover 2s infinite ease-in-out; border-color: #00f2fe; background: var(--lc-bg-overlay-hover); z-index: 10; }
      [data-hover="ring"] .svg_circle_divider:hover { transform: scale(1.05); box-shadow: 0 0 0 3px var(--lc-bg-overlay), 0 0 0 6px #ff9800, 0 0 15px rgba(255, 152, 0, 0.5); border-color: transparent; background: var(--lc-bg-overlay-hover); z-index: 10; }
      [data-hover="morph"] .svg_circle_divider:hover { transform: scale(1.1); border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; background: linear-gradient(135deg, rgba(255,200,0,0.3), rgba(255,100,0,0.3)); border-color: #ff9800; box-shadow: 0 5px 15px rgba(255,152,0,0.5); z-index: 10; }
      [data-hover="flash"] .svg_circle_divider:hover { transform: scale(1.12); background: rgba(255, 255, 255, 0.4); border: 2px solid #fff; box-shadow: 0 0 25px #fff, 0 0 40px #fff; transition: all 0.15s ease-out; z-index: 10; }
      
      @keyframes popup-bouncy { 0% { transform: translateY(110%); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
      @keyframes wiggle-continuous { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-5deg); } 75% { transform: rotate(5deg); } }
      
      /* Tháng âm lịch, năm âm lịch */
      .thang_am_lich, .nam_am_lich { position: relative; overflow: visible; color: var(--lc-text-accent); width: clamp(120px, 60%, 250px); font-family: 'Playfair Display', serif; background: var(--lc-bg-overlay); box-shadow: var(--lc-element-shadow); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); text-align:center; vertical-align: middle; font-size: clamp(11px, 4cqi, 18px); line-height: 1.2; font-weight:bold; padding: clamp(4px, 1.5cqi, 10px); margin: clamp(10px, 3cqi, 20px) auto; border-radius: 8px; text-shadow: var(--lc-text-shadow-light); }
      
      /* Ngày Âm Lịch (số to) */
      .ngayamlich { color: var(--lc-text-accent); font-family: 'Playfair Display', serif; text-align:center; vertical-align: middle; font-size: clamp(45px, 22cqi, 100px); letter-spacing: 2px; line-height: 0.9; font-weight: 600; text-shadow: var(--lc-text-shadow-heavy); margin: clamp(8px, 2cqi, 15px) auto; cursor: pointer; }
      
      /* Label và Value của Ngày/Tháng/Giờ/Tiết (Dưới cùng) */
      .ThangNgayGioTiet_before { font-family:'Bebas Neue', sans-serif; font-style:italic; color: var(--lc-text-main); text-align:center; font-size: clamp(8px, 2.5cqi, 12px); padding: 0; margin: 2px auto; opacity: 0.85; text-shadow: var(--lc-text-shadow-light); text-transform: uppercase; letter-spacing: 0.5px;}
      .ThangNgayGioTiet_after { font-family: 'Playfair Display', serif; color: var(--lc-text-accent); text-align:center; font-size: clamp(10px, 3.5cqi, 18px); font-weight:bold; padding: 0; margin: 2px auto clamp(8px, 2.5cqi, 16px) auto; text-shadow: var(--lc-text-shadow-light);}
      
      /* Nút chức năng & Lịch con */
      .toggle-btn { display:block; width:100%; border:none; padding: clamp(4px, 1.5cqi, 10px) 0; border-radius:6px; cursor:pointer; font-weight:bold; font-size: clamp(10px, 3cqi, 14px); transition:all 0.3s ease; margin: 0; }
      .toggle-btn-container { padding: 0; margin: 0 auto clamp(10px, 3cqi, 20px) auto; }
      .toggle-content { display:none; opacity:0; transform: translateY(-10px); transition: opacity 0.4s ease, transform 0.4s ease; }
      .toggle-content.show { display:table-row; opacity:1; transform: translateY(0); }
      .navi-l,.navi-r{ color: var(--lc-text-main); text-align:center; font-size: clamp(10px, 3.5cqi, 16px); line-height:100%; font-weight:bold; padding: clamp(4px, 1.5cqi, 8px) 0; border-bottom: 1px solid var(--lc-border-color) !important;}
      .nav-btn { color: var(--lc-text-main); border: none; padding: clamp(4px, 1cqi, 8px) clamp(8px, 2.5cqi, 16px); border-radius: 6px; cursor: pointer; font-weight: bold; background: transparent !important;}
      .tenthang { text-align:center; font-size: clamp(12px, 4.5cqi, 18px); line-height:100%; font-weight:bold; padding: clamp(4px, 1.5cqi, 8px) 0; border-bottom: 1px solid var(--lc-border-color) !important; color: var(--lc-text-main) !important;}
      
      .ngaytuan, .ngaytuan_t7, .ngaytuan_cn { width:14%; text-align:center; font-size: clamp(9px, 3cqi, 14px); padding: clamp(6px, 2cqi, 12px) 0; border-bottom: 1px solid var(--lc-border-color) !important;}
      .ngaytuan_t7 { color: var(--lc-saturday-color); }
      .ngaytuan_cn { color: var(--lc-sunday-color); }
      .ngaythang { padding-top: clamp(6px, 2cqi, 12px); padding-bottom: clamp(6px, 2cqi, 12px); background: transparent !important; cursor: pointer; }
      .am, .am2 { color: var(--lc-text-accent) !important; font-weight: bold !important; text-align:right; padding-right:3px; font-size: clamp(8px, 2.5cqi, 11px); }
      .t2t6 { text-align:center; font-size: clamp(12px, 4cqi, 18px); color: var(--lc-text-main) !important;}
      .t7 { color: var(--lc-saturday-color); text-align:center; font-size: clamp(12px, 4cqi, 18px); }
      .cn { color: var(--lc-sunday-color); text-align:center; font-size: clamp(12px, 4cqi, 18px); }
      td.homnay { font-weight:bold; background: var(--lc-today-bg) !important; border-radius: 8px; }
      
      .year-svg-container { position: absolute; top: -36px; width: 35px; height: 35px; animation: marquee-horizontal 8s ease-in-out infinite; overflow: visible; }
      .year-svg-container::after { content: ''; position: absolute; bottom: -2px; left: 15%; width: 70%; height: 4px; background: rgba(0, 0, 0, 0.25); border-radius: 50%; filter: blur(2px); z-index: -1; animation: shadow-pulse 0.5s infinite alternate; }
      .year-svg-container::before { content: ''; position: absolute; bottom: 2px; right: -5px; width: 4px; height: 4px; border-radius: 50%; background: rgba(255, 255, 255, 0.6); box-shadow: -5px -2px 0 -1px rgba(255, 255, 255, 0.4), -3px 5px 0 -1px rgba(255, 255, 255, 0.5); animation: dust-trail 0.6s infinite linear; z-index: -2; opacity: 0; }
      @keyframes marquee-horizontal { 0% { left: 0%; transform: scaleX(-1); } 49.9% { left: calc(100% - 35px); transform: scaleX(-1); } 50% { left: calc(100% - 35px); transform: scaleX(1); } 100% { left: 0%; transform: scaleX(1); } }
      @keyframes dust-trail { 0% { transform: translate(0, 0) scale(1); opacity: 0.8; } 100% { transform: translate(15px, -5px) scale(0.2); opacity: 0; } }
      @keyframes shadow-pulse { from { transform: scaleX(1); opacity: 0.25; } to { transform: scaleX(1.2); opacity: 0.15; } }
      
      .lunar-card > div:first-child, .thang_top, .giohoangdao, .viecnenlam, .viecnentranh,
      .cat_tinh, .hung_tinh, .tenthang, .navi-l, .navi-r, .ngaytuan, .ngaytuan_t7,
      .ngaytuan_cn, .ngaythang, .tet, .nav-btn, .toggle-btn { background: transparent !important; }
      .thang_top, .t2t6, .tenthang, .navi-r, .ngaytuan, .toggle-btn, .viecnenlam b, .viecnentranh b,
      .cat_tinh b, .hung_tinh b, .giohoangdao { color: var(--lc-text-main) !important; }
      .nav-btn:hover, .toggle-btn:hover, .ngaythang:hover { background-color: var(--lc-bg-overlay-hover) !important; border-radius: 8px;}
      .todayduonglich:hover, .ngayamlich:hover { color: rgba(255, 255, 0, 1) !important; text-shadow: 0 8px 16px rgba(255, 200, 0, 0.5)!important; }
      .svg-cell:hover { scale: 1.9; }
      .show_dao_tet:hover, .show_mai_tet:hover { animation: lanternSwingStrong 1.2s ease-in-out infinite; }
      @keyframes lanternSwingSoft { 0% { transform: rotate(0deg); } 25% { transform: rotate(1.5deg); } 50% { transform: rotate(-1.5deg); }75% { transform: rotate(1deg); } 100% { transform: rotate(0deg); } }
      @keyframes lanternSwingStrong { 0% { transform: rotate(0deg); } 20% { transform: rotate(6deg); } 40% { transform: rotate(-5deg); } 60% { transform: rotate(4deg); } 80% { transform: rotate(-3deg); } 100% { transform: rotate(0deg); } }
    `;
    res += '</style>';
    return res;
  }

  function printHead(mm, yy, extraClass){
    if (typeof extraClass === 'undefined') {
         extraClass = (typeof window.isCalendarExpanded !== 'undefined' && window.isCalendarExpanded) ? ' show' : '';
    }
    let res = "";
    const monthName = mm+" | "+yy;
    res += `<tr class="toggle-content${extraClass}"><td colspan="2" class="navi-l"><button id="prev-year" class="nav-btn">&lt;&lt;</button>  <button id="prev-month" class="nav-btn">&lt;</button></td>`;
    res += `<td colspan="3" class="tenthang"><button id="reset-today" style="all:unset; cursor:pointer;" class="nav-btn">${monthName}</button></td>`;
    res += `<td colspan="2" class="navi-r"><button id="next-month" class="nav-btn">&gt;</button><button id="next-year" class="nav-btn">&gt;&gt;</button></td></tr>`;
    res += `<tr class="toggle-content${extraClass}">`;
    for (let i=0;i<=6;i++){
      if (DAYNAMES[i]==='CN') res += '<td class="ngaytuan_cn">CN</td>';
      else if (DAYNAMES[i]==='T7') res += '<td class="ngaytuan_t7">T7</td>';
      else res += `<td class="ngaytuan">${DAYNAMES[i]}</td>`;
    }
    res += '</tr>';
    return res;
  }

  function printEmptyCell(){
    return '<td class="ngaythang"><div class="cn">&nbsp;</div><div class="am">&nbsp;</div></td>';
  }

  function printCell(lunarDate, solarDate, solarMonth, solarYear, today, config){
    let cellClasses = ["ngaythang"];
    let solarClass = "t2t6";
    let lunarClass = "am";

    const dow = (lunarDate.jd + 1) % 7;
    if (dow === 0){ solarClass = "cn"; }
    else if (dow === 6){ solarClass = "t7"; }

    if (solarDate === today.getDate() && solarMonth === (today.getMonth()+1) && solarYear === today.getFullYear()){
      cellClasses.push("homnay");
    }
    if (lunarDate.month === 1 && lunarDate.day >= 1 && lunarDate.day <= 3){
      cellClasses.push("tet_cell");
    }
    if (lunarDate.leap === 1){ lunarClass = "am2"; }

    let lunar = lunarDate.day;
    if (solarDate === 1 || lunar === 1){ lunar = `${lunarDate.day}/${lunarDate.month}`; }

    let title = getDayName(lunarDate);
    let finalCellClass = cellClasses.join(" ");

    const pTheme = config.popup_theme || 'default';
    const pOpacity = config.popup_opacity !== undefined ? config.popup_opacity : 95;

    return `<td class="${finalCellClass}" title="${title}" onclick="window.haShowDayPopup(${solarDate},${solarMonth},${solarYear}, '${pTheme}', ${pOpacity})">`+
      `<div class="${solarClass}">${solarDate}</div>`+
      `<div class="${lunarClass}">${lunar}</div>`+
      `</td>`;
  }

  if (typeof window.isCalendarExpanded === 'undefined') {
      window.isCalendarExpanded = false;
  }

  function printTable(mm, yy, today, config){
    const jd = jdn(today.getDate(), mm, yy);
    const currentMonthArr = getMonth(mm, yy);
    if (currentMonthArr.length === 0) return "";
    const ld1 = currentMonthArr[0];
    const emptyCells = (ld1.jd + 0) % 7;

    const currentLunarDate = getLunarDate(today.getDate(), mm, yy);
    let res = "";

    const extraClass = window.isCalendarExpanded ? ' show' : '';
    const btnText = window.isCalendarExpanded ? 'Thu gọn 🔼' : 'Xem lịch tháng 🔽';

    const pTheme = config.popup_theme || 'default';
    const pOpacity = config.popup_opacity !== undefined ? config.popup_opacity : 95;

    res += `<div style="border-radius: 16px;">`;
    res += `<table class="thang" border="0" width="${PRINT_OPTS.tableWidth}">`;

    const showthangarray_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const monthNameEN = showthangarray_EN[mm - 1];
    res += `<tr><td colspan="7">`;
	res += `<div style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; width: 100%;">`;
    res += `<div class="thang_top" style="text-align: right; padding-right: 8px;">Tháng ${mm} <span class="ngan_cach">❖</span>`;
    if ((currentLunarDate.month === 12 && currentLunarDate.day >= 23) || (currentLunarDate.month === 1 && currentLunarDate.day <= 3)) {
        const maiImg = svg_tet[1];
        if (maiImg) res += `<div class="show_mai_tet">${maiImg}</div>`;
    }
    res += `</div>`;
    res += `<div class="nam_top">${yy}</div>`;
    res += `<div class="thang_top_EN" style="text-align: left; padding-left: 8px;"><span class="ngan_cach">❖</span> ${monthNameEN}`;
    if ((currentLunarDate.month === 12 && currentLunarDate.day >= 23) || (currentLunarDate.month === 1 && currentLunarDate.day <= 3)) {
        const tetFlower = svg_tet[0];
        if (tetFlower) res += `<div class="show_dao_tet">${tetFlower}</div>`;
    }
	res += `</div></div></td></tr>`;

    res += `<tr><td colspan="7" class="phan_cach">──────  ⟡  ──────</td></tr>`;

    res += `<tr>`;
    let res_left = "";
    let res_right = "";
    if (mm === 2 && today.getDate() === 26) {
      res_right = `<div class="show_right_tet"><img src="/local/images/lich-block-am-duong-viet-nam/thantai_right.png" style="width:100%; height:100%;"></div>`;
      res_left = `<div class="show_left_tet"><img src="/local/images/lich-block-am-duong-viet-nam/thantai_left.png" style="width:100%; height:100%;"></div>`;
    }
    if ((currentLunarDate.month === 12 && currentLunarDate.day >= 23) || (currentLunarDate.month === 1 && currentLunarDate.day <= 3)) {
      const idxLeft = Math.floor(Math.random() * svg_tet_left.length);
      const imgLeft = svg_tet_left[idxLeft];
      if (imgLeft) res_left = `<div class="show_left_tet">${imgLeft}</div>`;
      const idxRight = Math.floor(Math.random() * svg_tet_right.length);
      const imgRight = svg_tet_right[idxRight];
      if (imgRight) res_right = `<div class="show_right_tet">${imgRight}</div>`;
    }
    res += `<td colspan="2" class="td_tet_left">${res_left}</td>`;
    res += `<td colspan="3"><div class="todayduonglich" title="Nhấp xem thêm chi tiết" onclick="window.haShowDayPopup(${today.getDate()},${mm},${yy}, '${pTheme}', ${pOpacity})">${today.getDate()}</div></td>`;
    res += `<td colspan="2" class="td_tet_right">${res_right}</td>`;
    res += `</tr>`;

    let noiDungLe = "";
    if (currentLunarDate.day === 1) noiDungLe = `Mùng Một`;
    else if (currentLunarDate.day === 15) noiDungLe = `Ngày Rằm`;

    const d_m = `${today.getDate()}/${mm}`;
    const idxDL = NGAY_LE_DL.indexOf(d_m);
    const infoDL = idxDL !== -1 ? NGAY_LE_DL_STRING[idxDL] : "";

    const d_m_al = `${currentLunarDate.day}/${currentLunarDate.month}`;
    const idxAL = NGAY_LE_AL.indexOf(d_m_al);
    const infoAL = idxAL !== -1 ? NGAY_LE_AL_STRING[idxAL] : "";

    let displayArray = [];
    if (noiDungLe) displayArray.push(noiDungLe);
    if (infoDL) displayArray.push(infoDL);
    if (infoAL) displayArray.push(infoAL);

    if (displayArray.length > 0) {
        res += `<tr><td colspan="7"><div align="center"><div class="thongtin_letet">${displayArray.join(" | ")}</div></div></td></tr>`;
    }

    res += `<tr><td colspan="7"><div align="center"><div class="cadaotucngu">${getUniqueDailyContent(CA_DAO_TUC_NGU)}</div></div></td></tr>`;

    const lunarDayIndex = (currentLunarDate.jd + 1) % 12;
    const lunarMonthIndex = (currentLunarDate.month + 1) % 12;
    const lunarYearIndex = (currentLunarDate.year + 8) % 12;
    const svgNgay = getSvgConGiap(lunarDayIndex);
    const svgThang = getSvgConGiap(lunarMonthIndex);
    const svgNam = getSvgConGiap(lunarYearIndex);

    const dayIndex = (currentLunarDate.jd + 1) % 7;
    let styleColor = "";
    if (dayIndex === 0) styleColor = 'style="color: var(--lc-sunday-color);"'; 
    else if (dayIndex === 6) styleColor = 'style="color: var(--lc-saturday-color);"'; 

    res += `<tr >
      <td colspan="3"><div class="thutrongtuan" ${styleColor}>${TUAN[(currentLunarDate.jd + 1) % 7]}</div></td>
      <td class="svg_td" >
        <div class="svg_circle_divider"><span class="svg-cell" title="Ngày ${CAN[(jd + 9) % 10]} ${CHI[(jd+1)%12]}">${svgNgay}</span></div>
      </td>
      <td colspan="3"><div class="thutrongtuan_EN" ${styleColor}>${TUAN_EN[(currentLunarDate.jd + 1) % 7]}</div></td>
    </tr>`;

    const showthangarray = ["Tháng Giêng","Tháng Hai","Tháng Ba","Tháng Tư","Tháng Năm","Tháng Sáu","Tháng Bảy","Tháng Tám","Tháng Chín","Tháng Mười","Tháng Mười Một","Tháng Chạp"];
    let thangAm = showthangarray[currentLunarDate.month-1] || ("Tháng " + currentLunarDate.month);
    if (currentLunarDate.leap===1) thangAm += " (Nhuận)";
    const ly = getYearInfo(currentLunarDate.year);
    let daysInLunarMonth = 0;
    for (let i = 0; i < ly.length; i++) {
      if (ly[i].month === currentLunarDate.month && ly[i].leap === currentLunarDate.leap) {
          if (i < ly.length - 1) daysInLunarMonth = ly[i+1].jd - ly[i].jd;
          else {
              const lyNext = getYearInfo(currentLunarDate.year + 1);
              if (lyNext && lyNext.length > 0) daysInLunarMonth = lyNext[0].jd - ly[i].jd;
              else daysInLunarMonth = 30; 
          }
          break;
      }
    }
    if (daysInLunarMonth === 29) { thangAm += " (T)"; } else if (daysInLunarMonth === 30) { thangAm += " (Đ)"; }
    res += `<tr><td colspan="7"><div class="thang_am_lich"> ${thangAm}</div></td></tr>`;

    res += `<tr>`;
    res += `<td width="25%" colspan="2">`;
    res += `<div class="ThangNgayGioTiet_before">─⟡ Ngày ⟡─</div><div class="ThangNgayGioTiet_after">${CAN[(jd + 9) % 10]} ${CHI[(jd+1)%12]}</div>`;
    res += `<div class="ThangNgayGioTiet_before">─⟡ Tháng ⟡─</div><div class="ThangNgayGioTiet_after">${getMonthCanChi(currentLunarDate)}</div>`;
    res += `</td>`;

    res += `<td width="50%" colspan="3" >`;
    res += `<div class="ngayamlich" title="Nhấp xem thêm chi tiết" onclick="window.haShowDayPopup(${today.getDate()},${mm},${yy}, '${pTheme}', ${pOpacity})">${currentLunarDate.day}</div>`;
    res += `</td>`;

    res += `<td width="25%" colspan="2">`;
    res += `<div class="ThangNgayGioTiet_before">─⟡ Giờ đầu ⟡─</div><div class="ThangNgayGioTiet_after">${getCanHour0(jd)} ${CHI[0]}</div>`;
    res += `<div class="ThangNgayGioTiet_before">─⟡ Tiết ⟡─</div><div class="ThangNgayGioTiet_after">${TIETKHI[getSunLongitude(jd+1, 7.0)]}</div>`;
    res += `</td>`;
    res += `</tr>`;

    res += `<tr><td colspan="7"><div class="thang_am_lich">${getYearCanChi(currentLunarDate.year)}<span class="year-svg-container">${svgNam}</span></div></td></tr>`;

    res += `<tr><td colspan="7" class="toggle-btn-container">
      <button class="toggle-btn" onclick="
        const rows = [...this.closest('table').querySelectorAll('.toggle-content')];
        const isHidden = rows.every(r => !r.classList.contains('show'));
        window.isCalendarExpanded = isHidden;
        rows.forEach((r, i) => {
          setTimeout(() => {
            if(isHidden){ r.classList.add('show'); } else { r.classList.remove('show'); }
          }, i * 100);
        });
        this.innerHTML = isHidden ? 'Thu gọn 🔼' : 'Xem lịch tháng 🔽';
      ">${btnText}</button>
    </td></tr>`;

    res += printHead(mm, yy, extraClass); 

    for (let i=0;i<6;i++){
      res += `<tr class="toggle-content${extraClass}">`;
      for (let j=0;j<7;j++){
        let k = 7*i + j;
        if (k < emptyCells || k >= emptyCells + currentMonthArr.length){
          res += printEmptyCell();
        } else {
          let solar = k - emptyCells + 1;
          let ld1c = currentMonthArr[k - emptyCells];
          res += printCell(ld1c, solar, mm, yy, today, config);
        }
      }
      res += '</tr>';
    }

    res += '</table></div>';
    return res;
  }

  function getMonth(mm, yy){
    let mm1, yy1;
    if (mm < 12){ mm1 = mm+1; yy1 = yy; } else { mm1 = 1; yy1 = yy+1; }
    let jd1 = jdn(1, mm, yy);
    let jd2 = jdn(1, mm1, yy1);
    let ly1 = getYearInfo(yy);
    let tet1 = ly1[0].jd;
    let result = [];
    if (tet1 <= jd1){
      for (let i=jd1;i<jd2;i++) result.push(findLunarDate(i, ly1));
    } else if (jd1 < tet1 && jd2 < tet1){
      ly1 = getYearInfo(yy - 1);
      for (let i=jd1;i<jd2;i++) result.push(findLunarDate(i, ly1));
    } else if (jd1 < tet1 && tet1 <= jd2){
      let ly2 = getYearInfo(yy - 1);
      for (let i=jd1;i<tet1;i++) result.push(findLunarDate(i, ly2));
      for (let i=tet1;i<jd2;i++) result.push(findLunarDate(i, ly1));
    }
    return result;
  }

  function getMonthCanChi(currentLunarDate){
    const year = currentLunarDate.year;
    const month = currentLunarDate.month;
    return CAN[(year*12 + month + 3) % 10] + " " + CHI[(month+1)%12];
  }

  // ====== Home Assistant Custom Card Editor ======
  class LunarCalendarCardEditor extends HTMLElement {
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
          .section { border: 1px solid var(--divider-color, #e0e0e0); border-radius: 12px; padding: 16px; margin-bottom: 16px; background: var(--card-background-color, transparent); box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
          .section-title { font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; font-size: 16px; color: var(--primary-text-color); border-bottom: 1px solid var(--divider-color, #e0e0e0); padding-bottom: 8px; }
          .row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
          .row:last-child { margin-bottom: 0; }
          .label { font-weight: 500; color: var(--primary-text-color); font-size: 14px; }
          .input-group { display: flex; align-items: center; gap: 12px; }
          input[type=color] { cursor: pointer; border: 1px solid var(--divider-color, #e0e0e0); border-radius: 6px; padding: 2px; width: 40px; height: 32px; background: transparent; }
          input[type=range] { flex-grow: 1; cursor: pointer; }
          .val-badge { background: var(--primary-color); color: var(--text-primary-color, white); padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: bold; min-width: 48px; text-align: center; }
          select.ha-select {
            background: var(--card-background-color, transparent);
            color: var(--primary-text-color);
            border: 1px solid var(--divider-color, #e0e0e0);
            padding: 6px 8px;
            border-radius: 6px;
            font-family: inherit;
            font-size: 14px;
            flex-grow: 1;
            max-width: 200px;
            cursor: pointer;
          }
        </style>

        <div class="editor-container">
          <div class="section">
            <div class="section-title">🎨 Nền (Background)</div>
            
            <div class="row">
              <span class="label" style="min-width: 120px;">Loại nền</span>
              <select id="bg_type" class="ha-select">
                <option value="solid">Màu đơn sắc (Solid)</option>
                <option value="gradient">Màu dải (Gradient)</option>
              </select>
            </div>

            <div class="row">
              <span class="label" style="min-width: 120px;">Độ trong suốt</span>
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
                  <div class="input-group">
                    <input type="color" id="bg_gradient_color1">
                    <span class="val-badge" id="bg_gradient_color1_val"></span>
                  </div>
                </div>
                <div class="row" style="width: 100%;">
                  <span class="label">Màu 2</span>
                  <div class="input-group">
                    <input type="color" id="bg_gradient_color2">
                    <span class="val-badge" id="bg_gradient_color2_val"></span>
                  </div>
                </div>
                <div class="row" style="width: 100%;">
                  <span class="label" style="min-width: 120px;">Góc độ (°)</span>
                  <input type="range" id="bg_gradient_angle" min="0" max="360" step="1">
                  <span class="val-badge" id="bg_gradient_angle_val"></span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">🪟 Giao diện Popup Chi tiết</div>
            <div class="row">
              <span class="label" style="min-width: 120px;">Màu Popup</span>
              <select id="popup_theme" class="ha-select">
                <option value="default">Mặc định (Đen mờ)</option>
                <option value="theme1">1. Đen tuyền / Trắng</option>
                <option value="theme2">2. Trắng ngà / Xanh đen</option>
                <option value="theme3">3. Xanh Navy / Trắng ngọc</option>
                <option value="theme4">4. Đỏ rượu / Vàng Gold</option>
                <option value="theme5">5. Xanh Rêu / Kem sáng</option>
                <option value="theme6">6. Nâu gỗ / Trắng sữa</option>
                <option value="theme7">7. Tím khói / Trắng</option>
                <option value="theme8">8. Vàng cát / Nâu cháy</option>
                <option value="theme9">9. Xám xi măng / Đen</option>
                <option value="theme10">10. Xanh Cyan / Cyan nhạt</option>
              </select>
            </div>
            <div class="row">
              <span class="label" style="min-width: 120px;">Độ trong suốt (%)</span>
              <input type="range" id="popup_opacity" min="0" max="100" step="1">
              <span class="val-badge" id="popup_opacity_val"></span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">
              🖌️ Tùy chỉnh Nội dung & Các Thanh hiển thị
              <input type="checkbox" id="auto_contrast" style="margin-left: auto; transform: scale(1.2); cursor: pointer;" title="Tự động tương phản màu chữ theo Nền">
            </div>
            
            <div id="custom_colors_settings">
              <div class="row">
                <span class="label">Màu chữ chính</span>
                <div class="input-group">
                  <input type="color" id="text_main_color">
                  <span class="val-badge" id="text_main_color_val"></span>
                </div>
              </div>
              <div class="row">
                <span class="label">Màu chữ phụ (Highlight)</span>
                <div class="input-group">
                  <input type="color" id="text_accent_color">
                  <span class="val-badge" id="text_accent_color_val"></span>
                </div>
              </div>

              <div class="row" style="margin-top: 16px; border-top: 1px dashed var(--divider-color, #e0e0e0); padding-top: 16px;">
                <span class="label">Màu nền các thanh chỉ báo</span>
                <div class="input-group">
                  <input type="color" id="element_bg_color">
                  <span class="val-badge" id="element_bg_color_val"></span>
                </div>
              </div>
              <div class="row">
                <span class="label" style="min-width: 120px;">Độ trong suốt thanh</span>
                <input type="range" id="element_bg_opacity" min="0" max="100">
                <span class="val-badge" id="element_bg_opacity_val"></span>
              </div>

              <div class="row" style="margin-top: 16px; border-top: 1px dashed var(--divider-color, #e0e0e0); padding-top: 16px;">
                <span class="label">Màu Thứ 7 (T7)</span>
                <div class="input-group">
                  <input type="color" id="saturday_color">
                  <span class="val-badge" id="saturday_color_val"></span>
                </div>
              </div>
              <div class="row">
                <span class="label">Màu Chủ Nhật (CN)</span>
                <div class="input-group">
                  <input type="color" id="sunday_color">
                  <span class="val-badge" id="sunday_color_val"></span>
                </div>
              </div>
              <div class="row">
                <span class="label">Màu Thông báo Lễ/Tết</span>
                <div class="input-group">
                  <input type="color" id="holiday_color">
                  <span class="val-badge" id="holiday_color_val"></span>
                </div>
              </div>
              <div class="row">
                <span class="label">Màu Ca dao tục ngữ</span>
                <div class="input-group">
                  <input type="color" id="cadao_color">
                  <span class="val-badge" id="cadao_color_val"></span>
                </div>
              </div>
            </div> <div class="row" style="margin-top: 16px; border-top: 1px dashed var(--divider-color, #e0e0e0); padding-top: 16px;">
              <span class="label" style="min-width: 120px;">Hiệu ứng Hover Emoji</span>
              <select id="hover_effect" class="ha-select">
                <option value="none">Không có</option>
                <option value="neon">1. Neon Glow (Phát sáng rực rỡ)</option>
                <option value="glass">2. 3D Glass (Kính nổi khối 3D)</option>
                <option value="aura">3. Sunny Aura (Hào quang mặt trời)</option>
                <option value="cyber">4. Cyberpunk (Viền sáng công nghệ)</option>
                <option value="spin">5. Spin & Glow (Xoay & Phát sáng)</option>
                <option value="pulse">6. Heartbeat (Nhịp đập nhấp nháy)</option>
                <option value="float">7. Floating (Trôi nổi lên trên)</option>
                <option value="ring">8. Double Ring (Vòng tròn kép)</option>
                <option value="morph">9. Shape Morph (Biến đổi hình dạng)</option>
                <option value="flash">10. Flash Shine (Chớp lóe chói lóa)</option>
              </select>
            </div>

            <button id="reset_colors_btn" style="width: 100%; margin-top: 16px; padding: 8px; border-radius: 6px; border: 1px solid var(--primary-color); background: transparent; color: var(--primary-text-color); cursor: pointer; font-weight: bold; transition: background 0.2s;">
              🔄 Đặt lại mặc định
            </button>
          </div>
          <div class="section">
            <div class="section-title">🔲 Viền (Border)</div>
            <div class="row">
              <span class="label">Màu viền</span>
              <div class="input-group">
                <input type="color" id="border_color">
                <span class="val-badge" id="border_color_val"></span>
              </div>
            </div>
            <div class="row">
              <span class="label" style="min-width: 120px;">Độ dày viền (px)</span>
              <input type="range" id="border_width" min="0" max="10" step="1">
              <span class="val-badge" id="border_width_val"></span>
            </div>
            <div class="row">
              <span class="label" style="min-width: 120px;">Độ trong suốt</span>
              <input type="range" id="border_opacity" min="0" max="100">
              <span class="val-badge" id="border_opacity_val"></span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">
              ☁️ Đổ bóng (Shadow)
              <input type="checkbox" id="shadow_enable" style="margin-left: auto; transform: scale(1.2); cursor: pointer;">
            </div>
            <div id="shadow_settings">
              <div class="row">
                <span class="label">Màu đổ bóng</span>
                <div class="input-group">
                  <input type="color" id="shadow_color">
                  <span class="val-badge" id="shadow_color_val"></span>
                </div>
              </div>
              <div class="row">
                <span class="label" style="min-width: 120px;">Độ trong suốt</span>
                <input type="range" id="shadow_opacity" min="0" max="100">
                <span class="val-badge" id="shadow_opacity_val"></span>
              </div>
              <div class="row">
                <span class="label" style="min-width: 120px;">Độ nhòe (Blur)</span>
                <input type="range" id="shadow_blur" min="0" max="100">
                <span class="val-badge" id="shadow_blur_val"></span>
              </div>
              <div class="row">
                <span class="label" style="min-width: 120px;">Khoảng cách (X)</span>
                <input type="range" id="shadow_offset_x" min="-50" max="50">
                <span class="val-badge" id="shadow_offset_x_val"></span>
              </div>
              <div class="row">
                <span class="label" style="min-width: 120px;">Khoảng cách (Y)</span>
                <input type="range" id="shadow_offset_y" min="-50" max="50">
                <span class="val-badge" id="shadow_offset_y_val"></span>
              </div>
            </div>
          </div>
        </div>
      `;

      this.updateUI();
      this.addListeners();
    }

    get _bg_type() { return this._config.bg_type || 'solid'; }
    get _bg_color() { return this._config.bg_color || '#000000'; }
    get _bg_opacity() { return this._config.bg_opacity !== undefined ? this._config.bg_opacity : 50; }
    get _bg_gradient_preset() { return this._config.bg_gradient_preset || 'linear-gradient(135deg, #141e30, #243b55)'; }
    
    get _bg_gradient_color1() { return this._config.bg_gradient_color1 || '#ff0000'; }
    get _bg_gradient_color2() { return this._config.bg_gradient_color2 || '#0000ff'; }
    get _bg_gradient_angle() { return this._config.bg_gradient_angle !== undefined ? this._config.bg_gradient_angle : 135; }
    
    get _auto_contrast() { return this._config.auto_contrast !== undefined ? this._config.auto_contrast : false; }
    get _text_main_color() { return this._config.text_main_color || '#ffffff'; }
    get _text_accent_color() { return this._config.text_accent_color || '#ffff99'; }
    get _element_bg_color() { return this._config.element_bg_color || '#ffffff'; }
    get _element_bg_opacity() { return this._config.element_bg_opacity !== undefined ? this._config.element_bg_opacity : 18; }
    
    get _popup_theme() { return this._config.popup_theme || 'default'; }
    get _popup_opacity() { return this._config.popup_opacity !== undefined ? this._config.popup_opacity : 95; }

    get _saturday_color() { return this._config.saturday_color || '#00e600'; }
    get _sunday_color() { return this._config.sunday_color || '#ff3333'; }
    get _holiday_color() { return this._config.holiday_color || '#ff3333'; }
    get _cadao_color() { return this._config.cadao_color || '#ffff99'; }
    
    get _hover_effect() { return this._config.hover_effect || 'neon'; }

    get _border_color() { return this._config.border_color || '#ffffff'; }
    get _border_width() { return this._config.border_width !== undefined ? this._config.border_width : 1; }
    get _border_opacity() { return this._config.border_opacity !== undefined ? this._config.border_opacity : 0; }
    
    get _shadow_enable() { return this._config.shadow_enable || false; }
    get _shadow_color() { return this._config.shadow_color || '#000000'; }
    get _shadow_opacity() { return this._config.shadow_opacity !== undefined ? this._config.shadow_opacity : 50; }
    get _shadow_blur() { return this._config.shadow_blur !== undefined ? this._config.shadow_blur : 16; }
    get _shadow_offset_x() { return this._config.shadow_offset_x !== undefined ? this._config.shadow_offset_x : 0; }
    get _shadow_offset_y() { return this._config.shadow_offset_y !== undefined ? this._config.shadow_offset_y : 4; }

    updateUI() {
      if (!this.querySelector('#bg_color')) return;

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

      this.querySelector('#popup_theme').value = this._popup_theme;
      this.querySelector('#popup_opacity').value = this._popup_opacity;
      this.querySelector('#popup_opacity_val').textContent = this._popup_opacity + '%';

      this.querySelector('#auto_contrast').checked = this._auto_contrast;
      this.querySelector('#text_main_color').value = this._text_main_color;
      this.querySelector('#text_main_color_val').textContent = this._text_main_color.toUpperCase();
      this.querySelector('#text_accent_color').value = this._text_accent_color;
      this.querySelector('#text_accent_color_val').textContent = this._text_accent_color.toUpperCase();
      this.querySelector('#element_bg_color').value = this._element_bg_color;
      this.querySelector('#element_bg_color_val').textContent = this._element_bg_color.toUpperCase();
      this.querySelector('#element_bg_opacity').value = this._element_bg_opacity;
      this.querySelector('#element_bg_opacity_val').textContent = this._element_bg_opacity + '%';

      this.querySelector('#saturday_color').value = this._saturday_color;
      this.querySelector('#saturday_color_val').textContent = this._saturday_color.toUpperCase();
      this.querySelector('#sunday_color').value = this._sunday_color;
      this.querySelector('#sunday_color_val').textContent = this._sunday_color.toUpperCase();
      this.querySelector('#holiday_color').value = this._holiday_color;
      this.querySelector('#holiday_color_val').textContent = this._holiday_color.toUpperCase();
      this.querySelector('#cadao_color').value = this._cadao_color;
      this.querySelector('#cadao_color_val').textContent = this._cadao_color.toUpperCase();

      this.querySelector('#hover_effect').value = this._hover_effect;

      if (this._auto_contrast) {
          this.querySelector('#custom_colors_settings').style.opacity = '0.4';
          this.querySelector('#custom_colors_settings').style.pointerEvents = 'none';
      } else {
          this.querySelector('#custom_colors_settings').style.opacity = '1';
          this.querySelector('#custom_colors_settings').style.pointerEvents = 'auto';
      }

      this.querySelector('#border_color').value = this._border_color;
      this.querySelector('#border_color_val').textContent = this._border_color.toUpperCase();
      this.querySelector('#border_width').value = this._border_width;
      this.querySelector('#border_width_val').textContent = this._border_width + 'px';
      this.querySelector('#border_opacity').value = this._border_opacity;
      this.querySelector('#border_opacity_val').textContent = this._border_opacity + '%';

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
    }

    addListeners() {
      const dispatchUpdate = () => {
        const newConfig = { 
            ...this._config, 
            bg_type: this.querySelector('#bg_type').value,
            bg_color: this.querySelector('#bg_color').value,
            bg_opacity: parseInt(this.querySelector('#bg_opacity').value, 10),
            bg_gradient_preset: this.querySelector('#bg_gradient_preset').value,
            bg_gradient_color1: this.querySelector('#bg_gradient_color1').value,
            bg_gradient_color2: this.querySelector('#bg_gradient_color2').value,
            bg_gradient_angle: parseInt(this.querySelector('#bg_gradient_angle').value, 10),

            popup_theme: this.querySelector('#popup_theme').value,
            popup_opacity: parseInt(this.querySelector('#popup_opacity').value, 10),

            auto_contrast: this.querySelector('#auto_contrast').checked,
            text_main_color: this.querySelector('#text_main_color').value,
            text_accent_color: this.querySelector('#text_accent_color').value,
            element_bg_color: this.querySelector('#element_bg_color').value,
            element_bg_opacity: parseInt(this.querySelector('#element_bg_opacity').value, 10),
            
            saturday_color: this.querySelector('#saturday_color').value,
            sunday_color: this.querySelector('#sunday_color').value,
            holiday_color: this.querySelector('#holiday_color').value,
            cadao_color: this.querySelector('#cadao_color').value,

            hover_effect: this.querySelector('#hover_effect').value,

            border_color: this.querySelector('#border_color').value,
            border_width: parseInt(this.querySelector('#border_width').value, 10),
            border_opacity: parseInt(this.querySelector('#border_opacity').value, 10),
            shadow_enable: this.querySelector('#shadow_enable').checked,
            shadow_color: this.querySelector('#shadow_color').value,
            shadow_opacity: parseInt(this.querySelector('#shadow_opacity').value, 10),
            shadow_blur: parseInt(this.querySelector('#shadow_blur').value, 10),
            shadow_offset_x: parseInt(this.querySelector('#shadow_offset_x').value, 10),
            shadow_offset_y: parseInt(this.querySelector('#shadow_offset_y').value, 10)
        };
        
        if (newConfig.background_color !== undefined) delete newConfig.background_color;
        if (newConfig.background !== undefined) delete newConfig.background;
        if (newConfig.bg_gradient_custom !== undefined) delete newConfig.bg_gradient_custom; 

        const event = new CustomEvent("config-changed", {
          detail: { config: newConfig },
          bubbles: true,
          composed: true,
        });
        this.dispatchEvent(event);
        this.updateUI();
      };

      this.querySelectorAll('input, select').forEach(el => {
        if (el.id === 'reset_colors_btn') return; 
        el.addEventListener('input', dispatchUpdate);
        el.addEventListener('change', dispatchUpdate); 
      });

      this.querySelector('#reset_colors_btn').addEventListener('click', (e) => {
        e.preventDefault();
        const newConfig = { ...this._config };
        delete newConfig.auto_contrast;
        delete newConfig.text_main_color;
        delete newConfig.text_accent_color;
        delete newConfig.element_bg_color;
        delete newConfig.element_bg_opacity;
        delete newConfig.saturday_color;
        delete newConfig.sunday_color;
        delete newConfig.holiday_color;
        delete newConfig.cadao_color;
        delete newConfig.hover_effect;
        delete newConfig.popup_theme;
        delete newConfig.popup_opacity;
        
        const event = new CustomEvent("config-changed", {
          detail: { config: newConfig },
          bubbles: true,
          composed: true,
        });
        this.dispatchEvent(event);
        this.updateUI();
      });
    }
  }

  // ====== Home Assistant Card ======
  class LunarCalendarCard extends HTMLElement{
    static getConfigElement() { return document.createElement('lich-block-am-duong-viet-nam-editor'); }
    static getStubConfig() { 
      return { bg_type: 'solid', bg_color: '#000000', bg_opacity: 0, border_width: 1, border_opacity: 0, shadow_enable: false }; 
    }

		constructor(){
			super();
			const today = new Date();
			this.displayMonth = today.getMonth() + 1;
			this.displayYear = today.getFullYear();
		}

    setConfig(config){
      this.config = config || {};
      if (!this.shadowRoot){ this.attachShadow({mode:'open'}); }
      if (!this.card){
        this.card = document.createElement('ha-card');
        this.shadowRoot.appendChild(this.card);
      }
      
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

      const applyOpacityToGradientStr = (str, opacity) => {
          return str.replace(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/gi, (match) => hexToRgba(match, opacity));
      };

      const oldBg = this.config.background_color || this.config.background;
      const bgType = this.config.bg_type || 'solid';
      const bgOpacity = this.config.bg_opacity !== undefined ? this.config.bg_opacity : 50;

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
          if (this.config.bg_color || this.config.bg_opacity !== undefined) {
              const bgColor = this.config.bg_color || '#000000';
              this.card.style.background = hexToRgba(bgColor, bgOpacity);
          } else if (oldBg) {
              this.card.style.background = oldBg;
          } else {
              this.card.style.background = 'transparent';
          }
      }

      const borderWidth = this.config.border_width !== undefined ? this.config.border_width : 1;
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

      this.card.style.borderRadius = 'var(--ha-card-border-radius, 16px)';

      let textMain = this.config.text_main_color || '#ffffff';
      let textAccent = this.config.text_accent_color || '#ffff99';
      let elemBg = this.config.element_bg_color || '#ffffff';
      let elemOpacity = this.config.element_bg_opacity !== undefined ? this.config.element_bg_opacity : 18;
      let elemShadow = '0 2px 8px rgba(0,0,0,0.12), inset 0 0.4px 0 rgba(255,255,255,0.35)';

      let satColor = this.config.saturday_color || '#00e600';
      let sunColor = this.config.sunday_color || '#ff3333';
      let holColor = this.config.holiday_color || '#ff3333';
      let cadaoColor = this.config.cadao_color || '#ffff99';

      let shadowHeavy = '0 6px 10px rgba(0,0,0,0.28)';
      let shadowLight = '0 1px 3px rgba(0,0,0,0.3)';

      if (this.config.auto_contrast) {
          let isLightBackground = false;
          let colorsToCheck = [];
          let strToExtract = "";
          if (bgType === 'solid' && this.config.bg_color) {
              strToExtract = this.config.bg_color;
          } else if (bgType === 'gradient') {
              const preset = this.config.bg_gradient_preset || 'linear-gradient(135deg, #141e30, #243b55)';
              if (preset === 'custom') {
                  strToExtract = (this.config.bg_gradient_color1 || '#ff0000') + " " + (this.config.bg_gradient_color2 || '#0000ff');
              } else strToExtract = preset;
          }

          const hexRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/gi;
          let match;
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
              let totalYIQ = 0;
              colorsToCheck.forEach(c => { totalYIQ += ((c.r * 299) + (c.g * 587) + (c.b * 114)) / 1000; });
              let avgYIQ = totalYIQ / colorsToCheck.length;
              if (avgYIQ >= 128) isLightBackground = true;
          }

          if (isLightBackground) {
              textMain = '#1a1a1a';   
              textAccent = '#0d47a1'; 
              elemBg = '#000000';     
              elemOpacity = 10;
              elemShadow = '0 2px 8px rgba(0,0,0,0.15), inset 0 0.4px 0 rgba(0,0,0,0.05)';
              satColor = '#006600';   
              sunColor = '#b30000';   
              holColor = '#b30000';   
              cadaoColor = '#0d47a1'; 
              shadowHeavy = '0 2px 6px rgba(255,255,255,0.7)';
              shadowLight = '0 1px 3px rgba(255,255,255,0.8)';
          }
      }

      this.style.setProperty('--user-text-main', textMain);
      this.style.setProperty('--user-text-accent', textAccent);
      this.style.setProperty('--user-element-base-color', elemBg);
      this.style.setProperty('--user-bg-overlay', hexToRgba(elemBg, elemOpacity));
      this.style.setProperty('--user-bg-overlay-hover', hexToRgba(elemBg, Math.min(100, elemOpacity + 15)));
      this.style.setProperty('--user-element-shadow', elemShadow);
      this.style.setProperty('--user-saturday-color', satColor);
      this.style.setProperty('--user-sunday-color', sunColor);
      this.style.setProperty('--user-holiday-color', holColor);
      this.style.setProperty('--user-cadao-color', cadaoColor);
      this.style.setProperty('--user-text-shadow-heavy', shadowHeavy);
      this.style.setProperty('--user-text-shadow-light', shadowLight);

      this._render();
    }

    set hass(hass){
      this._hass = hass;
      // ---- Gọi hàm chèn DOM Popup từ file phụ ----
      injectPopupDOM();
    }

    _render(){
      const today = new Date();
      const mm = this.displayMonth;
      const yy = this.displayYear;

      const html = [ printStyle(), printTable(mm, yy, today, this.config) ].join('');
      const hoverEffect = this.config.hover_effect || 'neon';

      // ==========================================
      // GIAO DIỆN BỘ CÔNG CỤ QUY ĐỔI NGÀY NHANH
      // ==========================================
      const convHtml = `
      <style>
        #conv-header:hover { background: var(--lc-bg-overlay-hover) !important; box-shadow: var(--lc-element-shadow); }
        .conv-input { background: var(--lc-bg-overlay) !important; color: var(--lc-text-main) !important; border: 1px solid var(--lc-border-color) !important; outline: none; transition: all 0.2s; text-shadow: var(--lc-text-shadow-light); }
        .conv-input:focus { background: var(--lc-bg-overlay-hover) !important; border-color: var(--lc-text-accent) !important; box-shadow: 0 0 5px var(--lc-text-accent); }
        .conv-input::placeholder { color: var(--lc-text-main); opacity: 0.6; }
        .conv-input option { background: #333; color: #fff; text-shadow: none; } /* Màu nền option dropdown hệ thống */
        #conv-btn:hover { background: var(--lc-bg-overlay-hover) !important; transform: scale(1.01); border-color: var(--lc-text-accent) !important; }
      </style>
      <div class="conv-wrapper" style="margin-top: clamp(8px, 3cqi, 15px); font-family: 'Be Vietnam Pro', sans-serif;">
        <div id="conv-header" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding: clamp(6px, 2.5cqi, 10px); border-radius: 8px; background: transparent; transition: all 0.2s;">
          <h3 style="margin: 0; font-size: clamp(10px, 4.5cqi, 16.8px); color: var(--lc-text-accent); text-shadow: var(--lc-text-shadow-light); display: flex; align-items: center; gap: clamp(4px, 2cqi, 8px);">
            <span>🔄</span> Tra cứu / Quy đổi ngày nhanh
          </h3>
          <span id="conv-icon" style="transition: transform 0.3s; color: var(--lc-text-main); text-shadow: var(--lc-text-shadow-light); font-size: clamp(10px, 4cqi, 16px);">▼</span>
        </div>

        <div id="conv-body" style="display: none; margin-top: clamp(4px, 1.5cqi, 8px); padding: clamp(10px, 4cqi, 15px) clamp(6px, 2.5cqi, 10px); background: var(--lc-bg-overlay); border: 0.4px solid var(--lc-border-color); border-radius: 8px; box-shadow: var(--lc-element-shadow); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);">
          <select id="conv-type" class="conv-input" style="width: 100%; margin-bottom: clamp(8px, 3cqi, 12px); padding: clamp(6px, 2.5cqi, 10px); border-radius: 6px; cursor: pointer; font-size: clamp(9px, 3.8cqi, 14px);">
            <option value="solar_to_lunar">☀️ Dương lịch ➡️ 🌙 Âm lịch</option>
            <option value="lunar_to_solar">🌙 Âm lịch ➡️ ☀️ Dương lịch</option>
          </select>
          
          <div style="display: flex; gap: clamp(4px, 2cqi, 8px); margin-bottom: clamp(10px, 4cqi, 15px);">
            <input id="conv-day" class="conv-input" type="number" placeholder="Ngày" min="1" max="31" style="flex: 1; padding: clamp(6px, 2.5cqi, 10px); border-radius: 6px; text-align: center; font-size: clamp(9px, 3.8cqi, 14px);">
            <input id="conv-month" class="conv-input" type="number" placeholder="Tháng" min="1" max="12" style="flex: 1; padding: clamp(6px, 2.5cqi, 10px); border-radius: 6px; text-align: center; font-size: clamp(9px, 3.8cqi, 14px);">
            <input id="conv-year" class="conv-input" type="number" placeholder="Năm" min="1800" max="2199" style="flex: 1.2; padding: clamp(6px, 2.5cqi, 10px); border-radius: 6px; text-align: center; font-size: clamp(9px, 3.8cqi, 14px);">
          </div>

          <button id="conv-btn" style="width: 100%; background: var(--lc-bg-overlay); color: var(--lc-text-accent); text-shadow: var(--lc-text-shadow-light); font-weight: bold; border-radius: 6px; padding: clamp(6px, 2.5cqi, 10px); border: 1px solid var(--lc-border-color); cursor: pointer; font-size: clamp(10px, 4.2cqi, 15px); transition: all 0.2s; box-shadow: var(--lc-element-shadow);">TÍNH TOÁN QUY ĐỔI</button>
          
          <div id="conv-result" style="display: none; margin-top: clamp(10px, 4cqi, 15px); padding: clamp(10px, 4cqi, 15px); background: var(--lc-bg-overlay); border-radius: 8px; border-left: 4px solid var(--lc-text-accent); border-top: 0.4px solid var(--lc-border-color); border-right: 0.4px solid var(--lc-border-color); border-bottom: 0.4px solid var(--lc-border-color); color: var(--lc-text-main); box-shadow: var(--lc-element-shadow); backdrop-filter: blur(4px); text-shadow: var(--lc-text-shadow-light); font-size: clamp(9px, 3.8cqi, 15px);"></div>
        </div>
      </div>`;

      // Nạp HTML hiển thị lịch và bộ quy đổi
      this.card.innerHTML = `<div class="lunar-card" data-hover="${hoverEffect}">${html}${convHtml}</div>`;

      // ==========================================
      // LOGIC XỬ LÝ SỰ KIỆN QUY ĐỔI
      // ==========================================
      const convHeader = this.card.querySelector('#conv-header');
      const convBody = this.card.querySelector('#conv-body');
      const convIcon = this.card.querySelector('#conv-icon');
      
      if (convHeader) {
          convHeader.addEventListener('click', () => {
              if (convBody.style.display === 'none' || convBody.style.display === '') {
                  convBody.style.display = 'block';
                  convIcon.style.transform = 'rotate(180deg)';
              } else {
                  convBody.style.display = 'none';
                  convIcon.style.transform = 'rotate(0deg)';
              }
          });
      }

      const convBtn = this.card.querySelector('#conv-btn');
      if (convBtn) {
          convBtn.addEventListener('click', () => {
              const type = this.card.querySelector('#conv-type').value;
              const dStr = this.card.querySelector('#conv-day').value;
              const mStr = this.card.querySelector('#conv-month').value;
              const yStr = this.card.querySelector('#conv-year').value;
              const resDiv = this.card.querySelector('#conv-result');

              if (!dStr || !mStr || !yStr) {
                  resDiv.style.display = 'block';
                  resDiv.innerHTML = '<span style="color: var(--lc-holiday-color);">⚠️ Vui lòng nhập đầy đủ Ngày, Tháng, Năm!</span>';
                  return;
              }

              const d = parseInt(dStr, 10);
              const m = parseInt(mStr, 10);
              const y = parseInt(yStr, 10);

              if (y < 1800 || y > 2199) {
                  resDiv.style.display = 'block';
                  resDiv.innerHTML = '<span style="color: var(--lc-holiday-color);">⚠️ Chỉ hỗ trợ tra cứu năm từ 1800 đến 2199!</span>';
                  return;
              }

              try {
                  let outHtml = "";
                  
                  // ====== CHIỀU 1: DƯƠNG LỊCH -> ÂM LỊCH ======
                  if (type === 'solar_to_lunar') {
                      const jd = jdn(d, m, y);
                      const checkDate = jdn2dateFunc(jd);
                      if (checkDate[0] !== d || checkDate[1] !== m || checkDate[2] !== y) {
                          resDiv.style.display = 'block';
                          resDiv.innerHTML = '<span style="color: var(--lc-holiday-color);">⚠️ Ngày dương lịch không tồn tại!</span>';
                          return;
                      }

                      const lunar = getLunarDate(d, m, y);
                      const canChi = getYearCanChi(lunar.year);
                      const thuStr = TUAN[(jd + 1) % 7];
                      
                      let ly = getYearInfo(lunar.year);
                      let leapMonth = 0;
                      for(let i=0; i<ly.length; i++) { if(ly[i].leap === 1) leapMonth = ly[i].month; }
                      
                      let leapMsg = leapMonth > 0 ? `Năm âm lịch ${canChi} (${lunar.year}) có nhuận tháng ${leapMonth}.` : `Năm âm lịch ${canChi} (${lunar.year}) không có tháng nhuận.`;
                      if(lunar.leap === 1) leapMsg += " (Tháng kết quả đang là tháng nhuận!)";

                      outHtml += `<div style="margin-bottom: 8px;">☀️ Ngày Dương Lịch: <b style="color: var(--lc-text-main); font-size: 1.1em;">${d}/${m}/${y} (${thuStr})</b></div>`;
                      outHtml += `<div style="margin-bottom: 8px;">🌙 Ngày Âm Lịch: <b style="color: var(--lc-text-accent); font-size: 1.1em;">${lunar.day}/${lunar.month}/${lunar.year}${lunar.leap===1 ? ' (Nhuận)' : ''}</b></div>`;
                      outHtml += `<div style="margin-bottom: 8px;">🐲 Năm Can Chi: <b style="color: var(--lc-text-main); font-size: 1.1em;">${canChi}</b></div>`;
                      outHtml += `<div style="margin-top: 10px; font-style: italic; opacity: 0.8; font-size: 0.9em;">ℹ️ ${leapMsg}</div>`;

                  } 
                  // ====== CHIỀU 2: ÂM LỊCH -> DƯƠNG LỊCH ======
                  else {
                      let ly = getYearInfo(y);
                      let results = {};
                      let leapMonth = 0;

                      for (let i = 0; i < ly.length; i++) {
                          let m_info = ly[i];
                          if (m_info.leap === 1) leapMonth = m_info.month;

                          if (m_info.month === m) {
                              let m_len = 30;
                              if (i + 1 < ly.length) {
                                  m_len = ly[i+1].jd - m_info.jd;
                              } else {
                                  let next_ly = getYearInfo(y + 1);
                                  if (next_ly && next_ly.length > 0) m_len = next_ly[0].jd - m_info.jd;
                              }

                              if (d >= 1 && d <= m_len) {
                                  let target_jd = m_info.jd + d - 1;
                                  let sDate = jdn2dateFunc(target_jd);
                                  let key = m_info.leap === 1 ? "leap" : "regular";
                                  results[key] = {
                                      ngay: sDate[0], thang: sDate[1], nam: sDate[2], 
                                      thu: TUAN[(target_jd + 1) % 7]
                                  };
                              }
                          }
                      }

                      if (Object.keys(results).length === 0) {
                          resDiv.style.display = 'block';
                          resDiv.innerHTML = `<span style="color: var(--lc-holiday-color);">⚠️ Ngày âm lịch ${d}/${m}/${y} không tồn tại! (Ví dụ: Tra ngày 30 nhưng tháng đó thiếu chỉ có 29 ngày)</span>`;
                          return;
                      }

                      const canChi = getYearCanChi(y);
                      let leapMsg = leapMonth > 0 ? `Năm âm lịch ${canChi} (${y}) có nhuận tháng ${leapMonth}.` : `Năm âm lịch ${canChi} (${y}) không có tháng nhuận.`;
                      
                      let defRes = results["regular"] || results["leap"];
                      
                      outHtml += `<div style="margin-bottom: 8px;">☀️ Ngày Dương Lịch: <b style="color: var(--lc-text-main); font-size: 1.1em;">${defRes.ngay}/${defRes.thang}/${defRes.nam} (${defRes.thu})</b></div>`;
                      outHtml += `<div style="margin-bottom: 8px;">🌙 Ngày Âm Lịch: <b style="color: var(--lc-text-accent); font-size: 1.1em;">${d}/${m}/${y}</b></div>`;
                      outHtml += `<div style="margin-bottom: 8px;">🐲 Năm Can Chi: <b style="color: var(--lc-text-main); font-size: 1.1em;">${canChi}</b></div>`;
                      outHtml += `<div style="margin-top: 10px; font-style: italic; opacity: 0.8; font-size: 0.9em;">ℹ️ ${leapMsg}</div>`;

                      if (Object.keys(results).length > 1) {
                          outHtml += `<div style="margin-top: 10px; border-top: 1px dashed var(--lc-border-color); padding-top: 10px;">`;
                          outHtml += `<div style="color: var(--lc-text-accent); margin-bottom: 5px; font-size:0.9em;">📌 Lưu ý: Vì tháng tra cứu là tháng Nhuận, hệ thống trả về 2 kết quả Dương Lịch:</div>`;
                          if(results["regular"]) outHtml += `<div style="opacity: 0.9; font-size: 0.9em; margin-bottom: 4px;">🔹 Nếu là tháng âm thường: <b>${results["regular"].ngay}/${results["regular"].thang}/${results["regular"].nam} (${results["regular"].thu})</b></div>`;
                          if(results["leap"]) outHtml += `<div style="opacity: 0.9; font-size: 0.9em;">🔹 Nếu là tháng âm nhuận: <b>${results["leap"].ngay}/${results["leap"].thang}/${results["leap"].nam} (${results["leap"].thu})</b></div>`;
                          outHtml += `</div>`;
                      }
                  }
                  resDiv.innerHTML = outHtml;
                  resDiv.style.display = 'block';
              } catch (error) {
                  resDiv.style.display = 'block';
                  resDiv.innerHTML = `<span style="color: var(--lc-holiday-color);">❌ Đã xảy ra lỗi hệ thống: ${error.message}</span>`;
              }
          });
      }

      // ==========================================
      // LOGIC XỬ LÝ CHUYỂN THÁNG/NĂM CŨ CỦA LỊCH
      // ==========================================
      const prevBtn = this.card.querySelector('#prev-month');
      if (prevBtn){
          prevBtn.addEventListener('click', () => {
              this.displayMonth--;
              if (this.displayMonth < 1){ this.displayMonth = 12; this.displayYear--; }
              this._render();
          });
      }

      const nextBtn = this.card.querySelector('#next-month');
      if (nextBtn){
          nextBtn.addEventListener('click', () => {
              this.displayMonth++;
              if (this.displayMonth > 12){ this.displayMonth = 1; this.displayYear++; }
              this._render();
          });
      }

      const prevYearBtn = this.card.querySelector('#prev-year');
      if (prevYearBtn){ prevYearBtn.addEventListener('click', () => { this.displayYear--; this._render(); }); }

      const nextYearBtn = this.card.querySelector('#next-year');
      if (nextYearBtn){ nextYearBtn.addEventListener('click', () => { this.displayYear++; this._render(); }); }

      const resetBtn = this.card.querySelector('#reset-today');
      if (resetBtn){
          resetBtn.addEventListener('click', () => {
              const today = new Date();
              this.displayMonth = today.getMonth() + 1;
              this.displayYear = today.getFullYear();
              this._render();
          });
      }
    }

    getCardSize(){ return 8; }
  }

  // Đăng ký Element
  if (!customElements.get('lich-block-am-duong-viet-nam-editor')) customElements.define('lich-block-am-duong-viet-nam-editor', LunarCalendarCardEditor);
  if (!customElements.get('lich-block-am-duong-viet-nam')) customElements.define('lich-block-am-duong-viet-nam', LunarCalendarCard);

  window.customCards = window.customCards || [];
  window.customCards.push({
      type: "lich-block-am-duong-viet-nam",
      name: "Lịch Âm Dương",
      description: "Thẻ Lịch Âm Dương Việt Nam có thể tùy chỉnh màu nền.",
      preview: true,
  });

  // ---- TRUYỀN HÀM TÍNH TOÁN CORE CHO POPUP LÀM VIỆC ----
  initPopupCore({
      jdn,
      getLunarDate,
      getCanChiNgay,
      TIETKHI,
      getSunLongitude,
      getGioHoangDao,
      getGioHacDao,
      getHuongXuatHanh,
      getThanSat,
      CAN,
      CHI
  });

})();
