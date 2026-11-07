import assert from 'node:assert/strict';
import * as core from '../custom_components/am_lich_viet_nam/frontend/lich-am-duong-viet-nam-core.js';

assert.deepEqual([core.NGAY_LE_DL.length, core.NGAY_LE_DL_STRING.length], [38, 38]);
assert.equal(core.NGAY_LE_AL.length, core.NGAY_LE_AL_STRING.length);
const tet = core.getLunarDate(17, 2, 2026);
assert.deepEqual([tet.day, tet.month, tet.year, tet.leap], [1, 1, 2026, 0]);
const dates = [
  [[2026, 3, 5], 'Lễ Phục Sinh'],
  [[2026, 4, 10], 'Ngày của Mẹ'],
  [[2026, 5, 21], 'Ngày của Cha'],
  [[2026, 10, 26], 'Lễ Tạ Ơn'],
  [[2026, 10, 27], 'Black Friday']
];
for (const [parts, title] of dates) {
  assert.ok(core.getSolarHolidays(new Date(...parts)).includes(title), title);
}
assert.ok(!core.getSolarHolidays(new Date(2026, 2, 31)).includes('Lễ Phục Sinh'));
console.log('Frontend core: lunar conversion, holiday dates and data-array alignment OK.');
