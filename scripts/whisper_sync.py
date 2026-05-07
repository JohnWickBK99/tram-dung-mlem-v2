#!/usr/bin/env python3
"""
whisper_sync.py — produce normalized JSON `{words: [{word, start, end}]}` from voiceover.mp3.

Tries in order:
  1. whisper-cli (whisper.cpp build) with -ojf (JSON full)
  2. python3 -m whisper (openai-whisper)
  3. whisperX (if installed)

Output: `<voiceover_basename>.json` next to input, format:
  {"words": [{"word": "Bạn", "start": 0.32, "end": 0.51}, ...]}

Usage:
  python3 whisper_sync.py public/<slug>/<slug>-voiceover.mp3 [--model medium] [--lang vi]
"""
import argparse
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path


def find_whisper():
    cache = Path(".whisper_bin")
    if cache.exists():
        return cache.read_text().strip()
    for cand in ["whisper-cli", "whisper",
                 os.path.expanduser("~/whisper.cpp/build/bin/whisper-cli"),
                 os.path.expanduser("~/whisper.cpp/main")]:
        if shutil.which(cand) or os.access(cand, os.X_OK):
            cache.write_text(cand)
            return cand
    # Fallback: openai-whisper (pip)
    try:
        import whisper  # noqa
        cache.write_text("python3 -m whisper")
        return "python3 -m whisper"
    except ImportError:
        pass
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("voiceover_mp3")
    ap.add_argument("--model", default="medium")
    ap.add_argument("--lang", default="vi")
    ap.add_argument("--whisper-cpp-model-dir", default=os.path.expanduser("~/whisper.cpp/models"))
    args = ap.parse_args()

    if not os.path.exists(args.voiceover_mp3):
        print(f"❌ {args.voiceover_mp3} không tồn tại")
        sys.exit(1)

    base = os.path.splitext(args.voiceover_mp3)[0]
    wav = base + ".wav"
    out_json = base + ".json"

    # 1. Convert to wav 16kHz mono
    print(f"[1/3] ffmpeg → {wav}")
    subprocess.run(
        ["ffmpeg", "-y", "-i", args.voiceover_mp3, "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", wav],
        check=True, capture_output=True,
    )

    whisper_bin = find_whisper()
    if not whisper_bin:
        print("❌ Không tìm thấy whisper. Install: pip3 install openai-whisper --break-system-packages")
        print("   Hoặc build whisper.cpp: cd ~ && git clone https://github.com/ggerganov/whisper.cpp && cd whisper.cpp && make")
        sys.exit(1)

    # 2. Run whisper
    print(f"[2/3] whisper ({whisper_bin}) → JSON")
    raw_json = base + "-raw.json"
    if "whisper-cli" in whisper_bin or "whisper.cpp" in whisper_bin:
        # whisper.cpp produces JSON via -ojf flag
        model = os.path.join(args.whisper_cpp_model_dir, f"ggml-{args.model}.bin")
        if not os.path.exists(model):
            print(f"❌ Model not found: {model}")
            print(f"   Download: bash ~/whisper.cpp/models/download-ggml-model.sh {args.model}")
            sys.exit(1)
        subprocess.run([whisper_bin, "-m", model, "-l", args.lang, "-ojf", "-of", base, wav],
                       check=False)
        # whisper.cpp writes <base>.json
    else:
        # openai-whisper Python
        out_dir = os.path.dirname(args.voiceover_mp3) or "."
        subprocess.run([
            "python3", "-m", "whisper", wav,
            "--language", args.lang,
            "--model", args.model,
            "--word_timestamps", "True",
            "--output_format", "json",
            "--output_dir", out_dir,
        ], check=False)
        # python whisper writes basename.json
        wpath = os.path.join(out_dir, os.path.basename(base) + ".json")
        if os.path.exists(wpath) and wpath != raw_json:
            os.rename(wpath, raw_json)

    # 3. Normalize → {"words": [...]}
    print(f"[3/3] normalize → {out_json}")
    src = raw_json if os.path.exists(raw_json) else out_json
    if not os.path.exists(src):
        print(f"❌ Whisper output not found ({src} or {raw_json})")
        sys.exit(1)
    with open(src) as f:
        data = json.load(f)

    words = []
    if "segments" in data:
        # openai-whisper format
        for seg in data["segments"]:
            if "words" in seg:
                for w in seg["words"]:
                    words.append({
                        "word": w.get("word", w.get("text", "")).strip(),
                        "start": float(w.get("start", 0)),
                        "end": float(w.get("end", 0)),
                    })
    elif "transcription" in data:
        # whisper.cpp -ojf format
        for seg in data["transcription"]:
            for tok in seg.get("tokens", []):
                t = tok.get("text", "").strip()
                if t and not t.startswith("["):
                    start = tok.get("offsets", {}).get("from", 0) / 1000
                    end = tok.get("offsets", {}).get("to", 0) / 1000
                    if "t_dtw" in tok:
                        start = tok["t_dtw"] / 100
                    words.append({"word": t, "start": float(start), "end": float(end)})
    else:
        print(f"⚠️ Unknown JSON shape: keys={list(data.keys())}")

    with open(out_json, "w") as f:
        json.dump({"words": words}, f, ensure_ascii=False, indent=2)
    print(f"✓ {out_json} — {len(words)} words")


if __name__ == "__main__":
    main()
