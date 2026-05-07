/**
 * StatOverlay — large mono number with outline + shadow.
 * MAX size 240px (production tested). letterSpacing -4. stroke 6.
 */
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import theme from '../theme';

const { color, font } = theme;

export const StatOverlay: React.FC<{
  value: string;          // "150K", "30 PHÚT"
  size?: number;          // px, MAX 240
  color?: string;
  delay?: number;         // frames
  centerY?: string | number;
}> = ({ value, size = 240, color: colorProp = color.brand.yellow, delay = 0, centerY = '50%' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - delay, fps, config: { damping: 12, mass: 0.8 } });
  const scale = interpolate(sp, [0, 1], [0.5, 1.0], { extrapolateRight: 'clamp' });
  const _size = Math.min(size, 240);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          top: centerY,
          left: 0,
          right: 0,
          textAlign: 'center',
          transform: `translateY(-50%) scale(${scale})`,
          opacity: sp,
          fontFamily: font.family.mono,
          fontWeight: 600,
          fontSize: _size,
          color: colorProp,
          letterSpacing: -4,
          WebkitTextStroke: `6px ${color.outline}`,
          paintOrder: 'stroke fill',
          textShadow: `0 10px 0 ${color.outline}`,
        }}
      >
        {value}
      </div>
    </AbsoluteFill>
  );
};
