/**
 * SubtitleKaraoke — word-level karaoke caption (v1.4 — pure handoff sticker style).
 *
 * Inactive: padding 4px 0, color white, outline 4px ink, bg transparent.
 * Active = sticker box: padding 4px 14px, bg yellow, color ink, border 3px ink,
 *         shadow 4px 4px 0 0 ink, radius 8, NO outline. Layout shifts (design intent).
 *
 * Per-scene override props:
 *   highlightBg, highlightTextColor, highlightBorderColor, highlightShadowColor,
 *   highlightStroke (default 0), emphasis (string[]), emphasisColor
 */
import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import theme from '../theme';

const { color, font } = theme;
const weight = font.weight;
const stripPunct = (s: string) => s.replace(/[.,!?:;()«»"'–—]/g, '').toLowerCase();

export const SubtitleKaraoke: React.FC<{
  text: string;
  perWord?: number[];
  sceneStartSec?: number;
  highlightBg?: string;
  highlightTextColor?: string;
  highlightBorderColor?: string;
  highlightShadowColor?: string;
  highlightStroke?: number;
  emphasis?: string[];
  emphasisColor?: string;
  bottom?: number;
  fontSize?: number;
  strokeWidth?: number;
}> = ({
  text, perWord, sceneStartSec,
  highlightBg, highlightTextColor, highlightBorderColor, highlightShadowColor,
  highlightStroke = 0, emphasis, emphasisColor,
  bottom = 140, fontSize = 48, strokeWidth = 4,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const words = text.split(/\s+/).filter(Boolean);

  const keywordSet = React.useMemo(() => {
    if (!emphasis || emphasis.length === 0) return new Set<string>();
    const flat: string[] = [];
    for (const phrase of emphasis) {
      for (const w of phrase.split(/\s+/)) if (w) flat.push(stripPunct(w));
    }
    return new Set(flat);
  }, [emphasis]);

  const useAbsolute = perWord && perWord.length > 0 && perWord[perWord.length - 1] > 1;
  const tFraction = frame / Math.max(durationInFrames - 1, 1);
  const tSec = (frame / fps) + (sceneStartSec ?? 0);
  const fade = interpolate(frame, [0, 4], [0, 1], { extrapolateRight: 'clamp' });

  const hlBg = highlightBg ?? color.brand.yellow;
  const hlText = highlightTextColor ?? color.outline;
  const hlBorder = highlightBorderColor ?? color.outline;
  const hlShadow = highlightShadowColor ?? color.outline;
  const empCol = emphasisColor ?? color.brand.yellow;

  return (
    <div style={{
      position: 'absolute', bottom, left: 60, right: 60, zIndex: 9,
      display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
      gap: '10px 14px', opacity: fade, maxHeight: 340, overflow: 'hidden',
    }}>
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
        const isEmphasized = keywordSet.has(stripPunct(w));

        if (active) {
          return (
            <span key={i} style={{
              fontFamily: font.family.body, fontWeight: weight.bold, fontSize,
              lineHeight: 1.3, color: hlText, background: hlBg,
              border: `3px solid ${hlBorder}`,
              boxShadow: `4px 4px 0 0 ${hlShadow}`,
              padding: '4px 14px', borderRadius: 8,
              WebkitTextStroke: highlightStroke > 0 ? `${highlightStroke}px ${color.outline}` : '0',
              paintOrder: 'stroke fill', display: 'inline-block',
            }}>{w}</span>
          );
        }
        return (
          <span key={i} style={{
            fontFamily: font.family.body, fontWeight: weight.bold, fontSize,
            lineHeight: 1.3, color: isEmphasized ? empCol : color.neutral[0],
            background: 'transparent', padding: '4px 0',
            WebkitTextStroke: `${strokeWidth}px ${color.outline}`,
            paintOrder: 'stroke fill', display: 'inline-block',
          }}>{w}</span>
        );
      })}
    </div>
  );
};
