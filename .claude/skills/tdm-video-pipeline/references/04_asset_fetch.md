# 04 — ASSET AUTO-FETCH

> 4 fetcher Python + 1 finalize. CC ưu tiên → Google → YouTube → TikTok fallback.

## Pipeline cho 1 shot

```
search_queries[shot] (5-6 nguồn) → asset_fetch.py (CC) → google_fetch.py → youtube_fetch.py → tiktok_fetch.py
                                                ↓
                                  raw_pool/<shot>/{pexels,pixabay,wiki,google,yt,tiktok}_*.{jpg,mp4}
                                                ↓
                                       pick_best.py (auto-score)
                                                ↓
                                  _pick_proposed/<shot>/best.{jpg,mp4}
                                                ↓
                              CHECKPOINT 1 — user override _pick/<shot>/override.{jpg,mp4}
                                                ↓
                                     finalize_pick.py (trim + copy → final outname)
                                                ↓
                                     public/<slug>/01_NAME.jpg / videos/04_NAME.mp4
```

## Bước 1 — Search queries

Trong `public/<slug>/search_queries.md` (đã tạo bởi `new_clip.sh`):

```markdown
## S01a — Hook chuột đồng
- pexels:    "vietnam grilled rat field mekong delta"
- pixabay:   "rat dish vietnam food"
- wikimedia: "Rattus argentiventer Vietnam Mekong"
- google:    "chuot dong nuong lu an giang"
- youtube:   "chuột đồng nướng lu an giang traditional"
- tiktok:    (skip — risk cao, chỉ khi 5 nguồn trên fail)
```

**Quy tắc viết query:**
- 4-7 từ khoá EN cho CC sources (Pexels/Pixabay/Wikimedia ưu tiên EN)
- Bỏ dấu tiếng Việt cho Google + YouTube (engine handle Vietnamese tốt hơn unicode-encoded)
- Thêm địa danh + chất liệu + tên khoa học khi có
- Tránh từ "blood", "dead", "kill" — gây flag asset

## Bước 2 — Fetch CC sources

```bash
# Cho mỗi shot, kind, query trong search_queries.md
shot=S01a
mkdir -p public/<slug>/raw_pool/$shot

python3 scripts/asset_fetch.py "$shot" image \
  "vietnam grilled rat field mekong delta" 4 \
  public/<slug>/raw_pool/$shot

# asset_fetch.py thử cả Pexels + Pixabay + Mixkit + Wikimedia tuỳ kind
sleep 3
```

## Bước 3 — Fallback Google Images (khi CC < 2)

```bash
count=$(ls public/<slug>/raw_pool/$shot/ 2>/dev/null | wc -l | tr -d ' ')
if [ "$count" -lt 2 ]; then
  python3 scripts/google_fetch.py "$shot" \
    "chuot dong nuong lu an giang" 3 \
    public/<slug>/raw_pool/$shot
fi
```

⚠️ Google scraping rate-limited. Có thể block sau 10-20 query liên tục — sleep 5s giữa shot.

## Bước 4 — Fallback YouTube (cho video shot)

```bash
# CC ưu tiên trước
python3 scripts/youtube_fetch.py "$shot" \
  "vietnam clay pot grill traditional" 2 \
  public/<slug>/raw_pool/$shot --cc-only

# Nếu vẫn miss → non-CC (≤120s, sẽ trim ≤5s)
count=$(ls public/<slug>/raw_pool/$shot/yt_* 2>/dev/null | wc -l | tr -d ' ')
if [ "$count" -lt 1 ]; then
  python3 scripts/youtube_fetch.py "$shot" \
    "vietnam clay pot grill" 2 \
    public/<slug>/raw_pool/$shot --max-duration 120
fi
```

## Bước 5 — Fallback TikTok (chỉ khi mọi nguồn fail)

```bash
# Setup cookies once: yt-dlp --cookies-from-browser chrome <random_tiktok_url>

# Search via tiktok.com/search
python3 scripts/tiktok_fetch.py "$shot" \
  "chuot dong nuong" 2 \
  public/<slug>/raw_pool/$shot --cookies-browser chrome
```

⚠️ TikTok asset CHỈ được dùng nếu:
- ≥ 5 nguồn khác đã fail
- Trim chặt ≤ 4s
- Mix với ≥ 5 nguồn khác trong final video (transformative use)
- Log credit `tiktok @{username}` vào `out/credits.txt`

## Bước 6 — pick_best.py

```bash
python3 scripts/pick_best.py <slug>
```

Đọc `assets/<slug>/shot_map.json`, score & pick best per shot:
- **Image:** resolution 30% + aspect ratio 20% + sharpness 25% + brightness 15% + filesize 10%
- **Video:** resolution 30% + aspect 25% + duration sweet-spot (4-60s) 25% + filesize 20%

Output: `public/<slug>/_pick_proposed/<shot>/best.{jpg,mp4}` + `score.json`.

## CHECKPOINT 1 — User duyệt

```
📋 ĐỂ OVERRIDE 1 SHOT:
   1. Mở Finder → public/<slug>/_pick_proposed/SXX/best.jpg
   2. Nếu OK → bỏ qua
   3. Nếu muốn asset khác → copy file mới vào _pick/SXX/override.{jpg,mp4}

⚠️ CONTENT-SAFE CHECK (theo Pillar):
   - Pillar B Món lạ: tránh blood, animal-killing, gore
   - Pillar C Kỷ lục: kiểm visual size có đúng kỷ lục không
   - Pillar D Văn hóa: tránh stereotype offensive
```

## Bước 7 — finalize_pick.py

```bash
python3 scripts/finalize_pick.py <slug>
```

- Apply override nếu có, fallback proposed
- Trim videos về maxDurationSec (default 4, tutorial 5)
- Crop / scale 1080×1920
- Copy → tên final theo shot_map.json

Output cuối: `public/<slug>/01_NAME.jpg`, `public/<slug>/videos/04_NAME.mp4`, ...

## Bookkeeping credits

Mỗi fetcher tự ghi `credits_*.json` trong raw_pool. Tổng hợp cuối:

```bash
python3 -c "
import json, glob
out = []
for p in glob.glob('public/<slug>/raw_pool/**/credits*.json', recursive=True):
    out.append(json.load(open(p)))
with open('out/credits.json', 'w') as f:
    json.dump(out, f, indent=2)
print(f'✓ {len(out)} credit entries')
"
```

Cuối clip: `out/credits.txt` (paste vào caption nếu cần attribution).

## Khi user yêu cầu "fetch asset cho clip <slug>"

1. Đọc `assets/<slug>/shot_map.json` để biết shot list.
2. Đọc `public/<slug>/search_queries.md` (nếu chưa có → user fill, hoặc bot generate từ scenes.json + chủ đề).
3. Sinh đoạn lệnh (cho từng shot) chạy theo thứ tự fallback.
4. Sau khi raw_pool đầy → pick_best → CHECKPOINT 1 → finalize_pick.

## Edge cases

- **Asset historic (Pháp 1870, etc.):** ưu tiên Wikimedia trước, fallback Google. Pexels/Pixabay không có.
- **Tutorial process (lu nung, marinade):** ưu tiên video YouTube CC, vì Pexels chỉ có generic cooking.
- **Stat thuần text (150K, 30 PHÚT):** không cần fetch — Remotion StatOverlay tự render.
- **Map (An Giang, Hà Nội):** Wikimedia CC + style trong Remotion bằng SVG overlay.
- **Carousel comparison (Pháp/Ghana/VN):** mỗi panel 1 query riêng, fetch riêng.
