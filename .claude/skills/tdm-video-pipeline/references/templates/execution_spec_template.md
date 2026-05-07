# 🤖 CLIP {{NN}} — {{TITLE}} · EXECUTION SPEC (paste-and-run)

> **Cách dùng:** Mở Claude Code trong Cursor/Terminal tại `/Users/duyphan/tram-dung-mlem/` → paste TOÀN BỘ file này → Enter.
> Agent sẽ chạy tuần tự PHASE 0 → PHASE 7, dừng ở 2 CHECKPOINT chờ user xác nhận.
>
> **Slug:** `{{SLUG}}` (folder) / `{{SLUG_DASH}}` (file) / `{{PASCAL_SLUG}}` (composition)
> **Pillar:** {{PILLAR}} ({{PILLAR_NAME}}) — màu chủ đạo `{{PILLAR_COLOR}}`
> **Độ dài:** {{DURATION_SEC}}s = {{TOTAL_FRAMES}} frames @ 30fps · 1080×1920 vertical
> **Slot đăng:** {{SLOT}}

---

## 📌 SYSTEM ROLE — ĐỌC TRƯỚC

Bạn (Claude Code) đóng vai **Pipeline Agent** cho kênh TikTok "Trạm Dừng Mlem". Tuân thủ:

1. **Working dir:** `/Users/duyphan/tram-dung-mlem/`. Mọi path tương đối tính từ đây.
2. **Checkpoint:** Khi gặp `### ⏸ CHECKPOINT` — DỪNG, in tóm tắt, chờ user gõ `tiếp tục`.
3. **Idempotent:** Mỗi phase chạy lại được mà không hỏng dữ liệu cũ.
4. **Lỗi:** KHÔNG silently skip. In stderr rõ ràng + đề xuất fix.
5. **Không tự upload TikTok.** Output đích là 4 file `out/{{SLUG}}/`: `{{SLUG}}.mp4`, `cover.png`, `caption.txt`, `credits.txt`.
6. **Bản quyền:** Mỗi clip nguồn ≤ 4-5s. Tránh Netflix/Discovery/NatGeo/VTV. Log credits.
7. **Design system:** Bám `src/shared/` Universal Theme v1.0. Outline 4-6px, padding karaoke 4px 12px, PhotoBackdrop opacity 0.5.

---

## 🟦 PHASE 0 — BOOTSTRAP

```bash
set -e
cd /Users/duyphan/tram-dung-mlem
echo "=== PHASE 0: Bootstrap clip {{SLUG}} ==="

bash scripts/new_clip.sh "{{SLUG}}" "{{PILLAR}}" "{{DURATION_SEC}}" "{{TITLE}}"
```

Tạo:
- `public/{{SLUG}}/` (assets folder + raw_pool/_pick/_pick_proposed)
- `assets/{{SLUG}}/clip-meta.json`
- `src/scenes/{{SLUG_DASH}}/{_theme.ts,index.ts}` (placeholder)
- `src/compositions/{{PASCAL_SLUG}}.tsx` (stub)
- `public/{{SLUG}}/scenes.json` (1 scene placeholder)
- `public/{{SLUG}}/search_queries.md`

---

## 🟩 PHASE 1 + 2 — SCRIPT + STORYBOARD

> Đã viết tay tại workspace `/Users/duyphan/Documents/Claude/Projects/Trạm Dừng Mlem/{{SLUG}}_script.md`.
> Copy `scenes.json` + `shot_map.json` đã chuẩn bị:

```bash
# Copy đã có (storyboard + shot_map gen từ workspace)
cp /Users/duyphan/Documents/Claude/Projects/Trạm\ Dừng\ Mlem/{{SLUG}}_scenes.json public/{{SLUG}}/scenes.json
cp /Users/duyphan/Documents/Claude/Projects/Trạm\ Dừng\ Mlem/{{SLUG}}_shot_map.json assets/{{SLUG}}/shot_map.json

# Verify
python3 -c "
import json
sc = json.load(open('public/{{SLUG}}/scenes.json'))
sm = json.load(open('assets/{{SLUG}}/shot_map.json'))
print(f'  scenes: {len(sc[\"scenes\"])} (totalFrames={sc[\"totalFrames\"]})')
print(f'  shots:  {len(sm)}')
assert sc['totalFrames'] == {{TOTAL_FRAMES}}, 'totalFrames mismatch!'
"
```

---

## 🟧 PHASE 3 — VOICEOVER (USER manual)

