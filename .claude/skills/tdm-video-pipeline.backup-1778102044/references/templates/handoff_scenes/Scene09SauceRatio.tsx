// S09: Sauce ratio — YẾU TỐ ② TỈ LỆ VÀNG 1·1·1·4
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLOR, FONT, FW, BORDER, RADIUS, SHADOW, PILLAR_A } from './_theme';
import { PhotoBackdrop, useEntry } from './_chrome';

const items = [
  { k: 'MẮM', v: '1', bg: COLOR.yellow },
  { k: 'ĐƯỜNG', v: '1', bg: COLOR.cream },
  { k: 'GIẤM', v: '1', bg: COLOR.cream },
  { k: 'NƯỚC', v: '4', bg: COLOR.coral, white: true },
];

export const Scene09SauceRatio: React.FC = () => {
  const frame = useCurrentFrame();
  const eyebPop = useEntry(0, 14);
  const tailOp = interpolate(frame, [55, 75], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: COLOR.cream }}>
      <PhotoBackdrop src="visuals/bun-cha/S09.jpg" tint="rgba(255,244,224,0.55)" vignette={0.35} />

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 36 }}>
        <div style={{
          transform: `scale(${eyebPop})`,
          background: COLOR.yellow, color: COLOR.ink,
          border: `${BORDER.thick}px solid ${COLOR.outline}`,
          borderRadius: RADIUS.lg,
          padding: '16px 38px',
          boxShadow: SHADOW.stickerLg,
          fontFamily: FONT.display, fontWeight: 800,
          fontSize: 52, letterSpacing: 4,
          rotate: '-2deg',
        }}>YẾU TỐ ② · TỈ LỆ VÀNG</div>

        <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
          {items.map((it, i) => {
            const s = useEntry(8 + i * 6, 11);
            return (
              <div key={i} style={{
                width: 200, transform: `scale(${s})`,
                background: it.bg,
                color: it.white ? COLOR.white : COLOR.ink,
                border: `${BORDER.xthick}px solid ${COLOR.outline}`,
                borderRadius: RADIUS.xl,
                padding: '32px 0',
                boxShadow: SHADOW.stickerXL,
                textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: FONT.mono, fontWeight: 700,
                  fontSize: 180, lineHeight: 0.9,
                }}>{it.v}</div>
                <div style={{
                  fontFamily: FONT.heading, fontWeight: FW.extrabold,
                  fontSize: 36, letterSpacing: 4, marginTop: 14,
                }}>{it.k}</div>
              </div>
            );
          })}
        </div>

        <div style={{
          opacity: tailOp, marginTop: 20,
          fontFamily: FONT.heading, fontWeight: FW.bold,
          fontSize: 48, color: COLOR.ink, letterSpacing: 2,
        }}>
          + tỏi · ớt · <span style={{ background: COLOR.yellow, padding: '4px 14px', borderRadius: 6, border: `3px solid ${COLOR.outline}` }}>đu đủ xanh</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
