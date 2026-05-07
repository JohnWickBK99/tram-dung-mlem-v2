#!/usr/bin/env python3
"""
audio_mix.py — pre-mix VO + BGM + SFX into a single audio track.
Useful for:
  - Preview audio sync before render
  - Generating standalone .mp3 for CapCut import
  - Direct render output if Remotion <Audio> not used

Reads `public/<slug>/scenes.json` for SFX trigger events.

scene format:
  "sfx": [{"name": "whoosh-transition.mp3", "frame": 90, "volume": 0.55}, ...]

OR:
  "sfx": ["impact-hook.mp3", "chime-fact.mp3"]    # legacy: fires at scene start

Usage:
  python3 audio_mix.py <slug> [--out audio_mix.mp3] [--bgm-volume 0.18]
"""
import argparse
import json
import os
import subprocess
import sys
from pathlib import Path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("--out", default=None)
    ap.add_argument("--bgm-volume", type=float, default=0.18)
    ap.add_argument("--sfx-volume", type=float, default=0.55)
    args = ap.parse_args()

    slug = args.slug
    scenes_p = Path(f"public/{slug}/scenes.json")
    if not scenes_p.exists():
        print(f"❌ {scenes_p}")
        sys.exit(1)
    scenes = json.loads(scenes_p.read_text())
    fps = scenes.get("fps", 30)
    audio = scenes.get("audio", {})
    voiceover = audio.get("voiceover")
    bgm = audio.get("bgm")
    if not voiceover or not bgm:
        print("❌ scenes.json thiếu `audio.voiceover` hoặc `audio.bgm`")
        sys.exit(1)

    vo_path = f"public/{voiceover}"
    bgm_path = f"public/{bgm}"
    if not os.path.exists(vo_path):
        print(f"❌ {vo_path}")
        sys.exit(1)
    if not os.path.exists(bgm_path):
        print(f"⚠️  {bgm_path} not found — skip BGM")
        bgm_path = None

    # Get duration from voiceover
    duration = float(subprocess.check_output(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", vo_path]
    ).decode().strip())

    out = args.out or f"out/{slug}_audiomix.mp3"
    os.makedirs(os.path.dirname(out), exist_ok=True)

    inputs = ["-i", vo_path]
    filter_parts = ["[0:a]volume=1.0[vo]"]
    last_label = "vo"

    if bgm_path:
        inputs += ["-i", bgm_path]
        filter_parts.append(f"[1:a]volume={args.bgm_volume},aloop=loop=-1:size=2e9[bgm]")
        filter_parts.append(f"[vo][bgm]amix=inputs=2:duration=first:dropout_transition=0[mix1]")
        last_label = "mix1"

    # SFX events
    sfx_events = []
    for sc in scenes["scenes"]:
        sfx_list = sc.get("sfx", [])
        for entry in sfx_list:
            if isinstance(entry, str):
                sfx_events.append({"name": entry, "frame": sc["start"], "volume": args.sfx_volume})
            elif isinstance(entry, dict):
                sfx_events.append({
                    "name": entry["name"],
                    "frame": entry.get("frame", sc["start"]),
                    "volume": entry.get("volume", args.sfx_volume),
                })

    sfx_idx = 2 if bgm_path else 1
    for i, ev in enumerate(sfx_events):
        sfx_path = f"public/audio/{ev['name']}"
        if not os.path.exists(sfx_path):
            print(f"  ⚠️  sfx skip: {sfx_path}")
            continue
        inputs += ["-i", sfx_path]
        delay_ms = int((ev["frame"] / fps) * 1000)
        filter_parts.append(f"[{sfx_idx}:a]volume={ev['volume']},adelay={delay_ms}|{delay_ms}[sfx{i}]")
        new_label = f"mix{i+2}" if bgm_path else f"mix{i+1}"
        filter_parts.append(f"[{last_label}][sfx{i}]amix=inputs=2:duration=first:dropout_transition=0[{new_label}]")
        last_label = new_label
        sfx_idx += 1

    if not sfx_events and not bgm_path:
        # passthrough
        cmd = ["ffmpeg", "-y", "-i", vo_path, "-c:a", "libmp3lame", "-q:a", "2", out]
    else:
        filter_complex = ";".join(filter_parts)
        cmd = ["ffmpeg", "-y"] + inputs + [
            "-filter_complex", filter_complex,
            "-map", f"[{last_label}]",
            "-t", f"{duration:.3f}",
            "-c:a", "libmp3lame", "-q:a", "2",
            out,
        ]

    print(f"=== audio mix → {out} ({duration:.1f}s, {len(sfx_events)} sfx) ===")
    subprocess.run(cmd, check=True)
    print(f"✓ {out}")


if __name__ == "__main__":
    main()
