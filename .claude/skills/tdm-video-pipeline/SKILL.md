---
name: tdm-video-pipeline
description: End-to-end pipeline để sản xuất 1 clip TikTok cho kênh "Trạm Dừng Mlem" (Đại Việt / Lynx) — từ chủ đề món ăn → Vbee script → asset auto-fetch (CC ưu tiên + Google/YouTube/TikTok fallback) → Whisper word-level sync → Remotion render 1080×1920 9:16 30fps → mix BGM/SFX → MP4 final upload-ready. Áp dụng Universal Theme v1.2 "Playful Foodtoon" (4 pillar color-coded, font Baloo 2 + Be Vietnam Pro, karaoke caption outline đen, mascot Mèo Mlem, sticker shadow chunky). Triggers — kích hoạt skill này KHI user nói bất kỳ điều gì sau đây (kể cả không nhắc tên skill cụ thể) — "làm clip mới", "dựng clip", "tạo video TikTok", "build clip {tên món}", "chuẩn bị clip ngày mai", "viết Vbee cho món X", "fetch asset cho clip", "sync voiceover Whisper", "render Remotion clip", "ghép BGM SFX", "tdm video", "Trạm Dừng Mlem clip", "clip {tên món} pillar A/B/C/D". Khi user paste tên 1 món ăn (vd: "lẩu mắm", "bún bò Huế", "casu marzu") trong context kênh TikTok → cũng dùng skill này. KHÔNG dùng cho kênh "Chất AI" (đã có chat-ai-video-builder).
---

# Trạm Dừng Mlem — Video Pipeline Skill

> **Owner:** Đại Việt (Lynx) · solo content creator · kênh @tramdungmlem
> **Goal:** 60 clips / 30 ngày · từ 0 → 10K followers
> **Stack:** Vbee TTS + Whisper.cpp + yt-dlp + Playwright + Remotion 1080×1920 30fps

## 0. KHI NÀO DÙNG SKILL NÀY

Bất cứ khi user yêu cầu sản xuất 1 clip TikTok mới cho kênh Trạm Dừng Mlem, hoặc yêu cầu bất kỳ phase nào trong pipeline (Vbee, asset, sync, render, mix audio). Nếu user mới nói tên 1 món ăn lạ + nhắc TikTok / clip / video → vẫn dùng skill này.

**KHÔNG** dùng skill này cho kênh "Chất AI" (đã có skill `chat-ai-video-builder` riêng).

## 1. WORKFLOW 7 PHASE — END-TO-END

```
[CHỦ ĐỀ MÓN]
   ↓
PHASE 0  — Bootstrap clip folder (slug + scaffold)              [refs/00_overview.md]
   ↓
PHASE 1  — Vbee script (3 mode: research / template / format)   [refs/01_vbee_script.md]
   ↓
PHASE 2  — Storyboard + scenes.json (frame-level timeline)      [refs/02_storyboard.md]
   ↓
PHASE 3  — USER thu Vbee → import voiceover.mp3 (manual)
   ↓
PHASE 4  — Asset auto-fetch (CC ưu tiên → Google/YT/TikTok fb) [refs/04_asset_fetch.md]
   ↓        Checkpoint 1: user duyệt _pick_proposed/
PHASE 5  — Whisper word-level sync → scenes-with-perword.json   [refs/05_whisper_sync.md]
   ↓
PHASE 6  — Remotion render: VO + BGM + SFX + karaoke + visual   [refs/06_remotion_render.md]
   ↓        Checkpoint 2: user xem out/{slug}.mp4
PHASE 7  — Polish + caption + hashtag + cover                   [refs/07_audio_mix.md]
```

Mỗi phase **idempotent** — chạy lại được. Dừng ở 2 checkpoint chờ user gõ `tiếp tục`.

## 2. KIẾN TRÚC FILE — COMMON vs PER-VIDEO

### 2.1 Common (build 1 lần, dùng cho mọi clip) — sống ở `/Users/duyphan/tram-dung-mlem/`

