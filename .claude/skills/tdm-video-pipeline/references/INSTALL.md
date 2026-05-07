# INSTALL — first-time setup

> Chạy 1 lần khi bắt đầu dùng skill. Sau đó mỗi clip mới chỉ cần `new_clip.sh`.

## 1. Prerequisites (system)

```bash
# Cài CLI tools
brew install node ffmpeg yt-dlp python@3.11
pip3 install --break-system-packages openai-whisper Pillow opencv-python-headless playwright
python3 -m playwright install chromium

# Build whisper.cpp (Recommended cho Apple Silicon)
cd ~ && git clone https://github.com/ggerganov/whisper.cpp
cd whisper.cpp && make
bash models/download-ggml-model.sh medium

# Verify
node --version       # ≥ 18
npm --version
ffmpeg -version
yt-dlp --version
python3 -c "import cv2, playwright, PIL; print('OK')"
```

## 2. Setup Remotion repo (1 lần)

Giả sử Remotion repo đã có sẵn tại `/Users/duyphan/tram-dung-mlem/`.

```bash
SKILL=~/Documents/Claude/Projects/Trạm\ Dừng\ Mlem/.claude/skills/tdm-video-pipeline
ROOT=~/tram-dung-mlem

cd "$ROOT"

# 2.1 Copy shared Remotion code → src/shared/
mkdir -p src/shared
cp -r "$SKILL/remotion-shared/"* src/shared/

# 2.2 Copy scripts → scripts/
mkdir -p scripts
cp "$SKILL/scripts/"*.py scripts/
cp "$SKILL/scripts/"*.sh scripts/
chmod +x scripts/*.sh scripts/*.py

# 2.3 Bootstrap shared audio library (BGM + SFX)
bash scripts/fetch_audio_library.sh

# 2.4 Update src/Root.tsx
# Thêm dòng đầu file (side-effect import font loader):
cat > /tmp/_root_patch.tsx <<'PATCH'
import './shared/RootShared';   // load fonts globally
PATCH
# (Manual: dán dòng này vào src/Root.tsx)

# 2.5 Verify
node -e "
const { default: theme } = require('./src/shared/theme/theme.ts');
console.log('Pillar A:', theme.color.pillar.a.base);  // #F8B147
console.log('Font:', theme.font.family.display);
"

# 2.6 Test render preview
npx remotion studio
```

## 3. Setup mascot assets (1 lần)

```bash
mkdir -p "$ROOT/public/mascot"
# 6 PNG isolated với background transparent (gen Freepik/Mystic 2.5)
# - mlem-happy.png  (256×256+)
# - mlem-shocked.png
# - mlem-drooling.png
# - mlem-thinking.png
# - mlem-mindblown.png
# - mlem-sideeye.png
```

## 4. Setup TikTok cookies (cho tiktok_fetch.py)

```bash
# Mở Chrome/Safari/Firefox đăng nhập TikTok 1 lần
# yt-dlp tự đọc cookies từ browser
yt-dlp --cookies-from-browser chrome https://www.tiktok.com/foryou
# (chỉ cần test 1 lần, không cần download)
```

## 5. Verify install

```bash
cd ~/tram-dung-mlem
ls src/shared/components/    # 13 .tsx files + index.ts
ls src/shared/theme/         # theme.ts + tokens.json + globals.css + index.ts
ls scripts/                  # 11 .py + 2 .sh
ls public/audio/             # 4 BGM + 5 SFX = 9 files
```

Tất cả OK → bắt đầu clip mới với `bash scripts/new_clip.sh <slug> <pillar> <durationSec> "<title>"`.

## 6. Update skill (khi có version mới)

```bash
cd ~/Documents/Claude/Projects/Trạm\ Dừng\ Mlem
git pull   # nếu skill version-controlled

# Re-run install steps 2.1, 2.2 để sync code mới
cp -r .claude/skills/tdm-video-pipeline/remotion-shared/* ~/tram-dung-mlem/src/shared/
cp .claude/skills/tdm-video-pipeline/scripts/*.py ~/tram-dung-mlem/scripts/
```
