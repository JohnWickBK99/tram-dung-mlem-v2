#!/usr/bin/env python3
"""
finalize_pick.py — copy/trim picks to final outname.

Reads `assets/<slug>/shot_map.json`. For each shot:
  - if `public/<slug>/_pick/<shot>/override.{jpg|mp4}` exists → use it
  - else use `public/<slug>/_pick_proposed/<shot>/best.{jpg|mp4}`
Trim videos to max-duration (4s default, 5s for tutorial-type shots).

Usage:
  python3 finalize_pick.py <slug>
"""
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path


def main():
    if len(sys.argv) < 2:
        print("Usage: finalize_pick.py <slug>")
        sys.exit(1)
    slug = sys.argv[1]

    shot_map_path = Path(f"assets/{slug}/shot_map.json")
    shot_map = json.loads(shot_map_path.read_text())

    ROOT = f"public/{slug}"
    failed = []
    for shot, info in shot_map.items():
        outname = info["out"]
        kind = info["kind"]
        max_dur = str(info.get("maxDurationSec", 5 if kind == "video" else 0))
        ext = "mp4" if kind == "video" else "jpg"
        override = os.path.join(ROOT, "_pick", shot, f"override.{ext}")
        proposed = os.path.join(ROOT, "_pick_proposed", shot, f"best.{ext}")
        src = override if os.path.exists(override) else proposed
        if not os.path.exists(src):
            print(f"  ❌ {shot}: missing both override + proposed")
            failed.append(shot)
            continue
        dst = os.path.join(ROOT, outname)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        if kind == "video":
            cmd = [
                "ffmpeg", "-y", "-i", src, "-t", max_dur,
                "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920",
                "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-an", dst,
            ]
            subprocess.run(cmd, check=False, capture_output=True)
            print(f"  ✓ {shot} → {dst} (trimmed ≤{max_dur}s)")
        else:
            shutil.copy(src, dst)
            print(f"  ✓ {shot} → {dst}")

    if failed:
        print(f"\n❌ {len(failed)} shot fail: {failed}")
        sys.exit(2)
    print("\n✓ All picks finalized.")


if __name__ == "__main__":
    main()
