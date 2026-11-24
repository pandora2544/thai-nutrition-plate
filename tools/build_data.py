import csv, json, sys
src = sys.argv[1]; out = sys.argv[2]
rows = list(csv.DictReader(open(src, encoding='utf-8-sig')))
nutr = list(csv.DictReader(open(sys.argv[3], encoding='utf-8-sig')))
keys = [n['key'] for n in nutr]
foods = []
for r in rows:
    nut = {}
    for k in keys:
        lo, hi = r.get(k, ''), r.get(k + '_max', '')
        if lo == '' and hi == '': continue
        if lo == '': raise SystemExit('max without min ' + r['id'] + k)
        lo = float(lo); hi = float(hi) if hi != '' else lo
        assert 0 <= lo <= hi, (r['id'], k)
        nut[k] = [lo, hi] if lo != hi else lo
    b = float(r['basisAmount']); assert b > 0
    foods.append({'id': r['id'], 'n': r['name'], 'a': r['aliases'], 'c': r['category'], 'b': b, 'u': r['basisUnit'],
                  's': r['sourceSet'], 'src': r['source'], 'url': r['url'], 'note': r['note'], 'v': nut})
ids = [f['id'] for f in foods]; assert len(ids) == len(set(ids))
json.dump({'nutrients': nutr, 'foods': foods}, open(out, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(len(foods), 'foods')
