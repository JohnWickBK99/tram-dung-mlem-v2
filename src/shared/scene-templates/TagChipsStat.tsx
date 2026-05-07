/**
 * TagChipsStat — Pattern 2 (Scene02-style sidewalk).
 *
 * Visual: BG photo + pillar.light + tint. 3-5 chips rotated row + HUGE stat box + outline subtitle + dim text.
 *
 * Example:
 *   <TagChipsStat
 *     pillar="a"
 *     chips={['ghế nhựa', 'vỉa hè', 'khói than']}
 *     stat="60K"
 *     subtitle="MỘT SUẤT BÚN CHẢ"
 *     dimText="≈ 2.5 đô la Mỹ"
 *     photoSrc="bunchaha/02_sidewalk.jpg"
 *     photoTint="rgba(255,224,168,0.45)"
 *   />
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import theme, { getPillar, type PillarKey } from '../theme';
import { PhotoBackdrop, OutlineText, Chip } from '../components';

const { color, font } = theme;

const useEntry = (delay: number, damping: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.8 } });
};

export const TagChipsStat: React.FC<{
  pillar?: PillarKey;
  chips: string[];          // ['ghế nhựa', 'vỉa hè', 'khói than']
  stat: string;             // '60K' or 'một trăm năm mươi nghìn' (Vbee đầy đủ)
  subtitle: string;         // 'MỘT SUẤT BÚN CHẢ'
  dimText?: string;         // '≈ 2.5 đô la Mỹ'
  photoSrc?: string;
  photoTint?: string;
  bgFlat?: string;          // override BG (default pillar.light)
  /** BG opacity 0..1 (default 0.5). Content luôn full opacity. */
  bgOpacity?: number;
}> = ({
  pillar = 'a',
  chips,
  stat,
  subtitle,
  dimText,
  photoSrc,
  photoTint,
  bgFlat,
  bgOpacity = 0.6,
}) => {
  const frame = useCurrentFrame();
  const tagOp = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: 'clamp' });
  const priceScale = useEntry(10, 12);
  const subOp = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' });
  const p = getPillar(pillar);

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {/* BG group dimmed */}
      <AbsoluteFill style={{ opacity: bgOpacity }}>
        <AbsoluteFill style={{ background: bgFlat ?? p.light }} />
      {photoSrc && (
        <PhotoBackdrop src={photoSrc} pillar={pillar} tint={photoTint} vignette={0.4} />
      )}
      </AbsoluteFill>

      <AbsoluteFill style={{
        alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 24,
      }}>
        {/* Chips row rotated */}
        <div style={{ display: 'flex', gap: 16, opacity: tagOp }}>
          {chips.map((t, i) => (
            <Chip key={t} variant="cream" size="md" rotate={(i - Math.floor(chips.length / 2)) * 3}>
              {t}
            </Chip>
          ))}
        </div>

        {/* HUGE stat box */}
        <div style={{
          transform: `scale(${priceScale})`,
          background: color.brand.yellow,
          border: `8px solid ${color.outline}`,
          borderRadius: 32,
          padding: '40px 80px',
          boxShadow: '20px 20px 0 0 #1A1A1A',
          fontFamily: font.family.mono,
          fontWeight: 700,
          fontSize: 240,
          color: color.outline,
          lineHeight: 0.9,
        }}>
          {stat}
        </div>

        {/* Outline subtitle */}
        <OutlineText size={56} color={color.neutral[0]} weight={700} family={font.family.heading} variant="body">
          {subtitle}
        </OutlineText>

        {/* Dim text optional */}
        {dimText && (
          <div style={{
            opacity: subOp,
            fontFamily: font.family.body,
            fontWeight: 500,
            fontSize: 36,
            color: color.brand.cream,
            letterSpacing: 4,
            WebkitTextStroke: `2px ${color.outline}`,
            paintOrder: 'stroke fill',
          }}>
            {dimText}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
