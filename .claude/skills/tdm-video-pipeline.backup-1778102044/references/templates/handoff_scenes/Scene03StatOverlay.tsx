// S03: Stat overlay — 13.000 KM
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLOR, FONT, FW, BORDER, RADIUS, SHADOW, PILLAR_A } from './_theme';
import { useEntry, OutlineText } from './_chrome';

export const Scene03StatOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const eyeb = useEntry(0, 14);
  const stat = useEntry(8, 12);
  const unit = useEntry(20, 14);
  const lineGrow = interpolate(frame, [24, 50], [0, 1], { extrapolateRight: 'clamp' });
  const tail = useEntry(40, 14);

  return (
    <AbsoluteFill style={{ background: COLOR.outline }}>
      {/* radial glow */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at center, ${PILLAR_A.dark} 0%, ${COLOR.outline} 70%)`,
      }} />

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 28 }}>
        <div style={{
          transform: `scale(${eyeb})`,
          background: COLOR.yellow, color: COLOR.ink,
          border: `${BORDER.base}px solid ${COLOR.outline}`,
          borderRadius: RADIUS.pill,
          padding: '12px 32px',
          boxShadow: SHADOW.stickerMd,
          fontFamily: FONT.heading, fontWeight: FW.extrabold,
          fontSize: 36, letterSpacing: 6, textTransform: 'uppercase',
        }}>BAY ✈</div>

        <div style={{
          transform: `scale(${stat})`,
          fontFamily: FONT.mono, fontWeight: 700,
          fontSize: 360, color: COLOR.yellow, lineHeight: 0.9,
          letterSpacing: -10,
          textShadow: `0 12px 0 ${COLOR.outline}`,
          WebkitTextStroke: `8px ${COLOR.outline}`,
          paintOrder: 'stroke fill',
        }}>13.000</div>

        <div style={{
          transform: `scale(${unit})`,
          background: COLOR.coral, color: COLOR.white,
          border: `${BORDER.thick}px solid ${COLOR.outline}`,
          borderRadius: RADIUS.lg,
          padding: '14px 42px',
          boxShadow: SHADOW.stickerLg,
          fontFamily: FONT.display, fontWeight: 800,
          fontSize: 88, letterSpacing: 6,
        }}>KILOMET</div>

        <div style={{
          width: 600, height: 8, background: COLOR.yellow,
          transform: `scaleX(${lineGrow})`, transformOrigin: 'left center',
          marginTop: 20,
        }} />

        <div style={{
          opacity: tail,
          fontFamily: FONT.heading, fontWeight: FW.bold,
          fontSize: 56, color: COLOR.cream, letterSpacing: 2,
        }}>
          800 năm <span style={{ background: COLOR.yellow, color: COLOR.ink, padding: '4px 12px', borderRadius: 6 }}>khói than</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
