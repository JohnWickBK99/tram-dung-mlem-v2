# tdm-video-pipeline

Project-level Claude skill cho kênh TikTok **Trạm Dừng Mlem** (@tramdungmlem).

End-to-end pipeline sản xuất 1 clip TikTok từ chủ đề món ăn → MP4 final upload-ready.

## Cấu trúc

```
.claude/skills/tdm-video-pipeline/
├── SKILL.md                              ← entry point + triggers
├── README.md                             ← file này
├── references/                           ← chi tiết từng phase
│   ├── 00_overview.md                    workflow tổng + checklist
│   ├── 01_vbee_script.md                 3 mode generate Vbee text
│   ├── 02_storyboard.md                  scenes.json + shot_map.json schema
│   ├── 04_asset_fetch.md                 CC + Google + YT + TikTok pipeline
│   ├── 05_whisper_sync.md                Whisper word-level sync
│   ├── 06_remotion_render.md             Remotion 1080×1920 render
│   ├── 07_audio_mix.md                   BGM/SFX integration + caption
│   ├── 08_design_system.md               Universal Theme v1.0 spec
│   ├── INSTALL.md                        setup 1 lần
│   └── templates/
│       ├── execution_spec_template.md    paste-and-run cho Claude Code
│       ├── scenes_template.json
│       ├── shot_map_template.json
│       ├── scene_template.tsx
│       └── composition_template.tsx
├── scripts/                              ← drop vào /Users/duyphan/tram-dung-mlem/scripts/
│   ├── new_clip.sh                       bootstrap clip mới
│   ├── asset_fetch.py                    Pexels/Pixabay/Mixkit/Wikimedia
│   ├── google_fetch.py                   Playwright Google Images
│   ├── youtube_fetch.py                  yt-dlp YouTube CC + non-CC
│   ├── tiktok_fetch.py                   yt-dlp TikTok với cookies
│   ├── pick_best.py                      score & pick best per shot
│   ├── finalize_pick.py                  apply override + trim → final outname
│   ├── whisper_sync.py                   Whisper.cpp/openai-whisper wrapper
│   ├── scene_perword.py                  map words → scenes
│   ├── audio_mix.py                      FFmpeg pre-mix VO + BGM + SFX
│   └── fetch_audio_library.sh            bootstrap shared BGM/SFX
└── remotion-shared/                      ← drop vào src/shared/ trong Remotion repo
    ├── theme/
    │   ├── theme.ts                      Universal Theme v1.0 (color, font, motion, getPillar, outlineText)
    │   ├── tokens.json                   W3C tokens
    │   ├── globals.css                   CSS vars cho web/email
    │   └── index.ts                      barrel
    ├── components/
    │   ├── PhotoBackdrop.tsx
    │   ├── PillarBadge.tsx
    │   ├── ChannelMark.tsx
    │   ├── SubtitleKaraoke.tsx
    │   ├── StickerCard.tsx
    │   ├── SceneFrame.tsx
    │   ├── OutlineText.tsx
    │   ├── ZoomPunch.tsx
    │   ├── KenBurns.tsx
    │   ├── Carousel3Panel.tsx
    │   ├── StatOverlay.tsx
    │   ├── FactPop.tsx
    │   ├── HookFrame.tsx
    │   └── index.ts
    ├── hooks/
    │   ├── useEntry.ts
    │   └── useSceneWords.ts
    ├── RootShared.tsx                    font loader (side-effect import)
    └── index.ts                          top-level barrel
```

## Cách kích hoạt

Skill auto-load khi mở project `Trạm Dừng Mlem`. Trigger keywords (xem SKILL.md description):
- "Làm clip mới về {chủ đề}"
- "Build clip {tên món}"
- "Viết Vbee cho món X"
- "Fetch asset cho clip"
- "Sync voiceover Whisper"
- "Render Remotion clip {slug}"
- "Polish + caption clip"
- ... và bất kỳ yêu cầu nào liên quan đến sản xuất clip cho @tramdungmlem

