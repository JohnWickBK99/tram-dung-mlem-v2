/**
 * SubtitleKaraoke v1.8 — Layout-stable + sticker + PAGINATION (max 2 dòng).
 *
 * v1.8 NEW:
 *   - `wordsPerPage` prop (default 10) — chia text dài thành nhiều page
 *   - Page hiện tại = floor(activeWordIndex / wordsPerPage)
 *   - Khi từ cuối page X kết thúc → switch instant sang page X+1
 *   - Mỗi page chỉ render words của nó → KHÔNG vượt 2 dòng
 *
 * v1.9 — Uniform inactive color:
 *   - Inactive luôn TRẮNG (bỏ emphasis color toggle)
 *   - emphasis prop kept for future / scenes.json metadata, không ảnh hưởng visual
 *
 * Layout-stable + sticker (v1.6):
 *   - padding/border/outline LUÔN cố định → ZERO JUMP khi active
 *   - Active = sticker box (border 3px ink + shadow 4px ink + bg yellow)
 *   - Inactive = transparent border RESERVES space
 *   - No CSS transition (instant swap)
 *
 * v1.7 compact:
 *   - gap '8px 6px' (was 10px 14px)
 *   - padding '4px 10px' (was 4px 14px)
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
  /** Số từ tối đa trên 1 page (default 10 ≈ 2 dòng @ fontSize 48 trong frame 960px). */
  wordsPerPage?: number;
}> = ({
  text, perWord, sceneStartSec,
  highlightBg, highlightTextColor, highlightBorderColor, highlightShadowColor,
  highlightStroke, emphasis, emphasisColor,
  bottom = 140, fontSize = 48, strokeWidth = 4,
  wordsPerPage = 10,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const allWords = text.split(/\s+/).filter(Boolean);

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
  const fade = interpolate(frame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  // Pagination logic — find current word index then page
  const getWordTiming = (i: number): { start: number; end: number } => {
    if (useAbsolute && perWord) {
      const start = perWord[i];
      const end = perWord[i + 1] ?? start + 0.4;
      return { start, end };
    }
    const start = perWord?.[i] ?? i / Math.max(allWords.length, 1);
    const end = perWord?.[i + 1] ?? (i + 1) / Math.max(allWords.length, 1);
    return { start, end };
  };

  const isWordActive = (i: number): boolean => {
    const { start, end } = getWordTiming(i);
    const t = useAbsolute ? tSec : tFraction;
    return t >= start && t < end + 0.04;
  };

  // Find currently active word; fallback to latest word that has started
  let activeIdx = allWords.findIndex((_, i) => isWordActive(i));
  if (activeIdx === -1) {
    // No word currently active — find last word that has started
    let latest = -1;
    for (let i = 0; i < allWords.length; i++) {
      const { start } = getWordTiming(i);
      const t = useAbsolute ? tSec : tFraction;
      if (t >= start) latest = i;
    }
    activeIdx = Math.max(latest, 0);
  }

  const currentPage = Math.floor(activeIdx / wordsPerPage);
  const pageStart = currentPage * wordsPerPage;
  const pageEnd = Math.min(pageStart + wordsPerPage, allWords.length);
  const visibleWords = allWords.slice(pageStart, pageEnd);

  const hlBg = highlightBg ?? color.brand.yellow;
  const hlText = highlightTextColor ?? color.outline;
  const hlBorder = highlightBorderColor ?? color.outline;
  const hlShadow = highlightShadowColor ?? color.outline;
  const empCol = emphasisColor ?? color.brand.yellow;

  const baseStyle: React.CSSProperties = {
    fontFamily: font.family.body,
    fontWeight: weight.bold,
    fontSize,
    lineHeight: 1.3,
    padding: '4px 10px',
    borderRadius: 8,
    borderWidth: 3,
    borderStyle: 'solid',
    WebkitTextStroke: `${strokeWidth}px ${color.outline}`,
    paintOrder: 'stroke fill' as const,
    display: 'inline-block',
  };

  return (
    <div style={{
      position: 'absolute', bottom, left: 60, right: 60, zIndex: 9,
      display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
      gap: '8px 6px', opacity: fade, maxHeight: 340, overflow: 'hidden',
    }}>
      {visibleWords.map((w, localI) => {
        const i = localI + pageStart;
        const active = isWordActive(i);
        const isEmphasized = keywordSet.has(stripPunct(w));

        if (active) {
          return (
            <span key={`${currentPage}-${i}`} style={{
              ...baseStyle,
              color: hlText,
              background: hlBg,
              borderColor: hlBorder,
              boxShadow: `4px 4px 0 0 ${hlShadow}`,
              ...(highlightStroke !== undefined && {
                WebkitTextStroke: highlightStroke > 0
                  ? `${highlightStroke}px ${color.outline}`
                  : '0',
              }),
            }}>{w}</span>
          );
        }
        return (
          <span key={`${currentPage}-${i}`} style={{
            ...baseStyle,
            color: color.neutral[0],
            background: 'transparent',
            borderColor: 'transparent',
          }}>{w}</span>
        );
      })}
    </div>
  );
};
