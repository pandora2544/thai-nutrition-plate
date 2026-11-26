"""Cut Gemini 4x4 sheets into one transparent WebP per food.
Usage: python3 tools/slice_sheets.py <folder with sheet-NN.png> img/
Reads tools/image_map.csv (sheet, cell, id). Each item is found by connected regions of non-white pixels,
assigned to the grid cell that holds its centre, the white background connected to the edges is made transparent,
then trimmed and resized to 256 px. Prints a contact sheet path for human review (images are checked by a person)."""
import csv, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
rows = list(csv.DictReader(open(os.path.join(os.path.dirname(__file__), 'image_map.csv'), encoding='utf-8')))
done, problems = [], []
for sheet in sorted({int(r['sheet']) for r in rows}):
    path = next((os.path.join(src, f) for f in os.listdir(src) if f.lower().startswith(f'sheet-{sheet:02d}')), None)
    if not path: problems.append(f'sheet {sheet}: ไม่พบไฟล์'); continue
    im = Image.open(path).convert('RGB'); a = np.asarray(im).astype(int); H, W = a.shape[:2]
    white = (a.min(axis=2) > 236) & (a.max(axis=2) - a.min(axis=2) < 14)
    # background = white pixels connected to the border
    lab, _ = ndimage.label(white)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(border))
    fg = ~bg
    fg = ndimage.binary_opening(fg, iterations=2)
    objs, n = ndimage.label(ndimage.binary_dilation(fg, iterations=6))
    cells = {}
    for i, sl in enumerate(ndimage.find_objects(objs), 1):
        ys, xs = sl; area = (ys.stop - ys.start) * (xs.stop - xs.start)
        if area < (W * H) / 400: continue  # crumbs
        cy, cx = (ys.start + ys.stop) / 2, (xs.start + xs.stop) / 2
        cell = int(cy // (H / 4)) * 4 + int(cx // (W / 4)) + 1
        cells.setdefault(cell, []).append(sl)
    for r in [r for r in rows if int(r['sheet']) == sheet]:
        c = int(r['cell'])
        if c not in cells: problems.append(f'sheet {sheet} ช่อง {c} ({r["thai_name"]}): ไม่พบภาพ'); continue
        y0 = min(s[0].start for s in cells[c]); y1 = max(s[0].stop for s in cells[c])
        x0 = min(s[1].start for s in cells[c]); x1 = max(s[1].stop for s in cells[c])
        pad = 6; y0, x0 = max(0, y0 - pad), max(0, x0 - pad); y1, x1 = min(H, y1 + pad), min(W, x1 + pad)
        rgba = np.dstack([a[y0:y1, x0:x1], np.where(fg[y0:y1, x0:x1], 255, 0)]).astype('uint8')
        alpha = Image.fromarray(rgba[:, :, 3]).filter(__import__('PIL.ImageFilter', fromlist=['x']).GaussianBlur(1.2))
        img = Image.fromarray(rgba[:, :, :3]); img.putalpha(alpha)
        img.thumbnail((256, 256), Image.LANCZOS)
        canvas = Image.new('RGBA', (256, 256), (0, 0, 0, 0)); canvas.paste(img, ((256 - img.width) // 2, (256 - img.height) // 2), img)
        canvas.save(os.path.join(out, f'{r["id"]}.webp'), 'WEBP', quality=82, method=6)
        done.append(r)
# contact sheet for review
if done:
    cols = 8; rows_n = (len(done) + cols - 1) // cols
    sheet_img = Image.new('RGB', (cols * 140, rows_n * 160), 'white')
    for i, r in enumerate(done):
        t = Image.open(os.path.join(out, f'{r["id"]}.webp')).resize((128, 128))
        sheet_img.paste(t, ((i % cols) * 140 + 6, (i // cols) * 160 + 4), t)
    sheet_img.save('/tmp/contact.png')
print(len(done), 'images ·', len(problems), 'problems')
for p in problems: print(' -', p)
