/**
 * OutlineText — big text with chunky black outline + drop shadow.
 *
 * Production rules:
 *   - Outline 4-6px (variant: hook=6, body=4, thin=2)
 *   - Stat overlay MAX size 240px (KHÔNG 360+) — vượt là vỡ frame
 *   - letterSpacing default -2 cho hook size; cho stat dùng -4
 */
import React from 'react';
import theme from '../theme';

const { color, font } = theme;

export const OutlineText: React.FC<{
  size?: number;                              // px
  color?: string;
  family?: string;
  weight?: number;
  variant?: 'hook' | 'body' | 'thin';
  align?: 'left' | 'center' | 'right';
  letterSpacing?: number;
  lineHeight?: number;
  shadow?: boolean;
  stroke?: number;                            // override stroke px
  shadowSize?: number;                        // override shadow px
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({
  size = 140,
  color: colorProp = color.neutral[0],
  family = font.family.display,
  weight: weightProp = 800,
  variant = 'hook',
  align = 'center',
  letterSpacing = -2,
  lineHeight = 1.0,
  shadow = true,
  stroke,
  shadowSize,
  children,
  style,
}) => {
  const w = stroke ?? (variant === 'hook' ? 6 : variant === 'thin' ? 2 : 4);
  const ss = shadowSize ?? (variant === 'hook' ? 8 : 4);
  return (
    <div
      style={{
        fontFamily: family,
        fontWeight: weightProp,
        fontSize: size,
        lineHeight,
        letterSpacing,
        color: colorProp,
        textAlign: align,
        WebkitTextStroke: `${w}px ${color.outline}`,
        paintOrder: 'stroke fill',
        textShadow: shadow ? `0 ${ss}px 0 ${color.outline}` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
