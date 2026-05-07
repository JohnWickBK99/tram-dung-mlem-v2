// S10: Noodles & herbs — YẾU TỐ ③
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLOR, FONT, FW, BORDER, RADIUS, SHADOW, PILLAR_A } from './_theme';
import { PhotoBackdrop, useEntry, OutlineText } from './_chrome';

const herbs = ['xà lách', 'kinh giới', 'tía tô', 'húng láng'];

export const Scene10NoodlesHerbs: React.FC = () => {
  const frame = useCurrentFrame();
  const eyeb = useEntry(0, 14);
  const titlePop = useEntry(10, 11);
  const tailOp = interpolate(frame, [22, 38], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: PILLAR_A.light }}>
      <PhotoBackdrop src="visuals/bun-cha/S10.jpg" tint="rgba(78,195,209,0.20)" vignette={0.4} />

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 26 }}>
        <div style={{
          transform: `scale(${eyeb})`,
          background: COLOR.teal, color: COLOR.ink,
          border: `${BORDER.thick}px solid ${COLOR.outline}`,
          borderRadius: RADIUS.lg,
          padding: '16px 38px',
          boxShadow: SHADOW.stickerLg,
          fontFamily: FONT.display, fontWeight: 800,
          fontSize: 52, letterSpacing: 4,
          rotate: '-2deg',
        }}>YẾU TỐ ③ · BÚN & RAU</div>

        <div style={{ transform: `scale(${titlePop})` }}>
          <OutlineText size={200} color={COLOR.white} variant="hook" letterSpacing={-2} lineHeight={1}>
            BÚN RỐI
          </OutlineText>
        </div>

        <div style={{
          opacity: tailOp,
          fontFamily: FONT.heading, fontWeight: FW.bold,
          fontSize: 48, color: COLOR.ink,
        }}>+ rau sống tươi rói 🌿</div>

        <div style={{
          marginTop: 14, display: 'flex', flexWrap: 'wrap',
          gap: 16, justifyContent: 'center', maxWidth: 920,
        }}>
          {herbs.map((h, i) => {
            const op = interpolate(frame, [16 + i * 8, 24 + i * 8], [0, 1], { extrapolateRight: 'clamp' });
            const r = (i % 2 === 0 ? -1 : 1) * 2;
            return (
              <div key={h} style={{
                opacity: op, transform: `rotate(${r}deg)`,
                background: COLOR.cream, color: COLOR.ink,
                border: `${BORDER.base}px solid ${COLOR.outline}`,
                borderRadius: RADIUS.pill,
                padding: '16px 36px',
                boxShadow: SHADOW.stickerMd,
                fontFamily: FONT.heading, fontWeight: FW.extrabold,
                fontSize: 44,
              }}>{h}</div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
