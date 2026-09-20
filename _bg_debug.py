import cv2
import numpy as np


def sample_bg_lab(lab, h, w):
    m = 4
    pts = [
        lab[0:m, :].reshape(-1, 3),
        lab[h - m:h, :].reshape(-1, 3),
        lab[:, 0:m].reshape(-1, 3),
        lab[:, w - m:w].reshape(-1, 3),
    ]
    allpts = np.concatenate(pts, axis=0).astype(np.float32)
    return np.median(allpts, axis=0)


f = 'developer1.jpg'
img = cv2.imread(f)
h, w = img.shape[:2]
lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
bg_lab = sample_bg_lab(lab, h, w)
dist = np.linalg.norm(lab - bg_lab.reshape(1, 1, 3), axis=2)

# check a shoulder point, e.g near bottom, left-ish (suit)
shoulder_pts = [(h - 30, 50), (h - 30, w - 50), (h - 100, 30), (h - 5, w // 2)]
for (y, x) in shoulder_pts:
    print('point', (y, x), 'BGR', img[y, x].tolist(), 'dist', dist[y, x])

seed_mask = np.full((h, w), cv2.GC_PR_FGD, dtype=np.uint8)
seed_mask[dist < 15] = cv2.GC_BGD
seed_mask[dist > 90] = cv2.GC_FGD

# save seed mask visualization: BGD=black, PR_FGD=gray, FGD=white
vis = np.zeros((h, w), dtype=np.uint8)
vis[seed_mask == cv2.GC_BGD] = 0
vis[seed_mask == cv2.GC_PR_FGD] = 128
vis[seed_mask == cv2.GC_FGD] = 255
cv2.imwrite('_debug_seed_mask.png', vis)

mask = seed_mask.copy()
bgd_model = np.zeros((1, 65), np.float64)
fgd_model = np.zeros((1, 65), np.float64)
cv2.grabCut(img, mask, None, bgd_model, fgd_model, 6, cv2.GC_INIT_WITH_MASK)

vis2 = np.zeros((h, w), dtype=np.uint8)
vis2[mask == cv2.GC_BGD] = 0
vis2[mask == cv2.GC_PR_BGD] = 80
vis2[mask == cv2.GC_PR_FGD] = 180
vis2[mask == cv2.GC_FGD] = 255
cv2.imwrite('_debug_after_grabcut.png', vis2)

print('seed counts', np.bincount(seed_mask.flatten(), minlength=4))
print('after counts', np.bincount(mask.flatten(), minlength=4))
