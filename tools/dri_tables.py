"""Thai DRI 2563 summary tables, transcribed from printed pages 439 (Table 1), 440 (Table 2), 441 (Table 3)
and 442 (carbohydrate/fat). PDF page = printed page + 1.
'*' = AI (Adequate Intake); otherwise RDA. 'BM' = breast milk only. '+x' = add to the non-pregnant female row.
Run: python3 tools/dri_tables.py > data/groups.json
"""
import json

T1_COLS = ['ref_weight', 'ref_height', 'energy', 'protein']
T1 = {  # Table 1, page 439
    ('M', 'inf0'): '5.7 59.0 490 BM', ('M', 'inf6'): '8.7 71.2 680 14',
    ('F', 'inf0'): '5.3 57.6 460 BM', ('F', 'inf6'): '8.0 69.4 610 12',
    ('M', 'c1'): '13.1 90.8 1050 16', ('M', 'c4'): '18.3 109.5 1290 19', ('M', 'c6'): '23.0 122.3 1440 24',
    ('F', 'c1'): '12.5 89.6 980 15', ('F', 'c4'): '18.1 108.9 1200 19', ('F', 'c6'): '22.5 121.0 1320 24',
    ('M', 't9'): '35.6 142.2 1800 39', ('M', 't13'): '51.5 164.3 2200 55', ('M', 't16'): '58.3 171.2 2370 61',
    ('F', 't9'): '36.5 143.9 1650 40', ('F', 't13'): '47.7 157.1 1860 51', ('F', 't16'): '48.9 158.8 1890 51',
    ('M', 'a19'): '61.3 170.8 2260 61', ('M', 'a31'): '60.1 169.2 2190 60', ('M', 'a51'): '59.5 167.8 2180 60',
    ('M', 'a61'): '58.7 165.1 1790 59', ('M', 'a71'): '56.2 163.6 1740 56',
    ('F', 'a19'): '53.0 158.9 1780 53', ('F', 'a31'): '52.2 157.6 1780 52', ('F', 'a51'): '51.9 156.5 1770 52',
    ('F', 'a61'): '49.9 153.5 1560 50', ('F', 'a71'): '48.5 152.0 1540 49',
}
T1_ADD = {'p1': ('50-100', 1), 'p2': ('250-300', 10), 'p3': ('450-500', 31), 'l0': ('500', 19), 'l6': ('300', 13)}

# Table 2, page 440. Columns: vit A (ug RAE), vit D (IU), vit E (mg a-TE), vit K (ug), B1, B2 (mg), niacin (mg NE),
# pantothenic (mg), B6 (mg), folate (ug DFE), B12 (ug), biotin (ug), choline (mg), vit C (mg)
T2_COLS = ['vit_a', 'vit_d_iu', 'vit_e', 'vit_k', 'vit_b1', 'vit_b2', 'niacin_ne', 'pantothenic', 'vit_b6',
           'folate_dfe', 'vit_b12', 'biotin', 'choline', 'vit_c']
T2 = {
    'inf0': 'BM 400* BM BM BM BM BM BM BM BM BM BM BM BM',
    'inf6': '250 400* 5 2.5* 0.3* 0.4* 4* 1.8* 0.3* 85 0.5* 6* 150* 50',
    'c1': '300 600 6 30* 0.5 0.5 6 2* 0.5 120 0.9 8* 200* 25',
    'c4': '350 600 9 55* 0.6 0.6 8 3* 0.6 140 1.2 12* 250* 30',
    'c6': '350 600 9 55* 0.6 0.6 8 3* 0.6 180 1.2 12* 250* 40',
    'M t9': '550 600 13 60* 0.9 0.9 12 4* 1.0 240 1.8 20* 375* 60',
    'M t13': '750 600 13 75* 1.2 1.3 16 5* 1.3 300 2.4 25* 550* 85',
    'M t16': '750 600 13 75* 1.2 1.3 16 5* 1.3 300 2.4 25* 550* 100',
    'F t9': '550 600 11 60* 0.9 0.9 12 4* 1.0 240 1.8 20* 375* 60',
    'F t13': '700 600 11 75* 1.0 1.0 14 5* 1.2 300 2.4 25* 400* 80',
    'F t16': '600 600 11 75* 1.0 1.0 14 5* 1.2 300 2.4 25* 400* 80',
    'M a19': '700 600 13 120* 1.2 1.3 16 5* 1.3 300 2.4 30* 550* 100',
    'M a31': '700 600 13 120* 1.2 1.3 16 5* 1.3 300 2.4 30* 550* 100',
    'M a51': '700 600 13 120* 1.2 1.3 16 5* 1.7 300 2.4 30* 550* 100',
    'M a61': '700 600 13 120* 1.2 1.3 16 5* 1.7 300 2.4 30* 550* 100',
    'M a71': '700 800 13 120* 1.2 1.3 16 5* 1.7 300 2.4 30* 550* 100',
    'F a19': '600 600 11 90* 1.1 1.1 14 5* 1.3 300 2.4 30* 425* 85',
    'F a31': '600 600 11 90* 1.1 1.1 14 5* 1.3 300 2.4 30* 425* 85',
    'F a51': '600 600 11 90* 1.1 1.1 14 5* 1.5 300 2.4 30* 425* 85',
    'F a61': '600 600 11 90* 1.1 1.1 14 5* 1.5 300 2.4 30* 425* 85',
    'F a71': '600 800 11 90* 1.1 1.1 14 5* 1.5 300 2.4 30* 425* 85',
    'p': '+100 +0 +0 +0 +0.3 +0.3 +4 +1* +0.6 +250 +0.2 +0 +25* +10',
    'l': '+700 +0 +0 +0 +0.3 +0.5 +3 +2* +0.7 +150 +0.4 +5* +125* +60',
}

