// S02: Sidewalk — ghế nhựa, vỉa hè, 60.000Đ
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLOR, FONT, FW, BORDER, RADIUS, SHADOW, PILLAR_A, outlineText } from './_theme';
import { PhotoBackdrop, useEntry, OutlineText } from './_chrome';

export const Scene02Sidewalk: React.FC = () => {
  const frame = useCurrentFrame();
  const taglineOp = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: 'clamp' });
  const priceScale = useEntry(10, 12);
  const subOp = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: PILLAR_A.light }}>
      <PhotoBackdrop src="visuals/bun-cha/S02.jpg" tint="rgba(255,224,168,0.45)" vignette={0.4} />

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24 }}>
        {/* tag chips row */}
        <div style={{ display: 'flex', gap: 16, opacity: taglineOp }}>
          {['ghế nhựa', 'vỉa hè', 'khói than'].map((t, i) => (
            <div key={t} style={{
              background: COLOR.cream, color: COLOR.ink,
              border: `${BORDER.base}px solid ${COLOR.outline}`,
              borderRadius: RADIUS.pill,
              padding: '12px 28px',
              boxShadow: SHADOW.stickerSm,
              fontFamily: FONT.heading, fontWeight: FW.bold, fontSize: 36,
              transform: `rotate(${(i - 1) * 3}deg)`,
            }}>{t}</div>
          ))}
        </div>

        {/* big price */}
        <div style={{
          transform: `scale(${priceScale})`,
          background: COLOR.yellow,
          border: `${BORDER.xthick}px solid ${COLOR.outline}`,
          borderRadius: RADIUS['2xl'],
          padding: '40px 80px',
          boxShadow: SHADOW.stickerXL,
          fontFamily: FONT.mono, fontWeight: 700,
          fontSize: 280, color: COLOR.ink, lineHeight: 0.9,
        }}>
          60K
        </div>

        <OutlineText size={56} color={COLOR.white} weight={700} family={FONT.heading} variant="body">
          MỘT SUẤT BÚN CHẢ
        </OutlineText>

        <div style={{
          opacity: subOp,
          fontFamily: FONT.body, fontWeight: FW.medium,
          fontSize: 36, color: COLOR.cream, letterSpacing: 4,
          ...outlineText('thin'),
        }}>
          ≈ 2.5 USD
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
