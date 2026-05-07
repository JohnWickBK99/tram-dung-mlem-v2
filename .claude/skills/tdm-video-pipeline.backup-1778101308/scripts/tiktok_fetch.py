#!/usr/bin/env python3
"""
tiktok_fetch.py — TikTok asset download via yt-dlp + browser cookies.

⚠️ HIGH-RISK SOURCE. Use only when CC + Google + YouTube ALL miss.
Each clip MUST be ≤ 4s in final pick_best output (transformative use rule).

Setup once:
  yt-dlp can read cookies from your browser. On macOS:
    yt-dlp --cookies-from-browser chrome <url>     # or safari/firefox

Usage:
  python3 tiktok_fetch.py <shot_id> "<query OR url>" <count> <out_dir> [--cookies-browser chrome]

Mode auto-detect:
  - If query starts with http → treat as direct URL (download 1 video)
  - Otherwise → search via "tiktok-search:<query>" (note: yt-dlp's search support
    for tiktok is limited; recommend pasting URLs found via TikTok app)
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
    ap.add_argument("--cookies-browser", default="chrome", choices=["chrome", "safari", "firefox", "edge"])
    args = ap.parse_args()

    if not shutil.which("yt-dlp"):
        print("❌ yt-dlp not installed.")
        sys.exit(1)

    os.makedirs(args.out_dir, exist_ok=True)
    print(f"[{args.shot}] tiktok query='{args.query}'")

    cmd = ["yt-dlp", "--cookies-from-browser", args.cookies_browser, "--no-warnings", "--quiet"]

    if args.query.startswith("http"):
        cmd += [args.query]
    else:
        # TikTok-specific search via tiktok.com/search
        cmd += [f"https://www.tiktok.com/search/video?q={args.query.replace(' ', '+')}"]

    cmd += [
        "--max-downloads", str(args.count),
        "-f", "best[ext=mp4]/best",
        "-o", os.path.join(args.out_dir, "tiktok_%(autonumber)02d_%(id)s.%(ext)s"),
    ]

    try:
        subprocess.run(cmd, check=False, timeout=180)
    except subprocess.TimeoutExpired:
        print("  ! yt-dlp timeout (180s)")

    saved = len([f for f in os.listdir(args.out_dir) if f.startswith("tiktok_") and f.endswith(".mp4")])
    print(f"  ✓ tiktok total: {saved}")
    with open(os.path.join(args.out_dir, "credits_tiktok.json"), "w") as f:
        json.dump({"shot": args.shot, "query": args.query, "source": "tiktok", "count": saved, "warning": "trim to ≤4s + mix ≥5 sources"}, f, indent=2)


if __name__ == "__main__":
    main()
