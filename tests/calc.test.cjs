const assert = require('assert');
const path = require('path');
const C = require(path.join(__dirname, '..', 'calc.js'));
const db = require(path.join(__dirname, '..', 'data', 'foods.json'));
const G = require(path.join(__dirname, '..', 'data', 'groups.json'));
const byId = id => db.foods.find(f => f.id === id);
const near = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);

// Golden value carried over from version 1.1.3
const rice = byId('US169757');
near(C.scaleFood(rice, 120).carb[0], 33.804);

// grams <-> kcal round trip
const g = C.toBaseAmount(rice, 200, 'kcal');
near(C.scaleFood(rice, g).energy[0], 200);

// food without energy refuses kcal conversion (DRI single-nutrient record)
const noE = db.foods.find(f => f.v.energy === undefined);
assert.throws(() => C.toBaseAmount(noE, 100, 'kcal'), /ไม่มีค่าพลังงาน/);

// invalid amounts
for (const bad of ['', null, -1, 0, 'abc', true, 20000]) assert.throws(() => C.checkAmount(bad));

// missing is counted, never zero-filled
const t = C.sumItems([{ food: rice, amount: 100 }, { food: noE, amount: 100 }], ['energy', 'iodine']);
assert.strictEqual(t.energy.known, 1); assert.strictEqual(t.energy.missing, 1);
assert.strictEqual(t.iodine.known, 0); assert.strictEqual(t.iodine.missing, 2);

// %E from summed grams
const pe = C.percentE(C.sumItems([{ food: rice, amount: 100 }], ['energy', 'carb', 'protein', 'fat', 'la', 'ala', 'satfat']));
near(pe.carb.value, 28.17 * 4 / 130 * 100, 1e-3);

// worksheet case numbers (A-P, A-L) via calc mode
const a = C.profile(G, { groupId: 'p2', base: 'a19', mode: 'calc', age: 26, weight: 53, pal: 1.4, activity: true });
assert.strictEqual(a.energyRange[0], 2100); assert.strictEqual(a.protein, 63);
const b = C.profile(G, { groupId: 'l0', base: 'a19', mode: 'calc', age: 28, weight: 55, pal: 1.4, activity: true });
assert.strictEqual(b.energyRange[0], 2350); assert.strictEqual(b.protein, 74);
// Thai DRI targets equal the worksheet values
const want = { p2: { folate_dfe: 550, iodine: 200, calcium: 800, vit_a: 700, vit_c: 95, vit_b12: 2.6, vit_d: 15 },
               l0: { folate_dfe: 450, iodine: 200, calcium: 800, iron: 13, vit_a: 1300, vit_c: 145, vit_b12: 2.8, vit_d: 15 } };
for (const [gid, t] of Object.entries(want)) { const pr = C.profile(G, { groupId: gid, base: 'a19', mode: 'table' });
  for (const [k, v] of Object.entries(t)) near(pr.targets[k].min, v, 1e-9); }
// pregnancy iron: Thai DRI gives no food value; activity mode adds the worksheet practice value
assert.ok(C.profile(G, { groupId: 'p2', base: 'a19', mode: 'table' }).targets.iron.none);
assert.strictEqual(a.targets.iron.min, 20);
// table mode
const f = C.profile(G, { groupId: 'F-a19', mode: 'table' }); assert.strictEqual(f.energyRange[0], 1780); assert.strictEqual(f.protein, 53);
const p2t = C.profile(G, { groupId: 'p2', base: 'a19', mode: 'table' }); assert.deepStrictEqual(p2t.energyRange, [2030, 2080]); assert.strictEqual(p2t.protein, 63);
assert.ok(C.profile(G, { groupId: 'M-inf0', mode: 'table' }).breastMilkOnly);
assert.strictEqual(G.groups.length, 31);
near(G.mealShares.meals.reduce((s, m) => s + m.share, 0), 1);

// every food: positive basis, valid ranges
for (const f of db.foods) { assert.ok(f.b > 0); for (const v of Object.values(f.v)) { const r = C.range(v); assert.ok(r[0] >= 0 && r[1] >= r[0]); } }
console.log('PASS', db.foods.length, 'foods');