## Setup lần đầu

Xem `references/INSTALL.md`. Tóm tắt:

```bash
SKILL=~/Documents/Claude/Projects/Trạm\ Dừng\ Mlem/.claude/skills/tdm-video-pipeline
ROOT=~/tram-dung-mlem
cd "$ROOT"
mkdir -p src/shared scripts
cp -r "$SKILL/remotion-shared/"* src/shared/
cp "$SKILL/scripts/"*.{py,sh} scripts/
chmod +x scripts/*.{py,sh}
bash scripts/fetch_audio_library.sh
# Patch src/Root.tsx: thêm `import './shared/RootShared';` ở đầu file
```

## Tạo clip mới

```bash
cd ~/tram-dung-mlem
bash scripts/new_clip.sh chaca A 60 "Chả cá Lã Vọng Hà Nội"
# → tạo public/chaca/, assets/chaca/clip-meta.json,
#    src/scenes/chaca/, src/compositions/Chaca.tsx
```

Sau đó workflow theo 7 phase trong `references/00_overview.md`.

## Versioning

| Version | Date | Changes |
|---------|------|---------|
| v1.5 | 2026-05-06 | **NEW 11 scene-templates** ở `src/shared/scene-templates/`: HookRibbon, TagChipsStat, StatOverlayInk, PlaceNamePill, GiantNumberYellow, IngredientList, GrillFlameCoral, RatioCells, ChipCluster, ShopCard, CTAStriped. 1-1 với handoff bun-cha-preview.html patterns. Per-clip Scene*.tsx chỉ 4-15 line. Xem `references/09_scene_patterns.md`. |
| v1.4 | 2026-05-06 | **Revert v1.3 → match handoff** (`bun-cha-preview.html`). Karaoke sticker active (border 3px + shadow 4px 4px + radius 8px, layout shifts intentional). PhotoBackdrop vignette 0.45 + pillar.dark fallback (no flat darkMask). SceneFrame default cream `#FFFAF0` + per-scene BG variety (yellow/coral/ink/cream). Add `Chip` component (cream/yellow/coral/teal/ink × sm/md/lg). |
| v1.3 | 2026-05-06 | ⚠️ DEPRECATED — **BG đen + mask 0.6** — SceneFrame/HookFrame default `#1A1A1A`, PhotoBackdrop flat dark overlay 0.6 (vignette default 0). Pillar color CHỈ accent, KHÔNG full BG. **No-abbreviation thêm:** ÂL/DL/CN/T2-T7. |
| v1.2 | 2026-05-06 | **3 content rules**: (1) Không viết tắt — Vbee/caption/chip viết đầy đủ chữ. (2) Asset chỉ chiếu 1 lần — `<OffthreadVideo>` no loop, scene durFrames ≤ video dur. (3) Highlight địa danh + từ khóa — SubtitleKaraoke `emphasis` prop, vàng inactive (coral cho scene vàng). **Karaoke fade fix**: bỏ CSS transition (instant swap), entry fade 8f → 4f. |
| v1.1 | 2026-05-06 | **Layout-stable karaoke** — padding 4px 12px LUÔN cố định, outline 4px LUÔN giữ → ZERO jump khi chạy chữ. **PhotoBackdrop opacity default 0.6** (was 1.0) — text overlay legibility. |
| v1.0 | 2026-05-06 | Initial — kế thừa kinh nghiệm clip 01-04, tích hợp Universal Theme v1.0 (Bun cha handoff) |

## Liên kết

- Memory: `~/Library/Application Support/Claude/.../memory/MEMORY.md`
- Universal theme handoff: `~/Documents/Claude/Projects/Trạm Dừng Mlem/handoff/`
- Existing design-system: `~/Documents/Claude/Projects/Trạm Dừng Mlem/design-system/`
- Past clips: `clip0{1,2,3,4}_*` markdown ở workspace root

---

*Author: Đại Việt (Lynx) · Built with Claude · Direction A — Playful Foodtoon*
