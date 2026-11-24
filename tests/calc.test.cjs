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

// worksheet case numbers (A-P, A-L)
const preg = G.groups.find(x => x.id === 'preg2'), lact = G.groups.find(x => x.id === 'lact1');
const a = C.needs(preg, G.energyRules, 26, 53, 1.4); assert.strictEqual(a.energy, 2100); assert.strictEqual(a.protein, 63);
const b = C.needs(lact, G.energyRules, 28, 55, 1.4); assert.strictEqual(b.energy, 2350); assert.strictEqual(b.protein, 74);
near(G.mealShares.meals.reduce((s, m) => s + m.share, 0), 1);

// every food: positive basis, valid ranges
for (const f of db.foods) { assert.ok(f.b > 0); for (const v of Object.values(f.v)) { const r = C.range(v); assert.ok(r[0] >= 0 && r[1] >= r[0]); } }
console.log('PASS', db.foods.length, 'foods');
