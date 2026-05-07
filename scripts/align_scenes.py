#!/usr/bin/env python3
"""
align_scenes.py v1.13 — Smart alignment scene timing với voiceover thực tế.

Vấn đề cũ: scene_perword.py chia words bằng `start_sec >= scene.start_sec & < scene.end_sec`.
Nếu scene boundary cắt giữa câu → từ bị tách khỏi câu hợp lý → lệch scene.

Fix:
  1. Đọc scenes.json (text mỗi scene = source of truth)
  2. Đọc voiceover.json (perWord timestamps Whisper)
  3. Cho MỖI scene, tìm word range trong voiceover khớp text scene đó (fuzzy match)
  4. Update scene.start/end frames dựa trên actual word boundaries
  5. Output scenes-with-perword.json với:
     - scene.perWord = words thuộc về scene đó (đầy đủ câu)
     - scene.start/end = aligned với word boundaries thật
     - totalFrames adjusted nếu voiceover ngắn/dài hơn dự kiến

Usage:
  python3 scripts/align_scenes.py <slug> [--padding-frames 6]

Args:
  slug: clip slug (folder dưới public/)
  --padding-frames: thêm buffer giữa scenes (default 6 = 0.2s @ 30fps)
"""
import argparse
import json
import re
import sys
from pathlib import Path
from typing import List, Dict, Tuple


def strip_punct(s: str) -> str:
    """Normalize word for comparison."""
    return re.sub(r'[.,!?:;()«»"\'–—]', '', s).lower().strip()


def fuzzy_word_match(a: str, b: str) -> bool:
    """Check if 2 words match (case-insensitive, punct-stripped)."""
    return strip_punct(a) == strip_punct(b)


def find_best_word_range(
    voiceover_words: List[Dict],
    scene_words: List[str],
    cursor: int,
) -> Tuple[int, int]:
    """
    Find best matching word range trong voiceover starting from cursor.

    Returns: (start_idx, end_idx) — word range INCLUSIVE-EXCLUSIVE.

    Strategy:
    - Try strict sequential match starting at cursor
    - If voiceover words match scene words 70%+ → accept
    - Else slide cursor forward to find better start
    """
    n_scene = len(scene_words)
    if n_scene == 0:
        return cursor, cursor

    n_vo = len(voiceover_words)
    best_start = cursor
    best_score = -1
    best_length = n_scene

    # Try starting positions within ±5 of cursor
    search_range = range(max(0, cursor - 2), min(n_vo - n_scene + 5, cursor + 5))
    for start in search_range:
        # Try matching with flexible length (n_scene-2 to n_scene+5)
        for length_offset in range(-2, 6):
            length = n_scene + length_offset
            if length < 1 or start + length > n_vo:
                continue
            # Score: count matching words
            score = 0
            sc_idx = 0
            vo_idx = start
            while sc_idx < n_scene and vo_idx < start + length:
                if fuzzy_word_match(voiceover_words[vo_idx]['word'], scene_words[sc_idx]):
                    score += 1
                    sc_idx += 1
                vo_idx += 1
            # Penalize length deviation
            length_penalty = abs(length_offset) * 0.5
            adjusted_score = score - length_penalty
            if adjusted_score > best_score:
                best_score = adjusted_score
                best_start = start
                best_length = length

    return best_start, best_start + best_length


