/**
 * HookRibbon — Pattern 1 (Scene01-style hook).
 * v1.10: bgOpacity 0.5 default — dim BG, content full opacity.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import theme, { getPillar, type PillarKey } from '../theme';
import { PhotoBackdrop, OutlineText, Chip } from '../components';

const { color, font } = theme;

const useEntry = (delay: number, damping: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.8 } });
};

export const HookRibbon: React.FC<{
  pillar?: PillarKey;
  eyebrow: string;
  title: string;
  tagline?: string;
  photoSrc?: string;
  photoTint?: string;
  vignette?: number;
  titleSize?: number;
  titleColor?: string;
  taglineRotate?: number;
  /** BG opacity 0..1 (default 0.5). Content luôn full opacity. */
  bgOpacity?: number;
}> = ({
  pillar = 'a',
  eyebrow, title, tagline,
  photoSrc, photoTint, vignette = 0.55,
  titleSize = 260, titleColor, taglineRotate = -2,
  bgOpacity = 0.6,
}) => {
  const ribbonPop = useEntry(28, 12);
  const titlePop = useEntry(0, 11);
  const subPop = useEntry(14, 14);
  const p = getPillar(pillar);
  const _titleColor = titleColor ?? color.brand.yellow;

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {/* BG group dimmed */}
      <AbsoluteFill style={{ opacity: bgOpacity }}>
        <AbsoluteFill style={{ background: p.dark }} />
        {photoSrc && (
          <PhotoBackdrop src={photoSrc} pillar={pillar} tint={photoTint} vignette={vignette} />
        )}
      </AbsoluteFill>

      {/* Content full opacity */}
      <AbsoluteFill style={{
        alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 30,
      }}>
        <div style={{ transform: `scale(${ribbonPop})` }}>
          <Chip variant="yellow" size="lg">{eyebrow}</Chip>
        </div>

        <div style={{ transform: `scale(${titlePop})` }}>
          <OutlineText size={titleSize} color={_titleColor} variant="hook" letterSpacing={-6} lineHeight={0.95}>
            {title}
          </OutlineText>
        </div>

        {tagline && (
          <div style={{
            transform: `scale(${subPop}) rotate(${taglineRotate}deg)`,
            background: color.outline,
            color: color.brand.yellow,
            border: `8px solid ${color.outline}`,
            borderRadius: 16,
            padding: '18px 40px',
            boxShadow: '14px 14px 0 0 #1A1A1A',
            fontFamily: font.family.display,
            fontWeight: 800,
            fontSize: 84,
            letterSpacing: 8,
            whiteSpace: 'nowrap',
          }}>
            {tagline}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
