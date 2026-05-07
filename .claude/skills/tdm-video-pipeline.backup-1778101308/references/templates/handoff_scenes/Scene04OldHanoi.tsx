// S04: Old Hanoi — phố cổ
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLOR, FONT, FW, BORDER, RADIUS, SHADOW, PILLAR_A } from './_theme';
import { PhotoBackdrop, useEntry, OutlineText } from './_chrome';

export const Scene04OldHanoi: React.FC = () => {
  const frame = useCurrentFrame();
  const e1 = useEntry(0, 14);
  const e2 = useEntry(10, 11);
  const e3 = useEntry(28, 14);

  return (
    <AbsoluteFill style={{ background: PILLAR_A.dark }}>
      <PhotoBackdrop src="visuals/bun-cha/S04.jpg" tint="rgba(184,120,8,0.40)" vignette={0.5} />

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 30 }}>
        <div style={{
          transform: `scale(${e1})`,
          background: COLOR.cream, color: COLOR.ink,
          border: `${BORDER.thick}px solid ${COLOR.outline}`,
          borderRadius: RADIUS.pill,
          padding: '14px 40px',
          boxShadow: SHADOW.stickerMd,
          fontFamily: FONT.heading, fontWeight: FW.extrabold,
          fontSize: 44, letterSpacing: 8, textTransform: 'uppercase',
        }}>📜 Phố cổ</div>

        <div style={{ transform: `scale(${e2})` }}>
          <OutlineText size={280} color={COLOR.yellow} variant="hook" letterSpacing={-6} lineHeight={0.95}>
            HÀ NỘI
          </OutlineText>
        </div>

        <div style={{
          transform: `scale(${e3})`,
          background: COLOR.outline, color: COLOR.yellow,
          border: `${BORDER.thick}px solid ${COLOR.outline}`,
          borderRadius: RADIUS.lg,
          padding: '20px 44px',
          boxShadow: SHADOW.stickerLg,
          fontFamily: FONT.heading, fontWeight: FW.extrabold,
          fontSize: 42, letterSpacing: 4, textAlign: 'center',
        }}>
          BẾP THAN HOA · GÁNH HÀNG RONG
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