# Table 3, page 441. Columns: Ca, P, Mg, Fe, Zn, Cu, Mn (mg); I, Se (ug). Mo and Cr are not in the food database.
T3_COLS = ['calcium', 'phosphorus', 'magnesium', 'iron', 'iodine', 'zinc', 'selenium', 'copper', 'manganese']
T3 = {
    'inf0': 'BM BM BM BM BM BM BM BM BM',
    'inf6': '260* 275* 60* 9.0 70 2.7 20* 0.4* 0.4*',
    'c1': '500* 460 60 5.0 90 4.4 20 0.7* 0.6*',
    'c4': '800* 500 80 6.0 90 5.3 30 1.0* 0.8*',
    'c6': '800* 500 120 6.6 90 6.3 30 1.0* 1.1*',
    'M t9': '1000* 1000 170 11.5 120 9.5 40 1.0* 1.6*',
    'M t13': '1000* 1000 240 15.0 130 12.5 55 1.3* 2.2*',
    'M t16': '1000* 1000 290 11.0 130 12.9 55 1.3* 2.5*',
    'F t9': '1000* 1000 170 12.5 120 9.0 40 1.0* 1.6*',
    'F t13': '1000* 1000 220 16.0 130 9.8 55 1.1* 2.2*',
    'F t16': '1000* 1000 250 16.0 130 9.8 55 1.1* 2.5*',
    'M a19': '800* 700 310 11.5 150 11.6 55 1.6* 2.5*',
    'M a31': '800* 700 320 11.5 150 10.9 55 1.6* 2.5*',
    'M a51': '1000* 700 300 11.5 150 10.9 55 1.6* 2.5*',
    'M a61': '1000* 700 300 11.0 150 10.9 55 1.6* 2.5*',
    'M a71': '1000* 700 280 11.0 150 10.3 55 1.6* 2.5*',
    'F a19': '800* 700 250 20.0 150 9.7 55 1.3* 2.5*',
    'F a31': '800* 700 260 20.0 150 9.2 55 1.3* 2.5*',
    'F a51': '1000* 700 260 10.0 150 9.2 55 1.3* 2.5*',
    'F a61': '1000* 700 260 10.0 150 8.6 55 1.3* 2.5*',
    'F a71': '1000* 700 240 10.0 150 8.6 55 1.3* 2.5*',
    'p': '+0 +0 +30 NA +50 +1.6 +5 +0.2* +0',
    'l0': '+0 +0 +0 =13.0 +50 +2.9 +15 +0.2* +0',
    'l6': '+0 +0 +0 =20.0 +50 +2.9 +15 +0.2* +0',
}
T3_NOTES = {
    ('M t9', 'copper'): '9–10 ปี = 1.0, 11–12 ปี = 1.3 (ใช้ค่าต่ำเป็นเกณฑ์)',
    ('F t9', 'copper'): '9–10 ปี = 1.0, 11–12 ปี = 1.1 (ใช้ค่าต่ำเป็นเกณฑ์)',
    ('F t9', 'iron'): '12.5 ถ้ายังไม่มีประจำเดือน; 15.6 ถ้ามีประจำเดือนแล้ว',
    ('p', 'iron'): 'Thai DRI ไม่กำหนดเหล็กจากอาหาร; หญิงตั้งครรภ์ได้รับยาเม็ดธาตุเหล็กเสริมวันละ 60 mg (แยกจากยอดอาหาร)',
    ('l0', 'iron'): 'หญิงให้นมบุตร 0–5 เดือน 13 mg/วัน (ค่าทั้งหมด ไม่ใช่ส่วนเพิ่ม)',
    ('l6', 'iron'): 'หญิงให้นมบุตร 6–11 เดือน 20 mg/วัน (ค่าทั้งหมด ไม่ใช่ส่วนเพิ่ม)',
}

