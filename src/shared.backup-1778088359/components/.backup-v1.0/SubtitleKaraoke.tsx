/**
 * SubtitleKaraoke — word-level highlight caption.
 *
 * 4 RULES CỨNG (production tested clip 01-04):
 *   1. Padding `4px 12px` cố định khi active (KHÔNG dynamic)
 *   2. Outline + text trắng khi inactive
 *   3. `active = t >= start && t < end + 0.04` (no overshoot)
 *   4. Override `highlightColor` cho scene nền vàng → dùng coral
 *
 * Ưu tiên `perWord` (timestamps tuyệt đối từ Whisper). Fallback chia đều theo số từ.
 */
import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import theme from '../theme';

const { color, font, radius } = theme;
const weight = font.weight;

export const SubtitleKaraoke: React.FC<{
  text: string;
  /** Per-word timings as fraction 0..1 OR absolute seconds (auto-detect). */
  perWord?: number[];
  /** When perWord uses absolute seconds, set sceneStartSec for offset calc. */
  sceneStartSec?: number;
  /** Override active-word bg color (default brand yellow). Use coral on yellow scenes. */
  highlightColor?: string;
  /** Y position from bottom in px (default 220). */
  bottom?: number;
}> = ({ text, perWord, sceneStartSec, highlightColor, bottom = 220 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const words = text.split(/\s+/).filter(Boolean);

  const useAbsolute =
    perWord && perWord.length > 0 && perWord[perWord.length - 1] > 1;
  const tFraction = frame / Math.max(durationInFrames - 1, 1);
  const tSec = (frame / fps) + (sceneStartSec ?? 0);
  const fade = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  const hl = highlightColor ?? color.brand.yellow;

  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        left: 60,
        right: 60,
        zIndex: 9,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '10px 14px',
        opacity: fade,
      }}
    >
      {words.map((w, i) => {
        let active: boolean;
        if (useAbsolute && perWord) {
          const start = perWord[i];
          const end = perWord[i + 1] ?? start + 0.4;
          active = tSec >= start && tSec < end + 0.04;
        } else {
          const start = perWord?.[i] ?? i / Math.max(words.length, 1);
          const end = perWord?.[i + 1] ?? (i + 1) / Math.max(words.length, 1);
          active = tFraction >= start && tFraction < end + 0.04;
        }
        return (
          <span
            key={i}
            style={{
              fontFamily: font.family.body,
              fontWeight: weight.bold,
              fontSize: 48,
              color: active ? color.outline : color.neutral[0],
              background: active ? hl : 'transparent',
              padding: active ? '4px 12px' : '4px 0',
              borderRadius: radius.sm,
              ...(!active
                ? {
                    WebkitTextStroke: `4px ${color.outline}`,
                    paintOrder: 'stroke fill' as const,
                  }
                : {}),
              transition: 'background 100ms',
              lineHeight: 1.3,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
