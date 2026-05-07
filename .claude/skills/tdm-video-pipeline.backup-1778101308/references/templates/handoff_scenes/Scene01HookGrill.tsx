// S01: Hook — BÚN CHẢ title with grill flame
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLOR, FONT, FW, BORDER, RADIUS, SHADOW, outlineText, PILLAR_A } from './_theme';
import { PhotoBackdrop, useEntry, OutlineText } from './_chrome';

export const Scene01HookGrill: React.FC = () => {
  const frame = useCurrentFrame();
  const titlePop = useEntry(0, 11);
  const subPop = useEntry(14, 14);
  const ribbonPop = useEntry(28, 12);

  return (
    <AbsoluteFill style={{ background: PILLAR_A.dark }}>
      <PhotoBackdrop src="visuals/bun-cha/S01.jpg" tint="rgba(184,120,8,0.35)" vignette={0.55} />

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 30 }}>
        {/* Yellow ribbon eyebrow */}
        <div style={{
          background: COLOR.yellow, color: COLOR.ink,
          border: `${BORDER.thick}px solid ${COLOR.outline}`,
          borderRadius: RADIUS.pill,
          padding: '14px 36px',
          boxShadow: SHADOW.stickerMd,
          fontFamily: FONT.heading, fontWeight: FW.extrabold,
          fontSize: 38, letterSpacing: 4, textTransform: 'uppercase',
          transform: `scale(${ribbonPop})`,
        }}>
          ⚡ Hà Nội · 800 năm
        </div>

        <div style={{ transform: `scale(${titlePop})` }}>
          <OutlineText size={260} color={COLOR.yellow} variant="hook" letterSpacing={-6} lineHeight={0.95}>
            BÚN CHẢ
          </OutlineText>
        </div>

        <div style={{
          transform: `scale(${subPop})`,
          background: COLOR.outline, color: COLOR.yellow,
          border: `${BORDER.thick}px solid ${COLOR.outline}`,
          borderRadius: RADIUS.lg,
          padding: '18px 40px',
          boxShadow: SHADOW.stickerLg,
          fontFamily: FONT.display, fontWeight: 800,
          fontSize: 84, letterSpacing: 8,
          rotate: '-2deg',
        }}>
          KHÓI THAN
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
