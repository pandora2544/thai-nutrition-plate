"""Build the single-file version for WU eLearning (Moodle), packaged like the teacher's
"ค้นอาหารและสารอาหาร" zip: one HTML file with the database inside, plus a Thai README.

Usage: python3 tools/build_offline.py            -> dist/Thai_Nutrition_Plate_Offline.html
                                                    dist/Thai_Nutrition_Plate_eLearning.zip
Nothing is fetched at run time: CSS, scripts, foods, DRI groups and ingredient images are all inlined,
so the file works when opened from Moodle, from a USB stick, or with no internet.
"""
import base64, json, os, re, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, 'dist')
NAME = 'Thai_Nutrition_Plate_Offline.html'


def read(p, mode='r'):
    with open(os.path.join(ROOT, p), mode, **({} if 'b' in mode else {'encoding': 'utf-8'})) as f:
        return f.read()


def safe(js):  # text placed inside <script> must not close the tag early
    return js.replace('</', '<\\/')


def main():
    html = read('index.html')
    foods = json.loads(read('data/foods.json'))
    groups = json.loads(read('data/groups.json'))
    images = {i: 'data:image/webp;base64,' + base64.b64encode(read(f'img/{i}.webp', 'rb')).decode()
              for i in json.loads(read('data/images.json'))}
    bundle = json.dumps({'foods': foods, 'groups': groups, 'images': images}, ensure_ascii=False, separators=(',', ':'))

    # web font needs the internet; the CSS already falls back to Tahoma / system Thai fonts
    html = re.sub(r'<link rel="preconnect"[^\n]*\n', '', html)
    html = re.sub(r'<link rel="stylesheet" href="https://fonts[^\n]*\n', '', html)
    html = html.replace('<link rel="stylesheet" href="style.css">', '<style>\n' + read('style.css') + '\n</style>')
    scripts = re.findall(r'<script src="([^"]+)"></script>\n?', html)
    html = re.sub(r'<script src="[^"]+"></script>\n?', '', html)
    inline = '<script>window.TNP_BUNDLE=' + safe(bundle) + ';</script>\n'
    inline += ''.join('<script>\n' + safe(read(s)) + '\n</script>\n' for s in scripts)
    html = html.replace('</body>', inline + '</body>')
    assert 'src="' not in re.sub(r'data:image[^"]*', '', html.split('<script>window.TNP_BUNDLE')[0]), 'external file left in page'

    os.makedirs(DIST, exist_ok=True)
    out = os.path.join(DIST, NAME)
    with open(out, 'w', encoding='utf-8') as f:
        f.write(html)

    zpath = os.path.join(DIST, 'Thai_Nutrition_Plate_eLearning.zip')
    with zipfile.ZipFile(zpath, 'w', zipfile.ZIP_DEFLATED) as z:
        z.write(out, NAME)
        z.write(os.path.join(ROOT, 'docs', 'README_ELEARNING_TH.md'), 'README_TH.md')
    print(f'{out}  {os.path.getsize(out) / 1e6:.2f} MB · {len(foods["foods"])} foods · {len(images)} images')
    print(f'{zpath}  {os.path.getsize(zpath) / 1e6:.2f} MB')


if __name__ == '__main__':
    main()