```
src/shared/
├── theme/
│   ├── theme.ts              ← Universal theme v1.2 (color, font, motion, getPillar, outlineText)
│   ├── tokens.json           ← W3C tokens
│   └── globals.css           ← CSS vars (cho future web/email)
├── components/
│   ├── PhotoBackdrop.tsx     ← static photo + tint + vignette + fallback bg
│   ├── PillarBadge.tsx       ← top-left pillar tag
│   ├── ChannelMark.tsx       ← top-right "Trạm Dừng Mlem" watermark
│   ├── SubtitleKaraoke.tsx   ← word-level highlight, perWord prop
│   ├── StickerCard.tsx       ← chunky outline + offset shadow
│   ├── SceneFrame.tsx        ← root container với optional badge + mark
│   ├── OutlineText.tsx       ← outline 4-6px chuẩn + textShadow
│   ├── ZoomPunch.tsx         ← 13-frame transition wrapper
│   ├── KenBurns.tsx          ← optional zoom slow (off mặc định)
│   ├── Carousel3Panel.tsx    ← 3-panel carousel (S06b clip 04)
│   ├── StatOverlay.tsx       ← MAX 240px monoStat
│   ├── FactPop.tsx           ← chime + fact card
│   └── index.ts              ← barrel export
├── hooks/
│   ├── useEntry.ts           ← sticker pop spring
│   └── useSceneWords.ts      ← lấy perWord từ scenes-with-perword.json
└── RootShared.tsx            ← font loader: Baloo2, BeVietnamPro, JetBrainsMono

scripts/
├── new_clip.sh               ← bootstrap public/{slug}/ + src/scenes/{slug}/
├── asset_fetch.py            ← CC: Pexels/Pixabay/Mixkit/Wikimedia
├── google_fetch.py           ← Playwright Google Images (fallback)
├── youtube_fetch.py          ← yt-dlp YouTube CC + non-CC
├── tiktok_fetch.py           ← yt-dlp TikTok với cookies
├── pick_best.py              ← score & pick best per shot
├── whisper_sync.py           ← Whisper.cpp wrapper + JSON normalize
├── scene_perword.py          ← map words → scenes
└── audio_mix.py              ← FFmpeg mix VO + BGM 18% + SFX

public/audio/                  ← BGM + SFX SHARED giữa các clip
├── bgm-pillarA.mp3
├── bgm-pillarB.mp3
├── bgm-pillarC.mp3
├── bgm-pillarD.mp3
├── whoosh-transition.mp3
├── impact-hook.mp3
├── chime-fact.mp3
├── mlem-sting.mp3
└── pop-sticker.mp3
```

### 2.2 Per-video (build mới mỗi clip)

```
src/scenes/{slug}/
├── _theme.ts                 ← extends shared/theme với pillar + override
├── _chrome.tsx               ← (optional) extends shared/components nếu cần chrome riêng
├── index.ts                  ← SHOT_MAP {SXX_NAME: SceneXXComponent}
├── Scene01...tsx
└── ...
src/compositions/{Slug}.tsx   ← <Composition> entry, totalFrames từ clip-meta.json

public/{slug}/                ← FOLDER PER-CLIP
├── {slug}-voiceover.mp3      ← user import từ Vbee
├── {slug}-voiceover.json     ← Whisper output normalized
├── 01_NAME.jpg / .mp4
├── ...
└── _pick/_pick_proposed/raw_pool/

assets/{slug}/clip-meta.json   ← {slug, title, pillar, totalFrames, fps, ...}
out/{slug}.mp4                 ← final render
```

**Convention slug:** compact không dấu gạch (`caphetrung`, `duongdua`, `chuotdong`). Voiceover dùng dashes (`cha-ca-voiceover.mp3`).

## 3. CÁCH DÙNG SKILL — STEP BY STEP

### 3.1 Khi user nói "Làm clip mới về {chủ đề}"

1. **Hỏi 4 ABCD + Recommended** xác định:
   - Pillar (A/B/C/D)
   - Độ dài (35s short / 60s medium / 90s long-form)
   - Vbee mode (research / template / format)
   - Slot đăng (12h / 20h / khác)

2. Đọc `references/00_overview.md` để có flow tổng + checklist.

3. Đọc references theo phase đang làm:
   - PHASE 1 → `references/01_vbee_script.md`
   - PHASE 2 → `references/02_storyboard.md`
   - PHASE 4 → `references/04_asset_fetch.md`
   - PHASE 5 → `references/05_whisper_sync.md`
   - PHASE 6 → `references/06_remotion_render.md`
   - PHASE 7 → `references/07_audio_mix.md`

