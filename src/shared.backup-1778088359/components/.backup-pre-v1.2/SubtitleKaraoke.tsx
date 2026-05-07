/**
 * SubtitleKaraoke — word-level highlight caption.
 *
 * 5 RULES CỨNG (production tested clip 01-04 + v1.1 layout-stable fix):
 *   1. Layout cố định — padding `4px 12px` luôn cố định, fontSize/weight cố định, không jump
 *   2. Outline 4px BLACK LUÔN GIỮ cả ở active + inactive (chỉ đổi color + bg)
 *   3. Inactive: text trắng + outline đen + bg transparent
 *   4. Active: text đen + outline đen + bg highlight color (vàng default, coral khi BG vàng)
 *   5. active = t >= start && t < end + 0.04 (no overshoot)
 */
import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import theme from '../theme';

const { color, font, radius } = theme;
const weight = font.weight;

export const SubtitleKaraoke: React.FC<{
  text: string;
  perWord?: number[];
  sceneStartSec?: number;
  highlightColor?: string;
  bottom?: number;
  fontSize?: number;
  strokeWidth?: number;
}> = ({
  text,
  perWord,
  sceneStartSec,
  highlightColor,
  bottom = 220,
  fontSize = 48,
  strokeWidth = 4,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const words = text.split(/\s+/).filter(Boolean);

  const useAbsolute =
    perWord && perWord.length > 0 && perWord[perWord.length - 1] > 1;
  const tFraction = frame / Math.max(durationInFrames - 1, 1);
  const tSec = (frame / fps) + (sceneStartSec ?? 0);
  const fade = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  const hl = highlightColor ?? color.brand.yellow;

  const baseWordStyle: React.CSSProperties = {
    fontFamily: font.family.body,
    fontWeight: weight.bold,
    fontSize,
    padding: '4px 12px',
    borderRadius: radius.sm,
    lineHeight: 1.3,
    WebkitTextStroke: `${strokeWidth}px ${color.outline}`,
    paintOrder: 'stroke fill',
    display: 'inline-block',
    transition: 'background-color 100ms, color 100ms',
  };

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
              ...baseWordStyle,
              color: active ? color.outline : color.neutral[0],
              background: active ? hl : 'transparent',
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
