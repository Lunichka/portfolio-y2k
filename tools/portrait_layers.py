"""LEYLA OS — portrait layers (glitter laptop + glitter outline).

Builds two separate overlay layers on top of the untouched suit cut-out,
so the original photo is never edited and each layer can be redone later:

  1. laptop-glitter : the pink glitter lid from the reference picture,
     perspective-warped onto the silver lid. Fingers are masked out by colour,
     so the hand stays on top and is not repainted.
  2. outline-glitter: a pink glitter contour around the silhouette.

Usage:  python3 portrait_layers.py SUIT_CUTOUT.png PINK_LAPTOP_REF.jpg OUT_DIR
Lid corner coordinates below are in the 1920x2560 space of the cut-out.
"""
import sys, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

SRC, REF, OUT = sys.argv[1:4]
os.makedirs(OUT, exist_ok=True)

# -- lid quads: TL, TR, BR, BL -------------------------------------------------
DST_LID = [(836, 893), (1494, 843), (1414, 1283), (771, 1371)]   # silver lid in the photo
SRC_LID = [(212, 106), (632, 103), (589, 420), (162, 474)]        # glitter lid in the reference (inset from rounded corners)


def homography(src, dst):
    A = []
    for (x, y), (u, v) in zip(src, dst):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y, -u])
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y, -v])
    _, _, vt = np.linalg.svd(np.array(A, float))
    return (vt[-1] / vt[-1, -1]).reshape(3, 3)


suit = Image.open(SRC).convert('RGBA')
W, H = suit.size
S = np.asarray(suit).astype(np.float32)
ref = np.asarray(Image.open(REF).convert('RGB')).astype(np.float32)

# -- 1. warp the reference lid onto the photo lid --------------------------------
Hm = homography(DST_LID, SRC_LID)          # maps photo -> reference (inverse warp)
x0, y0 = min(p[0] for p in DST_LID) - 4, min(p[1] for p in DST_LID) - 4
x1, y1 = max(p[0] for p in DST_LID) + 4, max(p[1] for p in DST_LID) + 4
ys, xs = np.mgrid[y0:y1, x0:x1].astype(np.float32)
den = Hm[2, 0] * xs + Hm[2, 1] * ys + Hm[2, 2]
u = (Hm[0, 0] * xs + Hm[0, 1] * ys + Hm[0, 2]) / den
v = (Hm[1, 0] * xs + Hm[1, 1] * ys + Hm[1, 2]) / den
warped = np.zeros((y1 - y0, x1 - x0, 3), np.float32)
for c in range(3):
    warped[..., c] = ndimage.map_coordinates(ref[..., c], [v, u], order=1, mode='nearest')

# -- 2. lid mask = lid polygon minus skin -----------------------------------------
poly = Image.new('L', (W, H), 0)
ImageDraw.Draw(poly).polygon(DST_LID, fill=255)
poly_np = np.asarray(poly.filter(ImageFilter.GaussianBlur(0.8))).astype(np.float32) / 255
crop = S[y0:y1, x0:x1]
r, g, b, a = crop[..., 0], crop[..., 1], crop[..., 2], crop[..., 3]
# Soft skin/lid split by warmth (r-b). Smoothing first removes the canvas-texture
# noise, so the edge of every finger gets a 2-3 px blend instead of a grey halo.
warm = ndimage.gaussian_filter(r - b, 1.6)
skin_t = np.clip((warm - 14) / 18, 0, 1)
m = poly_np[y0:y1, x0:x1] * (1 - skin_t) * (a > 128)
lidcore = m > .5

# -- 3. integrate: keep the photo's canvas texture and its shadows ----------------
lum = (0.3 * r + 0.59 * g + 0.11 * b)
lum_n = lum / max(1, np.percentile(lum[lidcore], 60))
hf = lum / np.maximum(1, ndimage.gaussian_filter(lum, 6))          # canvas texture only
shade_wide = ndimage.gaussian_filter(lum_n, 25)
shade_near = np.clip(ndimage.gaussian_filter(lum_n, 3), 0.35, 1.15)  # finger shadows on the lid
out = warped * (0.82 + 0.18 * shade_wide[..., None]) * (0.45 + 0.55 * shade_near[..., None]) / 0.98
out = out * (0.85 + 0.15 * hf[..., None])
out = np.clip(out * 1.04, 0, 255)

layer = np.zeros((H, W, 4), np.uint8)
layer[y0:y1, x0:x1, :3] = out.astype(np.uint8)
layer[y0:y1, x0:x1, 3] = (m * 255).astype(np.uint8)
Image.fromarray(layer).save(os.path.join(OUT, 'laptop-glitter-layer.png'))

# -- 4. glitter outline around the silhouette -------------------------------------
alpha = S[..., 3] > 110
alpha = ndimage.binary_opening(alpha, iterations=3)
lab, n = ndimage.label(alpha)
sizes = ndimage.sum(alpha, lab, range(1, n + 1))
body = lab == (int(np.argmax(sizes)) + 1)
body = ndimage.binary_fill_holes(body)
small = Image.fromarray((body * 255).astype(np.uint8)).resize((W // 2, H // 2), Image.BILINEAR)
small = Image.fromarray((np.asarray(small) > 127).astype(np.uint8) * 255).filter(ImageFilter.GaussianBlur(6))
small = np.asarray(small) > 60                           # smoothed silhouette, no jaggies
dist = ndimage.distance_transform_edt(~small) * 2        # full-res px
dist = np.asarray(Image.fromarray(dist.astype(np.float32)).resize((W, H), Image.BILINEAR))
R = 30                                                   # outline width in px (full res)
ring = np.clip(R + 0.5 - dist, 0, 1) * (dist > -1)      # crisp anti-aliased outer edge
rim = np.clip(1 - np.abs(dist - (R - 2.5)) / 2.5, 0, 1)  # thin deeper-pink rim on the outer edge
ring = ring * (1 - body)                                # never over the person

rng = np.random.default_rng(7)
base = np.array([255, 150, 205], np.float32)
noise = rng.random((H, W)).astype(np.float32)
glit = np.empty((H, W, 3), np.float32)
glit[:] = base
glit *= (0.78 + 0.32 * noise[..., None])
sp = noise > 0.985                                      # tiny white flecks
glit[sp] = [255, 246, 252]
lav = (rng.random((H, W)) > 0.93)
glit[lav] = [226, 196, 255]
ol = np.zeros((H, W, 4), np.uint8)
rim = rim * (1 - body)
glit = glit * (1 - rim[..., None] * .55) + np.array([214, 40, 140], np.float32) * rim[..., None] * .55
ol[..., :3] = np.clip(glit, 0, 255).astype(np.uint8)
ol[..., 3] = (np.clip(ring, 0, 1) * 255).astype(np.uint8)
Image.fromarray(ol).save(os.path.join(OUT, 'outline-glitter-layer.png'))

# bbox of everything for web crops
bb = np.argwhere((ring > 0.02) | body)
print('content bbox (x0,y0,x1,y1):', bb[:, 1].min(), bb[:, 0].min(), bb[:, 1].max(), bb[:, 0].max())