User đã thu Vbee tại `app.vbee.vn` → save `public/{{SLUG}}/{{SLUG_DASH}}-voiceover.mp3`.

```bash
[ -f public/{{SLUG}}/{{SLUG_DASH}}-voiceover.mp3 ] || {
  echo "❌ Vbee voiceover chưa có. Thu xong → save vào public/{{SLUG}}/{{SLUG_DASH}}-voiceover.mp3"
  exit 1
}
size=$(stat -f%z public/{{SLUG}}/{{SLUG_DASH}}-voiceover.mp3 2>/dev/null || stat -c%s public/{{SLUG}}/{{SLUG_DASH}}-voiceover.mp3)
echo "✓ voiceover.mp3 = $size bytes"
ffprobe -v quiet -show_entries format=duration -of csv=p=0 public/{{SLUG}}/{{SLUG_DASH}}-voiceover.mp3
```

---

## 🟪 PHASE 4 — ASSET AUTO-FETCH

```bash
set -e
cd /Users/duyphan/tram-dung-mlem
echo "=== PHASE 4: Auto fetch assets ==="

# Cài deps nếu chưa có
pip3 install -q --break-system-packages Pillow opencv-python-headless playwright 2>/dev/null || true
python3 -m playwright install chromium 2>/dev/null

# 4.1 Search queries (đã có ở public/{{SLUG}}/search_queries.md từ phase 0)
# Loop fetch từng shot — paste-and-run từ search_queries.md đã chỉnh sửa.

# Example pattern cho 1 shot (REPEAT cho mỗi shot):
SHOT="S01"
KIND="image"
QUERY="vietnam {{TOPIC}} close-up macro"
mkdir -p public/{{SLUG}}/raw_pool/$SHOT

# Try CC first
python3 scripts/asset_fetch.py "$SHOT" "$KIND" "$QUERY" 4 public/{{SLUG}}/raw_pool/$SHOT || true
sleep 3

# Fallback Google nếu CC < 2
count=$(ls public/{{SLUG}}/raw_pool/$SHOT/ 2>/dev/null | wc -l | tr -d ' ')
if [ "$count" -lt 2 ]; then
  python3 scripts/google_fetch.py "$SHOT" "$QUERY" 3 public/{{SLUG}}/raw_pool/$SHOT || true
fi

# Fallback YouTube nếu kind=video
if [ "$KIND" = "video" ]; then
  count=$(ls public/{{SLUG}}/raw_pool/$SHOT/yt_* 2>/dev/null | wc -l | tr -d ' ')
  if [ "$count" -lt 1 ]; then
    python3 scripts/youtube_fetch.py "$SHOT" "$QUERY" 2 public/{{SLUG}}/raw_pool/$SHOT --cc-only || true
  fi
fi

# 4.X — REPEAT cho từng shot trong shot_map.json
# (Spec generator sẽ unroll loop dựa trên shot_map.json)

# 4.99 — Pick best
python3 scripts/pick_best.py {{SLUG}}

# Tổng kết
echo ""
echo "=== PHASE 4 SUMMARY ==="
python3 -c "
import json, os
sm = json.load(open('assets/{{SLUG}}/shot_map.json'))
for shot in sm:
    pool = f'public/{{SLUG}}/raw_pool/{shot}'
    n = len([f for f in os.listdir(pool) if not f.startswith('credits')]) if os.path.isdir(pool) else 0
    proposed = f'public/{{SLUG}}/_pick_proposed/{shot}/best'
    has = '✓' if any(os.path.exists(proposed + ext) for ext in ['.jpg', '.mp4']) else '✗'
    print(f'  {shot:>6} pool={n:>3} pick={has}')
"
```

### ⏸ CHECKPOINT 1 — User duyệt picks

```
📋 ĐỂ OVERRIDE:
   1. Mở Finder → public/{{SLUG}}/_pick_proposed/<SHOT>/best.jpg|mp4
   2. Nếu OK → bỏ qua
   3. Nếu muốn asset khác → copy file mới vào public/{{SLUG}}/_pick/<SHOT>/override.jpg|mp4

⚠️ CHECK CONTENT-SAFE theo Pillar {{PILLAR}} (xem references/04_asset_fetch.md).
```

Chờ user gõ `tiếp tục`.

