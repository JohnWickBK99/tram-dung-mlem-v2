/**
 * FactPop — small fact card that pops in with chime.
 * Pair with sfx/chime-fact.mp3 + Audio in scene.
 */
import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import theme from '../theme';

const { color, font, border, radius, shadow } = theme;
const weight = font.weight;

export const FactPop: React.FC<{
  label?: string;          // small uppercase label trên top, default "FACT"
  value: string;           // value chính
  delay?: number;
  bg?: string;
  color?: string;
  rotate?: number;
}> = ({ label = 'FACT', value, delay = 0, bg = color.brand.cream, color: textColor = color.outline, rotate = -3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - delay, fps, config: { damping: 10, mass: 0.7 } });
  const scale = interpolate(sp, [0, 1], [0.6, 1.0], { extrapolateRight: 'clamp' });
  return (
    <div
      style={{
        background: bg,
        color: textColor,
        border: `${border.thick}px solid ${color.outline}`,
        borderRadius: radius.xl,
        boxShadow: shadow.stickerLg,
        padding: '24px 36px',
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        opacity: sp,
        fontFamily: font.family.heading,
        display: 'inline-block',
      }}
    >
      <div style={{ fontSize: 28, fontWeight: weight.bold, letterSpacing: 2, color: color.brand.coral }}>
        {label}
      </div>
      <div style={{ fontSize: 56, fontWeight: weight.extrabold, lineHeight: 1.1, marginTop: 4 }}>
        {value}
      </div>
    </div>
  );
};
