/* Original flat illustrations and line icons (no third-party artwork). */
(function (root) {
  'use strict';
  const skin = '#f2c5a0', skinS = '#e2a986', line = '#2f3d39';
  const S = 'stroke="' + '#2f3d39' + '" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"';
  /* Half-body portrait on a 96x96 canvas. opts: shirt, collar, hairBack, hairFront, extra, faceExtra, cy (head centre y), r (head radius) */
  function person(o) {
    const cy = o.cy || 38, r = o.r || 17, cx = 48;
    const eyes = `<circle cx="${cx - 6}" cy="${cy + 1}" r="1.7" fill="${line}"/><circle cx="${cx + 6}" cy="${cy + 1}" r="1.7" fill="${line}"/>`;
    const mouth = `<path d="M${cx - 5} ${cy + 8} q5 4 10 0" fill="none" ${S}/>`;
    const cheeks = `<circle cx="${cx - 10}" cy="${cy + 6}" r="2.6" fill="#f0a98c" opacity=".55"/><circle cx="${cx + 10}" cy="${cy + 6}" r="2.6" fill="#f0a98c" opacity=".55"/>`;
    const ears = `<ellipse cx="${cx - r}" cy="${cy + 2}" rx="3" ry="4.2" fill="${skin}" ${S}/><ellipse cx="${cx + r}" cy="${cy + 2}" rx="3" ry="4.2" fill="${skin}" ${S}/>`;
    return `<svg viewBox="0 0 96 96" width="84" height="84" aria-hidden="true">
      ${o.hairBack || ''}
      <path d="M${cx - 30} 96 q0 -26 ${30} -27 q30 1 30 27z" fill="${o.shirt}" ${S}/>
      ${o.collar || ''}
      <path d="M${cx - 6} ${cy + r - 2} v8 q6 4 12 0 v-8" fill="${skinS}" ${S}/>
      ${ears}<circle cx="${cx}" cy="${cy}" r="${r}" fill="${skin}" ${S}/>
      ${cheeks}${eyes}${mouth}${o.faceExtra || ''}${o.hairFront || ''}${o.extra || ''}</svg>`;
  }
  const H = '#3a332e', HG = '#d7d6d2';
  const PEOPLE = {
    inf: `<svg viewBox="0 0 96 96" width="84" height="84" aria-hidden="true">
      <path d="M22 92 q-6 -38 26 -42 q32 4 26 42z" fill="#cfe4f2" ${S}/>
      <path d="M28 70 q20 14 40 0 M30 82 q18 10 36 0" fill="none" ${S} opacity=".6"/>
      <circle cx="48" cy="40" r="19" fill="${skin}" ${S}/>
      <circle cx="41" cy="41" r="1.8" fill="${line}"/><circle cx="55" cy="41" r="1.8" fill="${line}"/>
      <ellipse cx="48" cy="50" rx="3.5" ry="2.6" fill="#e98f8f" ${S}/>
      <circle cx="37" cy="47" r="2.8" fill="#f0a98c" opacity=".55"/><circle cx="59" cy="47" r="2.8" fill="#f0a98c" opacity=".55"/>
      <path d="M44 22 q4 -6 8 0" fill="none" ${S}/></svg>`,
    child: person({ shirt: '#7fb6e3', cy: 42, r: 16, hairFront: `<path d="M32 40 q-1 -19 16 -19 q17 0 16 19 q-5 -9 -16 -9 q-11 0 -16 9z" fill="${H}" ${S}/>`,
      collar: '<path d="M40 70 l8 7 l8 -7" fill="#fff" stroke="#2f3d39" stroke-width="1.6"/>' }),
    teen: person({ shirt: '#78bf98', hairFront: `<path d="M31 36 q-1 -18 17 -18 q18 0 17 18 l-4 -6 q-6 -7 -13 -4 q-9 -3 -14 4z" fill="${H}" ${S}/>` }),
    adult: person({ shirt: '#a7c6e8', hairFront: `<path d="M31 35 q0 -17 17 -17 q17 0 17 17 q-6 -8 -17 -7 q-11 -1 -17 7z" fill="${H}" ${S}/>`,
      collar: '<path d="M41 70 l7 9 l7 -9" fill="#fff" stroke="#2f3d39" stroke-width="1.6"/><path d="M48 79 v17" stroke="#2f3d39" stroke-width="1.4"/>' }),
    elder: person({ shirt: '#8dbd9d', hairFront: `<path d="M31 36 q1 -16 17 -16 q16 0 17 16 q-3 -6 -7 -7 q-10 -3 -20 0 q-4 1 -7 7z" fill="${HG}" ${S}/>`,
      faceExtra: `<circle cx="42" cy="39" r="5" fill="none" ${S}/><circle cx="54" cy="39" r="5" fill="none" ${S}/><path d="M47 39 h2" ${S}/><path d="M40 50 q8 5 16 0" fill="none" stroke="${HG}" stroke-width="3.5" stroke-linecap="round"/>` }),
    preg: person({ shirt: '#83c3a3',
      hairBack: `<path d="M29 40 q-3 -24 19 -24 q20 0 19 22 q-1 14 2 28 q-8 -4 -10 -14z" fill="${H}" ${S}/>`,
      hairFront: `<path d="M31 37 q2 -16 17 -17 q14 0 17 13 q-9 -5 -16 -4 q-10 1 -18 8z" fill="${H}" ${S}/>`,
      extra: `<path d="M50 96 q2 -18 14 -18 q12 2 12 18z" fill="#6fb592" ${S}/><path d="M58 84 q6 2 8 8" fill="none" ${S} opacity=".6"/>` }),
    lact: person({ shirt: '#83c3a3', cy: 34, r: 15,
      hairBack: `<path d="M31 36 q-3 -22 17 -22 q18 0 17 20 q-1 12 2 24 q-8 -4 -9 -12z" fill="${H}" ${S}/>`,
      hairFront: `<path d="M33 33 q2 -14 15 -15 q13 0 16 12 q-9 -5 -15 -4 q-9 1 -16 7z" fill="${H}" ${S}/>`,
      extra: `<ellipse cx="54" cy="80" rx="17" ry="10" fill="#ffffff" ${S}/><circle cx="64" cy="73" r="8" fill="${skin}" ${S}/>
        <circle cx="62" cy="73" r="1.2" fill="${line}"/><path d="M28 86 q22 10 44 -4" fill="none" stroke="${skinS}" stroke-width="7" stroke-linecap="round"/><path d="M28 86 q22 10 44 -4" fill="none" ${S} opacity=".5"/>` })
  };

  const ic = (d, s = 20) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICON = {
    check: ic('<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.8"/>'),
    plate: ic('<circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="3"/><path d="M3 4v5a2 2 0 0 0 2 2v9M5 4v4M21 4c-1.5 0-2.5 2-2.5 5s1 3 2.5 3v8"/>'),
    doc: ic('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>'),
    clip: ic('<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h4"/>', 18),
    one: ic('<circle cx="12" cy="12" r="9"/><path d="M12 8v8"/>', 26),
    two: ic('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 0 1 5 .5c0 1.8-5 3.5-5 6h5"/>', 26),
    three: ic('<circle cx="12" cy="12" r="9"/><path d="M9.5 8.5h5l-2.5 3a2.5 2.5 0 1 1-2.5 3.5"/>', 26),
    tick: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#0f6b55"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    logo: '<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="#e7f2ee" stroke="#0f6b55" stroke-width="1.6"/><circle cx="16" cy="17" r="8" fill="#fff" stroke="#0f6b55" stroke-width="1.6"/><path d="M16 9.5c-2.5 2.5-2.5 5 0 7.5 2.5-2.5 2.5-5 0-7.5z" fill="#2f9a73"/><path d="M12 19h8" stroke="#0f6b55" stroke-width="1.6" stroke-linecap="round"/></svg>'
  };
  root.Icons = { PEOPLE, ICON };
})(this);