BANDS = [('inf0', 'ทารก 0–5 เดือน', 'inf'), ('inf6', 'ทารก 6–11 เดือน', 'inf'), ('c1', 'เด็ก 1–3 ปี', 'child'),
         ('c4', 'เด็ก 4–5 ปี', 'child'), ('c6', 'เด็ก 6–8 ปี', 'child'), ('t9', '9–12 ปี', 'teen'),
         ('t13', '13–15 ปี', 'teen'), ('t16', '16–18 ปี', 'teen'), ('a19', '19–30 ปี', 'adult'),
         ('a31', '31–50 ปี', 'adult'), ('a51', '51–60 ปี', 'adult'), ('a61', '61–70 ปี', 'elder'), ('a71', '71 ปีขึ้นไป', 'elder')]
SEXLAB = {'M': 'ชาย', 'F': 'หญิง'}


def cell(s):
    if s == 'BM': return {'bm': True}
    if s == 'NA': return {'none': True}
    ai = s.endswith('*'); s = s.rstrip('*')
    if s.startswith('='): return {'v': float(s[1:]), 'type': 'RDA'}
    if s.startswith('+'): return {'add': float(s[1:]), 'type': 'AI' if ai else 'RDA'}
    return {'v': float(s), 'type': 'AI' if ai else 'RDA'}


def row(tab, cols, key):
    vals = tab[key].split(); assert len(vals) == len(cols), (key, len(vals), len(cols))
    return {c: cell(v) for c, v in zip(cols, vals)}


def micro(sex, band):
    k2 = band if band in T2 else f'{sex} {band}'
    k3 = band if band in T3 else f'{sex} {band}'
    out = {**row(T2, T2_COLS, k2), **row(T3, T3_COLS, k3)}
    for (rk, n), note in T3_NOTES.items():
        if rk == k3: out[n]['note'] = note
    return out


def apply_add(base, add, notes_key):
    out = {}
    for k, b in base.items():
        a = add[k]
        if a.get('none'): out[k] = {'none': True}
        elif 'v' in a: out[k] = {'v': a['v'], 'type': 'RDA'}
        else: out[k] = {'v': round(b['v'] + a['add'], 3), 'type': b['type'] if a['add'] == 0 else a['type'], 'add': a['add']}
        for (rk, n), note in T3_NOTES.items():
            if rk == notes_key and n == k: out[k]['note'] = note
    return out


def fin(m):
    """vit D IU -> ug (40 IU = 1 ug), drop breast-milk-only cells."""
    out = {}
    for k, c in m.items():
        if c.get('bm') or c.get('none'):
            out['vit_d' if k == 'vit_d_iu' else k] = c; continue
        if k == 'vit_d_iu':
            c = dict(c); c['v'] = c['v'] / 40; c['iu'] = c['v'] * 40; k = 'vit_d'
        out[k] = c
    return out


def fat_range(band):
    if band == 'inf0': return None
    if band == 'inf6': return [35, 40]
    if band == 'c1': return [35, 40]  # book: 1-2 y 35-40, 2-8 y 25-35 -> band 1-3 spans both; use 1-2 y and note
    if band in ('c4', 'c6', 't9', 't13', 't16'): return [25, 35]
    return [20, 35]


groups = []
for sex in ('M', 'F'):
    for band, label, kind in BANDS:
        w, h, e, p = T1[(sex, band)].split()
        g = {'id': f'{sex}-{band}', 'kind': kind, 'sex': sex, 'label': f'{label} ({SEXLAB[sex]})' if kind != 'inf' else f'{label} ({SEXLAB[sex]})',
             'refWeight': float(w), 'refHeight': float(h), 'energy': None if e == 'BM' else float(e),
             'protein': None if p == 'BM' else float(p), 'breastMilkOnly': band == 'inf0', 'targets': fin(micro(sex, band)), 'fatE': fat_range(band)}
        if band == 'c1': g['fatNote'] = 'Thai DRI: 1–2 ปี 35–40%E, 2–8 ปี 25–35%E'
        groups.append(g)

