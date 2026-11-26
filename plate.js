/* Draws a real plate (top view) with every chosen food placed in its area. Original vector drawings, no emoji. */
(function (root) {
  'use strict';
  const L = 'stroke="#3b4a45" stroke-width="1.3" stroke-linejoin="round"';
  const AREAS = {
    veg: { label: 'ผัก', color: '#e8f3e4' }, starch: { label: 'ข้าว-แป้ง', color: '#fbf5e6' }, protein: { label: 'เนื้อสัตว์ ไข่ ถั่ว', color: '#fbece6' },
    fruit: { label: 'ผลไม้', color: '#fff' }, milk: { label: 'นม', color: '#fff' }, fat: { label: 'น้ำมัน ไขมัน', color: '#fff' }, other: { label: 'เครื่องปรุง อื่น ๆ', color: '#fff' }
  };
  const has = (n, ...ks) => ks.some(k => n.includes(k));

  /* Each piece is drawn around (0,0) in a ~40px box, then translated and scaled. */
  function piece(area, n) {
    switch (area) {
      case 'starch':
        if (has(n, 'ขนมปัง')) return `<rect x="-17" y="-15" width="34" height="30" rx="8" fill="#e9b872" ${L}/><rect x="-13" y="-11" width="26" height="22" rx="5" fill="#f6dfb0"/>`;
        if (has(n, 'เส้น', 'ก๋วยเตี๋ยว', 'บะหมี่', 'หมี่', 'วุ้นเส้น', 'พาสต้า', 'สปาเก')) return `<ellipse rx="19" ry="15" fill="#f5e7b8" ${L}/>` + [-8, -2, 4, 10].map(y => `<path d="M-15 ${y} q5 -5 10 0 t10 0 t10 0" fill="none" stroke="#d9b96a" stroke-width="2"/>`).join('');
        if (has(n, 'ข้าวโพด')) return `<ellipse rx="11" ry="19" fill="#f3c63f" ${L}/>` + [-12, -6, 0, 6, 12].map(y => `<path d="M-9 ${y} h18" stroke="#d9a520" stroke-width="1.2"/>`).join('');
        if (has(n, 'มัน', 'เผือก')) return `<ellipse rx="18" ry="13" fill="#c98b4d" ${L}/><ellipse cx="-3" cy="-2" rx="11" ry="7" fill="#f1cf8f"/>`;
        return `<path d="M-20 8 q0 -24 20 -24 q20 0 20 24 q-20 8 -40 0z" fill="${has(n, 'กล้อง', 'ไรซ์เบอร์รี', 'หอมนิล', 'ดำ') ? '#d9b59a' : '#fbfaf5'}" ${L}/>` +
          [[-9, -4], [-2, -9], [6, -5], [11, 1], [-12, 3], [2, 0], [-5, 4], [8, 6]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2" ry="1" fill="#d8d2c4"/>`).join('');
      case 'veg':
        if (has(n, 'แครอต')) return [-8, 0, 8].map((x, i) => `<rect x="${x - 3}" y="-16" width="6" height="30" rx="3" fill="#f08a2c" ${L} transform="rotate(${(i - 1) * 14})"/>`).join('');
        if (has(n, 'มะเขือเทศ')) return `<circle r="15" fill="#e0483e" ${L}/><path d="M-6 -12 l6 4 l6 -4 l-2 6 h-8z" fill="#4f9a45"/>`;
        if (has(n, 'บรอกโคลี', 'กะหล่ำดอก')) { const c = has(n, 'ดอก') ? '#f3efe0' : '#3f8f3c'; return `<rect x="-4" y="2" width="8" height="15" rx="3" fill="#8fbf6a" ${L}/>` + [[-9, -3], [0, -9], [9, -3], [-4, 2], [5, 2]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="${c}" ${L}/>`).join(''); }
        if (has(n, 'เห็ด')) return `<rect x="-4" y="-2" width="8" height="16" rx="3" fill="#efe3cc" ${L}/><path d="M-16 0 q0 -16 16 -16 q16 0 16 16z" fill="#b98a5e" ${L}/>`;
        if (has(n, 'แตงกวา', 'ฟักแม้ว', 'บวบ')) return [[-9, -6], [8, -6], [0, 8]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#a7d48a" ${L}/><circle cx="${x}" cy="${y}" r="5" fill="#e6f3d6"/>`).join('');
        if (has(n, 'ฟักทอง')) return `<path d="M-18 6 q2 -20 18 -20 q16 0 18 20 q-18 8 -36 0z" fill="#f2a03a" ${L}/><path d="M-10 2 q10 -10 20 0" fill="none" stroke="#d47f1e" stroke-width="2"/>`;
        return [[-9, 2, -30], [9, 2, 30], [0, -6, 0]].map(([x, y, r]) => `<path d="M0 14 q-11 -12 0 -28 q11 16 0 28z" fill="#4fa64a" ${L} transform="translate(${x} ${y}) rotate(${r})"/><path d="M0 12 v-22" stroke="#2e7a2c" stroke-width="1.1" transform="translate(${x} ${y}) rotate(${r})"/>`).join('');
      case 'protein':
        if (has(n, 'ไข่')) return `<path d="M-19 0 q-2 -15 12 -16 q9 -9 18 0 q11 4 7 15 q-3 13 -18 13 q-17 0 -19 -12z" fill="#fff" ${L}/><circle cx="2" cy="-1" r="8" fill="#f4b528" ${L}/>`;
        if (has(n, 'ปลา', 'แซลมอน', 'ซาร์ดีน', 'ทูน่า', 'mackerel', 'แมคเคอเรล')) { const c = has(n, 'แซลมอน') ? '#f39a7a' : '#a9bfcf'; return `<path d="M-18 0 q12 -14 28 0 q-16 14 -28 0z" fill="${c}" ${L}/><path d="M10 0 l10 -8 v16z" fill="${c}" ${L}/><circle cx="-11" cy="-2" r="1.6" fill="#3b4a45"/>`; }
        if (has(n, 'กุ้ง')) return `<path d="M-12 -10 q22 -8 22 12 q-2 10 -12 10" fill="none" stroke="#f07c55" stroke-width="9" stroke-linecap="round"/><path d="M-12 -10 q22 -8 22 12 q-2 10 -12 10" fill="none" ${L}/><path d="M-6 14 l-8 4 l2 -8z" fill="#f07c55" ${L}/>`;
        if (has(n, 'เต้าหู้')) return `<rect x="-14" y="-14" width="28" height="28" rx="4" fill="#f7efd8" ${L}/><path d="M-14 -6 h28" stroke="#e7dcbd"/>`;
        if (has(n, 'ถั่ว')) { const c = has(n, 'แดง') ? '#9e3b33' : has(n, 'เขียว', 'แระ') ? '#7fae4b' : has(n, 'ดำ') ? '#3a3533' : '#d8b073'; return [[-8, -6], [3, -9], [10, 1], [-2, 2], [-10, 7], [5, 9]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="5.5" ry="4" fill="${c}" ${L}/>`).join(''); }
        if (has(n, 'หอย')) return `<path d="M-16 6 q0 -20 16 -20 q16 0 16 20z" fill="#3b4a6a" ${L}/><path d="M-12 4 q12 -14 24 0" fill="#f0b48a"/>`;
        return `<path d="M-18 -6 q4 -12 20 -10 q16 3 15 15 q-2 13 -18 12 q-19 -1 -17 -17z" fill="${has(n, 'ไก่') ? '#e9c59a' : '#b5654b'}" ${L}/><path d="M-8 -4 q8 4 16 0" fill="none" stroke="${has(n, 'ไก่') ? '#d4a571' : '#8c4734'}" stroke-width="2"/>`;
      case 'fruit':
        if (has(n, 'กล้วย')) return `<path d="M-18 -6 q16 26 36 0 q-18 14 -36 0z" fill="#f6d44d" ${L}/><path d="M18 -6 l3 -4" stroke="#6b5a2a" stroke-width="2"/>`;
        if (has(n, 'แตงโม')) return `<path d="M-18 -6 h36 q-4 22 -18 22 q-14 0 -18 -22z" fill="#e8504e" ${L}/><path d="M-18 -6 h36" stroke="#4f9a45" stroke-width="4"/>` + [[-6, 2], [4, 3], [0, 8]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.4" ry="2.2" fill="#2d2d2d"/>`).join('');
        if (has(n, 'องุ่น', 'ลำไย', 'ลองกอง', 'ลิ้นจี่', 'เงาะ')) { const c = has(n, 'องุ่น') ? (has(n, 'เขียว') ? '#a6cf6b' : '#7b4b8f') : has(n, 'ลิ้นจี่', 'เงาะ') ? '#d6514a' : '#d9b77a'; return [[-8, -8], [2, -10], [10, -3], [-4, 0], [6, 6], [-10, 6], [0, 11]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.5" fill="${c}" ${L}/>`).join(''); }
        if (has(n, 'ส้ม')) return `<circle r="15" fill="#f6a23a" ${L}/>` + [0, 60, 120].map(a => `<path d="M0 -12 V12" stroke="#fbd39a" stroke-width="1.4" transform="rotate(${a})"/>`).join('');
        { const c = has(n, 'มะละกอ') ? '#f3913d' : has(n, 'มะม่วง', 'สับปะรด', 'ทุเรียน', 'ขนุน') ? '#f7c443' : has(n, 'ฝรั่ง', 'ฝรั่ง') ? '#a9d27a' : has(n, 'แอปเปิ้ล', 'แอปเปิล', 'สตรอ', 'ชมพู่', 'มังคุด') ? '#d9423b' : '#f0b45a';
          return `<path d="M-16 4 q0 -18 16 -18 q16 0 16 18 q-16 10 -32 0z" fill="${c}" ${L}/><path d="M-8 -6 q8 -4 14 2" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/>`; }
      case 'milk': { const c = has(n, 'ถั่วเหลือง') ? '#efe0c2' : '#ffffff'; return `<path d="M-12 -18 h24 l-3 34 h-18z" fill="#e9f2f6" ${L}/><path d="M-11 -8 h22 l-2 23 h-18z" fill="${c}" ${L}/>`; }
      case 'fat': if (n.startsWith('น้ำมัน')) return `<path d="M0 -16 q14 16 0 28 q-14 -12 0 -28z" fill="#f4cf4e" ${L}/>`;
        if (has(n, 'งา', 'เมล็ด', 'อัลมอนด์', 'ถั่ว')) return [[-6, -4], [4, -6], [8, 4], [-3, 6], [-9, 4]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="2.6" fill="#e5c58f" ${L}/>`).join('');
        return `<path d="M0 -16 q14 16 0 28 q-14 -12 0 -28z" fill="#f4cf4e" ${L}/>`;
      default: return `<ellipse rx="14" ry="10" fill="#6e4f3a" ${L}/><ellipse cx="-4" cy="-3" rx="5" ry="2.5" fill="#9a7b62"/>`;
    }
  }

  /* 3D-style plate: the plate is a flat circle seen at an angle (y squashed by K); food stands upright with a contact shadow. */
  const W = 640, H = 430, CX = 250, CY = 230, R = 190, K = 0.56;
  const SLOTS = {
    veg: [[-110, -40], [-60, 60], [-70, -110], [-125, 60], [-45, -25], [-140, -5], [-90, 125], [-35, 120], [-30, -100]],
    starch: [[75, -80], [135, -40], [120, -125], [45, -135], [45, -30]],
    protein: [[65, 60], [135, 40], [120, 120], [50, 130], [100, 175]]
  };
  const SIDE = { milk: [545, 140], fruit: [545, 285], fat: [455, 395], other: [575, 400] };
  const ell = (cx, cy, rx, ry, extra) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${extra}/>`;
  function sector(a0, a1, fill) { // angles in degrees, flat-circle then squashed
    const p = a => [CX + R * Math.cos(a * Math.PI / 180), CY + R * K * Math.sin(a * Math.PI / 180)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `<path d="M${CX} ${CY} L${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R * K} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}Z" fill="${fill}"/>`;
  }
  const src = id => (window.TNP_BUNDLE && window.TNP_BUNDLE.images[id]) || `img/${id}.webp`;
  function art(area, name, id, imgs, size) {
    if (imgs && imgs.has(id)) { const s = size * 1.4; return `<image href="${src(id)}" x="${(-s / 2).toFixed(1)}" y="${(-s * 0.78).toFixed(1)}" width="${s.toFixed(1)}" height="${s.toFixed(1)}"/>`; }
    const sc = size / 44;
    return `<g transform="translate(0 ${-size * 0.38}) scale(${sc.toFixed(2)})">${piece(area, name)}</g>`;
  }
  function draw(items, imgs) {
    const by = {}; items.forEach(it => (by[it.area] = by[it.area] || []).push(it));
    let s = `<svg viewBox="0 0 ${W} ${H + 30}" class="plate-svg" role="img" aria-label="จานอาหาร ${items.length} รายการ">
      <defs><linearGradient id="tbl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe7da"/><stop offset="1" stop-color="#e3d8c6"/></linearGradient>
      <radialGradient id="rim" cx="40%" cy="30%"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e6ebe8"/></radialGradient>
      <filter id="blur"><feGaussianBlur stdDeviation="6"/></filter></defs>
      <rect x="4" y="10" width="${W - 8}" height="${H + 14}" rx="24" fill="url(#tbl)"/>
      ${ell(CX + 8, CY + 26, R + 26, (R + 26) * K, 'fill="#5b4a33" opacity=".22" filter="url(#blur)"')}
      ${ell(CX, CY + 12, R + 22, (R + 22) * K, 'fill="#d9dfdc"')}
      ${ell(CX, CY, R + 22, (R + 22) * K, 'fill="url(#rim)" stroke="#cfd7d3" stroke-width="1.2"')}
      ${ell(CX, CY + 4, R, R * K, 'fill="#e9eeeb"')}
      ${ell(CX, CY, R, R * K, 'fill="#fff"')}
      ${sector(90, 270, AREAS.veg.color)}${sector(270, 360, AREAS.starch.color)}${sector(0, 90, AREAS.protein.color)}
      <path d="M${CX} ${CY - R * K} V${CY + R * K} M${CX} ${CY} H${CX + R}" stroke="#d5dcd8" stroke-width="2" stroke-dasharray="6 6"/>
      <text x="${CX - 95}" y="${CY + R * K + 46}" class="pl-lab" text-anchor="middle">ผัก</text>
      <text x="${CX + 95}" y="${CY - R * K - 24}" class="pl-lab" text-anchor="middle">ข้าว-แป้ง</text>
      <text x="${CX + 95}" y="${CY + R * K + 46}" class="pl-lab" text-anchor="middle">เนื้อสัตว์ ไข่ ถั่ว</text>
      ${ell(SIDE.milk[0] + 4, SIDE.milk[1] + 16, 52, 16, 'fill="#5b4a33" opacity=".2" filter="url(#blur)"')}${ell(SIDE.milk[0], SIDE.milk[1] + 6, 50, 20, 'fill="#c9b89c"')}${ell(SIDE.milk[0], SIDE.milk[1], 50, 20, 'fill="#e6d8bf" stroke="#c9b89c" stroke-width="1.2"')}
      <text x="${SIDE.milk[0]}" y="${SIDE.milk[1] + 46}" class="pl-lab" text-anchor="middle">นม</text>
      ${ell(SIDE.fruit[0] + 6, SIDE.fruit[1] + 30, 72, 26, 'fill="#5b4a33" opacity=".2" filter="url(#blur)"')}
      ${ell(SIDE.fruit[0], SIDE.fruit[1] + 12, 70, 34, 'fill="#dfe5e2"')}${ell(SIDE.fruit[0], SIDE.fruit[1], 70, 34, 'fill="#fff" stroke="#cfd7d3" stroke-width="1.2"')}
      <text x="${SIDE.fruit[0]}" y="${SIDE.fruit[1] + 66}" class="pl-lab" text-anchor="middle">ผลไม้</text>
      ${['fat', 'other'].map(a => ell(SIDE[a][0] + 4, SIDE[a][1] + 14, 46, 15, 'fill="#5b4a33" opacity=".2" filter="url(#blur)"') + ell(SIDE[a][0], SIDE[a][1] + 6, 44, 18, 'fill="#dfe5e2"') + ell(SIDE[a][0], SIDE[a][1], 44, 18, 'fill="#fff" stroke="#cfd7d3" stroke-width="1.2"')).join('')}
      <text x="${SIDE.fat[0]}" y="${SIDE.fat[1] + 40}" class="pl-lab" text-anchor="middle">ไขมัน</text><text x="${SIDE.other[0]}" y="${SIDE.other[1] + 40}" class="pl-lab" text-anchor="middle">เครื่องปรุง</text>`;
    const placed = [];
    for (const area of Object.keys(by)) {
      const list = by[area], many = list.length > 4 ? 0.8 : 1;
      list.forEach((it, i) => {
        let x, y, base;
        if (SLOTS[area]) { const [dx, dy] = SLOTS[area][i % SLOTS[area].length]; x = CX + dx; y = CY + dy * K; base = 62; }
        else if (area === 'milk') { x = SIDE.milk[0] + (list.length > 1 ? (i % 3 - 1) * 26 : 0); y = SIDE.milk[1] + 4; base = 64; }
        else if (area === 'fruit') { x = SIDE.fruit[0] + [0, -32, 32, -14, 20][i % 5]; y = SIDE.fruit[1] + [4, -6, -4, 14, 16][i % 5]; base = 58; }
        else { const c = SIDE[area] || SIDE.other; x = c[0] + (list.length > 1 ? (i % 3 - 1) * 22 : 0); y = c[1] + 2; base = 40; }
        const size = base * Math.max(0.75, Math.min(1.5, Math.sqrt((it.grams || 100) / 100))) * many;
        placed.push({ it, area, x, y, size });
      });
    }
    placed.sort((a, b) => a.y - b.y);
    for (const p of placed) {
      s += `<g class="piece" data-idx="${p.it.idx}" transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})"><title>${p.it.titleText}</title>
        ${ell(0, 0, (p.size * 0.42).toFixed(1), (p.size * 0.13).toFixed(1), 'fill="#3b2f20" opacity=".22"')}
        ${art(p.area, p.it.name, p.it.id, imgs, p.size)}
        <circle cx="${(p.size * 0.38).toFixed(1)}" cy="${(-p.size * 0.82).toFixed(1)}" r="10" fill="#0f6b55" stroke="#fff" stroke-width="2"/>
        <text x="${(p.size * 0.38).toFixed(1)}" y="${(-p.size * 0.82 + 3.8).toFixed(1)}" class="pl-num" text-anchor="middle">${p.it.idx + 1}</text></g>`;
    }
    if (!items.length) s += `<text x="${CX}" y="${CY + 6}" class="pl-empty" text-anchor="middle">จานยังว่าง · กด "ใส่จาน" ที่วัตถุดิบ</text>`;
    return s + '</svg>';
  }
  /* Product image for the shop grid: Gemini image if present, else the vector drawing. */
  function thumb(area, name, id, imgs) {
    if (imgs && imgs.has(id)) return `<img src="${src(id)}" alt="" loading="lazy" width="256" height="256">`;
    return `<svg viewBox="-30 -30 60 60" aria-hidden="true"><g transform="scale(1.05)">${piece(area, name)}</g></svg>`;
  }
  root.Plate = { draw, thumb, AREAS };
})(this);
