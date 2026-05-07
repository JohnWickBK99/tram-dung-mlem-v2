/**
 * SubtitleKaraoke v1.11 — Smart pagination (split by sentence/phrase).
 * Min 4 / max 12 từ/page. Split tại . ! ? > , ; > maxWords.
 */
import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import theme from '../theme';

const { color, font } = theme;
const weight = font.weight;
const stripPunct = (s: string) => s.replace(/[.,!?:;()«»"'–—]/g, '').toLowerCase();
void stripPunct;
const isHardBreak = (word: string) => /[.!?]$/.test(word);
const isSoftBreak = (word: string) => /[,;:]$/.test(word);

const computePages = (words: string[], minWords: number, maxWords: number): number[][] => {
  const pages: number[][] = [];
  let current: number[] = [];
  for (let i = 0; i < words.length; i++) {
    current.push(i);
    if (isHardBreak(words[i]) && current.length >= minWords) {
      pages.push(current);
      current = [];
      continue;
    }
    if (current.length >= maxWords) {
      let softIdx = -1;
      for (let j = current.length - 1; j >= minWords - 1; j--) {
        if (isSoftBreak(words[current[j]])) { softIdx = j; break; }
      }
      if (softIdx > 0) {
        pages.push(current.slice(0, softIdx + 1));
        current = current.slice(softIdx + 1);
      } else {
        pages.push(current);
        current = [];
      }
    }
  }
  if (current.length > 0) {
    if (current.length < minWords && pages.length > 0) {
      pages[pages.length - 1].push(...current);
    } else {
      pages.push(current);
    }
  }
  return pages;
};

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
  minWordsPerPage?: number;
  maxWordsPerPage?: number;
}> = ({
  text, perWord, sceneStartSec,
  highlightBg, highlightTextColor, highlightBorderColor, highlightShadowColor,
  highlightStroke, emphasis, emphasisColor,
  bottom = 140, fontSize = 48, strokeWidth = 4,
  minWordsPerPage = 4, maxWordsPerPage = 12,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const allWords = text.split(/\s+/).filter(Boolean);

  const pages = React.useMemo(
    () => computePages(allWords, minWordsPerPage, maxWordsPerPage),
    [text, minWordsPerPage, maxWordsPerPage]
  );

  const useAbsolute = perWord && perWord.length > 0 && perWord[perWord.length - 1] > 1;
  const tFraction = frame / Math.max(durationInFrames - 1, 1);
  const tSec = (frame / fps) + (sceneStartSec ?? 0);
  const fade = interpolate(frame, [0, 2], [0, 1], { extrapolateRight: 'clamp' });

  const getWordTiming = (i: number) => {
    if (useAbsolute && perWord) {
      const start = perWord[i];
      const end = perWord[i + 1] ?? start + 0.4;
      return { start, end };
    }
    const start = perWord?.[i] ?? i / Math.max(allWords.length, 1);
    const end = perWord?.[i + 1] ?? (i + 1) / Math.max(allWords.length, 1);
    return { start, end };
  };
  const isWordActive = (i: number) => {
    const { start, end } = getWordTiming(i);
    const t = useAbsolute ? tSec : tFraction;
    return t >= start && t < end + 0.04;
  };

  let activeIdx = allWords.findIndex((_, i) => isWordActive(i));
  if (activeIdx === -1) {
    let latest = -1;
    for (let i = 0; i < allWords.length; i++) {
      const { start } = getWordTiming(i);
      const t = useAbsolute ? tSec : tFraction;
      if (t >= start) latest = i;
    }
    activeIdx = Math.max(latest, 0);
  }

  let currentPageIdx = 0;
  for (let p = 0; p < pages.length; p++) {
    if (pages[p].includes(activeIdx)) { currentPageIdx = p; break; }
    if (pages[p][pages[p].length - 1] < activeIdx) currentPageIdx = p + 1;
  }
  currentPageIdx = Math.min(currentPageIdx, pages.length - 1);
  const visibleIndices = pages[currentPageIdx] ?? [];

  const hlBg = highlightBg ?? color.brand.yellow;
  const hlText = highlightTextColor ?? color.outline;
  const hlBorder = highlightBorderColor ?? color.outline;
  const hlShadow = highlightShadowColor ?? color.outline;

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
      {visibleIndices.map((i) => {
        const w = allWords[i];
        const active = isWordActive(i);
        // Check if this word position falls within any emphasis phrase (multi-word match)
        const isEmphasized = (() => {
          if (!emphasis?.length) return false;
          const norm = (s: string) => s.replace(/[.,!?;:()«»"'\-–—]/g, '').toLowerCase().trim();
          const lcWord = norm(w);
          for (const phrase of emphasis) {
            const ws = phrase.split(/\s+/).map(norm).filter(Boolean);
            if (!ws.length) continue;
            // Try to match the phrase starting at any position covering index i
            for (let start = Math.max(0, i - ws.length + 1); start <= i; start++) {
              if (start + ws.length > allWords.length) continue;
              const seq = allWords.slice(start, start + ws.length).map(norm);
              if (seq.every((tok, k) => tok === ws[k])) return true;
            }
            // Also match single-word emphasis
            if (ws.length === 1 && ws[0] === lcWord) return true;
          }
          return false;
        })();
        if (active) {
          return (
            <span key={`${currentPageIdx}-${i}`} style={{
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
          <span key={`${currentPageIdx}-${i}`} style={{
            ...baseStyle,
            color: isEmphasized ? (emphasisColor ?? color.brand.yellow) : color.neutral[0],
            background: 'transparent',
            borderColor: 'transparent',
          }}>{w}</span>
        );
      })}
    </div>
  );
};
