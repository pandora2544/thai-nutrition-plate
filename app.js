'use strict';
(function () {
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n, d = 1) => n == null || !Number.isFinite(n) ? '–' : Number(n.toFixed(d)).toLocaleString('th-TH', { maximumFractionDigits: d });
  const unitTh = u => ({ g: 'g', ml: 'ml' }[u] || u);
  const MAIN = ['energy', 'carb', 'protein', 'fat', 'la', 'ala', 'satfat', 'dha', 'epa_dha', 'sodium'];
  const STORE = 'tnp-state-v2';
  const CATS = [
    { id: 'inf', label: 'ทารก', icon: '👶', bands: ['inf0', 'inf6'], sex: true },
    { id: 'child', label: 'เด็ก 1–8 ปี', icon: '🧒', bands: ['c1', 'c4', 'c6'], sex: true },
    { id: 'teen', label: 'วัยรุ่น 9–18 ปี', icon: '🧑', bands: ['t9', 't13', 't16'], sex: true },
    { id: 'adult', label: 'ผู้ใหญ่ 19–60 ปี', icon: '🧑‍💼', bands: ['a19', 'a31', 'a51'], sex: true },
    { id: 'elder', label: 'ผู้สูงอายุ 61 ปีขึ้นไป', icon: '🧓', bands: ['a61', 'a71'], sex: true },
    { id: 'preg', label: 'หญิงตั้งครรภ์', icon: '🤰', groups: ['p1', 'p2', 'p3'] },
    { id: 'lact', label: 'หญิงให้นมบุตร', icon: '🤱', groups: ['l0', 'l6'] }];
  const BANDLAB = { inf0: '0–5 เดือน', inf6: '6–11 เดือน', c1: '1–3 ปี', c4: '4–5 ปี', c6: '6–8 ปี', t9: '9–12 ปี', t13: '13–15 ปี', t16: '16–18 ปี', a19: '19–30 ปี', a31: '31–50 ปี', a51: '51–60 ปี', a61: '61–70 ปี', a71: '71 ปีขึ้นไป' };

  let DB, D, NUT = {}, foodsById, KEYS = [];
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
    let h = `<h2>① เลือกกลุ่มวัย</h2><div class="grid">` + CATS.map(x => `<button class="card" data-cat="${x.id}" aria-pressed="${x.id === state.cat}"><span class="ic">${x.icon}</span><b>${esc(x.label)}</b></button>`).join('') + '</div>';
    if (c) {
      h += '<div class="row" style="margin-top:14px">';
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
      h += `<h3>ความต้องการต่อวัน · ${esc(p.label)}</h3>`;
      if (!reveal) {
        h += `<p>โหมดฝึก: คำนวณเองก่อน แล้วกรอกคำตอบเพื่อตรวจ</p><div class="row">
          <label>พลังงานหลังปัด (kcal)<input id="ansE" type="number" value="${esc(state.answer.e || '')}"></label>
          <label>โปรตีนขั้นต่ำ (g)<input id="ansP" type="number" step="0.1" value="${esc(state.answer.p || '')}"></label>
          <button class="btn" id="checkAns">ตรวจคำตอบ</button></div><p id="ansMsg"></p>`;
      } else {
        h += `<table><tr><th>รายการ</th><th class="num">ค่า</th><th>ที่มา / วิธีคิด</th></tr>
          <tr><td><b>พลังงาน</b></td><td class="num"><b>${fmt(p.energyRange[0], 0)}–${fmt(p.energyRange[1], 0)} kcal</b></td><td>${esc(p.energyHow)}</td></tr>
          <tr><td><b>โปรตีน</b></td><td class="num"><b>≥ ${fmt(p.protein, 1)} g</b></td><td>${esc(p.proteinHow)}</td></tr></table>`;
      }
      h += `<h3>วิตามินและแร่ธาตุต่อวัน</h3><table><tr><th>สารอาหาร</th><th class="num">เกณฑ์</th><th>ชนิด</th><th>หมายเหตุ</th></tr>` +
        Object.entries(p.targets).map(([k, t]) => `<tr><td>${esc(NUT[k] ? NUT[k].label : k)}</td><td class="num">${t.none ? '–' : t.min != null ? '≥ ' + fmt(t.min, 2) : '≤ ' + fmt(t.max, 0)} ${esc(NUT[k] ? NUT[k].unit : '')}${t.iu ? ` <small class="na">(${fmt(t.iu, 0)} IU)</small>` : ''}</td>
          <td>${t.src === 'ACT' ? '<span class="tag w">ค่าฝึกในใบงาน</span>' : esc(t.type || '')}</td><td>${esc(t.note || '')}</td></tr>`).join('') + `</table>
        <p class="note">สัดส่วนพลังงาน: คาร์โบไฮเดรต 45–65%E · ไขมัน ${p.fatE ? p.fatE.join('–') : '–'}%E${p.fatNote ? ' (' + esc(p.fatNote) + ')' : ''} · LA 2.5–9%E · ALA 0.5–0.6%E · ไขมันอิ่มตัว &lt;10%E · ${esc(D.percentENote)}</p>
        <p class="note">${esc(D.source)} · RDA = ค่าที่แนะนำ, AI = ปริมาณที่เพียงพอ · <b>${esc(D.verification)}</b></p>
        <p><button class="btn" data-go="2">ไปจัดจาน →</button></p>`;
    }
    $('#step1').innerHTML = h;
  }
  function modeBox() {
    if (!canCalc()) return '';
    let h = `<div class="row" style="margin-top:10px"><label>วิธีหาพลังงาน<select id="mode"><option value="table"${state.mode === 'table' ? ' selected' : ''}>ตามตาราง Thai DRI</option><option value="calc"${state.mode === 'calc' ? ' selected' : ''}>คำนวณจากน้ำหนักจริง (สูตรในใบงาน)</option></select></label>`;
    if (state.mode === 'calc') h += `<label>อายุ (ปี)<input id="age" type="number" value="${esc(state.age)}"></label>
      <label>${state.cat === 'preg' ? 'น้ำหนักก่อนตั้งครรภ์' : 'น้ำหนัก'} (kg)<input id="weight" type="number" step="0.1" value="${esc(state.weight)}"></label>
      <label>PAL<input id="pal" type="number" step="0.05" value="${esc(state.pal)}"></label>`;
    if (maternal()) h += `<label style="align-self:center"><input type="checkbox" id="activity"${state.activity ? ' checked' : ''} style="width:auto;display:inline"> ใช้เกณฑ์เพิ่มของใบงาน (DHA, Na, เหล็ก 20 mg)</label>`;
    return h + '</div>' + (state.mode === 'calc' ? `<p class="note">${esc(D.energyCalc.source)}; ส่วนเพิ่มของหญิงตั้งครรภ์/ให้นมใช้ค่าสูงของช่วงในตารางที่ 1</p>` : '');
  }

  /* ---------- step 2 ---------- */
  function itemCalc(it) {
    const f = foodsById.get(it.id);
    try { const amount = Calc.toBaseAmount(f, it.value, it.mode); return { f, amount, s: Calc.scaleFood(f, amount) }; }
    catch (e) { return { f, error: e.message }; }
  }
  function mealTarget(mId) { const p = prof(); const m = D.mealShares.meals.find(m => m.id === mId); return p && p.energyRange ? p.energyRange[0] * m.share : null; }

  function renderStep2() {
    const p = prof();
    if (!p || p.error || p.breastMilkOnly) { $('#step2').innerHTML = '<p>เลือกกลุ่มวัยในขั้นที่ ① ให้ครบก่อน (ทารก 0–5 เดือนไม่มีการจัดจาน)</p>'; return; }
    const mId = state.meal, items = state.meals[mId];
    const calc = items.map(itemCalc);
    const ok = calc.filter(c => !c.error).map(c => ({ food: c.f, amount: c.amount }));
    const tot = Calc.sumItems(ok, KEYS);
    const tgt = mealTarget(mId);
    let h = `<h2>② จัดจาน · ${esc(p.label)}</h2><div class="tabs noprint">` + D.mealShares.meals.map(m => `<button data-meal="${m.id}" class="${m.id === mId ? 'on' : ''}">${esc(m.label)} (${state.meals[m.id].length})</button>`).join('') + `</div>
      <div class="two"><div class="noprint"><input class="search" id="q" placeholder="ค้นอาหาร เช่น ข้าว ไข่ ปลา นม ผัก" autocomplete="off"><div class="results" id="res"></div></div><div>
      <h3>${esc(D.mealShares.meals.find(m => m.id === mId).label)} · เป้า ${tgt ? fmt(tgt, 0) + ' kcal' : '–'}</h3>
      <table><tr><th>รายการ</th><th>ปริมาณ</th><th class="num">g/ml</th><th class="num">kcal</th><th class="num">C (g)</th><th class="num">P (g)</th><th class="num">ไขมัน (g)</th><th></th></tr>` +
      calc.map((c, i) => {
        const it = items[i], f = c.f;
        const cell = k => c.error ? '' : c.s[k] ? fmt(c.s[k][0], 1) + (c.s[k][1] !== c.s[k][0] ? '–' + fmt(c.s[k][1], 1) : '') : '<span class="na">n.a.</span>';
        return `<tr><td>${esc(f.n)}<br><small class="na">${esc(f.id)} · ${esc(f.s)}</small></td>
          <td><input data-i="${i}" data-f="value" type="number" step="any" value="${esc(it.value)}"> <select data-i="${i}" data-f="mode"><option value="unit"${it.mode !== 'kcal' ? ' selected' : ''}>${esc(unitTh(f.u))}</option><option value="kcal"${it.mode === 'kcal' ? ' selected' : ''}>kcal</option></select>${c.error ? `<div class="err">${esc(c.error)}</div>` : ''}</td>
          <td class="num">${c.error ? '' : fmt(c.amount, 1) + ' ' + esc(unitTh(f.u))}</td><td class="num">${cell('energy')}</td><td class="num">${cell('carb')}</td><td class="num">${cell('protein')}</td><td class="num">${cell('fat')}</td>
          <td><button class="x noprint" data-del="${i}" title="ลบ">×</button></td></tr>`;
      }).join('') +
      `<tr><th>รวมมื้อนี้</th><th></th><th></th>${['energy', 'carb', 'protein', 'fat'].map(k => `<th class="num">${fmt(tot[k].lo, 1)}${tot[k].missing ? `<br><span class="na">n.a. ${tot[k].missing}</span>` : ''}</th>`).join('')}<th></th></tr></table>`;
    if (tgt && tot.energy.known) {
      const pct = tot.energy.lo / tgt * 100;
      h += `<p>พลังงานมื้อนี้ ${fmt(tot.energy.lo, 0)} / ${fmt(tgt, 0)} kcal · <b>${tgt - tot.energy.lo >= 0 ? 'เหลือ ' + fmt(tgt - tot.energy.lo, 0) : 'เกิน ' + fmt(tot.energy.lo - tgt, 0)} kcal</b></p><div class="bar"><i style="width:${Math.min(100, pct)}%"></i></div>`;
    }
    h += `<p class="note">กรอกปริมาณเป็น g/ml หรือเลือก kcal ได้ · n.a. = ไม่มีข้อมูล ไม่ใช่ 0 · รายการจาก Thai DRI ส่วนใหญ่มีสารอาหารเดียวและไม่มีพลังงาน</p>
      <p class="noprint"><button class="btn" data-go="3">ดูสรุปทั้งวัน →</button></p></div></div>`;
    $('#step2').innerHTML = h;
    renderSearch('');
  }

  function renderSearch(q) {
    const box = $('#res'); if (!box) return;
    const n = s => String(s).normalize('NFKC').toLowerCase().replace(/[\s,\-()·]/g, '');
    const qq = n(q);
    const list = DB.foods.filter(f => !qq || n(f.n + f.a + f.id).includes(qq))
      .sort((a, b) => (b.v.energy !== undefined) - (a.v.energy !== undefined) || Object.keys(b.v).length - Object.keys(a.v).length).slice(0, 30);
    box.innerHTML = list.map(f => `<button class="res" data-add="${esc(f.id)}"><b>${esc(f.n)}</b><small>${esc(f.src)} · ต่อ ${f.b} ${esc(unitTh(f.u))}</small><br>
      ${f.v.energy !== undefined ? `<span class="tag">${fmt(Calc.range(f.v.energy)[0], 0)} kcal</span>` : '<span class="tag w">ไม่มีค่าพลังงาน</span>'}
      <span class="tag${Object.keys(f.v).length === 1 ? ' w' : ''}">มีข้อมูล ${Object.keys(f.v).length}/${DB.nutrients.length}</span>${f.s.includes('USDA') ? '<span class="tag">ข้อมูลต่างประเทศ</span>' : ''}</button>`).join('') || '<p>ไม่พบอาหาร</p>';
  }

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
    let h = `<h2>③ สรุปทั้งวัน · ${esc(p.label)}</h2><table><tr><th>สารอาหาร</th><th class="num">เป้าทั้งวัน</th>` +
      D.mealShares.meals.map(m => `<th class="num">${esc(m.label)}</th>`).join('') + `<th class="num">รวม</th><th class="num">%E</th><th>ผลตรวจ</th></tr>` +
      rows.map(k => {
        const d = day[k], j = show ? judge(k, d, p, pe) : ['', 'กด "ตรวจจาน"'];
        const x = pe && pe[k] ? fmt(pe[k].value, 1) + '%' : '';
        return `<tr><td>${esc(NUT[k].label)} <small class="na">${esc(NUT[k].unit)}</small></td><td class="num">${esc(targetText(k, p))}</td>` +
          D.mealShares.meals.map(m => { const c = per[m.id][k]; return `<td class="num">${c.known ? fmt(c.lo, 2) : c.missing ? '<span class="na">n.a.</span>' : '–'}</td>`; }).join('') +
          `<td class="num"><b>${d.known ? fmt(d.lo, 2) : d.missing ? '<span class="na">n.a.</span>' : '–'}</b>${d.missing ? `<br><span class="na" title="${esc(d.missingNames.join(', '))}">ขาดข้อมูล ${d.missing} รายการ</span>` : ''}</td>
          <td class="num">${x}</td><td class="${j[0]}">${esc(j[1])}</td></tr>`;
      }).join('') + `</table>
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
      else if (t.dataset.meal) { state.meal = t.dataset.meal; save(); renderStep2(); }
      else if (t.dataset.add) { state.meals[state.meal].push({ id: t.dataset.add, value: 100, mode: 'unit' }); state.checked = false; save(); const q = $('#q').value; renderStep2(); $('#q').value = q; renderSearch(q); }
      else if (t.dataset.del) { state.meals[state.meal].splice(+t.dataset.del, 1); save(); renderStep2(); }
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
      else if (t.id === 'q') renderSearch(t.value);
    });
    document.addEventListener('change', e => {
      const t = e.target;
      if (t.id === 'sex') { state.sex = t.value; changed(); }
      else if (t.id === 'band') { state.band = t.value || null; changed(); }
      else if (t.id === 'grp') { state.groupId = t.value || null; changed(); }
      else if (t.id === 'base') { state.base = t.value; changed(); }
      else if (t.id === 'mode') { state.mode = t.value; if (t.value === 'calc' && !state.weight) Object.assign(state, state.cat === 'lact' ? { age: 28, weight: 55 } : { age: 26, weight: 53 }); changed(); }
      else if (t.id === 'activity') { state.activity = t.checked; changed(); }
      else if (t.dataset.i != null) { state.meals[state.meal][+t.dataset.i][t.dataset.f] = t.value; state.checked = false; save(); const q = $('#q') ? $('#q').value : ''; renderStep2(); if ($('#q')) { $('#q').value = q; renderSearch(q); } }
      else if (t.id === 'practice') rerender();
    });
  }

  async function init() {
    load();
    try {
      const [d, g] = await Promise.all([fetch('data/foods.json').then(r => r.json()), fetch('data/groups.json').then(r => r.json())]);
      DB = d; D = g; DB.nutrients.forEach(n => NUT[n.key] = n); foodsById = new Map(DB.foods.map(f => [f.id, f]));
      KEYS = DB.nutrients.map(n => n.key);
      for (const m of Object.keys(state.meals)) state.meals[m] = state.meals[m].filter(it => foodsById.has(it.id));
      if (!canCalc()) state.mode = 'table';
      $('#loading').hidden = true;
      $('#foot').innerHTML = `เวอร์ชันทดลอง · เกณฑ์: Thai DRI 2563 หน้า 439–442 · ฐานอาหาร ${DB.foods.length} ระเบียน (Thai DRI 2563, USDA SR Legacy 2018) จาก "ค้นอาหารและสารอาหาร" รุ่น 1.1.3 · ไม่มีการส่งข้อมูลที่กรอกออกจากเครื่อง`;
      wire(); go(1);
    } catch (e) { $('#loading').textContent = 'โหลดข้อมูลไม่สำเร็จ: ' + e.message; }
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  init();
})();
