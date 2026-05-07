#!/usr/bin/env python3
"""
scene_perword.py — merge `<slug>-voiceover.json` words into scenes.json
Output: `public/scenes-with-perword.json` (consumed by Remotion shared/hooks/useSceneWords).

scenes.json format:
  {
    "totalFrames": 2700, "fps": 30,
    "scenes": [{"id": "S01", "shot": "S01_HOOK", "start": 0, "end": 90, "text": "..."}]
  }

Output adds `perWord: [{word, start, end}]` to each scene (absolute seconds in voiceover).

Usage:
  python3 scene_perword.py <slug>
"""
import json
import sys
from pathlib import Path


def main():
    if len(sys.argv) < 2:
        print("Usage: scene_perword.py <slug>")
        sys.exit(1)
    slug = sys.argv[1]

    scenes_p = Path(f"public/{slug}/scenes.json")
    vo_p = Path(f"public/{slug}/{slug.replace('_', '-')}-voiceover.json")
    # try common dash patterns
    if not vo_p.exists():
        # search for *-voiceover.json
        for p in scenes_p.parent.glob("*-voiceover.json"):
            vo_p = p
            break

    if not scenes_p.exists():
        print(f"❌ {scenes_p}")
        sys.exit(1)
    if not vo_p.exists():
        print(f"❌ voiceover.json không tìm thấy trong public/{slug}/")
        sys.exit(1)

    scenes = json.loads(scenes_p.read_text())
    vo = json.loads(vo_p.read_text())
    words = vo.get("words", [])
    fps = scenes.get("fps", 30)

    for sc in scenes["scenes"]:
        start_sec = sc["start"] / fps
        end_sec = sc["end"] / fps
        sc_words = [w for w in words if start_sec <= w["start"] < end_sec]
        sc["perWord"] = [{"word": w["word"], "start": w["start"], "end": w["end"]} for w in sc_words]

    out = Path("public/scenes-with-perword.json")
    out.write_text(json.dumps(scenes, ensure_ascii=False, indent=2))
    total = sum(len(s["perWord"]) for s in scenes["scenes"])
    print(f"✓ {out} — {total} words / {len(scenes['scenes'])} scenes")


if __name__ == "__main__":
    main()