```bash
# Finalize sau khi user duyệt
python3 scripts/finalize_pick.py {{SLUG}}

# Verify final
python3 -c "
import json, os
sm = json.load(open('assets/{{SLUG}}/shot_map.json'))
for shot, info in sm.items():
    p = f'public/{{SLUG}}/{info[\"out\"]}'
    print(f'  {info[\"out\"]:<40} {\"✓\" if os.path.exists(p) else \"❌ MISSING\"}')
"
```

---

## 🟦 PHASE 5 — WHISPER SYNC

```bash
set -e
cd /Users/duyphan/tram-dung-mlem
echo "=== PHASE 5: Whisper sync ==="

python3 scripts/whisper_sync.py public/{{SLUG}}/{{SLUG_DASH}}-voiceover.mp3 \
  --model medium --lang vi

python3 scripts/scene_perword.py {{SLUG}}

# Verify per-word distribution
python3 -c "
import json
data = json.load(open('public/scenes-with-perword.json'))
for sc in data['scenes']:
    n = len(sc.get('perWord', []))
    flag = '⚠️' if n == 0 else ' '
    print(f'  {flag} {sc[\"shot\"]:30} {sc[\"start\"]:>5}-{sc[\"end\"]:>5}f  {n:>3} words')
"
```

---

## 🟥 PHASE 6 — REMOTION RENDER

```bash
set -e
cd /Users/duyphan/tram-dung-mlem
echo "=== PHASE 6: Remotion render ==="

# 6.1 Verify Scene*.tsx files exist for every shot in scenes.json
python3 -c "
import json, os
sc = json.load(open('public/{{SLUG}}/scenes.json'))
shots = list({s['shot'] for s in sc['scenes']})
print(f'  {len(shots)} unique shots in scenes.json')
"

# 6.2 Verify SHOT_MAP exports + composition registered
grep -q '{{PASCAL_SLUG}}' src/Root.tsx || {
  echo '❌ Root.tsx chưa register Composition {{PASCAL_SLUG}}'
  echo '   Thêm: <Composition id=\"{{SLUG}}\" component={{{PASCAL_SLUG}}} ... />'
  exit 1
}

# 6.3 Render
npx remotion render src/index.tsx {{SLUG}} out/{{SLUG}}.mp4 \
  --concurrency=4 --pixel-format=yuv420p --codec=h264 --crf=20

# 6.4 Verify
ffprobe -v quiet -show_entries format=duration -of csv=p=0 out/{{SLUG}}.mp4
ls -la out/{{SLUG}}.mp4
```

### ⏸ CHECKPOINT 2 — User xem preview

User mở `out/{{SLUG}}.mp4` → check:
- Hook 0-3s đọc rõ
- Karaoke đồng bộ từng từ
- BGM 18% không lấn voice
- Transitions không giật
- Mascot đúng beat

OK → user gõ `tiếp tục` để PHASE 7.

---

## 🟫 PHASE 7 — POLISH + UPLOAD

```bash
set -e
cd /Users/duyphan/tram-dung-mlem
mkdir -p out/{{SLUG}}

# 7.1 Generate caption + hashtag
cat > out/{{SLUG}}/caption.txt <<'CAPTION'
{{HOOK_LINE}}

{{BODY_LINE_1}}
{{BODY_LINE_2}}

{{CTA_LINE}}

#TramDungMlem #monlathegioi {{NICHE_HASHTAGS}} #amthucvietnam #foodvietnam #foodadventure #xuhuong
CAPTION

# 7.2 Compile credits
python3 -c "
import json, glob
out = []
for p in glob.glob('public/{{SLUG}}/raw_pool/**/credits*.json', recursive=True):
    out.append(json.load(open(p)))
with open('out/{{SLUG}}/credits.json', 'w') as f:
    json.dump(out, f, indent=2)
" 2>/dev/null

# 7.3 Copy final MP4
cp out/{{SLUG}}.mp4 out/{{SLUG}}/{{SLUG}}.mp4

# 7.4 (Optional) Generate cover.png — TODO

ls -la out/{{SLUG}}/
```

User upload TikTok manual:
- Paste `caption.txt`
- Cover frame: chọn frame có hook text rõ
- Schedule: {{SLOT}}
- Allow: comment + duet + stitch

---

## ✅ DELIVERABLES

| File | Path | Mục đích |
|------|------|----------|
| Final MP4 | `out/{{SLUG}}/{{SLUG}}.mp4` | Upload TikTok |
| Caption | `out/{{SLUG}}/caption.txt` | TikTok description |
| Credits | `out/{{SLUG}}/credits.json` | Attribution log |
| Cover | `out/{{SLUG}}/cover.png` | Thumbnail (optional) |