4. Generate **execution_spec.md** từ `references/templates/execution_spec_template.md`. User paste vào Claude Code tại `/Users/duyphan/tram-dung-mlem/`.

### 3.2 Khi user yêu cầu phase đơn lẻ

1. Đọc reference tương ứng.
2. Đảm bảo `public/{slug}/`, `assets/{slug}/clip-meta.json`, `clip{NN}_{slug}/scenes.json` tồn tại.
3. Generate đoạn lệnh / spec phù hợp.

## 4. PILLAR THEME — KHI NÀO DÙNG MÀU NÀO

| Pillar | Tên | Tỷ lệ | Color base | Mood | Karaoke override |
|--------|-----|-------|------------|------|------------------|
| A | Khẩu phần đặc thù | 30% | `#F8B147` Yellow | Năng động, tò mò | Default Yellow OK; scene nền vàng → Coral |
| B | Món lạ quốc gia | 35% | `#C8302D` Red | Shock, kích động | Scene BG đỏ pillar → highlight Yellow |
| C | Kỷ lục & Cực đoan | 20% | `#E85D2F` Coral | Nóng bỏng | Default Yellow OK |
| D | Văn hóa & Cách làm | 15% | `#4FC3D1` Teal | Bình tĩnh | Default Yellow OK |

Quy tắc: **1 pillar / 1 clip**. Yellow + Black luôn xuất hiện. Mascot Mèo Mlem dùng cả 4 pillar.

## 5. ASSET POLICY — BẢN QUYỀN

**Hybrid:** thử CC trước, fallback Google/YT/TikTok.

| Nguồn | Risk | Khi dùng |
|-------|------|----------|
| Pexels Videos / Pixabay / Mixkit / Coverr | 0% — CC0 | mặc định |
| Wikimedia Commons | 0% — public domain | sự kiện lịch sử |
| YouTube CC (yt-dlp `--match-filter`) | thấp | cảnh quay đặc thù |
| YouTube không-CC (≤ 5s mỗi clip) | medium | khi CC không có |
| Google Images scraping (Playwright) | medium | ảnh tĩnh khi Pexels miss |
| TikTok scraping (yt-dlp + cookies) | cao | chỉ khi đó là asset duy nhất, ≤ 4s |

**Quy tắc:** Mỗi clip nguồn ≤ 4-5s, mix ≥ 5-6 nguồn/video = transformative use. Tránh Netflix/Discovery/NatGeo/VTV. Log mọi nguồn vào `out/credits.txt`.

## 6. DESIGN SYSTEM — REFERENCE NHANH

Spec đầy đủ tại `references/06_design_system.md` + `remotion-shared/theme/theme.ts`.

- **Font display:** `'Baloo 2', system-ui, sans-serif` ExtraBold 800
  - ⚠️ Lưu ý production: `@remotion/google-fonts/Baloo2` đăng ký dưới tên `"Baloo Two"` — KIỂM TRA bằng test render trước khi commit
- **Font heading/body:** `'Be Vietnam Pro'` 700/500
- **Font number:** `'JetBrains Mono'` 600
- **Karaoke v1.4 (handoff sticker):** Inactive padding `4px 0` + outline 4px + white. Active = sticker box: padding `4px 14px` + bg yellow + text ink + border 3px ink + shadow `4px 4px 0 0 ink` + radius 8 + NO outline. Layout shifts khi active là design intent (sticker pop). Per-scene override props: `highlightBg`, `highlightTextColor`, `highlightShadowColor`, `highlightStroke`. Emphasis prop = list địa danh + từ khóa nổi bật vàng khi inactive
- **PhotoBackdrop v1.4:** vignette 0.45 radial + fallbackBg = pillar.dark theo prop `pillar`. Optional tint multiply per-scene mood
- **SceneFrame v1.4:** default bg `#FFFAF0` cream (handoff). Per-scene override BG variety: photo + pillar.dark, yellow flat, coral flat, ink flat, cream flat
- **HookFrame v1.4:** default bg = pillar.dark (photo BG fallback theo pillar)
- **Chip v1.4 (NEW):** sticker pill 5 variant (cream/yellow/coral/teal/ink) × 3 size (sm/md/lg) — match handoff `.chip` rules
- **Scene templates v1.5 (NEW):** 11 component templates ở `src/shared/scene-templates/` — 1-1 với handoff bun-cha. Per-clip Scene*.tsx chỉ 4-15 line: `<HookRibbon eyebrow="..." title="..." tagline="..." pillar="b" photoSrc="..."/>` + `<SubtitleKaraoke text={...} emphasis={...}/>`. Xem chi tiết `references/09_scene_patterns.md`
- **Sticker shadow:** `'8px 8px 0 0 #1A1A1A'` (stickerMd) — offset solid, không soft blur
- **Outline text:** 4-6px black `WebkitTextStroke` + `paintOrder: 'stroke fill'`
- **Motion:** Zoom Punch + Whip 13 frames @ 30fps (~430ms) — last 13 frames của scene

