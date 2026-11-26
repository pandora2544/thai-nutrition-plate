'use strict';
(function () {
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n, d = 1) => n == null || !Number.isFinite(n) ? '–' : Number(n.toFixed(d)).toLocaleString('th-TH', { maximumFractionDigits: d });
  const unitTh = u => ({ g: 'g', ml: 'ml' }[u] || u);
  const MAIN = ['energy', 'carb', 'protein', 'fat', 'la', 'ala', 'satfat', 'dha', 'epa_dha', 'sodium'];
  const STORE = 'tnp-state-v2';
  const CATS = [
    { id: 'inf', label: 'ทารก', bands: ['inf0', 'inf6'], sex: true },
    { id: 'child', label: 'เด็ก 1–8 ปี', bands: ['c1', 'c4', 'c6'], sex: true },
    { id: 'teen', label: 'วัยรุ่น 9–18 ปี', bands: ['t9', 't13', 't16'], sex: true },
    { id: 'adult', label: 'ผู้ใหญ่ 19–60 ปี', bands: ['a19', 'a31', 'a51'], sex: true },
    { id: 'elder', label: 'ผู้สูงอายุ 61 ปีขึ้นไป', bands: ['a61', 'a71'], sex: true },
    { id: 'preg', label: 'หญิงตั้งครรภ์', groups: ['p1', 'p2', 'p3'] },
    { id: 'lact', label: 'หญิงให้นมบุตร', groups: ['l0', 'l6'] }];
  const BANDLAB = { inf0: '0–5 เดือน', inf6: '6–11 เดือน', c1: '1–3 ปี', c4: '4–5 ปี', c6: '6–8 ปี', t9: '9–12 ปี', t13: '13–15 ปี', t16: '16–18 ปี', a19: '19–30 ปี', a31: '31–50 ปี', a51: '51–60 ปี', a61: '61–70 ปี', a71: '71 ปีขึ้นไป' };

  let DB, D, NUT = {}, foodsById, KEYS = [], IMGS = new Set();
  let state = { cat: null, sex: 'F', band: null, groupId: null, base: 'a19', mode: 'table', age: '', weight: '', pal: '1.4', activity: false,
    meal: 'm1', meals: { m1: [], m2: [], m3: [] }, checked: false, answer: {} };

  function load() { try { const s = JSON.parse(localStorage.getItem(STORE) || 'null'); if (s && s.meals) state = Object.assign(state, s); } catch (e) { /* storage unavailable */ } }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* ignore */ } }
  const practice = () => $('#practice').checked;
  const cat = () => CATS.find(c => c.id === state.cat);
  const maternal = () => state.cat === 'preg' || state.cat === 'lact';
  function prof() { if (!state.groupId) return null; try { return Calc.profile(D, state); } catch (e) { return { error: e.message }; } }
  function syncGroup() { const c = cat(); if (!c) return; state.groupId = c.groups ? (c.groups.includes(state.groupId) ? state.groupId : null) : (state.band ? `${state.sex}-${state.band}` : null); }
  const canCalc = () => maternal() || ((state.cat === 'adult' || (state.cat === 'teen' && state.band === 't16')) && state.sex === 'F');

  /* ---------- step 1 ---------- */
  function renderStep1() {
    const c = cat(), p = prof();
    let h = `<h2>${Icons.ICON.one}เลือกกลุ่มวัย</h2><div class="grid">` + CATS.map(x => `<button class="card" data-cat="${x.id}" aria-pressed="${x.id === state.cat}"><span class="badge">${Icons.ICON.tick}</span>${Icons.PEOPLE[x.id]}<span>${esc(x.label)}</span></button>`).join('') + '</div>';
    if (c) {
      h += '<div class="row">';
      if (c.sex) h += `<label>เพศ<select id="sex"><option value="F"${state.sex === 'F' ? ' selected' : ''}>หญิง</option><option value="M"${state.sex === 'M' ? ' selected' : ''}>ชาย</option></select></label>
        <label>ช่วงอายุ<select id="band"><option value="">— เลือก —</option>${c.bands.map(b => `<option value="${b}"${b === state.band ? ' selected' : ''}>${BANDLAB[b]}</option>`).join('')}</select></label>`;
      else h += `<label>ระยะ<select id="grp"><option value="">— เลือก —</option>${c.groups.map(id => `<option value="${id}"${id === state.groupId ? ' selected' : ''}>${esc(D.groups.find(g => g.id === id).label)}</option>`).join('')}</select></label>
        <label>อายุของแม่ (ฐานคำนวณ)<select id="base">${['t16', 'a19', 'a31'].map(b => `<option value="${b}"${b === state.base ? ' selected' : ''}>${BANDLAB[b]}</option>`).join('')}</select></label>`;
      h += '</div>';
    }
    if (p && p.breastMilkOnly) h += `<p class="note warn">ทารก 0–5 เดือน: Thai DRI กำหนดให้ได้รับจากน้ำนมแม่ จึงไม่มีการจัดจานอาหารสำหรับกลุ่มนี้</p>`;
    else if (p && p.error) h += `<p class="err">${esc(p.error)}</p>${modeBox()}`;
    else if (p) {
      h += modeBox();
      const reveal = !practice() || state.answer.revealed || state.mode === 'table';
      h += `<div class="chip">${Icons.ICON.clip}ความต้องการต่อวัน · ${esc(p.label)}</div><h3>ความต้องการพลังงานและโปรตีน</h3>`;
      if (!reveal) {
        h += `<p>โหมดฝึก: คำนวณเองก่อน แล้วกรอกคำตอบเพื่อตรวจ</p><div class="row">
          <label>พลังงานหลังปัด (kcal)<input id="ansE" type="number" value="${esc(state.answer.e || '')}"></label>
          <label>โปรตีนขั้นต่ำ (g)<input id="ansP" type="number" step="0.1" value="${esc(state.answer.p || '')}"></label>
          <button class="btn" id="checkAns">ตรวจคำตอบ</button></div><p id="ansMsg"></p>`;
      } else {
        h += `<div class="scroll"><table><tr><th>รายการ</th><th class="num">ค่าแนะนำ</th><th>ที่มา / วิธีคิด</th></tr>
          <tr><td>พลังงาน</td><td class="num val">${fmt(p.energyRange[0], 0)}–${fmt(p.energyRange[1], 0)} kcal</td><td>${esc(p.energyHow)}</td></tr>
          <tr><td>โปรตีน</td><td class="num val">≥ ${fmt(p.protein, 1)} g</td><td>${esc(p.proteinHow)}</td></tr></table></div>`;
      }
      h += `<h3>วิตามินและแร่ธาตุต่อวัน</h3><div class="scroll"><table><tr><th>สารอาหาร</th><th class="num">เกณฑ์แนะนำ</th><th>ชนิด</th><th>หมายเหตุ</th></tr>` +
        Object.entries(p.targets).map(([k, t]) => `<tr><td>${esc(NUT[k] ? NUT[k].label : k)}</td><td class="num">${t.none ? '–' : t.min != null ? '≥ ' + fmt(t.min, 2) : '≤ ' + fmt(t.max, 0)} ${esc(NUT[k] ? NUT[k].unit : '')}${t.iu ? ` <small class="na">(${fmt(t.iu, 0)} IU)</small>` : ''}</td>
          <td>${t.src === 'ACT' ? '<span class="tag w">ค่าฝึกในใบงาน</span>' : esc(t.type || '')}</td><td>${esc(t.note || '')}</td></tr>`).join('') + `</table></div>
        <p class="note">สัดส่วนพลังงาน: คาร์โบไฮเดรต 45–65%E · ไขมัน ${p.fatE ? p.fatE.join('–') : '–'}%E${p.fatNote ? ' (' + esc(p.fatNote) + ')' : ''} · LA 2.5–9%E · ALA 0.5–0.6%E · ไขมันอิ่มตัว &lt;10%E · ${esc(D.percentENote)}</p>
        <p class="note">${esc(D.source)} · RDA = ค่าที่แนะนำ, AI = ปริมาณที่เพียงพอ · <b>${esc(D.verification)}</b></p>
        <p><button class="btn" data-go="2">ไปจัดจาน →</button></p>`;
    }
    $('#step1').innerHTML = h;
  }
  function modeBox() {
    if (!canCalc()) return '';
    let h = `<div class="row"><label>วิธีหาพลังงาน<select id="mode"><option value="table"${state.mode === 'table' ? ' selected' : ''}>ตามตาราง Thai DRI</option><option value="calc"${state.mode === 'calc' ? ' selected' : ''}>คำนวณจากน้ำหนักจริง (สูตรในใบงาน)</option></select></label>`;
    if (state.mode === 'calc') h += `<label>อายุ (ปี)<input id="age" type="number" value="${esc(state.age)}"></label>
      <label>${state.cat === 'preg' ? 'น้ำหนักก่อนตั้งครรภ์' : 'น้ำหนัก'} (kg)<input id="weight" type="number" step="0.1" value="${esc(state.weight)}"></label>
      <label>PAL<input id="pal" type="number" step="0.05" value="${esc(state.pal)}"></label>`;
    if (maternal()) h += `<label class="check"><input type="checkbox" id="activity"${state.activity ? ' checked' : ''}> ใช้เกณฑ์เพิ่มของใบงาน (DHA, Na, เหล็ก 20 mg)</label>`;
    return h + '</div>' + (state.mode === 'calc' ? `<p class="note">${esc(D.energyCalc.source)}; ส่วนเพิ่มของหญิงตั้งครรภ์/ให้นมใช้ค่าสูงของช่วงในตารางที่ 1</p>` : '');
  }

  /* ---------- step 2 ---------- */
  function itemCalc(it) {
    const f = foodsById.get(it.id);
    try { const amount = Calc.toBaseAmount(f, it.value, it.mode); return { f, amount, s: Calc.scaleFood(f, amount) }; }
    catch (e) { return { f, error: e.message }; }
  }
  function mealTarget(mId) { const p = prof(); const m = D.mealShares.meals.find(m => m.id === mId); return p && p.energyRange ? p.energyRange[0] * m.share : null; }

  const SHOP_CATS = [['all', 'ทั้งหมด'], ['starch', 'ข้าว-แป้ง'], ['veg', 'ผัก'], ['protein', 'เนื้อสัตว์ ไข่ ถั่ว'], ['fruit', 'ผลไม้'], ['milk', 'นม'], ['fat', 'ไขมัน'], ['other', 'เครื่องปรุง']];
  let shop = { cat: 'all', q: '', n: 24 };

  function renderStep2() {
    const p = prof();
    if (!p || p.error || p.breastMilkOnly) { $('#step2').innerHTML = '<p>เลือกกลุ่มวัยในขั้นที่ ① ให้ครบก่อน (ทารก 0–5 เดือนไม่มีการจัดจาน)</p>'; return; }
    $('#step2').innerHTML = `<h2>${Icons.ICON.two}จัดจาน · ${esc(p.label)}</h2>
      <div class="shop"><div class="shop-main">
        <input class="search" id="q" placeholder="ค้นวัตถุดิบ เช่น ข้าว ไข่ ปลา นม ผักบุ้ง" autocomplete="off" value="${esc(shop.q)}">
        <div class="chips">${SHOP_CATS.map(([k, l]) => `<button class="chipbtn${shop.cat === k ? ' on' : ''}" data-shopcat="${k}">${esc(l)}</button>`).join('')}</div>
        <div id="grid" class="pgrid"></div><div id="more"></div>
      </div><aside class="shop-side" id="side"></aside></div>`;
    renderGrid(); renderSide();
  }

  function renderSide() {
    const mId = state.meal, items = state.meals[mId];
    const calc = items.map(itemCalc);
    const ok = calc.filter(c => !c.error).map(c => ({ food: c.f, amount: c.amount }));
    const tot = Calc.sumItems(ok, ['energy', 'carb', 'protein', 'fat']);
    const tgt = mealTarget(mId);
    let h = `<div class="tabs">` + D.mealShares.meals.map(m => `<button data-meal="${m.id}" class="${m.id === mId ? 'on' : ''}">${esc(m.label)} (${state.meals[m.id].length})</button>`).join('') + `</div>
      <h3 class="side-h">จานของฉัน · ${items.length} อย่าง <span>เป้า ${tgt ? fmt(tgt, 0) + ' kcal' : '–'}</span></h3>
      <div class="plate-box">${Plate.draw(calc.map((c, i) => ({ idx: i, id: c.f.id, area: items[i].area || c.f.g, name: c.f.n, grams: c.error ? 100 : c.amount,
        titleText: esc(c.f.n + (c.error ? '' : ' ' + fmt(c.amount, 0) + ' ' + unitTh(c.f.u)) + (c.s && c.s.energy ? ' · ' + fmt(c.s.energy[0], 0) + ' kcal' : '')) })), IMGS)}</div>`;
    if (tgt) {
      const e = tot.energy.lo, pct = e / tgt * 100;
      h += `<div class="kbar"><div class="bar"><i style="width:${Math.min(100, pct)}%"></i></div><p>${fmt(e, 0)} / ${fmt(tgt, 0)} kcal · <b>${tgt - e >= 0 ? 'เหลือ ' + fmt(tgt - e, 0) : 'เกิน ' + fmt(e - tgt, 0)} kcal</b>${tot.energy.missing ? ` <span class="na">(ไม่มีค่าพลังงาน ${tot.energy.missing} รายการ)</span>` : ''}</p></div>`;
    }
    h += `<ul class="cart">` + calc.map((c, i) => {
      const it = items[i], f = c.f, ar = it.area || f.g;
      const kc = c.error || !c.s.energy ? '<span class="na">n.a.</span>' : fmt(c.s.energy[0], 0) + ' kcal';
      return `<li><span class="num-dot">${i + 1}</span><div class="cart-img">${Plate.thumb(f.g, f.n, f.id, IMGS)}</div>
        <div class="cart-body"><b>${esc(f.n)}</b>
          <div class="cart-ctl"><input data-i="${i}" data-f="value" type="number" step="any" value="${esc(it.value)}" aria-label="ปริมาณ">
          <select data-i="${i}" data-f="mode" aria-label="หน่วย"><option value="unit"${it.mode !== 'kcal' ? ' selected' : ''}>${esc(unitTh(f.u))}</option><option value="kcal"${it.mode === 'kcal' ? ' selected' : ''}>kcal</option></select>
          <span class="cart-k">${c.error ? '' : '= ' + fmt(c.amount, 0) + ' ' + esc(unitTh(f.u)) + ' · '}${kc}</span></div>
          ${c.error ? `<div class="err">${esc(c.error)}</div>` : ''}
          <label class="cart-area">ช่องบนจาน <select data-i="${i}" data-f="area">${Object.entries(Plate.AREAS).map(([k, a]) => `<option value="${k}"${k === ar ? ' selected' : ''}>${esc(a.label)}</option>`).join('')}</select></label>
        </div><button class="x" data-del="${i}" title="เอาออกจากจาน" aria-label="เอาออกจากจาน">×</button></li>`;
    }).join('') + `</ul>${items.length ? '' : '<p class="na">ยังไม่มีอาหารในจาน</p>'}
      <p class="note">C ${fmt(tot.carb.lo, 1)} g · P ${fmt(tot.protein.lo, 1)} g · ไขมัน ${fmt(tot.fat.lo, 1)} g · n.a. = ไม่มีข้อมูล ไม่ใช่ 0</p>
      <p><button class="btn" data-go="3">ดูสรุปทั้งวัน →</button></p>`;
    $('#side').innerHTML = h;
  }

  function renderGrid() {
    const grid = $('#grid'); if (!grid) return;
    const n = x => String(x).normalize('NFKC').toLowerCase().replace(/[\s,\-()·]/g, '');
    const qq = n(shop.q);
    const list = DB.foods.filter(f => (shop.cat === 'all' || f.g === shop.cat) && (!qq || n(f.n + f.a + f.id).includes(qq)))
      .sort((a, b) => (IMGS.has(b.id) - IMGS.has(a.id)) || (b.v.energy !== undefined) - (a.v.energy !== undefined) || Object.keys(b.v).length - Object.keys(a.v).length);
    const inPlate = new Set(state.meals[state.meal].map(it => it.id));
    grid.innerHTML = list.slice(0, shop.n).map(f => {
      const e = f.v.energy !== undefined ? Calc.range(f.v.energy)[0] / f.b * 100 : null;
      return `<article class="pcard"><div class="pimg">${Plate.thumb(f.g, f.n, f.id, IMGS)}</div>
        <div class="pbody"><h4>${esc(f.n)}</h4>
          <p class="pmeta">${e != null ? `<b>${fmt(e, 0)}</b> kcal / 100 ${esc(unitTh(f.u))}` : '<span class="tag w">ไม่มีค่าพลังงาน</span>'}</p>
          <p class="psrc">${f.s.includes('USDA') ? 'USDA · ข้อมูลต่างประเทศ' : esc(f.s)} · มีข้อมูล ${Object.keys(f.v).length}/${DB.nutrients.length}</p>
          <button class="btn add${inPlate.has(f.id) ? ' sec' : ''}" data-add="${esc(f.id)}">${inPlate.has(f.id) ? 'ใส่เพิ่มอีก' : 'ใส่จาน'}</button></div></article>`;
    }).join('') || '<p>ไม่พบวัตถุดิบ</p>';
    $('#more').innerHTML = list.length > shop.n ? `<button class="btn sec" id="moreBtn">ดูเพิ่ม (${list.length - shop.n} รายการ)</button>` : '';
  }

  function toast(msg) { let t = $('#toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); } t.textContent = msg; t.className = 'show'; clearTimeout(toast.tm); toast.tm = setTimeout(() => t.className = '', 1600); }

  /* ---------- step 3 ---------- */
  const PE = { carb: [45, 65], la: [2.5, 9], ala: [0.5, 0.6], satfat: [null, 10] };
  function peRange(k, p) { return k === 'fat' ? p.fatE : PE[k]; }
  function judge(k, total, p, pe) {
    if (!total || total.known === 0) return ['unk', 'ไม่มีข้อมูล'];
    const inc = total.missing > 0;
    if (k === 'energy') { const v = total.lo; return v < p.energyRange[0] ? (inc ? ['unk', 'ยังยืนยันไม่ได้'] : ['bad', 'ต่ำกว่าเกณฑ์']) : v > p.energyRange[1] ? ['bad', 'เกินเกณฑ์'] : ['ok', 'ผ่าน']; }
    if (k === 'protein') return total.lo >= p.protein ? ['ok', 'ผ่าน'] : inc ? ['unk', 'ยังยืนยันไม่ได้'] : ['bad', 'ต่ำกว่าเกณฑ์'];
    const r = peRange(k, p);
    if (r) { const x = pe && pe[k]; if (!x) return ['unk', 'คำนวณ %E ไม่ได้'];
      if (r[1] != null && x.value > r[1]) return ['bad', 'เกินช่วง']; if (r[0] != null && x.value < r[0]) return x.incomplete ? ['unk', 'ยังยืนยันไม่ได้'] : ['bad', 'ต่ำกว่าช่วง']; return x.incomplete ? ['unk', 'ผ่านจากค่าที่ทราบ'] : ['ok', 'ผ่าน']; }
    const t = p.targets[k]; if (!t || t.none) return ['', ''];
    if (t.min != null) return total.lo >= t.min ? ['ok', inc ? 'ถึงเกณฑ์จากค่าที่ทราบ' : 'ผ่าน'] : inc ? ['unk', 'ยังยืนยันไม่ได้'] : ['bad', 'ต่ำกว่าเกณฑ์'];
    if (t.max != null) return total.hi > t.max ? ['bad', 'เกินเกณฑ์'] : inc ? ['unk', 'ยังยืนยันไม่ได้'] : ['ok', 'ผ่าน'];
    return ['', ''];
  }
  function targetText(k, p) {
    if (k === 'energy') return `${fmt(p.energyRange[0], 0)}–${fmt(p.energyRange[1], 0)}`;
    if (k === 'protein') return `≥ ${fmt(p.protein, 1)}`;
    const r = peRange(k, p); if (r) return `${r[0] != null ? r[0] : ''}${r[0] != null && r[1] != null ? '–' : r[0] != null ? '+' : '< '}${r[1] != null ? r[1] : ''} %E`;
    const t = p.targets[k]; return !t || t.none ? '–' : (t.min != null ? '≥ ' + fmt(t.min, 2) : '≤ ' + fmt(t.max, 0)) + (t.src === 'ACT' ? ' *' : '');
  }
  function renderStep3() {
    const p = prof();
    if (!p || p.error || p.breastMilkOnly) { $('#step3').innerHTML = '<p>กรอกข้อมูลในขั้นที่ ① ให้ครบก่อน</p>'; return; }
    const per = {}, all = [];
    for (const m of D.mealShares.meals) { const ok = state.meals[m.id].map(itemCalc).filter(c => !c.error).map(c => ({ food: c.f, amount: c.amount })); per[m.id] = Calc.sumItems(ok, KEYS); all.push(...ok); }
    const day = Calc.sumItems(all, KEYS), pe = Calc.percentE(day);
    const show = !practice() || state.checked;
    const rows = KEYS.filter(k => MAIN.includes(k) ? (p.targets[k] || ['energy', 'carb', 'protein', 'fat', 'la', 'ala', 'satfat'].includes(k)) : p.targets[k]);
    let h = `<h2>${Icons.ICON.three}สรุปทั้งวัน · ${esc(p.label)}</h2><div class="scroll"><table><tr><th>สารอาหาร</th><th class="num">เป้าทั้งวัน</th>` +
      D.mealShares.meals.map(m => `<th class="num">${esc(m.label)}</th>`).join('') + `<th class="num">รวม</th><th class="num">%E</th><th>ผลตรวจ</th></tr>` +
      rows.map(k => {
        const d = day[k], j = show ? judge(k, d, p, pe) : ['', 'กด "ตรวจจาน"'];
        const x = pe && pe[k] ? fmt(pe[k].value, 1) + '%' : '';
        return `<tr><td>${esc(NUT[k].label)} <small class="na">${esc(NUT[k].unit)}</small></td><td class="num">${esc(targetText(k, p))}</td>` +
          D.mealShares.meals.map(m => { const c = per[m.id][k]; return `<td class="num">${c.known ? fmt(c.lo, 2) : c.missing ? '<span class="na">n.a.</span>' : '–'}</td>`; }).join('') +
          `<td class="num"><b>${d.known ? fmt(d.lo, 2) : d.missing ? '<span class="na">n.a.</span>' : '–'}</b>${d.missing ? `<br><span class="na" title="${esc(d.missingNames.join(', '))}">ขาดข้อมูล ${d.missing} รายการ</span>` : ''}</td>
          <td class="num">${x}</td><td class="${j[0]}">${esc(j[1])}</td></tr>`;
      }).join('') + `</table></div>
      <p class="note">%E คิดจากผลรวมกรัมทั้งวัน (C, P × 4; ไขมัน, LA, ALA, SFA × 9) ÷ พลังงานรวม ไม่เฉลี่ย % ของแต่ละมื้อ · "ยังยืนยันไม่ได้" = ยอดจากค่าที่ทราบยังไม่ถึงเกณฑ์ และมีรายการที่ไม่มีข้อมูล · * = ค่าฝึกในใบงาน</p>
      ${maternal() ? '<p class="note warn">ยาเสริมตามระบบฝากครรภ์/หลังคลอด แยกจากยอดอาหาร ให้ติดตามกับบุคลากรสุขภาพ · ไม่ใช้เกลือมากหรือเพิ่มตับเพื่อไล่ตัวเลข</p>' : ''}
      <p class="noprint"><button class="btn" id="checkPlate">ตรวจจาน</button> <button class="btn sec" id="print">ดาวน์โหลด PDF / พิมพ์</button> <button class="btn sec" id="copy">คัดลอกตาราง</button> <span id="copyMsg"></span></p>`;
    $('#step3').innerHTML = h;
  }

  /* ---------- wiring ---------- */
  const RENDER = [null, () => renderStep1(), () => renderStep2(), () => renderStep3()];
  function go(step) {
    document.querySelectorAll('.steps button').forEach(b => b.classList.toggle('on', b.dataset.step == step));
    for (const s of [1, 2, 3]) $('#step' + s).hidden = s != step;
    RENDER[step](); window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function rerender() { RENDER[document.querySelector('.steps .on').dataset.step](); }
  function changed() { state.answer = {}; state.checked = false; syncGroup(); save(); renderStep1(); }

  function wire() {
    document.addEventListener('click', e => {
      const t = e.target.closest('button'); if (!t) return;
      if (t.dataset.step) go(+t.dataset.step);
      else if (t.dataset.go) go(+t.dataset.go);
      else if (t.dataset.cat) { state.cat = t.dataset.cat; state.band = null; state.groupId = null; if (maternal()) state.sex = 'F'; changed(); }
      else if (t.dataset.meal) { state.meal = t.dataset.meal; save(); renderSide(); renderGrid(); }
      else if (t.dataset.add) { const f = foodsById.get(t.dataset.add); state.meals[state.meal].push({ id: f.id, value: 100, mode: 'unit' }); state.checked = false; save(); renderSide(); renderGrid(); toast('ใส่ ' + f.n + ' ลงจานแล้ว'); }
      else if (t.dataset.del) { state.meals[state.meal].splice(+t.dataset.del, 1); save(); renderSide(); renderGrid(); }
      else if (t.dataset.shopcat) { shop.cat = t.dataset.shopcat; shop.n = 24; document.querySelectorAll('.chipbtn').forEach(b => b.classList.toggle('on', b === t)); renderGrid(); }
      else if (t.id === 'moreBtn') { shop.n += 24; renderGrid(); }
      else if (t.id === 'checkAns') {
        const p = prof(), e1 = Number($('#ansE').value), p1 = Number($('#ansP').value);
        state.answer = { e: $('#ansE').value, p: $('#ansP').value };
        const okE = e1 === p.energyRange[0], okP = Math.abs(p1 - p.protein) < 0.05;
        if (okE && okP) { state.answer.revealed = true; save(); renderStep1(); }
        else { $('#ansMsg').innerHTML = `<span class="${okE ? 'ok' : 'bad'}">พลังงาน ${okE ? 'ถูก' : 'ยังไม่ถูก'}</span> · <span class="${okP ? 'ok' : 'bad'}">โปรตีน ${okP ? 'ถูก' : 'ยังไม่ถูก'}</span> <button class="btn sec" id="reveal">ดูเฉลย</button>`; save(); }
      }
      else if (t.id === 'reveal') { state.answer.revealed = true; save(); renderStep1(); }
      else if (t.id === 'checkPlate') { state.checked = true; save(); renderStep3(); }
      else if (t.id === 'print') { try { window.print(); } catch (x) { /* not allowed here */ } }
      else if (t.id === 'copy') {
        const rows = [...document.querySelectorAll('#step3 table tr')].map(tr => [...tr.children].map(c => c.innerText.replace(/\s+/g, ' ').trim()).join('\t')).join('\n');
        (navigator.clipboard ? navigator.clipboard.writeText(rows) : Promise.reject()).then(() => $('#copyMsg').textContent = 'คัดลอกแล้ว', () => $('#copyMsg').textContent = 'เบราว์เซอร์ไม่อนุญาตให้คัดลอก');
      }
    });
    document.addEventListener('input', e => {
      const t = e.target;
      if (['age', 'weight', 'pal'].includes(t.id)) { state[t.id] = t.value; state.answer = {}; save(); clearTimeout(wire.tm); wire.tm = setTimeout(() => { const id = t.id; renderStep1(); const el = $('#' + id); if (el) el.focus(); }, 600); }
      else if (t.id === 'q') { shop.q = t.value; shop.n = 24; renderGrid(); }
    });
    document.addEventListener('change', e => {
      const t = e.target;
      if (t.id === 'sex') { state.sex = t.value; changed(); }
      else if (t.id === 'band') { state.band = t.value || null; changed(); }
      else if (t.id === 'grp') { state.groupId = t.value || null; changed(); }
      else if (t.id === 'base') { state.base = t.value; changed(); }
      else if (t.id === 'mode') { state.mode = t.value; if (t.value === 'calc' && !state.weight) Object.assign(state, state.cat === 'lact' ? { age: 28, weight: 55 } : { age: 26, weight: 53 }); changed(); }
      else if (t.id === 'activity') { state.activity = t.checked; changed(); }
      else if (t.dataset.i != null) { state.meals[state.meal][+t.dataset.i][t.dataset.f] = t.value; state.checked = false; save(); renderSide(); }
      else if (t.id === 'practice') rerender();
    });
  }

  async function init() {
    load();
    try {
      const [d, g, im] = await Promise.all([fetch('data/foods.json').then(r => r.json()), fetch('data/groups.json').then(r => r.json()), fetch('data/images.json').then(r => r.ok ? r.json() : []).catch(() => [])]);
      IMGS = new Set(im);
      DB = d; D = g; DB.nutrients.forEach(n => NUT[n.key] = n); foodsById = new Map(DB.foods.map(f => [f.id, f]));
      KEYS = DB.nutrients.map(n => n.key);
      for (const m of Object.keys(state.meals)) state.meals[m] = state.meals[m].filter(it => foodsById.has(it.id));
      if (!canCalc()) state.mode = 'table';
      $('#logo').innerHTML = Icons.ICON.logo; document.querySelectorAll('[data-ic]').forEach(e => e.innerHTML = Icons.ICON[e.dataset.ic]);
      $('#loading').hidden = true;
      $('#foot').innerHTML = `เวอร์ชันทดลอง · เกณฑ์: Thai DRI 2563 หน้า 439–442 · ฐานอาหาร ${DB.foods.length} ระเบียน (Thai DRI 2563, USDA SR Legacy 2018) จาก "ค้นอาหารและสารอาหาร" รุ่น 1.1.3 · ไม่มีการส่งข้อมูลที่กรอกออกจากเครื่อง`;
      wire(); go(1);
    } catch (e) { $('#loading').textContent = 'โหลดข้อมูลไม่สำเร็จ: ' + e.message; }
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  init();
})();
