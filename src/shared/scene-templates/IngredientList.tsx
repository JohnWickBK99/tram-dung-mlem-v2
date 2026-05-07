/**
 * IngredientList — Pattern 6 (Scene07-style nguyên liệu).
 *
 * Visual: BG photo dim. Column gap 22 với mix các ingredient pills (1 yellow LG emphasized + cream md/sm).
 *
 * Example:
 *   <IngredientList
 *     pillar="a"
 *     items={[
 *       { text: 'Ba chỉ', size: 'md' },
 *       { text: 'MẮM NÊM', size: 'lg', emphasized: true },
 *       { text: 'Tỏi', size: 'md' },
 *       { text: 'Đường', size: 'md' },
 *       { text: 'Nước mắm', size: 'sm' },
 *     ]}
 *     photoSrc="bunchaha/07_meat.jpg"
 *     photoTint="rgba(40,8,8,0.55)"
 *   />
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import theme, { getPillar, type PillarKey } from '../theme';
import { PhotoBackdrop, Chip, type ChipSize, type ChipVariant } from '../components';

void theme;

const useEntry = (delay: number, damping: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.8 } });
};

export interface IngredientItem {
  text: string;
  size?: ChipSize;
  variant?: ChipVariant;
  emphasized?: boolean;     // shorthand: emphasized → variant=yellow size=lg
}

export const IngredientList: React.FC<{
  pillar?: PillarKey;
  items: IngredientItem[];
  photoSrc?: string;
  photoTint?: string;
  vignette?: number;
  /** BG opacity 0..1 (default 0.5). Content luôn full opacity. */
  bgOpacity?: number;
}> = ({
  pillar = 'a',
  items,
  photoSrc,
  photoTint,
  vignette = 0.45,
  bgOpacity = 0.6,
}) => {
  const p = getPillar(pillar);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {/* BG group dimmed */}
      <AbsoluteFill style={{ opacity: bgOpacity }}>
        <AbsoluteFill style={{ background: p.dark }} />
      {photoSrc && (
        <PhotoBackdrop src={photoSrc} pillar={pillar} tint={photoTint} vignette={vignette} />
      )}
      </AbsoluteFill>

      <AbsoluteFill style={{
        alignItems: 'center', justifyContent: 'flex-start',
        flexDirection: 'column', gap: 22,
        paddingTop: 280, paddingBottom: 280,
      }}>
        {items.map((item, i) => {
          const variant = item.emphasized ? 'yellow' : (item.variant ?? 'cream');
          const size = item.emphasized ? 'lg' : (item.size ?? 'md');
          const popScale = useEntry(i * 5, 12);
          return (
            <div key={i} style={{ transform: `scale(${popScale})` }}>
              <Chip variant={variant} size={size}>{item.text}</Chip>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
