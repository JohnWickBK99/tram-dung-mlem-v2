/**
 * Chip v1.4 — sticker pill (handoff style).
 * Variants: cream/yellow/coral/teal/ink. Sizes: sm/md/lg.
 */
import React from 'react';
import theme from '../theme';

const { color, font } = theme;

export type ChipVariant = 'cream' | 'yellow' | 'coral' | 'teal' | 'ink';
export type ChipSize = 'sm' | 'md' | 'lg';

const VARIANTS: Record<ChipVariant, { bg: string; fg: string }> = {
  cream:  { bg: color.brand.cream,  fg: color.outline },
  yellow: { bg: color.brand.yellow, fg: color.outline },
  coral:  { bg: color.brand.coral,  fg: color.neutral[0] },
  teal:   { bg: color.brand.teal,   fg: color.outline },
  ink:    { bg: color.outline,      fg: color.brand.yellow },
};

const SIZES: Record<ChipSize, { fontSize: number; padding: string; shadow: string; border: number }> = {
  sm: { fontSize: 28, padding: '10px 22px', shadow: '4px 4px 0 0 #1A1A1A',   border: 3 },
  md: { fontSize: 36, padding: '14px 32px', shadow: '8px 8px 0 0 #1A1A1A',   border: 4 },
  lg: { fontSize: 52, padding: '16px 38px', shadow: '14px 14px 0 0 #1A1A1A', border: 6 },
};

export const Chip: React.FC<{
  variant?: ChipVariant;
  size?: ChipSize;
  rotate?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ variant = 'cream', size = 'md', rotate = 0, style, children }) => {
  const v = VARIANTS[variant];
  const s = SIZES[size];
  return (
    <span style={{
      background: v.bg, color: v.fg,
      border: `${s.border}px solid ${color.outline}`,
      borderRadius: 999, boxShadow: s.shadow, padding: s.padding,
      fontFamily: font.family.heading, fontWeight: font.weight.extrabold,
      fontSize: s.fontSize, display: 'inline-block',
      transform: rotate ? `rotate(${rotate}deg)` : undefined,
      whiteSpace: 'nowrap', ...style,
    }}>{children}</span>
  );
};
