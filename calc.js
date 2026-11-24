/* Pure calculation core. No DOM. Missing data is never treated as 0. */
(function (root) {
  'use strict';
  const MAC_KCAL = { carb: 4, protein: 4, fat: 9, la: 9, ala: 9, satfat: 9 };

  function range(v) { return v == null ? null : Array.isArray(v) ? v : [v, v]; }

  function checkAmount(x) {
    if (x === '' || x == null || typeof x === 'boolean') throw Error('กรอกปริมาณก่อน');
    const n = Number(x);
    if (!Number.isFinite(n) || n <= 0 || n > 10000) throw Error('ปริมาณต้องมากกว่า 0 และไม่เกิน 10,000');
    return n;
  }

  /* kcal per 1 basis unit (g, ml, ...). null if the food has no energy or energy is a range. */
  function kcalPerUnit(food) {
    const e = range(food.v.energy);
    if (!e || e[0] !== e[1]) return null;
    return e[0] / food.b;
  }

  /* Convert an entered amount to the food's own unit. mode: 'unit' (g/ml/...) or 'kcal'. */
  function toBaseAmount(food, value, mode) {
    const n = checkAmount(value);
    if (mode !== 'kcal') return n;
    const k = kcalPerUnit(food);
    if (k == null) throw Error('รายการนี้ไม่มีค่าพลังงาน จึงแปลง kcal เป็นปริมาณไม่ได้');
    if (k === 0) throw Error('รายการนี้ให้พลังงาน 0 kcal จึงแปลงจาก kcal ไม่ได้');
    return n / k;
  }

  function scaleFood(food, amount) {
    const out = {};
    for (const [k, v] of Object.entries(food.v)) {
      const r = range(v);
      out[k] = [r[0] * amount / food.b, r[1] * amount / food.b];
    }
    return out;
  }

  /* items: [{food, amount}] amount in the food's unit. Returns per nutrient {lo, hi, known, missing}. */
  function sumItems(items, keys) {
    const res = {};
    for (const k of keys) res[k] = { lo: 0, hi: 0, known: 0, missing: 0, missingNames: [] };
    for (const it of items) {
      const s = scaleFood(it.food, it.amount);
      for (const k of keys) {
        if (s[k]) { res[k].lo += s[k][0]; res[k].hi += s[k][1]; res[k].known++; }
        else { res[k].missing++; res[k].missingNames.push(it.food.n); }
      }
    }
    return res;
  }

  /* %E computed from summed grams over summed energy (never averaged per meal). */
  function percentE(totals) {
    const e = totals.energy;
    if (!e || e.known === 0 || e.lo <= 0) return null;
    const out = {};
    for (const [k, f] of Object.entries(MAC_KCAL)) {
      const t = totals[k];
      if (!t || t.known === 0) { out[k] = null; continue; }
      out[k] = { value: t.lo * f / e.lo * 100, incomplete: t.missing > 0 || e.missing > 0 };
    }
    return out;
  }

  function bmrFemale(rules, age, weight) {
    const a = Number(age), w = Number(weight);
    if (!(a >= 18 && a <= 60)) throw Error('สูตรในเวอร์ชันนี้รองรับอายุ 18–60 ปี');
    if (!(w > 20 && w < 200)) throw Error('น้ำหนักไม่ถูกต้อง');
    const r = rules.bmrFemale.find(r => a >= r.minAge && (a < r.maxAge || (r.maxAge === 60 && a <= 60)));
    return r.a * w + r.b;
  }

  function needs(group, rules, age, weight, pal) {
    const bmr = bmrFemale(rules, age, weight);
    const p = Number(pal);
    if (!(p >= 1.2 && p <= 2.4)) throw Error('PAL ต้องอยู่ระหว่าง 1.2–2.4');
    const raw = bmr * p + group.energyAdd;
    const energy = Math.ceil(raw / 50) * 50;
    return { bmr, raw, energy, energyRange: [energy, energy * 1.05], protein: Number(weight) + group.proteinAdd };
  }

  const api = { range, checkAmount, kcalPerUnit, toBaseAmount, scaleFood, sumItems, percentE, bmrFemale, needs, MAC_KCAL };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Calc = api;
})(this);
