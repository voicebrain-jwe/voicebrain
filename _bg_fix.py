import cv2
import numpy as np

TARGET_BG_RGB = (230, 229, 227)  # light neutral gray studio backdrop
TARGET_BG_BGR = (TARGET_BG_RGB[2], TARGET_BG_RGB[1], TARGET_BG_RGB[0])

files = ['developer1.jpg', 'developer2.jpg', 'developer3.jpg']


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


for f in files:
    img = cv2.imread(f)
    h, w = img.shape[:2]
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
    bg_lab = sample_bg_lab(lab, h, w)
    dist = np.linalg.norm(lab - bg_lab.reshape(1, 1, 3), axis=2)

    mask = np.full((h, w), cv2.GC_PR_FGD, dtype=np.uint8)
    mask[dist < 15] = cv2.GC_BGD
    mask[dist > 90] = cv2.GC_FGD

    bgd_model = np.zeros((1, 65), np.float64)
    fgd_model = np.zeros((1, 65), np.float64)
    cv2.grabCut(img, mask, None, bgd_model, fgd_model, 6, cv2.GC_INIT_WITH_MASK)

    fg_mask = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype('uint8')

    kernel = np.ones((3, 3), np.uint8)
    fg_mask = cv2.morphologyEx(fg_mask, cv2.MORPH_CLOSE, kernel, iterations=2)

    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(fg_mask, connectivity=8)
    if num_labels > 1:
        largest = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
        fg_mask = np.where(labels == largest, 255, 0).astype('uint8')

    alpha = cv2.GaussianBlur(fg_mask, (0, 0), sigmaX=2.2)
    alpha = alpha.astype('float32') / 255.0
    alpha = alpha[..., None]

    bg = np.zeros_like(img, dtype='float32')
    bg[:, :] = TARGET_BG_BGR

    out = img.astype('float32') * alpha + bg * (1 - alpha)
    out = out.astype('uint8')

    out_path = f.replace('.jpg', '_bgfix.jpg')
    cv2.imwrite(out_path, out, [cv2.IMWRITE_JPEG_QUALITY, 92])
    print('saved', out_path)
