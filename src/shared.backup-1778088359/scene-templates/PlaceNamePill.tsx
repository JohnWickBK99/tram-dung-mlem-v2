/**
 * PlaceNamePill — Pattern 4 (Scene04-style old hà nội / địa danh).
 *
 * Visual: BG photo vintage + tint warm. HUGE outline place name + ink pill subtitle.
 *
 * Example:
 *   <PlaceNamePill
 *     pillar="b"
 *     placeName="HÀ NỘI"
 *     subtitle="BÚN CHẢ HÀ NỘI"
 *     photoSrc="bunchaha/04_old_hanoi.jpg"
 *     photoTint="rgba(184,120,8,0.40)"
 *   />
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import theme, { getPillar, type PillarKey } from '../theme';
import { PhotoBackdrop, OutlineText } from '../components';

const { color, font } = theme;

const useEntry = (delay: number, damping: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.8 } });
};

export const PlaceNamePill: React.FC<{
  pillar?: PillarKey;
  placeName: string;        // 'HÀ NỘI'
  subtitle?: string;        // 'BÚN CHẢ HÀ NỘI'
  placeNameSize?: number;   // default 240
  photoSrc?: string;
  photoTint?: string;
}> = ({
  pillar = 'a',
  placeName,
  subtitle,
  placeNameSize = 240,
  photoSrc,
  photoTint,
}) => {
  const namePop = useEntry(0, 12);
  const pillPop = useEntry(20, 12);
  const p = getPillar(pillar);

  return (
    <AbsoluteFill style={{ background: p.dark }}>
      {photoSrc && (
        <PhotoBackdrop src={photoSrc} pillar={pillar} tint={photoTint} vignette={0.5} />
      )}
      <AbsoluteFill style={{
        alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 30,
      }}>
        <div style={{ transform: `scale(${namePop})` }}>
          <OutlineText size={placeNameSize} color={color.brand.yellow} variant="hook" letterSpacing={-6}>
            {placeName}
          </OutlineText>
        </div>
        {subtitle && (
          <div style={{
            transform: `scale(${pillPop})`,
            background: color.outline,
            color: color.brand.yellow,
            border: `6px solid ${color.outline}`,
            borderRadius: 16,
            padding: '20px 44px',
            boxShadow: '14px 14px 0 0 #1A1A1A',
            fontFamily: font.family.heading,
            fontWeight: 800,
            fontSize: 42,
            letterSpacing: 4,
            textAlign: 'center',
          }}>
            {subtitle}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
