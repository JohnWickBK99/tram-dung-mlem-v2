/**
 * SubtitleKaraoke v1.6 — LAYOUT-STABLE sticker pop (kết hợp v1.2 layout-stable + v1.4 sticker visual).
 *
 * KEY INSIGHT: padding cố định + transparent border cho inactive (reserve space) → ZERO JUMP
 * khi active = sticker box xuất hiện. Outline luôn 4px (không toggle on/off → no glyph shift).
 *
 * INACTIVE word:
 *   - color white + WebkitTextStroke 4px ink + paint-order
 *   - padding 4px 14px (LUÔN — reserve cho active state)
 *   - bg transparent
 *   - border 3px transparent (reserve cho active border)
 *   - radius 8 (no visual khi bg transparent + border transparent)
 *
 * ACTIVE word (sticker box xuất hiện):
 *   - color ink + WebkitTextStroke 4px ink (ink trên ink → invisible stroke OK)
 *   - padding 4px 14px (SAME)
 *   - bg yellow
 *   - border 3px ink (visible — LAYOUT STAYS vì inactive đã reserve 3px transparent)
 *   - shadow 4px 4px 0 0 ink (paint-only, không layout)
 *
 * EMPHASIZED inactive (địa danh + từ khóa nổi bật):
 *   - color emphasisColor (default yellow) thay vì white
 *   - giữ padding/outline/border như inactive thường → layout same
 *
 * Per-scene override khi BG khác cream/photo: highlightBg, highlightTextColor, highlightBorderColor, highlightShadowColor, highlightStroke
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
  highlightStroke, emphasis, emphasisColor,
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
  // Entry fade SIÊU NGẮN — 2 frames để gần như instant
  const fade = interpolate(frame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  const hlBg = highlightBg ?? color.brand.yellow;
  const hlText = highlightTextColor ?? color.outline;
  const hlBorder = highlightBorderColor ?? color.outline;
  const hlShadow = highlightShadowColor ?? color.outline;
  const empCol = emphasisColor ?? color.brand.yellow;

  // Style cố định cho mọi word — KHÔNG đổi giữa active/inactive (rule layout-stable)
  const baseStyle: React.CSSProperties = {
    fontFamily: font.family.body,
    fontWeight: weight.bold,
    fontSize,
    lineHeight: 1.3,
    padding: '4px 14px',                                 // LUÔN cố định
    borderRadius: 8,                                     // LUÔN (no visual khi bg transparent)
    borderWidth: 3,                                      // LUÔN 3px (reserve space cho border khi active)
    borderStyle: 'solid',
    WebkitTextStroke: `${strokeWidth}px ${color.outline}`, // LUÔN — no glyph shift
    paintOrder: 'stroke fill' as const,
    display: 'inline-block',
    // KHÔNG có transition — instant swap (no fade)
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
          // Active sticker box — visual đầy đủ NHƯNG layout same
          return (
            <span
              key={i}
              style={{
                ...baseStyle,
                color: hlText,
                background: hlBg,
                borderColor: hlBorder,                                              // visible border
                boxShadow: `4px 4px 0 0 ${hlShadow}`,                                // paint only
                ...(highlightStroke !== undefined && {
                  WebkitTextStroke: highlightStroke > 0
                    ? `${highlightStroke}px ${color.outline}`
                    : '0',
                }),
              }}
            >
              {w}
            </span>
          );
        }

        // Inactive — transparent border RESERVE space → no jump khi active
        return (
          <span
            key={i}
            style={{
              ...baseStyle,
              color: isEmphasized ? empCol : color.neutral[0],
              background: 'transparent',
              borderColor: 'transparent',                                           // reserve space
              // no shadow (paint only — không ảnh hưởng)
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
