/**
 * GiantNumberYellow — Pattern 5 (Scene06-style 800-năm).
 * v1.10: bgOpacity 0.5 default.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import theme, { getPillar, type PillarKey } from '../theme';

const { color, font } = theme;

const useEntry = (delay: number, damping: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.8 } });
};

export const GiantNumberYellow: React.FC<{
  pillar?: PillarKey;
  number: string;
  unit?: string;
  attribution?: string;
  numberSize?: number;
  shadowColor?: string;
  bg?: string;
  /** BG opacity 0..1 (default 0.5). */
  bgOpacity?: number;
}> = ({
  pillar = 'a',
  number, unit, attribution,
  numberSize = 480, shadowColor, bg,
  bgOpacity = 0.5,
}) => {
  const numScale = useEntry(0, 11);
  const unitScale = useEntry(15, 12);
  const frame = useCurrentFrame();
  const attrOp = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: 'clamp' });
  const p = getPillar(pillar);
  const _shadow = shadowColor ?? color.brand.coral;

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ opacity: bgOpacity }}>
        <AbsoluteFill style={{ background: bg ?? color.brand.yellow }} />
        <AbsoluteFill style={{
          background: `radial-gradient(circle at 50% 50%, ${p.light} 0%, ${color.brand.yellow} 70%)`,
        }} />
      </AbsoluteFill>

      <AbsoluteFill style={{
        alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 30,
      }}>
        <div style={{
          transform: `scale(${numScale})`,
          fontFamily: font.family.display,
          fontWeight: 800,
          fontSize: numberSize,
          color: color.outline,
          lineHeight: 0.9,
          letterSpacing: -16,
          textShadow: `12px 12px 0 ${_shadow}`,
          whiteSpace: 'nowrap',
        }}>
          {number}
        </div>

        {unit && (
          <div style={{
            transform: `scale(${unitScale})`,
            background: color.brand.coral,
            color: color.neutral[0],
            border: `6px solid ${color.outline}`,
            borderRadius: 16,
            padding: '20px 50px',
            boxShadow: '14px 14px 0 0 #1A1A1A',
            fontFamily: font.family.display,
            fontWeight: 800,
            fontSize: 96,
            letterSpacing: 12,
          }}>
            {unit}
          </div>
        )}

        {attribution && (
          <div style={{
            opacity: attrOp,
            fontFamily: font.family.heading,
            fontWeight: 700,
            fontSize: 42,
            color: color.outline,
            letterSpacing: 2,
            marginTop: 30,
            textAlign: 'center',
          }}>
            {attribution}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