def align_scenes(slug: str, padding_frames: int = 6) -> None:
    """Main alignment logic."""
    scenes_path = Path(f"public/{slug}/scenes.json")
    if not scenes_path.exists():
        print(f"❌ {scenes_path} không tồn tại")
        sys.exit(1)

    # Find voiceover.json (try common patterns)
    vo_path = None
    for candidate in scenes_path.parent.glob("*-voiceover.json"):
        vo_path = candidate
        break
    if vo_path is None:
        print(f"❌ không tìm thấy *-voiceover.json trong public/{slug}/")
        sys.exit(1)

    print(f"📂 scenes:    {scenes_path}")
    print(f"📂 voiceover: {vo_path}")

    scenes_data = json.loads(scenes_path.read_text())
    vo_data = json.loads(vo_path.read_text())
    voiceover_words = vo_data.get('words', [])
    fps = scenes_data.get('fps', 30)

    if not voiceover_words:
        print("❌ voiceover.json rỗng (không có words)")
        sys.exit(1)

    print(f"   Total voiceover words: {len(voiceover_words)}")
    print(f"   Total scenes: {len(scenes_data['scenes'])}")
    print(f"   FPS: {fps}")
    print()

    # Process scenes sequentially
    cursor = 0
    aligned_scenes = []
    total_words_assigned = 0

    for sc_idx, sc in enumerate(scenes_data['scenes']):
        scene_text = (sc.get('text') or sc.get('subtitle') or '').strip()
        scene_words = scene_text.split()

        if not scene_words:
            # Empty text scene — keep original timing, no perWord
            sc['perWord'] = []
            aligned_scenes.append(sc)
            continue

        # Find matching word range in voiceover
        start_idx, end_idx = find_best_word_range(voiceover_words, scene_words, cursor)
        end_idx = min(end_idx, len(voiceover_words))
        scene_voiceover = voiceover_words[start_idx:end_idx]

        if not scene_voiceover:
            print(f"   ⚠️  scene {sc.get('shot', sc_idx)} no match — skipped")
            sc['perWord'] = []
            aligned_scenes.append(sc)
            continue

        # Update scene timing from actual voiceover
        actual_start_sec = scene_voiceover[0]['start']
        actual_end_sec = scene_voiceover[-1]['end']

        # Convert to frames
        new_start = int(actual_start_sec * fps)
        new_end = int(actual_end_sec * fps) + padding_frames

        # Build perWord array
        sc['perWord'] = [
            {'word': w['word'], 'start': w['start'], 'end': w['end']}
            for w in scene_voiceover
        ]

        # Save aligned timing
        old_start = sc.get('start', 0)
        old_end = sc.get('end', 0)
        sc['start'] = new_start
        sc['end'] = new_end

        shifted_msg = ""
        if abs(new_start - old_start) > 3 or abs(new_end - old_end) > 3:
            shifted_msg = f" [SHIFTED from {old_start}-{old_end}f]"

        print(
            f"   {sc.get('shot', sc_idx):30} "
            f"{new_start:>5}-{new_end:>5}f  "
            f"({len(scene_voiceover):>3} words)"
            f"{shifted_msg}"
        )

        aligned_scenes.append(sc)
        cursor = end_idx
        total_words_assigned += len(scene_voiceover)

    # Update scenes data
    scenes_data['scenes'] = aligned_scenes

    # Adjust totalFrames if last scene end > totalFrames
    last_end = max((s.get('end', 0) for s in aligned_scenes), default=0)
    old_total = scenes_data.get('totalFrames', 0)
    if last_end > old_total:
        print(f"\n   📐 Adjusting totalFrames: {old_total} → {last_end}")
        scenes_data['totalFrames'] = last_end

    # Write output
    out_path = Path("public/scenes-with-perword.json")
    out_path.write_text(json.dumps(scenes_data, ensure_ascii=False, indent=2))

    print()
    print(f"✅ Aligned {len(aligned_scenes)} scenes ({total_words_assigned}/{len(voiceover_words)} words assigned)")
    print(f"   Output: {out_path}")

    # Warn if many words unassigned
    unassigned = len(voiceover_words) - total_words_assigned
    if unassigned > len(voiceover_words) * 0.1:
        print(f"   ⚠️  {unassigned} voiceover words unassigned (>10%) — kiểm tra scenes.json text matches voiceover")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("--padding-frames", type=int, default=6,
                    help="Buffer frames giữa scenes (default 6 = 0.2s @ 30fps)")
    args = ap.parse_args()
    align_scenes(args.slug, args.padding_frames)


if __name__ == "__main__":
    main()

