#!/usr/bin/env bash
# fetch_audio_library.sh — bootstrap public/audio/ với BGM/SFX shared
# Compatible với macOS bash 3.2 (KHÔNG dùng declare -A)
# Run 1 lần trong Remotion repo.
set -eo pipefail
ROOT="${REMOTION_ROOT:-$(pwd)}"
mkdir -p "$ROOT/public/audio"

# ─── SFX from Mixkit (CC0) ───
echo "=== Fetching SFX (Mixkit CC0) ==="
while IFS='|' read -r fn url; do
  [ -z "$fn" ] && continue
  if [ ! -f "$ROOT/public/audio/$fn" ]; then
    echo "↓ $fn"
    curl -fsSL "$url" -o "$ROOT/public/audio/$fn" || echo "  ✗ fail $fn"
  else
    echo "✓ exists $fn"
  fi
done <<'SFX_LIST'
whoosh-transition.mp3|https://assets.mixkit.co/active_storage/sfx/2858/2858-preview.mp3
impact-hook.mp3|https://assets.mixkit.co/active_storage/sfx/1432/1432-preview.mp3
chime-fact.mp3|https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3
mlem-sting.mp3|https://assets.mixkit.co/active_storage/sfx/2876/2876-preview.mp3
pop-sticker.mp3|https://assets.mixkit.co/active_storage/sfx/2356/2356-preview.mp3
SFX_LIST

# ─── BGM per pillar — yt-dlp YouTube CC search ───
echo ""
echo "=== Fetching BGM per pillar (YouTube CC) ==="
while IFS='|' read -r pillar query; do
  [ -z "$pillar" ] && continue
  out="$ROOT/public/audio/bgm-pillar${pillar}.mp3"
  if [ -f "$out" ]; then
    echo "✓ exists bgm-pillar${pillar}.mp3"
    continue
  fi
  echo "↓ bgm-pillar${pillar}.mp3 (query: $query)"
  yt-dlp \
    "ytsearch5:$query creative commons" \
    --match-filter "license = 'Creative Commons Attribution license (reuse allowed)' & duration >= 90 & duration <= 300" \
    --max-downloads 1 \
    -x --audio-format mp3 --audio-quality 192K \
    --no-playlist --quiet --no-warnings \
    -o "$out" 2>&1 | tail -3 || echo "  ✗ fail bgm-${pillar} (sẽ skip — clip vẫn render được, BGM thêm CapCut sau)"
done <<'BGM_LIST'
A|vietnamese street food lofi instrumental no vocal
B|asian travel discovery instrumental no vocal
C|epic culinary record instrumental no vocal
D|traditional vietnamese culture instrumental no vocal
BGM_LIST

echo ""
echo "=== Audio library status ==="
ls -la "$ROOT/public/audio/"
