'use strict';
(function () {
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n, d = 1) => n == null || !Number.isFinite(n) ? '–' : Number(n.toFixed(d)).toLocaleString('th-TH', { maximumFractionDigits: d });
  const unitTh = u => ({ g: 'g', ml: 'ml' }[u] || u);
  const KEYS = ['energy', 'carb', 'protein', 'fat', 'la', 'ala', 'dha', 'epa_dha', 'folate_dfe', 'iodine', 'calcium', 'iron', 'vit_a', 'vit_c', 'vit_b12', 'vit_d', 'sodium', 'satfat'];
  const STORE = 'tnp-state-v1';

  let DB, G, NUT = {}, foodsById;
  let state = { groupId: null, age: '', weight: '', pal: '1.4', meal: 'm1', meals: { m1: [], m2: [], m3: [] }, checked: false, answer: {} };

  function load() { try { const s = JSON.parse(localStorage.getItem(STORE) || 'null'); if (s && s.meals) state = Object.assign(state, s); } catch (e) { /* storage unavailable */ } }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* ignore */ } }

  const group = () => G.groups.find(g => g.id === state.groupId);
  function needs() { const g = group(); if (!g || g.status !== 'active') return null; try { return Calc.needs(g, G.energyRules, state.age, state.weight, state.pal); } catch (e) { return { error: e.message }; } }
  const practice = () => $('#practice').checked;

  /* ---------- step 1 ---------- */
  function renderStep1() {
    const g = group();
    let h = `<h2>① เลือกกลุ่มวัย</h2><p class="note">${esc(G.note)}</p><div class="grid">` +
      G.groups.map(x => `<button class="card" data-g="${x.id}" aria-pressed="${x.id === state.groupId}" ${x.status === 'active' ? '' : 'disabled'}>
        <span class="ic">${x.icon}</span><b>${esc(x.label)}</b><small>${x.status === 'active' ? 'พร้อมใช้' : 'รอข้อมูล Thai DRI'}</small></button>`).join('') + '</div>';
    if (g && g.status === 'active') {
      h += `<h3>ข้อมูลผู้รับบริการ (กรณีสมมุติ)</h3><div class="row">
        <label>อายุ (ปี)<input id="age" type="number" value="${esc(state.age)}"></label>
        <label>${esc(g.weightLabel)}<input id="weight" type="number" step="0.1" value="${esc(state.weight)}"></label>
        <label>PAL<input id="pal" type="number" step="0.05" value="${esc(state.pal)}"></label></div>`;
      const n = needs();
      if (n && n.error) h += `<p class="err">${esc(n.error)}</p>`;
      else if (n) {
        const reveal = !practice() || state.answer.revealed;
        h += `<h3>ความต้องการต่อวัน</h3>`;
        if (!reveal) {
          h += `<p>โหมดฝึก: คำนวณเองก่อน แล้วกรอกคำตอบเพื่อตรวจ</p><div class="row">
            <label>พลังงานหลังปัด (kcal)<input id="ansE" type="number" value="${esc(state.answer.e || '')}"></label>
            <label>โปรตีนขั้นต่ำ (g)<input id="ansP" type="number" step="0.1" value="${esc(state.answer.p || '')}"></label>
            <button class="btn" id="checkAns">ตรวจคำตอบ</button></div><p id="ansMsg"></p>`;
        } else {
          h += `<table><tr><th>รายการ</th><th class="num">ค่า</th><th>วิธีคิด</th></tr>
            <tr><td>BMR</td><td class="num">${fmt(n.bmr, 2)} kcal</td><td>${esc(bmrText())}</td></tr>
            <tr><td>พลังงานก่อนปัด</td><td class="num">${fmt(n.raw, 2)} kcal</td><td>BMR × ${esc(state.pal)} + ${g.energyAdd}</td></tr>
            <tr><td><b>พลังงานหลังปัด</b></td><td class="num"><b>${fmt(n.energy, 0)} kcal</b></td><td>ปัดขึ้นขั้นละ 50 kcal · เกณฑ์ 100–105% = ${fmt(n.energyRange[0], 0)}–${fmt(n.energyRange[1], 1)}</td></tr>
            <tr><td><b>โปรตีนขั้นต่ำ</b></td><td class="num"><b>${fmt(n.protein, 1)} g</b></td><td>1.0 × น้ำหนัก + ${g.proteinAdd}</td></tr></table>
            <p class="note">ที่มา: ${esc(G.energyRules.source)}</p>`;
        }
        h += `<h3>เป้าหมายสารอาหารต่อวัน</h3><table><tr><th>สารอาหาร</th><th class="num">เกณฑ์</th><th>หมายเหตุ</th></tr>` +
          Object.entries(g.targets).map(([k, t]) => `<tr><td>${esc(NUT[k].label)}</td><td class="num">${t.min != null ? '≥ ' + t.min : '≤ ' + t.max} ${esc(NUT[k].unit)}</td><td>${esc(t.flag || '')}</td></tr>`).join('') +
          Object.entries(G.energyRules.percentE).map(([k, r]) => `<tr><td>${esc(NUT[k].label)}</td><td class="num">${r[0] != null ? r[0] : ''}${r[0] != null && r[1] != null ? '–' : r[0] != null ? '+' : '≤ '}${r[1] != null ? r[1] : ''} %E</td><td>คิดจากผลรวมกรัม</td></tr>`).join('') +
          `</table><p class="note">${esc(g.source)}</p><p><button class="btn" data-go="2">ไปจัดจาน →</button></p>`;
      }
    }
    $('#step1').innerHTML = h;
  }
  function bmrText() { const a = Number(state.age); const r = G.energyRules.bmrFemale.find(r => a >= r.minAge && (a < r.maxAge || a === 60)); return r ? `${r.a} × ${state.weight} + ${r.b}` : ''; }

  /* ---------- step 2 ---------- */
  function itemCalc(it) {
    const f = foodsById.get(it.id);
    try { const amount = Calc.toBaseAmount(f, it.value, it.mode); return { f, amount, s: Calc.scaleFood(f, amount) }; }
    catch (e) { return { f, error: e.message }; }
  }
  function mealTarget(mId) { const n = needs(); const m = G.mealShares.meals.find(m => m.id === mId); return n && !n.error ? n.energy * m.share : null; }

  function renderStep2() {
    if (!group() || group().status !== 'active') { $('#step2').innerHTML = '<p>เลือกกลุ่มวัยในขั้นที่ ① ก่อน</p>'; return; }
    const mId = state.meal, items = state.meals[mId];
    const calc = items.map(itemCalc);
    const ok = calc.filter(c => !c.error).map(c => ({ food: c.f, amount: c.amount }));
    const tot = Calc.sumItems(ok, KEYS);
    const tgt = mealTarget(mId);
    let h = `<h2>② จัดจาน</h2><div class="tabs noprint">` + G.mealShares.meals.map(m => `<button data-meal="${m.id}" class="${m.id === mId ? 'on' : ''}">${esc(m.label)} (${state.meals[m.id].length})</button>`).join('') + `</div>
      <div class="two"><div class="noprint"><input class="search" id="q" placeholder="ค้นอาหาร เช่น ข้าว ไข่ ปลา นม ผัก" autocomplete="off"><div class="results" id="res"></div></div><div>
      <h3>${esc(G.mealShares.meals.find(m => m.id === mId).label)} · เป้า ${tgt ? fmt(tgt, 0) + ' kcal' : '–'}</h3>
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
      h += `<p>พลังงานมื้อนี้ ${fmt(tot.energy.lo, 0)} / ${fmt(tgt, 0)} kcal · <b>เหลือ ${fmt(tgt - tot.energy.lo, 0)} kcal</b></p><div class="bar"><i style="width:${Math.min(100, pct)}%"></i></div>`;
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
  function judge(k, total, n, g, pe) {
    if (!total || total.known === 0) return ['unk', 'ไม่มีข้อมูล'];
    const inc = total.missing > 0;
    if (k === 'energy') { const v = total.lo; return v < n.energyRange[0] ? (inc ? ['unk', 'ยังยืนยันไม่ได้'] : ['bad', 'ต่ำกว่าเกณฑ์']) : v > n.energyRange[1] ? ['bad', 'เกินเกณฑ์'] : ['ok', 'ผ่าน']; }
    if (k === 'protein') return total.lo >= n.protein ? ['ok', 'ผ่าน'] : inc ? ['unk', 'ยังยืนยันไม่ได้'] : ['bad', 'ต่ำกว่าเกณฑ์'];
    const r = G.energyRules.percentE[k];
    if (r) { const p = pe && pe[k]; if (!p) return ['unk', 'คำนวณ %E ไม่ได้']; const lo = r[0], hi = r[1];
      if (hi != null && p.value > hi) return ['bad', 'เกินช่วง']; if (lo != null && p.value < lo) return p.incomplete ? ['unk', 'ยังยืนยันไม่ได้'] : ['bad', 'ต่ำกว่าช่วง']; return p.incomplete ? ['unk', 'ผ่านจากค่าที่ทราบ'] : ['ok', 'ผ่าน']; }
    const t = g.targets[k]; if (!t) return ['', ''];
    if (t.min != null) return total.lo >= t.min ? ['ok', inc ? 'ถึงเกณฑ์จากค่าที่ทราบ' : 'ผ่าน'] : inc ? ['unk', 'ยังยืนยันไม่ได้'] : ['bad', 'ต่ำกว่าเกณฑ์'];
    if (t.max != null) return total.hi > t.max ? ['bad', 'เกินเกณฑ์'] : inc ? ['unk', 'ยังยืนยันไม่ได้'] : ['ok', 'ผ่าน'];
    return ['', ''];
  }
  function targetText(k, n, g) {
    if (k === 'energy') return `${fmt(n.energyRange[0], 0)}–${fmt(n.energyRange[1], 1)}`;
    if (k === 'protein') return `≥ ${fmt(n.protein, 1)}`;
    const r = G.energyRules.percentE[k]; if (r) return `${r[0] != null ? r[0] : ''}${r[0] != null && r[1] != null ? '–' : r[0] != null ? '+' : '≤ '}${r[1] != null ? r[1] : ''} %E`;
    const t = g.targets[k]; return t ? (t.min != null ? '≥ ' + t.min : '≤ ' + t.max) : '';
  }
  function renderStep3() {
    const g = group(), n = needs();
    if (!g || !n || n.error) { $('#step3').innerHTML = '<p>กรอกข้อมูลในขั้นที่ ① ให้ครบก่อน</p>'; return; }
    const per = {}, all = [];
    for (const m of G.mealShares.meals) { const ok = state.meals[m.id].map(itemCalc).filter(c => !c.error).map(c => ({ food: c.f, amount: c.amount })); per[m.id] = Calc.sumItems(ok, KEYS); all.push(...ok); }
    const day = Calc.sumItems(all, KEYS), pe = Calc.percentE(day);
    const show = !practice() || state.checked;
    let h = `<h2>③ สรุปทั้งวัน · ${esc(g.label)}</h2><table><tr><th>สารอาหาร</th><th class="num">เป้าทั้งวัน</th>` +
      G.mealShares.meals.map(m => `<th class="num">${esc(m.label)}</th>`).join('') + `<th class="num">รวม</th><th class="num">%E</th><th>ผลตรวจ</th></tr>` +
      KEYS.map(k => {
        const d = day[k], j = show ? judge(k, d, n, g, pe) : ['', 'กด "ตรวจจาน"'];
        const p = pe && pe[k] ? fmt(pe[k].value, 1) + '%' : '';
        return `<tr><td>${esc(NUT[k].label)} <small class="na">${esc(NUT[k].unit)}</small></td><td class="num">${esc(targetText(k, n, g))}</td>` +
          G.mealShares.meals.map(m => { const c = per[m.id][k]; return `<td class="num">${c.known ? fmt(c.lo, 2) : c.missing ? '<span class="na">n.a.</span>' : '–'}</td>`; }).join('') +
          `<td class="num"><b>${d.known ? fmt(d.lo, 2) : '<span class="na">n.a.</span>'}</b>${d.missing ? `<br><span class="na" title="${esc(d.missingNames.join(', '))}">ขาดข้อมูล ${d.missing} รายการ</span>` : ''}</td>
          <td class="num">${p}</td><td class="${j[0]}">${esc(j[1])}</td></tr>`;
      }).join('') + `</table>
      <p class="note">%E คิดจากผลรวมกรัมทั้งวัน (C, P × 4; ไขมัน, LA, ALA, SFA × 9) ÷ พลังงานรวม ไม่เฉลี่ย % ของแต่ละมื้อ · "ยังยืนยันไม่ได้" = ยอดจากค่าที่ทราบยังไม่ถึงเกณฑ์ และมีรายการที่ไม่มีข้อมูล</p>
      <p class="note warn">ยาเสริมตามระบบฝากครรภ์/หลังคลอด แยกจากยอดอาหาร ให้ติดตามกับบุคลากรสุขภาพ · ไม่ใช้เกลือมากหรือเพิ่มตับเพื่อไล่ตัวเลข</p>
      <p class="noprint"><button class="btn" id="checkPlate">ตรวจจาน</button> <button class="btn sec" id="print">ดาวน์โหลด PDF / พิมพ์</button> <button class="btn sec" id="copy">คัดลอกตาราง</button> <span id="copyMsg"></span></p>`;
    $('#step3').innerHTML = h;
  }

  /* ---------- wiring ---------- */
  function go(step) {
    document.querySelectorAll('.steps button').forEach(b => b.classList.toggle('on', b.dataset.step == step));
    for (const s of [1, 2, 3]) $('#step' + s).hidden = s != step;
    [null, renderStep1, renderStep2, renderStep3][step]();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function rerender() { const s = document.querySelector('.steps .on').dataset.step; [null, renderStep1, renderStep2, renderStep3][s](); }

  function wire() {
    document.addEventListener('click', e => {
      const t = e.target.closest('button'); if (!t) return;
      if (t.dataset.step) go(+t.dataset.step);
      else if (t.dataset.go) go(+t.dataset.go);
      else if (t.dataset.g) { const g = G.groups.find(x => x.id === t.dataset.g); state.groupId = g.id; Object.assign(state, { age: g.defaults.age, weight: g.defaults.weight, pal: g.defaults.pal, answer: {}, checked: false }); save(); renderStep1(); }
      else if (t.dataset.meal) { state.meal = t.dataset.meal; save(); renderStep2(); }
      else if (t.dataset.add) { state.meals[state.meal].push({ id: t.dataset.add, value: 100, mode: 'unit' }); state.checked = false; save(); const q = $('#q').value; renderStep2(); $('#q').value = q; renderSearch(q); }
      else if (t.dataset.del) { state.meals[state.meal].splice(+t.dataset.del, 1); save(); renderStep2(); }
      else if (t.id === 'checkAns') {
        const n = needs(), e1 = Number($('#ansE').value), p1 = Number($('#ansP').value);
        state.answer = { e: $('#ansE').value, p: $('#ansP').value };
        const okE = e1 === n.energy, okP = Math.abs(p1 - n.protein) < 0.05;
        if (okE && okP) { state.answer.revealed = true; save(); renderStep1(); }
        else { $('#ansMsg').innerHTML = `<span class="${okE ? 'ok' : 'bad'}">พลังงาน ${okE ? 'ถูก' : 'ยังไม่ถูก'}</span> · <span class="${okP ? 'ok' : 'bad'}">โปรตีน ${okP ? 'ถูก' : 'ยังไม่ถูก'}</span> <button class="btn sec" id="reveal">ดูเฉลย</button>`; save(); }
      }
      else if (t.id === 'reveal') { state.answer.revealed = true; save(); renderStep1(); }
      else if (t.id === 'checkPlate') { state.checked = true; save(); renderStep3(); }
      else if (t.id === 'print') window.print();
      else if (t.id === 'copy') {
        const rows = [...document.querySelectorAll('#step3 table tr')].map(tr => [...tr.children].map(c => c.innerText.replace(/\s+/g, ' ').trim()).join('\t')).join('\n');
        (navigator.clipboard ? navigator.clipboard.writeText(rows) : Promise.reject()).then(() => $('#copyMsg').textContent = 'คัดลอกแล้ว', () => $('#copyMsg').textContent = 'เบราว์เซอร์ไม่อนุญาตให้คัดลอก');
      }
    });
    document.addEventListener('input', e => {
      const t = e.target;
      if (['age', 'weight', 'pal'].includes(t.id)) { state[t.id] = t.value; state.answer = {}; save(); clearTimeout(wire.tm); wire.tm = setTimeout(() => { const id = t.id, pos = t.selectionStart; renderStep1(); const el = $('#' + id); el.focus(); try { el.setSelectionRange(pos, pos); } catch (x) { } }, 500); }
      else if (t.id === 'q') renderSearch(t.value);
    });
    document.addEventListener('change', e => {
      const t = e.target;
      if (t.dataset.i != null) { state.meals[state.meal][+t.dataset.i][t.dataset.f] = t.value; state.checked = false; save(); const q = $('#q') ? $('#q').value : ''; renderStep2(); if ($('#q')) { $('#q').value = q; renderSearch(q); } }
      else if (t.id === 'practice') rerender();
    });
  }

  async function init() {
    load();
    try {
      const [d, g] = await Promise.all([fetch('data/foods.json').then(r => r.json()), fetch('data/groups.json').then(r => r.json())]);
      DB = d; G = g; DB.nutrients.forEach(n => NUT[n.key] = n); foodsById = new Map(DB.foods.map(f => [f.id, f]));
      for (const m of Object.keys(state.meals)) state.meals[m] = state.meals[m].filter(it => foodsById.has(it.id));
      $('#loading').hidden = true;
      $('#foot').innerHTML = `เวอร์ชันทดลอง · ฐานอาหาร ${DB.foods.length} ระเบียน (Thai DRI 2563, USDA SR Legacy 2018) จาก "ค้นอาหารและสารอาหาร" รุ่น 1.1.3 · ไม่มีการส่งข้อมูลที่กรอกออกจากเครื่อง`;
      wire(); go(1);
    } catch (e) { $('#loading').textContent = 'โหลดข้อมูลไม่สำเร็จ: ' + e.message; }
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  init();
})();
