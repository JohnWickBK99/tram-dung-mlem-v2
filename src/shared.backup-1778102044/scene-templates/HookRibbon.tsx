/**
 * HookRibbon — Pattern 1 (Scene01-style hook).
 *
 * Visual: BG photo + pillar.dark + tint. Yellow chip eyebrow + HUGE outline title + sticker tagline.
 *
 * Use cho scene 0-3s opening hook clip — món + địa danh + tagline punch.
 *
 * Example:
 *   <HookRibbon
 *     pillar="b"
 *     eyebrow="⚡ An Giang · 30 năm"
 *     title="CHUỘT ĐỒNG"
 *     tagline="NƯỚNG LU"
 *     photoSrc="chuotdong/01_hook.jpg"
 *     photoTint="rgba(122,22,20,0.35)"
 *   />
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
  eyebrow: string;          // "⚡ Hà Nội · 800 năm"
  title: string;            // "BÚN CHẢ"
  tagline?: string;         // "KHÓI THAN" — optional
  photoSrc?: string;        // staticFile path
  photoTint?: string;       // rgba(...)
  vignette?: number;
  /** Title size px (default 260). Tăng/giảm theo độ dài text. */
  titleSize?: number;
  titleColor?: string;
  /** Tagline rotate deg (default -2). */
  taglineRotate?: number;
}> = ({
  pillar = 'a',
  eyebrow,
  title,
  tagline,
  photoSrc,
  photoTint,
  vignette = 0.55,
  titleSize = 260,
  titleColor,
  taglineRotate = -2,
}) => {
  const ribbonPop = useEntry(28, 12);
  const titlePop = useEntry(0, 11);
  const subPop = useEntry(14, 14);
  const p = getPillar(pillar);
  const _titleColor = titleColor ?? color.brand.yellow;

  return (
    <AbsoluteFill style={{ background: p.dark }}>
      {photoSrc && (
        <PhotoBackdrop src={photoSrc} pillar={pillar} tint={photoTint} vignette={vignette} />
      )}
      <AbsoluteFill style={{
        alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 30,
      }}>
        {/* Yellow ribbon eyebrow */}
        <div style={{ transform: `scale(${ribbonPop})` }}>
          <Chip variant="yellow" size="lg">
            {eyebrow}
          </Chip>
        </div>

        {/* Huge title */}
        <div style={{ transform: `scale(${titlePop})` }}>
          <OutlineText size={titleSize} color={_titleColor} variant="hook" letterSpacing={-6} lineHeight={0.95}>
            {title}
          </OutlineText>
        </div>

        {/* Sticker tagline (optional) */}
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