## 6.1 QUY TẮC v1.4 — MATCH HANDOFF (BẮT BUỘC)

Source of truth = `handoff/bun-cha-preview.html` + `handoff/src/scenes/bun-cha/_chrome.tsx` (zip user upload 06/05/2026).

**KHÔNG hard-code BG đen mọi scene** (rule v1.3 DEPRECATED). Variety BG là design intent: photo+pillar.dark / yellow flat / coral flat / cream flat / ink flat tùy scene.

**KHÔNG layout-stable karaoke** (rule v1.2 deprecated). Sticker pop active là design intent — padding active 14px khác inactive 0 → chữ "nhảy nhẹ" khi highlight, đó là effect mong muốn.

Per-scene karaoke override khi BG khác cream:
- Scene BG yellow flat → `highlightBg="#1A1A1A"` `highlightTextColor="#F8B147"` `highlightShadowColor="#E85D2F"`
- Scene BG striped/pattern → `highlightBg="#E85D2F"` `highlightTextColor="#FFFFFF"` `highlightStroke={2}`
- Scene BG cream → default OK

## 7. CHECKPOINTS — DỪNG CHỜ USER

| Checkpoint | Sau phase | Việc user làm |
|------------|-----------|---------------|
| **CP1** | Phase 1 | Đọc Vbee text → tinh chỉnh từ ngữ → thu Vbee tay tại app.vbee.vn |
| **CP2** | Phase 4 | Mở Finder duyệt `_pick_proposed/`, copy override vào `_pick/SXX/override.{jpg,mp4}` nếu cần |
| **CP3** | Phase 6 | Xem preview `out/{slug}.mp4` → OK upload TikTok |

User gõ `tiếp tục` để qua mỗi CP.

## 8. QUY TẮC LÀM VIỆC VỚI USER (Lynx)

Đọc memory `feedback_clarifying_questions.md`:

1. **Hỏi tới khi 95% chắc** trước khi work.
2. **Mỗi câu hỏi 4 phương án A/B/C/D có sẵn** — đánh dấu **(Recommended)** vào option hợp lý nhất.
3. Mỗi option phải **mutually exclusive** + có description giải thích trade-off.

## 9. INSTALL — CÁCH SETUP MỘT LẦN

Xem `references/INSTALL.md`. Tóm tắt:

```bash
SKILL=~/Documents/Claude/Projects/Trạm\ Dừng\ Mlem/.claude/skills/tdm-video-pipeline

cd /Users/duyphan/tram-dung-mlem
mkdir -p src/shared scripts/lib

# Copy shared Remotion code
cp -r "$SKILL/remotion-shared/"* src/shared/

# Copy scripts
cp "$SKILL/scripts/"*.py scripts/
cp "$SKILL/scripts/"*.sh scripts/
chmod +x scripts/*.sh scripts/*.py

# Update src/Root.tsx import shared font loader
# (xem references/INSTALL.md §3)
```

## 10. TÀI LIỆU LIÊN QUAN

- **Memory:** `MEMORY.md` → `reference_design_system.md`, `feedback_asset_organization.md`, `project_clip0{1,3,4}_status.md`
- **Universal theme source:** `~/Documents/Claude/Projects/Trạm Dừng Mlem/handoff/claude-handoff.md` (v1.1)
- **Existing design-system:** `~/Documents/Claude/Projects/Trạm Dừng Mlem/design-system/`
- **Bun cha example (đã ship):** `handoff/src/scenes/bun-cha/` trong design package gốc

Khi cần truy cập design tokens hoặc components đã production-tested, ưu tiên đọc các file này trước.
