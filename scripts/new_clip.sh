#!/usr/bin/env bash
# new_clip.sh — bootstrap directory + scaffold cho 1 clip TikTok mới
# Compatible với macOS bash 3.2 native (KHÔNG dùng ${VAR,,} hay declare -A)
#
# Usage:
#   ./scripts/new_clip.sh <slug-no-dashes> <pillar A|B|C|D> <duration-sec> "<title>"
#
# Example:
#   ./scripts/new_clip.sh chaca B 60 "Chả cá Lã Vọng Hà Nội"
#
# Tạo:
#   public/<slug>/                                ← assets folder
#   public/<slug>/raw_pool/, _pick/, _pick_proposed/
#   assets/<slug>/clip-meta.json                  ← metadata
#   src/scenes/<slug-with-dashes>/                ← scene folder (placeholder)
#   src/compositions/<PascalSlug>.tsx             ← composition stub
#
set -eo pipefail

if [ $# -lt 4 ]; then
  echo "Usage: $0 <slug-no-dashes> <pillar A|B|C|D> <duration-sec> \"<title>\""
  echo "Example: $0 chaca B 60 \"Chả cá Lã Vọng\""
  exit 1
fi

SLUG="$1"
PILLAR="$2"
DURATION_SEC="$3"
TITLE="$4"
FPS="${FPS:-30}"
TOTAL_FRAMES=$((DURATION_SEC * FPS))

# Slug variants
SLUG_DASH=$(echo "$SLUG" | sed 's/_/-/g' | sed -E 's/(.)([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]')
PASCAL_SLUG=$(echo "$SLUG_DASH" | awk -F- '{for(i=1;i<=NF;i++) printf("%s%s", toupper(substr($i,1,1)), substr($i,2)); print ""}')

# Lowercase pillar (bash 3.2 compatible — KHÔNG dùng ${PILLAR,,})
PILLAR_LOWER=$(echo "$PILLAR" | tr '[:upper:]' '[:lower:]')
PILLAR_UPPER=$(echo "$PILLAR" | tr '[:lower:]' '[:upper:]')

# Pillar color
case "$PILLAR_UPPER" in
  A) PILLAR_COLOR="#F8B147"; PILLAR_NAME="Khẩu phần đặc thù" ;;
  B) PILLAR_COLOR="#C8302D"; PILLAR_NAME="Món lạ quốc gia" ;;
  C) PILLAR_COLOR="#E85D2F"; PILLAR_NAME="Kỷ lục & Cực đoan" ;;
  D) PILLAR_COLOR="#4FC3D1"; PILLAR_NAME="Văn hóa & Cách làm" ;;
  *) echo "❌ Pillar phải là A/B/C/D, got: $PILLAR"; exit 1 ;;
esac

ROOT="${REMOTION_ROOT:-$(pwd)}"
echo "=== Bootstrapping clip: $SLUG (pillar $PILLAR_UPPER, ${DURATION_SEC}s = ${TOTAL_FRAMES}f) ==="
echo "  root: $ROOT"

# 1. Create folders
mkdir -p "$ROOT/public/$SLUG/"{videos,raw_pool,_pick,_pick_proposed}
mkdir -p "$ROOT/public/audio"
mkdir -p "$ROOT/assets/$SLUG"
mkdir -p "$ROOT/src/scenes/$SLUG_DASH"
mkdir -p "$ROOT/src/compositions"
mkdir -p "$ROOT/out"

# 2. clip-meta.json
cat > "$ROOT/assets/$SLUG/clip-meta.json" <<EOF
{
  "slug": "$SLUG",
  "slugDash": "$SLUG_DASH",
  "title": "$TITLE",
  "pillar": "$PILLAR_UPPER",
  "pillarName": "$PILLAR_NAME",
  "pillarColor": "$PILLAR_COLOR",
  "durationSec": $DURATION_SEC,
  "fps": $FPS,
  "totalFrames": $TOTAL_FRAMES,
  "width": 1080,
  "height": 1920,
  "format": "tiktok-9x16",
  "voiceoverFile": "$SLUG/${SLUG_DASH}-voiceover.mp3",
  "scenesJson": "$SLUG/scenes-with-perword.json",
  "createdAt": "$(date -u +%FT%TZ)"
}
EOF
echo "✓ assets/$SLUG/clip-meta.json"