for pid, label, addkey in [('p1', 'หญิงตั้งครรภ์ ไตรมาส 1', 'p'), ('p2', 'หญิงตั้งครรภ์ ไตรมาส 2', 'p'), ('p3', 'หญิงตั้งครรภ์ ไตรมาส 3', 'p'),
                           ('l0', 'หญิงให้นมบุตร 0–5 เดือน', 'l0'), ('l6', 'หญิงให้นมบุตร 6–11 เดือน', 'l6')]:
    addE, addP = T1_ADD[pid]
    lo, hi = (addE.split('-') + [addE])[:2]
    t2add = row(T2, T2_COLS, 'p' if pid.startswith('p') else 'l')
    t3add = row(T3, T3_COLS, addkey)
    groups.append({'id': pid, 'kind': 'preg' if pid.startswith('p') else 'lact', 'sex': 'F', 'label': label,
                   'energyAdd': [float(lo), float(hi)], 'proteinAdd': addP,
                   'addT2': {k: v for k, v in t2add.items()}, 'addT3': t3add, 'notesKey': addkey,
                   'baseBands': ['t16', 'a19', 'a31'], 'fatE': [20, 35]})

# resolve preg/lact targets per maternal base band
for g in groups:
    if g['kind'] in ('preg', 'lact'):
        g['byBase'] = {}
        for b in g['baseBands']:
            base = micro('F', b)
            add = {**g.pop('_t2', g['addT2']), **g['addT3']}
            g['byBase'][b] = fin(apply_add(base, add, g['notesKey']))
        del g['addT2'], g['addT3']

out = {
    'source': 'Thai DRI 2563 ตารางที่ 1–3 หน้า 439–441 และหน้า 442 (เลขหน้าพิมพ์) · ถอดจากภาพตาราง',
    'verification': 'ถอดรอบที่ 1 โดยผู้ช่วย AI 24 พ.ย. 2569 · เทียบค่าหญิงตั้งครรภ์ไตรมาส 2 / ให้นม 0–5 เดือน กับใบงานชุด A แล้วตรงกัน · รอผู้สอนตรวจรอบที่ 2',
    'percentE': {'carb': [45, 65], 'la': [2.5, 9], 'ala': [0.5, 0.6], 'satfat': [None, 10]},
    'percentENote': 'ทารก 0–5 เดือน ใช้น้ำนมแม่; PUFA รวม 6–11%E; ไขมันทรานส์ <1%E; น้ำตาลที่เติม ≤5%E (หน้า 442)',
    'mealShares': {'source': 'การแบ่งพลังงานในใบงานชุด A (30/35/35%)', 'meals': [
        {'id': 'm1', 'label': 'เช้า + ว่างเช้า', 'share': 0.30}, {'id': 'm2', 'label': 'กลางวัน + ว่างบ่าย', 'share': 0.35},
        {'id': 'm3', 'label': 'เย็น + ว่างค่ำ', 'share': 0.35}]},
    'activity': {'source': 'ใบงานชุด A 24 พ.ย. 2569 (ผู้สอนกำหนดเพื่อฝึก ไม่ใช่ค่าจากตาราง Thai DRI หน้า 439–441)',
                 'preg': {'dha': {'v': 0.2}, 'epa_dha': {'v': 0.3}, 'sodium': {'max': 2000},
                          'iron': {'v': 20, 'note': 'ค่าฝึก 20 mg จากอาหาร อิงหญิงวัยผู้ใหญ่ ไม่ใช่ RDA หญิงตั้งครรภ์ และไม่ทดแทนยาเสริมตามฝากครรภ์'}},
                 'lact': {'dha': {'v': 0.2}, 'epa_dha': {'v': 0.3}, 'sodium': {'max': 2000}}},
    'energyCalc': {'source': 'สูตรในใบงานชุด A (BMR × PAL + ส่วนเพิ่ม ปัดขึ้นขั้นละ 50 kcal; โปรตีน 1.0 g/kg + ส่วนเพิ่ม)',
                   'bmrFemale': [{'minAge': 18, 'maxAge': 30, 'a': 14.818, 'b': 486.6}, {'minAge': 30, 'maxAge': 60, 'a': 8.126, 'b': 845.6}]},
    'groups': groups,
}
print(json.dumps(out, ensure_ascii=False, indent=1))
