// S14: CTA — FOLLOW Trạm Dừng Mlem
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLOR, FONT, FW, BORDER, RADIUS, SHADOW, PILLAR_A } from './_theme';
import { useEntry, OutlineText } from './_chrome';

export const Scene14CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const eyeb = useEntry(0, 14);
  const big = useEntry(8, 10);
  const cta = useEntry(22, 11);
  const sub = useEntry(38, 14);
  const heart = 1 + 0.06 * Math.sin(frame / 8);

  return (
    <AbsoluteFill style={{ background: COLOR.yellow }}>
      {/* offset blocks bg pattern */}
      <AbsoluteFill style={{
        background: `repeating-linear-gradient(45deg, ${COLOR.yellow} 0 60px, ${PILLAR_A.light} 60px 120px)`,
        opacity: 0.5,
      }} />

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 26 }}>
        <div style={{
          transform: `scale(${eyeb})`,
          background: COLOR.outline, color: COLOR.yellow,
          border: `${BORDER.base}px solid ${COLOR.outline}`,
          borderRadius: RADIUS.pill,
          padding: '14px 40px',
          boxShadow: SHADOW.stickerMd,
          fontFamily: FONT.heading, fontWeight: FW.extrabold,
          fontSize: 44, letterSpacing: 6, textTransform: 'uppercase',
        }}>NẾU BẠN THẤY NGON 😋</div>

        <div style={{ transform: `scale(${big})` }}>
          <OutlineText size={260} color={COLOR.coral} variant="hook" letterSpacing={-6} lineHeight={0.95}>
            FOLLOW
          </OutlineText>
        </div>

        <div style={{
          transform: `scale(${cta * heart})`,
          background: COLOR.coral, color: COLOR.white,
          border: `${BORDER.xthick}px solid ${COLOR.outline}`,
          borderRadius: RADIUS.pill,
          padding: '28px 64px',
          boxShadow: SHADOW.stickerXL,
          fontFamily: FONT.display, fontWeight: 800,
          fontSize: 76, letterSpacing: 4, textTransform: 'uppercase',
        }}>Trạm Dừng Mlem</div>

        <div style={{
          opacity: sub, marginTop: 16,
          fontFamily: FONT.heading, fontWeight: FW.bold,
          fontSize: 46, color: COLOR.ink, letterSpacing: 2,
        }}>
          một <span style={{ background: COLOR.outline, color: COLOR.yellow, padding: '4px 14px', borderRadius: 6 }}>món ngon</span> mỗi ngày
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
