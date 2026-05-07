/**
 * ChipCluster — Pattern 9 (Scene10-style noodles + herbs).
 *
 * Visual: BG pillar.light. Big outline title + "+xxx" heading + cluster of cream chips wrapped.
 *
 * Example:
 *   <ChipCluster
 *     pillar="a"
 *     mainText="BÚN RỐI"
 *     heading="+ rau sống"
 *     items={['kinh giới', 'tía tô', 'xà lách', 'húng quế', 'giá', 'ngò']}
 *     photoSrc="bunchaha/10_noodles.jpg"
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

export const ChipCluster: React.FC<{
  pillar?: PillarKey;
  mainText: string;         // 'BÚN RỐI'
  heading: string;          // '+ rau sống'
  items: string[];          // ['kinh giới', 'tía tô', ...]
  mainSize?: number;        // default 200
  photoSrc?: string;
  bg?: string;
  /** Dark overlay 0..1 trên BG (default 0). Dùng khi BG quá sáng — dim chữ trên rõ hơn. */
  darkMask?: number;
}> = ({
  pillar = 'a',
  mainText,
  heading,
  items,
  mainSize = 200,
  photoSrc,
  bg,
  darkMask = 0,
}) => {
  const mainPop = useEntry(0, 11);
  const headPop = useEntry(15, 12);
  const p = getPillar(pillar);

  return (
    <AbsoluteFill style={{ background: bg ?? p.light }}>
      {photoSrc && (
        <PhotoBackdrop src={photoSrc} pillar={pillar} tint="rgba(78,195,209,0.20)" vignette={0.2} />
      )}
      {darkMask > 0 && (
        <AbsoluteFill style={{ background: `rgba(0,0,0,${darkMask})`, pointerEvents: 'none' }} />
      )}

      <AbsoluteFill style={{
        alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 24,
      }}>
        <div style={{ transform: `scale(${mainPop})` }}>
          <OutlineText size={mainSize} color={color.neutral[0]} variant="hook" letterSpacing={-2}>
            {mainText}
          </OutlineText>
        </div>
        <div style={{
          transform: `scale(${headPop})`,
          fontFamily: font.family.heading,
          fontWeight: 700,
          fontSize: 48,
          color: color.outline,
        }}>{heading}</div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          justifyContent: 'center',
          maxWidth: 920,
          marginTop: 14,
        }}>
          {items.map((h, i) => {
            const chipPop = useEntry(20 + i * 4, 14);
            return (
              <div key={h} style={{ transform: `scale(${chipPop})` }}>
                <Chip variant="cream" size="md">{h}</Chip>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
