/**
 * GrillFlameCoral — Pattern 7 (Scene08-style nướng / hot/process).
 *
 * Visual: BG coral flat + photo overlay coral tint. HUGE outline yellow + sticker yellow + floating hot fact pill.
 *
 * Example:
 *   <GrillFlameCoral
 *     pillar="a"
 *     mainText="CHÁY CẠNH"
 *     stickerText="VÀNG RỘM"
 *     hotFact="🔥 200°C lửa than hoa"
 *     photoSrc="bunchaha/08_grill.jpg"
 *   />
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import theme, { type PillarKey } from '../theme';
import { PhotoBackdrop, OutlineText, Chip } from '../components';

const { color, font } = theme;

const useEntry = (delay: number, damping: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.8 } });
};

export const GrillFlameCoral: React.FC<{
  pillar?: PillarKey;
  mainText: string;         // 'CHÁY CẠNH'
  stickerText?: string;     // 'VÀNG RỘM'
  hotFact?: string;         // '🔥 200°C lửa than hoa'
  mainSize?: number;        // default 220
  photoSrc?: string;
  bg?: string;              // override default brand.coral
}> = ({
  pillar = 'a',
  mainText,
  stickerText,
  hotFact,
  mainSize = 220,
  photoSrc,
  bg,
}) => {
  const mainPop = useEntry(0, 11);
  const stickerPop = useEntry(15, 12);
  const factPop = useEntry(30, 14);
  return (
    <AbsoluteFill style={{ background: bg ?? color.brand.coral }}>
      {photoSrc && (
        <PhotoBackdrop src={photoSrc} pillar={pillar} tint="rgba(232,93,47,0.5)" vignette={0} />
      )}
      <AbsoluteFill style={{
        alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 30,
      }}>
        <div style={{ transform: `scale(${mainPop})` }}>
          <OutlineText size={mainSize} color={color.brand.yellow} variant="hook" letterSpacing={-4}>
            {mainText}
          </OutlineText>
        </div>
        {stickerText && (
          <div style={{
            transform: `scale(${stickerPop})`,
            background: color.brand.yellow,
            color: color.outline,
            border: `6px solid ${color.outline}`,
            borderRadius: 16,
            padding: '18px 46px',
            boxShadow: '14px 14px 0 0 #1A1A1A',
            fontFamily: font.family.display,
            fontWeight: 800,
            fontSize: 84,
            letterSpacing: 6,
          }}>
            {stickerText}
          </div>
        )}
      </AbsoluteFill>
      {hotFact && (
        <div style={{
          position: 'absolute',
          top: 600,
          right: 80,
          transform: `scale(${factPop}) rotate(-6deg)`,
        }}>
          <div style={{
            background: color.neutral[0],
            color: color.brand.coral,
            border: `4px solid ${color.outline}`,
            borderRadius: 999,
            padding: '12px 28px',
            boxShadow: '8px 8px 0 0 #1A1A1A',
            fontFamily: font.family.heading,
            fontWeight: 800,
            fontSize: 38,
            letterSpacing: 4,
            whiteSpace: 'nowrap',
          }}>
            {hotFact}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
