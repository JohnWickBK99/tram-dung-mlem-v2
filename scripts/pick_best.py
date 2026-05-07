#!/usr/bin/env python3
"""
pick_best.py — score & pick best asset per shot.

Reads SHOT_TO_OUTNAME from `assets/<slug>/shot_map.json`:
  {
    "S01": {"out": "01_hook.jpg", "kind": "image"},
    "S04": {"out": "videos/04_bite.mp4", "kind": "video"}, ...
  }

Layout convention:
  public/<slug>/
    raw_pool/<shot>/{pexels,pixabay,wiki,google,yt,tiktok}_*.{jpg|mp4}
    _pick_proposed/<shot>/best.{jpg|mp4}      ← script writes here
    _pick/<shot>/override.{jpg|mp4}           ← user manually puts override

After this script, run finalize step (in execution_spec) to copy
override OR proposed to final outname.

Usage:
  python3 pick_best.py <slug>
"""
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

try:
    import cv2
    import numpy as np
    HAS_CV = True
except ImportError:
    HAS_CV = False
    print("(opencv not installed — using basic scoring)")


def is_video(path):
    return path.lower().endswith((".mp4", ".webm", ".mov", ".mkv"))


def ffprobe_dim(path):
    try:
        out = subprocess.check_output(
            ["ffprobe", "-v", "quiet", "-print_format", "json", "-show_streams", "-show_format", path],
            timeout=20,
        ).decode()
        d = json.loads(out)
        v = next((s for s in d["streams"] if s.get("codec_type") == "video"), d["streams"][0])
        return int(v.get("width", 0)), int(v.get("height", 0)), float(d.get("format", {}).get("duration", 0))
    except Exception:
        return 0, 0, 0


def score_image(path):
    w, h, _ = ffprobe_dim(path)
    if w == 0:
        return 0
    res_score = min(100, (w * h) / (1080 * 1920) * 100)
    aspect_score = 100 - min(100, abs((h / w) - (1920 / 1080)) * 50)
    fs = os.path.getsize(path)
    fs_score = min(100, fs / (200 * 1024) * 100)
    sharpness = 50
    brightness_s = 50
    if HAS_CV:
        try:
            img = cv2.imread(path)
            if img is not None:
                gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                lap = cv2.Laplacian(gray, cv2.CV_64F).var()
                sharpness = min(100, lap / 5)
                brightness = float(gray.mean())
                brightness_s = 100 - min(100, abs(brightness - 130) * 1.5)
        except Exception:
            pass
    return res_score * 0.30 + aspect_score * 0.20 + sharpness * 0.25 + brightness_s * 0.15 + fs_score * 0.10


def score_video(path):
    w, h, dur = ffprobe_dim(path)
    if w == 0 or dur == 0:
        return 0
    res_score = min(100, (w * h) / (1080 * 1920) * 100)
    aspect_score = 100 - min(100, abs((h / w) - (1920 / 1080)) * 50)
    dur_score = 100 if 4 <= dur <= 60 else max(0, 100 - abs(dur - 4) * 10)
    fs = os.path.getsize(path)
    fs_score = min(100, fs / (1 * 1024 * 1024) * 100)
    return res_score * 0.30 + aspect_score * 0.25 + dur_score * 0.25 + fs_score * 0.20


def main():
    if len(sys.argv) < 2:
        print("Usage: pick_best.py <slug>")
        sys.exit(1)
    slug = sys.argv[1]

    shot_map_path = Path(f"assets/{slug}/shot_map.json")
    if not shot_map_path.exists():
        print(f"❌ {shot_map_path} không tồn tại. Tạo trước:")
        print('  echo \'{"S01": {"out": "01_hook.jpg", "kind": "image"}}\' > ' + str(shot_map_path))
        sys.exit(1)
    shot_map = json.loads(shot_map_path.read_text())

    POOL = f"public/{slug}/raw_pool"
    PROPOSED = f"public/{slug}/_pick_proposed"
    OVERRIDE = f"public/{slug}/_pick"
    os.makedirs(PROPOSED, exist_ok=True)
    os.makedirs(OVERRIDE, exist_ok=True)

    results = {}
    for shot, info in shot_map.items():
        if info.get("kind") == "synth" or "out" not in info:
            continue
        outname = info["out"]
        kind = info["kind"]
        pool_dir = os.path.join(POOL, shot)
        if not os.path.isdir(pool_dir):
            print(f"  ⚠️  {shot}: no raw_pool — skip")
            continue
        candidates = []
        for fn in os.listdir(pool_dir):
            path = os.path.join(pool_dir, fn)
            if not os.path.isfile(path):
                continue
            if kind == "image" and is_video(path):
                continue
            if kind == "video" and not is_video(path):
                continue
            if kind == "image" and not fn.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                continue
            s = score_video(path) if kind == "video" else score_image(path)
            candidates.append((s, path))
        if not candidates:
            print(f"  ⚠️  {shot}: no valid candidates")
            continue
        candidates.sort(reverse=True)
        best_score, best_path = candidates[0]
        out_dir = os.path.join(PROPOSED, shot)
        os.makedirs(out_dir, exist_ok=True)
        ext = "mp4" if kind == "video" else "jpg"
        out_path = os.path.join(out_dir, f"best.{ext}")
        shutil.copy(best_path, out_path)
        with open(os.path.join(out_dir, "score.json"), "w") as f:
            json.dump({
                "shot": shot, "outname": outname, "kind": kind,
                "best_score": best_score, "best_path": best_path,
                "all_candidates": [{"score": s, "path": p} for s, p in candidates],
            }, f, indent=2)
        results[shot] = {"score": round(best_score, 1), "outname": outname, "kind": kind, "src": best_path}
        print(f"  ✓ {shot}: score={best_score:.1f} → {out_path}")

    print(f"\n=== PICK SUMMARY ({len(results)}/{len(shot_map)} shot) ===")
    print(json.dumps(results, indent=2, default=str))


if __name__ == "__main__":
    main()
