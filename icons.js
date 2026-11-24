/* Original flat illustrations and line icons (no third-party artwork). */
(function (root) {
  'use strict';
  const skin = '#f4c7a1', skinD = '#e3a982', hair = '#3b3a36', hairG = '#d9d9d6', line = '#33413d';
  const face = (cx, cy, r, extra = '') => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${skin}" stroke="${line}" stroke-width="1.6"/>
    <circle cx="${cx - r * 0.35}" cy="${cy}" r="1.3" fill="${line}"/><circle cx="${cx + r * 0.35}" cy="${cy}" r="1.3" fill="${line}"/>
    <path d="M${cx - r * 0.3} ${cy + r * 0.4} q${r * 0.3} ${r * 0.25} ${r * 0.6} 0" fill="none" stroke="${line}" stroke-width="1.4" stroke-linecap="round"/>${extra}`;
  const body = (fill, w = 30) => `<path d="M${40 - w / 2} 78 q0 -18 ${w / 2} -18 q${w / 2} 0 ${w / 2} 18z" fill="${fill}" stroke="${line}" stroke-width="1.6"/>`;
  const wrap = inner => `<svg viewBox="0 0 80 80" width="64" height="64" aria-hidden="true">${inner}</svg>`;

  const PEOPLE = {
    inf: wrap(`<path d="M26 74 q-4 -26 14 -28 q18 2 14 28z" fill="#cfe6f3" stroke="${line}" stroke-width="1.6"/>
      <path d="M28 60 q12 8 24 -2" fill="none" stroke="${line}" stroke-width="1.4"/>${face(40, 34, 14)}<path d="M37 21 q3 -5 6 0" fill="none" stroke="${line}" stroke-width="1.4"/>`),
    child: wrap(`${body('#7fb8e6', 32)}${face(40, 38, 15)}<path d="M25 34 q2 -16 15 -16 q13 0 15 16 q-8 -8 -15 -6 q-8 -2 -15 6z" fill="${hair}"/>`),
    teen: wrap(`${body('#7cc39b', 36)}${face(40, 36, 15)}<path d="M25 33 q0 -17 15 -17 q15 0 15 17 l-3 -6 q-6 -6 -12 -3 q-8 -3 -12 3z" fill="${hair}"/>`),
    adult: wrap(`${body('#a9c8ea', 38)}<path d="M36 60 l4 7 l4 -7" fill="#fff" stroke="${line}" stroke-width="1.3"/>${face(40, 35, 14)}<path d="M26 32 q0 -15 14 -15 q14 0 14 15 q-5 -7 -14 -6 q-9 -1 -14 6z" fill="${hair}"/>`),
    elder: wrap(`${body('#8fbf9f', 38)}${face(40, 36, 14, `<circle cx="35" cy="36" r="4" fill="none" stroke="${line}" stroke-width="1.3"/><circle cx="45" cy="36" r="4" fill="none" stroke="${line}" stroke-width="1.3"/><path d="M39 36 h2" stroke="${line}" stroke-width="1.3"/>`)}
      <path d="M26 33 q1 -13 14 -13 q13 0 14 13 q-3 -5 -6 -6 q-8 -3 -16 0 q-3 1 -6 6z" fill="${hairG}" stroke="${line}" stroke-width="1"/><path d="M34 45 q6 4 12 0" fill="none" stroke="${hairG}" stroke-width="3" stroke-linecap="round"/>`),
    preg: wrap(`<path d="M30 78 q-2 -18 8 -20 q6 -1 8 4 q12 2 10 12 q-1 4 -4 4z" fill="#86c4a5" stroke="${line}" stroke-width="1.6"/>
      <path d="M44 64 q9 1 9 8" fill="none" stroke="${line}" stroke-width="1.3"/>${face(38, 34, 13)}<path d="M25 34 q-1 -18 14 -17 q13 1 12 14 q-3 9 -1 22 q-4 -10 -2 -18 q-6 -6 -12 -6 q-8 2 -11 5z" fill="${hair}"/>`),
    lact: wrap(`${body('#86c4a5', 38)}${face(36, 32, 12)}<path d="M23 32 q-1 -16 13 -15 q12 1 11 13 q-1 8 0 16 q-4 -8 -2 -15 q-5 -5 -10 -5 q-7 2 -10 5z" fill="${hair}"/>
      <ellipse cx="44" cy="60" rx="11" ry="7" fill="#fff" stroke="${line}" stroke-width="1.4"/><circle cx="50" cy="56" r="5.5" fill="${skin}" stroke="${line}" stroke-width="1.4"/>
      <path d="M30 66 q10 6 24 -2" fill="none" stroke="${skinD}" stroke-width="5" stroke-linecap="round"/>`)
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
