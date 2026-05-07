#!/usr/bin/env python3
"""
youtube_fetch.py — yt-dlp wrapper for YouTube clip download.

Supports 2 modes:
  --cc-only           : --match-filter "license = 'Creative Commons Attribution license (reuse allowed)'"
  (default)           : no license filter — non-CC clips, restrict to ≤ MAX_DURATION sec each (transformative use)

Usage:
  python3 youtube_fetch.py <shot_id> "<query>" <count> <out_dir> [--cc-only] [--max-duration SEC]

Default: max-duration=120s (will trim post-fetch in pick_best.py to 4-5s).
"""
import argparse
import json
import os
import shutil
import subprocess
import sys

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("shot")
    ap.add_argument("query")
    ap.add_argument("count", type=int)
    ap.add_argument("out_dir")
    ap.add_argument("--cc-only", action="store_true")
    ap.add_argument("--max-duration", type=int, default=120)
    args = ap.parse_args()

    if not shutil.which("yt-dlp"):
        print("❌ yt-dlp not installed. Run: pip3 install yt-dlp --break-system-packages")
        sys.exit(1)

    os.makedirs(args.out_dir, exist_ok=True)
    print(f"[{args.shot}] yt query='{args.query}' count={args.count} cc={args.cc_only}")

    cmd = [
        "yt-dlp",
        f"ytsearch{args.count + 4}:{args.query}",
        "--max-downloads", str(args.count),
        "-f", "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
        "--merge-output-format", "mp4",
        "--no-playlist",
        "--quiet", "--no-warnings",
        "-o", os.path.join(args.out_dir, "yt_%(autonumber)02d_%(title).50B.%(ext)s"),
    ]

    if args.cc_only:
        cmd.extend(["--match-filter", f"license = 'Creative Commons Attribution license (reuse allowed)' & duration <= {args.max_duration}"])
    else:
        cmd.extend(["--match-filter", f"duration <= {args.max_duration}"])

    try:
        subprocess.run(cmd, check=False, timeout=300)
    except subprocess.TimeoutExpired:
        print("  ! yt-dlp timeout (300s)")

    saved = len([f for f in os.listdir(args.out_dir) if f.startswith("yt_") and f.endswith(".mp4")])
    print(f"  ✓ youtube total: {saved}")
    with open(os.path.join(args.out_dir, "credits_youtube.json"), "w") as f:
        json.dump({"shot": args.shot, "query": args.query, "source": "youtube", "cc_only": args.cc_only, "count": saved}, f, indent=2)


if __name__ == "__main__":
    main()
