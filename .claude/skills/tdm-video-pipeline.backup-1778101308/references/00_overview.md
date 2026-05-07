# 00 — OVERVIEW

> Đọc file này TRƯỚC để có flow tổng. Mỗi phase có 1 file riêng (01-07).

## Pipeline tổng quan

```
PHASE 0  Bootstrap clip                              [scripts/new_clip.sh]
PHASE 1  Vbee script (research/template/format)      [refs/01_vbee_script.md]
PHASE 2  Storyboard + scenes.json                    [refs/02_storyboard.md]
PHASE 3  USER thu Vbee → import .mp3 (manual)
PHASE 4  Asset fetch (CC + Google + YT + TikTok)     [refs/04_asset_fetch.md]
         CHECKPOINT 1 — duyệt _pick_proposed/
PHASE 5  Whisper sync → scenes-with-perword.json     [refs/05_whisper_sync.md]
PHASE 6  Remotion render                             [refs/06_remotion_render.md]
         CHECKPOINT 2 — preview out/{slug}.mp4
PHASE 7  Caption + hashtag + cover + upload          [refs/07_audio_mix.md]
```

## Per-clip checklist

```
[ ] PHASE 0  scripts/new_clip.sh <slug> <pillar A|B|C|D> <durationSec> "<title>"
[ ] PHASE 1  Generate Vbee script (1 trong 3 mode)
[ ] PHASE 2  Fill scenes.json beats + assets/<slug>/shot_map.json
[ ] PHASE 3  USER thu Vbee tại app.vbee.vn → public/<slug>/<slug>-voiceover.mp3
[ ] PHASE 4  python3 scripts/asset_fetch.py + youtube_fetch.py + (google/tiktok if miss)
[ ] PHASE 4  python3 scripts/pick_best.py <slug>
[ ] CHECKPOINT 1 — User duyệt _pick_proposed → override nếu cần
[ ] PHASE 4  python3 scripts/finalize_pick.py <slug>
[ ] PHASE 5  python3 scripts/whisper_sync.py public/<slug>/<slug>-voiceover.mp3
[ ] PHASE 5  python3 scripts/scene_perword.py <slug>
[ ] PHASE 6  Build Scene*.tsx files theo scenes.json (manual hoặc với Claude help)
[ ] PHASE 6  npx remotion render src/index.tsx <PascalSlug> out/<slug>.mp4
[ ] CHECKPOINT 2 — User xem preview
[ ] PHASE 7  Generate caption.txt + hashtag + cover.png
[ ] PHASE 7  Upload TikTok (manual)
```

## Convention quan trọng

### Slug
- **Folder slug:** compact, không dấu gạch — `caphetrung`, `chuotdong`, `chaca`
- **File slug (voiceover):** dùng dashes — `cha-ca-voiceover.mp3`
- **Pascal slug (composition):** PascalCase — `ChaCa`, `CaPheTrung`

### Folder per-clip
```
public/<slug>/                        ← FOLDER PER-CLIP
  <slug-dash>-voiceover.{mp3,json}    ← từ Vbee + Whisper
  01_NAME.jpg / 02_NAME.jpg / ...     ← finalized images
  videos/04_NAME.mp4 / ...            ← finalized videos
  raw_pool/<shot>/*.{jpg,mp4}         ← all candidates from fetchers
  _pick_proposed/<shot>/best.{jpg,mp4} ← auto-picked
  _pick/<shot>/override.{jpg,mp4}     ← user override (optional)
  scenes.json                         ← timeline (beats + sfx)
public/scenes-with-perword.json       ← sync output (read by Remotion useSceneWords)
public/audio/                         ← BGM + SFX SHARED
assets/<slug>/
  clip-meta.json                      ← title, pillar, duration, etc.
  shot_map.json                       ← {S01: {out: "01_hook.jpg", kind: "image", maxDurationSec: 4}}
```

### Pillar dominant
1 pillar / 1 clip. Yellow + Black luôn xuất hiện. Mascot dùng cả 4 pillar.

| Pillar | Color base | Mood |
|--------|-----------|------|
| A | `#F8B147` Yellow | Khẩu phần đặc thù (Fire dept, MRE, astronaut) |
| B | `#C8302D` Red | Món lạ quốc gia (Balut, Casu Marzu, Hákarl) |
| C | `#E85D2F` Coral | Kỷ lục cực đoan (12k$ pizza, Pepper X, 50kg burger) |
| D | `#4FC3D1` Teal | Văn hóa (taboo Nhật, vì sao Ấn không ăn bò) |

## Khi user yêu cầu sản xuất clip

1. Đọc 00_overview.md (file này) + 01_vbee_script.md
2. Hỏi 4 ABCD + Recommended:
   - **Pillar?** (A: Khẩu phần / B: Món lạ / C: Kỷ lục / D: Văn hóa) — dùng A nếu liên quan khẩu phần lính/du hành; B nếu món gây shock; C nếu kỷ lục; D nếu kể chuyện văn hóa
   - **Độ dài?** (35s / 60s / 90s / khác) — dài chỉ khi chủ đề có depth (lịch sử + tutorial + so sánh)
   - **Vbee mode?** (Research bot tự / Template Pillar / Format only / Hybrid)
   - **Slot đăng?** (12h / 20h / cả hai / khác)
3. Generate execution_spec.md từ template → user paste Claude Code tại Remotion repo
4. Theo dõi 2 checkpoint, dừng chờ `tiếp tục`
