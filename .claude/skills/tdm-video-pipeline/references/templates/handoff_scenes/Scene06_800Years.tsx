// S06: 800 NĂM TUỔI — calligraphy stat
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLOR, FONT, FW, BORDER, RADIUS, SHADOW, PILLAR_A } from './_theme';
import { useEntry, OutlineText } from './_chrome';

export const Scene06_800Years: React.FC = () => {
  const frame = useCurrentFrame();
  const eyeb = useEntry(0, 14);
  const big = useEntry(8, 11);
  const sub = useEntry(24, 14);
  const quote = useEntry(40, 14);

  return (
    <AbsoluteFill style={{ background: COLOR.yellow }}>
      {/* radial paper texture */}
      <AbsoluteFill style={{
        background: `radial-gradient(circle at 50% 50%, ${PILLAR_A.light} 0%, ${COLOR.yellow} 70%)`,
      }} />

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24 }}>
        <div style={{
          transform: `scale(${eyeb})`,
          background: COLOR.outline, color: COLOR.yellow,
          border: `${BORDER.base}px solid ${COLOR.outline}`,
          borderRadius: RADIUS.pill,
          padding: '12px 32px',
          boxShadow: SHADOW.stickerMd,
          fontFamily: FONT.heading, fontWeight: FW.extrabold,
          fontSize: 38, letterSpacing: 8,
        }}>GẦN</div>

        <div style={{
          transform: `scale(${big})`,
          fontFamily: FONT.display, fontWeight: 800,
          fontSize: 580, color: COLOR.outline, lineHeight: 0.9,
          letterSpacing: -20,
          textShadow: `12px 12px 0 ${COLOR.coral}`,
        }}>800</div>

        <div style={{
          transform: `scale(${sub})`,
          background: COLOR.coral, color: COLOR.white,
          border: `${BORDER.thick}px solid ${COLOR.outline}`,
          borderRadius: RADIUS.lg,
          padding: '20px 50px',
          boxShadow: SHADOW.stickerLg,
          fontFamily: FONT.display, fontWeight: 800,
          fontSize: 96, letterSpacing: 12,
        }}>NĂM TUỔI</div>

        <div style={{
          opacity: quote, marginTop: 30,
          fontFamily: FONT.heading, fontWeight: FW.bold,
          fontSize: 42, color: COLOR.ink, letterSpacing: 2,
        }}>— Vũ Bằng</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