# 3. _theme.ts placeholder (extends shared) — bash 3.2 compat: dùng PILLAR_LOWER pre-computed
cat > "$ROOT/src/scenes/$SLUG_DASH/_theme.ts" <<EOF
/** Per-clip theme overrides for $SLUG. Extends shared/theme. */
import sharedTheme, { getPillar } from '../../shared/theme';

export const PILLAR_KEY = '${PILLAR_LOWER}' as const;
export const PILLAR = getPillar(PILLAR_KEY);

// Override / extend shared tokens here.
// Example: change karaoke highlight cho scene nền vàng → coral
export const KARAOKE_HIGHLIGHT_OVERRIDE: Record<string, string> = {
  // 'S04_BITE_REACTION': '#E85D2F',  // coral khi BG vàng
};

export default sharedTheme;
EOF
echo "✓ src/scenes/$SLUG_DASH/_theme.ts"

# 4. index.ts SHOT_MAP placeholder
cat > "$ROOT/src/scenes/$SLUG_DASH/index.ts" <<EOF
/** SHOT_MAP for $SLUG. Add Scene imports khi scenes ready. */
// import { Scene01Hook } from './Scene01Hook';
// ...

export const SHOT_MAP = {
  // S01_HOOK: Scene01Hook,
} as const;

export type ShotKey = keyof typeof SHOT_MAP;
EOF
echo "✓ src/scenes/$SLUG_DASH/index.ts"

# 5. scenes.json template
cat > "$ROOT/public/$SLUG/scenes.json" <<EOF
{
  "slug": "$SLUG",
  "totalFrames": $TOTAL_FRAMES,
  "fps": $FPS,
  "scenes": [
    {
      "id": "S01_HOOK",
      "shot": "S01_HOOK",
      "start": 0,
      "end": 90,
      "text": "TODO: hook 0-3s",
      "sfx": ["impact-hook.mp3"]
    }
  ],
  "audio": {
    "voiceover": "$SLUG/${SLUG_DASH}-voiceover.mp3",
    "bgm": "audio/bgm-pillar${PILLAR_UPPER}.mp3",
    "bgmVolume": 0.18
  }
}
EOF
echo "✓ public/$SLUG/scenes.json"

# 6. Composition stub
cat > "$ROOT/src/compositions/${PASCAL_SLUG}.tsx" <<EOF
import React from 'react';
import { AbsoluteFill, Audio, Series, staticFile, useVideoConfig } from 'remotion';
import meta from '../../assets/$SLUG/clip-meta.json';
import { SHOT_MAP } from '../scenes/$SLUG_DASH';

/** $TITLE — pillar $PILLAR_UPPER — ${DURATION_SEC}s */
export const $PASCAL_SLUG: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {/* Voiceover (master) */}
      <Audio src={staticFile(meta.voiceoverFile)} />
      {/* BGM — 18% volume */}
      <Audio src={staticFile('audio/bgm-pillar${PILLAR_UPPER}.mp3')} volume={0.18} />
      {/* Scenes — driven by scenes-with-perword.json (after PHASE 5) */}
      <Series>
        {/* TODO: map scenes.json → <Series.Sequence durationInFrames>...</Series.Sequence> */}
      </Series>
    </AbsoluteFill>
  );
};
EOF
echo "✓ src/compositions/${PASCAL_SLUG}.tsx"

# 7. Search queries placeholder
cat > "$ROOT/public/$SLUG/search_queries.md" <<EOF
# Search queries — $TITLE (clip $SLUG)

> Mỗi shot 5-6 nguồn fallback để tăng hit rate.

## S01 — Hook
- pexels:    "TODO món-name close-up macro"
- pixabay:   "TODO food traditional vietnam"
- mixkit:    "TODO ingredient close-up"
- wikimedia: "TODO subject scientific"
- youtube:   "TODO món-name food vietnam recipe"
- google:    "TODO món-name finishing-shot HD"

EOF
echo "✓ public/$SLUG/search_queries.md"

echo ""
echo "📋 NEXT STEPS:"
echo "  1. Fill in script + storyboard (scenes.json beats)"
echo "  2. Run: scripts/asset_fetch.py + youtube_fetch.py per shot (xem search_queries.md)"
echo "  3. User thu Vbee → public/$SLUG/${SLUG_DASH}-voiceover.mp3"
echo "  4. Run: scripts/whisper_sync.py public/$SLUG/${SLUG_DASH}-voiceover.mp3"
echo "  5. Build per-scene Scene*.tsx → register in SHOT_MAP"
echo "  6. npx remotion render src/index.tsx ${PASCAL_SLUG} out/${SLUG}.mp4"
