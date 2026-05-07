/**
 * ShopCard — Pattern 10 (Scene11/12/13-style shop feature).
 *
 * Visual: BG photo dark. 880px wide cream card + number circle + name + address pill + tag + corner stamp.
 *
 * Example:
 *   <ShopCard
 *     pillar="a"
 *     number="1"
 *     numberBg="#F8B147"
 *     name="BÚN CHẢ HƯƠNG LIÊN"
 *     address="24 Lê Văn Hưu"
 *     tagText="ai cũng biết"
 *     stamp="TOP 1"
 *     photoSrc="bunchaha/11_shop1.jpg"
 *   />
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import theme, { type PillarKey } from '../theme';
import { PhotoBackdrop } from '../components';

const { color, font } = theme;

const useEntry = (delay: number, damping: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.8 } });
};

export const ShopCard: React.FC<{
  pillar?: PillarKey;
  number: string;           // '1' / '2' / '3'
  numberBg?: string;        // default brand.yellow
  name: string;             // 'BÚN CHẢ HƯƠNG LIÊN'
  address?: string;         // '24 Lê Văn Hưu'
  tagText?: string;         // 'ai cũng biết'
  stamp?: string;           // 'TOP 1' — corner stamp coral rotate 12deg
  nameSize?: number;        // default 130
  photoSrc?: string;
  /** BG opacity 0..1 (default 0.5). Content luôn full opacity. */
  bgOpacity?: number;
}> = ({
  pillar = 'a',
  number,
  numberBg,
  name,
  address,
  tagText,
  stamp,
  nameSize = 130,
  photoSrc,
  bgOpacity = 0.6,
}) => {
  const cardPop = useEntry(0, 12);
  const stampPop = useEntry(20, 14);

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {/* BG group dimmed */}
      <AbsoluteFill style={{ opacity: bgOpacity }}>
        <AbsoluteFill style={{ background: '#5C5443' }} />
      {photoSrc && (
        <PhotoBackdrop src={photoSrc} pillar={pillar} tint="rgba(0,0,0,0.45)" vignette={0.3} />
      )}
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          transform: `scale(${cardPop})`,
          position: 'relative',
          width: 880,
          padding: '60px 50px 50px',
          background: color.brand.cream,
          color: color.outline,
          border: `8px solid ${color.outline}`,
          borderRadius: 32,
          boxShadow: '20px 20px 0 0 #1A1A1A',
          textAlign: 'center',
        }}>
          {/* Number circle */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 120, height: 120, borderRadius: '50%',
            background: numberBg ?? color.brand.yellow,
            border: `6px solid ${color.outline}`,
            boxShadow: '8px 8px 0 0 #1A1A1A',
            fontFamily: font.family.display, fontWeight: 800, fontSize: 80,
            color: color.neutral[0],
            marginBottom: 30,
          }}>
            {number}
          </div>

          {/* Name */}
          <div style={{
            fontFamily: font.family.display, fontWeight: 800,
            fontSize: nameSize, lineHeight: 1.0, letterSpacing: -2,
          }}>{name}</div>

          {/* Address pill */}
          {address && (
            <div style={{
              marginTop: 24,
              display: 'inline-flex', gap: 8, alignItems: 'center',
              background: color.brand.yellow,
              border: `4px solid ${color.outline}`,
              borderRadius: 999,
              padding: '12px 28px',
              boxShadow: '4px 4px 0 0 #1A1A1A',
              fontFamily: font.family.heading, fontWeight: 700,
              fontSize: 40,
            }}>
              📍 {address}
            </div>
          )}

          {/* Tag */}
          {tagText && (
            <div style={{
              marginTop: 22,
              fontFamily: font.family.heading, fontWeight: 700,
              fontSize: 38,
              color: '#5C5443',
            }}>{tagText}</div>
          )}

          {/* Corner stamp */}
          {stamp && (
            <div style={{
              position: 'absolute', top: -30, right: -40,
              transform: `scale(${stampPop}) rotate(12deg)`,
              background: color.brand.coral,
              color: color.neutral[0],
              border: `6px solid ${color.outline}`,
              borderRadius: 999,
              padding: '14px 28px',
              boxShadow: '8px 8px 0 0 #1A1A1A',
              fontFamily: font.family.display, fontWeight: 800, fontSize: 40,
              letterSpacing: 2,
            }}>{stamp}</div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
