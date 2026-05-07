# 05 — WHISPER WORD-LEVEL SYNC

> Output: `public/<slug>/<slug-dash>-voiceover.json` (normalized) + `public/scenes-with-perword.json`.

## Pipeline

```
public/<slug>/<slug-dash>-voiceover.mp3       (USER thu Vbee)
        ↓ ffmpeg → 16kHz mono pcm_s16le
        wav
        ↓ whisper-cli (ggml-medium.bin) -ojf -l vi
        OR python3 -m whisper --word_timestamps True
        ↓ normalize
voiceover.json {"words": [{word, start, end}]}
        ↓ scene_perword.py — slice words theo scenes.json
public/scenes-with-perword.json {"scenes": [{...sc, perWord: [...]}]}
```

## Setup once

### Option A — whisper.cpp (Recommended, Apple Silicon nhanh)

```bash
cd ~ && git clone https://github.com/ggerganov/whisper.cpp
cd whisper.cpp && make
bash models/download-ggml-model.sh medium
# whisper-cli at ~/whisper.cpp/build/bin/whisper-cli
# model at ~/whisper.cpp/models/ggml-medium.bin
```

### Option B — openai-whisper (Python, fallback)

```bash
pip3 install openai-whisper --break-system-packages
# Slower nhưng word_timestamps tốt hơn
```

### Option C — WhisperX (alignment chính xác nhất, GPU)

Chỉ cần khi clip > 90s và muốn karaoke chuẩn từng từ. Setup phức tạp, hiện không build vào skill mặc định.

## Lệnh

```bash
# Tự auto-detect whisper binary, ưu tiên whisper.cpp
python3 scripts/whisper_sync.py public/<slug>/<slug-dash>-voiceover.mp3 \
  --model medium --lang vi
```

Argument:
- `--model`: tiny / base / small / medium (default) / large-v3
- `--lang`: vi (default) / en

Cache binary path tại `.whisper_bin` (ghi 1 lần đầu, đỡ scan lại).

## Output normalize format

```json
{
  "words": [
    { "word": "Một", "start": 0.32, "end": 0.51 },
    { "word": "trăm", "start": 0.51, "end": 0.71 },
    { "word": "năm", "start": 0.71, "end": 0.85 }
  ]
}
```

Cả whisper.cpp (`-ojf` JSON full) và openai-whisper (`--output_format json --word_timestamps True`) đều được normalize về format này.

## Quirks

### Whisper hallucinations cuối file
Sau khi voiceover kết thúc nhưng ffmpeg pad silence → Whisper có thể tự gen từ "Cảm ơn" / "Hết video" giả. Fix:
```bash
# Trim trailing silence trước khi feed Whisper
ffmpeg -y -i $VO.mp3 -af silenceremove=stop_periods=-1:stop_duration=1:stop_threshold=-50dB $VO_clean.mp3
```

### Tên riêng + từ Hán Việt
Whisper VN model đôi khi sai từ Hán Việt (vd: "Casu Marzu" → "Cá Sự Mặt Trời"). Fix bằng prompt:
```bash
whisper-cli ... --prompt "Casu Marzu, Pho, An Giang, Hákarl, Balut"
```

### Số → chữ
Whisper output "150K" có thể là "150" + "K" hoặc "một trăm năm mươi nghìn". Vbee text PHẢI ghi chữ ("một trăm năm mươi nghìn") để Whisper align đúng.

## Bước 2 — Map words → scenes

```bash
python3 scripts/scene_perword.py <slug>
```

Đọc:
- `public/<slug>/scenes.json`
- `public/<slug>/<slug-dash>-voiceover.json` (vừa gen)

Slice words theo `scene.start / scene.end` (frame → seconds), gắn `perWord: [...]` vào mỗi scene.

Output: `public/scenes-with-perword.json` ← Remotion `useSceneWords()` hook đọc file này.

## Verification

```bash
# Check word count vs scene
python3 -c "
import json
data = json.load(open('public/scenes-with-perword.json'))
for sc in data['scenes']:
    n = len(sc.get('perWord', []))
    print(f'{sc[\"shot\"]:30} {sc[\"start\"]:>5}-{sc[\"end\"]:>5}f  {n:>3} words')
total = sum(len(s.get('perWord', [])) for s in data['scenes'])
print(f'TOTAL: {total} words / {len(data[\"scenes\"])} scenes')
"
```

Expected: ~3 words/giây × duration. Ngẫu nhiên scene nào có 0 words → check sync trễ (Vbee text ngắn hơn timing scenes.json).

## Khi user nói "sync voiceover"

1. Verify `public/<slug>/<slug-dash>-voiceover.mp3` tồn tại + size > 100KB.
2. Chạy `whisper_sync.py` (5-15 phút tùy model).
3. Chạy `scene_perword.py`.
4. Print verification table.
5. Nếu scene nào có 0 words → flag user kiểm scenes.json timing vs Vbee actual duration.
