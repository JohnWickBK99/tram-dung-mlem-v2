/**
 * SubtitleKaraoke — word-level karaoke caption (v1.4 — pure handoff style).
 *
 * Source of truth: handoff/bun-cha-preview.html `.sub` rules.
 *
 * INACTIVE word:
 *   - color white + outline 4px ink + paint-order stroke fill
 *   - padding `4px 0` (no horizontal padding)
 *   - bg transparent
 *
 * ACTIVE word (sticker box):
 *   - bg yellow + text ink + NO outline
 *   - border `3px solid ink` + box-shadow `4px 4px 0 0 ink`
 *   - padding `4px 14px` + border-radius 8px
 *   - **layout shifts khi active** — đây là design intent (sticker pop effect)
 *
 * EMPHASIZED inactive (địa danh + từ khóa):
 *   - color = `emphasisColor` (default yellow) thay vì white
 *   - giữ outline 4px ink + padding 4px 0
 *
 * Per-scene override khi BG khác:
 *   - Scene BG yellow (#s06): pass highlightBg="#1A1A1A" highlightTextColor="#F8B147" highlightShadowColor="#E85D2F"
 *   - Scene BG striped yellow (#s14): pass highlightBg="#E85D2F" highlightTextColor="#FFFFFF" highlightStroke={2}
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
  /** Active word bg (default yellow). Override `'#1A1A1A'` cho scene yellow. */
  highlightBg?: string;
  /** Active word text color (default ink). Override `yellow` cho scene yellow. */
  highlightTextColor?: string;
  /** Active word border color (default ink). */
  highlightBorderColor?: string;
  /** Active word shadow color (default ink). Override `coral` cho scene yellow. */
  highlightShadowColor?: string;
  /** Active word stroke (default 0 — no outline khi active). */
  highlightStroke?: number;
  /** List địa danh + từ khóa cần nổi bật khi inactive (string array). */
  emphasis?: string[];
  /** Inactive emphasized text color (default yellow). Override coral/red cho scene cream. */
  emphasisColor?: string;
  /** Y position từ bottom px (default 140 — match handoff preview). */
  bottom?: number;
  /** Font size (default 48 — handoff preview = 42, TSX = 48 cho legibility). */
  fontSize?: number;
  /** Inactive outline stroke px (default 4). */
  strokeWidth?: number;
}> = ({
  text,
  perWord,
  sceneStartSec,
  highlightBg,
  highlightTextColor,
  highlightBorderColor,
  highlightShadowColor,
  highlightStroke = 0,
  emphasis,
  emphasisColor,
  bottom = 140,
  fontSize = 48,
  strokeWidth = 4,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const words = text.split(/\s+/).filter(Boolean);

  const keywordSet = React.useMemo(() => {
    if (!emphasis || emphasis.length === 0) return new Set<string>();
    const flat: string[] = [];
    for (const phrase of emphasis) {
      for (const w of phrase.split(/\s+/)) {
        if (w) flat.push(stripPunct(w));
      }
    }
    return new Set(flat);
  }, [emphasis]);

  const useAbsolute =
    perWord && perWord.length > 0 && perWord[perWord.length - 1] > 1;
  const tFraction = frame / Math.max(durationInFrames - 1, 1);
  const tSec = (frame / fps) + (sceneStartSec ?? 0);
  const fade = interpolate(frame, [0, 4], [0, 1], { extrapolateRight: 'clamp' });

  const hlBg = highlightBg ?? color.brand.yellow;
  const hlText = highlightTextColor ?? color.outline;
  const hlBorder = highlightBorderColor ?? color.outline;
  const hlShadow = highlightShadowColor ?? color.outline;
  const empCol = emphasisColor ?? color.brand.yellow;

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
        maxHeight: 340,
        overflow: 'hidden',
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
        const isEmphasized = keywordSet.has(stripPunct(w));

        if (active) {
          // Active sticker box (handoff style)
          return (
            <span
              key={i}
              style={{
                fontFamily: font.family.body,
                fontWeight: weight.bold,
                fontSize,
                lineHeight: 1.3,
                color: hlText,
                background: hlBg,
                border: `3px solid ${hlBorder}`,
                boxShadow: `4px 4px 0 0 ${hlShadow}`,
                padding: '4px 14px',
                borderRadius: 8,
                WebkitTextStroke: highlightStroke > 0 ? `${highlightStroke}px ${color.outline}` : '0',
                paintOrder: 'stroke fill',
                display: 'inline-block',
              }}
            >
              {w}
            </span>
          );
        }

        // Inactive — emphasized hoặc thường
        return (
          <span
            key={i}
            style={{
              fontFamily: font.family.body,
              fontWeight: weight.bold,
              fontSize,
              lineHeight: 1.3,
              color: isEmphasized ? empCol : color.neutral[0],
              background: 'transparent',
              padding: '4px 0',
              WebkitTextStroke: `${strokeWidth}px ${color.outline}`,
              paintOrder: 'stroke fill',
              display: 'inline-block',
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
