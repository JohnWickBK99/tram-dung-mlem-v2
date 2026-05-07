/**
 * StatOverlayInk — Pattern 3 (Scene03-style stat scene BG ink).
 *
 * Visual: BG ink + radial glow pillar.dark + giant mono stat 300px + KM pill + tail text.
 *
 * Example:
 *   <StatOverlayInk
 *     pillar="b"
 *     stat="5000"
 *     unit="KG/NGÀY"
 *     unitColor="#E85D2F"
 *     tailText="bán tại chợ Phù Dật"
 *     tailHighlight="Phù Dật"
 *   />
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

export const StatOverlayInk: React.FC<{
  pillar?: PillarKey;
  stat: string;             // '5000' / '800'
  unit?: string;            // 'KG/NGÀY' / 'NĂM TUỔI'
  unitColor?: string;       // default coral
  tailText?: string;        // 'bán tại chợ Phù Dật'
  tailHighlight?: string;   // 'Phù Dật' — phần highlight vàng inline trong tail
  statColor?: string;       // default brand yellow
  /** BG opacity 0..1 (default 0.5). Content luôn full opacity. */
  bgOpacity?: number;
}> = ({
  pillar = 'a',
  stat,
  unit,
  unitColor,
  tailText,
  tailHighlight,
  statColor,
  bgOpacity = 0.5,
}) => {
  const statScale = useEntry(0, 12);
  const unitScale = useEntry(14, 12);
  const frame = useCurrentFrame();
  const tailOp = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' });
  const p = getPillar(pillar);
  const _statColor = statColor ?? color.brand.yellow;
  const _unitColor = unitColor ?? color.brand.coral;

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {/* BG group dimmed */}
      <AbsoluteFill style={{ opacity: bgOpacity }}>
        <AbsoluteFill style={{ background: color.outline }} />
      {/* Radial glow */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at center, ${p.dark} 0%, ${color.outline} 70%)`,
      }} />
      </AbsoluteFill>

      <AbsoluteFill style={{
        alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 30,
      }}>
        {/* Giant stat */}
        <div style={{
          transform: `scale(${statScale})`,
          fontFamily: font.family.mono,
          fontWeight: 700,
          fontSize: 300,
          color: _statColor,
          lineHeight: 0.9,
          letterSpacing: -10,
          textShadow: `0 12px 0 ${color.outline}`,
          WebkitTextStroke: `8px ${color.outline}`,
          paintOrder: 'stroke fill',
          whiteSpace: 'nowrap',
        }}>
          {stat}
        </div>

        {/* Unit pill */}
        {unit && (
          <div style={{
            transform: `scale(${unitScale})`,
            background: _unitColor,
            color: color.neutral[0],
            border: `6px solid ${color.outline}`,
            borderRadius: 16,
            padding: '14px 42px',
            boxShadow: '14px 14px 0 0 #1A1A1A',
            fontFamily: font.family.display,
            fontWeight: 800,
            fontSize: 88,
            letterSpacing: 6,
          }}>
            {unit}
          </div>
        )}

        {/* Yellow grow line */}
        <div style={{ width: 600, height: 8, background: color.brand.yellow }} />

        {/* Tail text */}
        {tailText && (
          <div style={{
            opacity: tailOp,
            fontFamily: font.family.heading,
            fontWeight: 700,
            fontSize: 56,
            color: color.brand.cream,
            letterSpacing: 2,
            textAlign: 'center',
          }}>
            {tailHighlight && tailText.includes(tailHighlight)
              ? tailText.split(tailHighlight).map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span style={{
                        background: color.brand.yellow,
                        color: color.outline,
                        padding: '4px 12px',
                        borderRadius: 6,
                      }}>{tailHighlight}</span>
                    )}
                  </React.Fragment>
                ))
              : tailText}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
