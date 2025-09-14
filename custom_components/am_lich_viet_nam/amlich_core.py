from math import floor
from datetime import datetime

class LunarDate:
    def __init__(self, day, month, year, leap, jd):
        self.day = day
        self.month = month
        self.year = year
        self.leap = leap
        self.jd = jd

TK21 = [
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
]
TK22 = [
    0x4eb520,0x38d727,0x5eada0,0x4a55b0,0x362db5,0x5a45b0,0x44a2b0,0x2eb2b4,0x54a950,0x3cb559,
    0x626b20,0x4cad50,0x385766,0x5c5370,0x484570,0x326574,0x5852b0,0x406950,0x2a7953,0x505aa0,
    0x3baaa7,0x5ea6d0,0x4a4ae0,0x35a2e5,0x5aa550,0x42d2a0,0x2de2a4,0x52d550,0x3e5abb,0x6256a0,
    0x4c96d0,0x3949b6,0x5e4ab0,0x46a8d0,0x30d4b5,0x56b290,0x40b550,0x2a6d52,0x504da0,0x3b9567,
    0x609570,0x4a49b0,0x34a975,0x5a64b0,0x446a90,0x2cba94,0x526b50,0x3e2b60,0x28ab61,0x4c9570,
    0x384ae6,0x5cd160,0x46e4a0,0x2eed25,0x54da90,0x405b50,0x2c36d3,0x502ae0,0x3a93d7,0x6092d0,
    0x4ac950,0x32d556,0x58b4a0,0x42b690,0x2e5d94,0x5255b0,0x3e25fa,0x6425b0,0x4e92b0,0x36aab6,
    0x5c6950,0x4674a0,0x31b2a5,0x54ad50,0x4055a0,0x2aab73,0x522570,0x3a5377,0x6052b0,0x4a6950,
    0x346d56,0x585aa0,0x42ab50,0x2e56d4,0x544ae0,0x3ca570,0x2864d2,0x4cd260,0x36eaa6,0x5ad550,
    0x465aa0,0x30ada5,0x5695d0,0x404ad0,0x2aa9b3,0x50a4d0,0x3ad2b7,0x5eb250,0x48b540,0x33d556
]


CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"]
CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"]
THU = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"]
MONTH_NAMES = [
    "Tháng Giêng", "Tháng Hai", "Tháng Ba", "Tháng Tư", "Tháng Năm", "Tháng Sáu",
    "Tháng Bảy", "Tháng Tám", "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Chạp"
]

def INT(d): return floor(d)

def jdn(dd, mm, yy):
    a = INT((14 - mm) / 12)
    y = yy + 4800 - a
    m = mm + 12 * a - 3
    return dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045
    
def jd_to_date(jd):
    a = jd + 32044
    b = int((4 * a + 3) / 146097)
    c = a - int((146097 * b) / 4)
    d = int((4 * c + 3) / 1461)
    e = c - int((1461 * d) / 4)
    m = int((5 * e + 2) / 153)
    day = e - int((153 * m + 2) / 5) + 1
    month = m + 3 - 12 * int(m / 10)
    year = 100 * b + d - 4800 + int(m / 10)
    return (day, month, year)

def decode_lunar_year(yy, k):
    month_lengths = [29, 30]
    regular_months = [0] * 12
    offset_of_tet = k >> 17
    leap_month = k & 0xf
    leap_month_length = month_lengths[(k >> 16) & 0x1]
    solar_ny = jdn(1, 1, yy)
    current_jd = solar_ny + offset_of_tet
    j = k >> 4
    ly = []
    for i in range(12):
        regular_months[11 - i] = month_lengths[j & 0x1]
        j >>= 1
    if leap_month == 0:
        for mm in range(1, 13):
            ly.append(LunarDate(1, mm, yy, 0, current_jd))
            current_jd += regular_months[mm - 1]
    else:
        for mm in range(1, leap_month + 1):
            ly.append(LunarDate(1, mm, yy, 0, current_jd))
            current_jd += regular_months[mm - 1]
        ly.append(LunarDate(1, leap_month, yy, 1, current_jd))
        current_jd += leap_month_length
        for mm in range(leap_month + 1, 13):
            ly.append(LunarDate(1, mm, yy, 0, current_jd))
            current_jd += regular_months[mm - 1]
    return ly

#def get_year_info(yyyy):
#    if 2000 <= yyyy <= 2099:
#        return decode_lunar_year(yyyy, TK21[yyyy - 2000])
#    else:
#        raise ValueError("Chỉ hỗ trợ từ năm 2000 đến 2099.")

def get_year_info(yyyy):
    if 2000 <= yyyy <= 2099:
        return decode_lunar_year(yyyy, TK21[yyyy - 2000])
    elif 2100 <= yyyy <= 2199:
        return decode_lunar_year(yyyy, TK22[yyyy - 2100])
    else:
        raise ValueError("Chỉ hỗ trợ từ năm 2000 đến 2199.")



def find_lunar_date(jd, ly):
    if jd < ly[0].jd:
        return LunarDate(0, 0, 0, 0, jd)
    i = len(ly) - 1
    while jd < ly[i].jd:
        i -= 1
    offset = jd - ly[i].jd
    return LunarDate(ly[i].day + offset, ly[i].month, ly[i].year, ly[i].leap, jd)

def get_lunar_date(dd, mm, yyyy):
    jd = jdn(dd, mm, yyyy)
    ly = get_year_info(yyyy)
    if jd < ly[0].jd:
        ly = get_year_info(yyyy - 1)
    return find_lunar_date(jd, ly)

def convert_lunar_to_solar(dd, mm, yyyy, leap):
    ly = get_year_info(yyyy)
    for i in range(len(ly)):
        if ly[i].month == mm and ly[i].leap == (1 if leap else 0):
            jd = ly[i].jd + dd - 1
            return jd_to_date(jd)
    return None

def get_year_can_chi(year):
    return f"{CAN[(year + 6) % 10]} {CHI[(year + 8) % 12]}"

def get_month_name(month, leap):
    name = MONTH_NAMES[month - 1] if 1 <= month <= 12 else f"Tháng {month}"
    return name + " Nhuận" if leap else name

def get_lunar_month_length(lunar_date):
    ly = get_year_info(lunar_date.year)
    for i in range(len(ly)):
        if ly[i].month == lunar_date.month and ly[i].leap == lunar_date.leap:
            if i + 1 < len(ly):
                return ly[i + 1].jd - ly[i].jd  # số ngày của tháng
    return 29  # mặc định nếu không tìm thấy
