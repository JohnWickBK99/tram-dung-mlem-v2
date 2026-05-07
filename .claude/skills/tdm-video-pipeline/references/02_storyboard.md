# 02 — STORYBOARD & scenes.json

> Output: `public/<slug>/scenes.json` + `assets/<slug>/shot_map.json`.

## scenes.json schema

```json
{
  "slug": "chuotdong",
  "title": "Chuột đồng nướng lu An Giang",
  "totalFrames": 2700,
  "fps": 30,
  "width": 1080,
  "height": 1920,
  "pillar": "B",
  "scenes": [
    {
      "id": "S01_HOOK_USA_VN",
      "shot": "S01_HOOK_USA_VN",
      "start": 0,
      "end": 90,
      "text": "Một trăm năm mươi nghìn đồng",
      "visual": "split-screen-USA-VN",
      "highlightColor": null,
      "sfx": [
        { "name": "impact-hook.mp3", "frame": 0, "volume": 0.6 }
      ]
    }
  ],
  "audio": {
    "voiceover": "chuotdong/chuot-dong-voiceover.mp3",
    "bgm": "audio/bgm-pillarB.mp3",
    "bgmVolume": 0.18
  }
}
```

## shot_map.json schema (cho pick_best.py)

```json
{
  "S01a": { "out": "01_hook_chuotdong.jpg", "kind": "image" },
  "S01b": { "out": "02_usa_exterminator.jpg", "kind": "image" },
  "S03b": { "out": "videos/04_lu_dat.mp4", "kind": "video", "maxDurationSec": 5 },
  "S04":  { "out": "videos/05_bite.mp4", "kind": "video", "maxDurationSec": 4 }
}
```

- `out` — đường dẫn relative trong `public/<slug>/`
- `kind` — "image" hoặc "video"
- `maxDurationSec` — chỉ áp dụng cho video, default 4

## Quy tắc thiết kế scenes

### Frame range
- **Hook** 0-90 (3s) — KHÔNG ngắn hơn 75f, KHÔNG dài hơn 105f (3.5s)
- **Scene thường:** 4-7s (120-210f) — đủ thời gian đọc karaoke + xem visual
- **Scene tutorial:** 8-12s (240-360f) — chỉ khi có 3-4 sub-step có chip rõ
- **CTA cuối:** 3-5s (90-150f)
- **Long-form 90s:** mỗi 5-7s phải có animation/SFX/chip change để giữ retention

### SFX trigger pattern
```json
"sfx": [
  { "name": "impact-hook.mp3",     "frame": 0,    "volume": 0.6 },   // hit khởi đầu
  { "name": "whoosh-transition.mp3","frame": 85,  "volume": 0.55 },  // whip ra scene
  { "name": "chime-fact.mp3",      "frame": 140, "volume": 0.5 },   // fact pop
  { "name": "pop-sticker.mp3",     "frame": 165, "volume": 0.5 }    // chip xuất hiện
]
```

Chuẩn vol: VO 1.0, BGM 0.18, SFX 0.5-0.6, mlem-sting 0.7.

### Karaoke override (per-scene)
```json
"highlightColor": "#E85D2F"   // override default Yellow → Coral (cho scene nền vàng)
```

Hoặc set null để dùng default.

### Visual hint cho Scene*.tsx
Trong `visual` field ghi shorthand mô tả:
- `"static-photo"` → PhotoBackdrop
- `"split-USA-VN"` → 2-column split
- `"carousel-3"` → Carousel3Panel
- `"stat-overlay-150K"` → StatOverlay
- `"video-bite"` → OffthreadVideo của public/{slug}/videos/05_bite.mp4
- `"map-an-giang"` → SVG/PNG map

Visual hint là gợi ý cho người implement Scene*.tsx; không bắt buộc.

## Pillar-specific design rules

### Pillar A (Yellow)
- BG nhiều scene = `pillar.a.light` (#FFE0A8)
- Karaoke default Yellow → cảnh nền vàng phải override Coral
- Mascot: mlem-happy / mlem-drooling

### Pillar B (Red)
- BG hook + price = `pillar.b.base` (#C8302D)
- Karaoke trên BG đỏ → highlight Yellow
- Mascot: mlem-shocked / mlem-mindblown

### Pillar C (Coral)
- BG record/extreme = `pillar.c.base` (#E85D2F)
- Stat overlay HUGE (size 240) ở scene record
- Mascot: mlem-mindblown / mlem-shocked

### Pillar D (Teal)
- BG cultural = `pillar.d.light` (#BEE7ED)
- Tone bình tĩnh, ít SFX hơn (max 2-3 sfx/scene)
- Mascot: mlem-thinking / mlem-sideeye

## Khi build storyboard

1. Xác định totalFrames = durationSec × fps (30).
2. Phân scene theo template Pillar (xem `01_vbee_script.md`).
3. Mỗi scene gán shot ID `SXX_NAME` (vd: S01_HOOK, S03b_TUTORIAL).
4. Map text Vbee → scene.text (đoạn text scene đó).
5. Map asset cần fetch → `assets/<slug>/shot_map.json` (mỗi shot 1 entry).
6. SFX events tối thiểu: hook impact (f0), whoosh giữa scene, chime fact, mlem-sting kết.

Verify: `totalFrames === scenes[last].end`.

## ⚠️ QUY TẮC v1.2 — ASSET CHỈ CHIẾU 1 LẦN

### Quy tắc

Mỗi video clip + ảnh xuất hiện 1 lần duy nhất trong scene của nó. KHÔNG loop, KHÔNG replay.

### scenes.json — đảm bảo scene durFrames ≤ video duration

Khi shot là video (`videos/04_lu_dat.mp4`) — sau finalize_pick.py video đã trim ≤ 4-5s. scene `end - start` PHẢI ≤ video duration × fps:

```python
# Verify trong build process
import json, subprocess
sc = json.load(open('public/<slug>/scenes.json'))
sm = json.load(open('assets/<slug>/shot_map.json'))
for scene in sc['scenes']:
    info = sm.get(scene['shot'])
    if info and info['kind'] == 'video':
        max_dur = info.get('maxDurationSec', 4) * sc['fps']
        scene_dur = scene['end'] - scene['start']
        assert scene_dur <= max_dur, f"{scene['shot']} scene_dur ({scene_dur}f) > video max ({max_dur}f) — sẽ replay/freeze"
```

### Scene*.tsx implementation

```tsx
// ✅ ĐÚNG
<OffthreadVideo src={staticFile('chuotdong/videos/04_lu_dat.mp4')} />
// KHÔNG có `loop` prop — default false là đúng

// ❌ SAI — không bao giờ pass loop
<OffthreadVideo src="..." loop />
```

### scenes.json — emphasis field (v1.2 keyword highlight)

```json
{
  "id": "S02",
  "shot": "S02_SETUP",
  "start": 90,
  "end": 240,
  "text": "An Giang miền Tây nổi tiếng món chuột đồng nướng lu",
  "emphasis": ["An Giang", "chuột đồng", "nướng lu"],
  ...
}
```

`emphasis` chứa list phrase quan trọng. SubtitleKaraoke v1.2 mark các word match → vàng inactive, đen-vàng active.
