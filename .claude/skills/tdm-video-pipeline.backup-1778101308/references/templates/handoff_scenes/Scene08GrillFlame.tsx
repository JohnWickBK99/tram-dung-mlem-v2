// S08: Grill flame — CHÁY CẠNH
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLOR, FONT, FW, BORDER, RADIUS, SHADOW, PILLAR_A, outlineText } from './_theme';
import { PhotoBackdrop, useEntry, OutlineText } from './_chrome';

export const Scene08GrillFlame: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + 0.04 * Math.sin(frame / 5);
  const titlePop = useEntry(0, 10);
  const subPop = useEntry(20, 14);
  const sticker = useEntry(34, 10);

  return (
    <AbsoluteFill style={{ background: COLOR.coral }}>
      <PhotoBackdrop src="visuals/bun-cha/S08.jpg" tint="rgba(232,93,47,0.50)" vignette={0.45} />

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 28 }}>
        <div style={{ transform: `scale(${titlePop * pulse})` }}>
          <OutlineText size={240} color={COLOR.yellow} variant="hook" letterSpacing={-4} lineHeight={0.95}>
            CHÁY CẠNH
          </OutlineText>
        </div>

        <div style={{
          transform: `scale(${subPop})`,
          background: COLOR.yellow, color: COLOR.ink,
          border: `${BORDER.thick}px solid ${COLOR.outline}`,
          borderRadius: RADIUS.lg,
          padding: '18px 46px',
          boxShadow: SHADOW.stickerLg,
          fontFamily: FONT.display, fontWeight: 800,
          fontSize: 84, letterSpacing: 6,
        }}>VÀNG RỘM</div>

        <div style={{
          transform: `scale(${sticker}) rotate(-6deg)`,
          background: COLOR.white, color: COLOR.coral,
          border: `${BORDER.base}px solid ${COLOR.outline}`,
          borderRadius: RADIUS.pill,
          padding: '12px 28px',
          boxShadow: SHADOW.stickerMd,
          fontFamily: FONT.heading, fontWeight: FW.extrabold,
          fontSize: 38, letterSpacing: 4,
        }}>🔥 HOT FACT</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
