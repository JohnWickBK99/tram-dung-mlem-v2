// S07: Meat marinade list — yếu tố ① THỊT
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLOR, FONT, FW, BORDER, RADIUS, SHADOW, PILLAR_A } from './_theme';
import { PhotoBackdrop, useEntry, OutlineText } from './_chrome';

const items = [
  { label: 'vai gáy', emp: false },
  { label: '7 nạc · 3 mỡ', emp: true },
  { label: 'mắm cốt', emp: false },
  { label: 'hành tím', emp: false },
  { label: 'mật mía', emp: false },
];

export const Scene07MeatMarinade: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: PILLAR_A.dark }}>
      <PhotoBackdrop src="visuals/bun-cha/S07.jpg" tint="rgba(40,8,8,0.55)" vignette={0.5} />

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 220, flexDirection: 'column', gap: 22 }}>
        {/* eyebrow */}
        <div style={{
          background: COLOR.yellow, color: COLOR.ink,
          border: `${BORDER.thick}px solid ${COLOR.outline}`,
          borderRadius: RADIUS.lg,
          padding: '16px 38px',
          boxShadow: SHADOW.stickerLg,
          fontFamily: FONT.display, fontWeight: 800,
          fontSize: 56, letterSpacing: 4,
          rotate: '-2deg',
        }}>YẾU TỐ ① · THỊT</div>

        <div style={{ height: 30 }} />

        {items.map((it, i) => {
          const op = interpolate(frame, [i * 10, i * 10 + 14], [0, 1], { extrapolateRight: 'clamp' });
          const x = interpolate(frame, [i * 10, i * 10 + 14], [-60, 0], { extrapolateRight: 'clamp' });
          return (
            <div key={i} style={{
              opacity: op, transform: `translateX(${x}px)`,
              background: it.emp ? COLOR.yellow : COLOR.cream,
              color: COLOR.ink,
              border: `${BORDER.thick}px solid ${COLOR.outline}`,
              borderRadius: RADIUS.lg,
              padding: it.emp ? '24px 52px' : '18px 40px',
              boxShadow: it.emp ? SHADOW.stickerXL : SHADOW.stickerMd,
              fontFamily: FONT.display, fontWeight: 800,
              fontSize: it.emp ? 110 : 72, letterSpacing: -1,
              rotate: it.emp ? '0deg' : `${(i % 2 === 0 ? -1 : 1) * 1.5}deg`,
            }}>
              {it.label}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
