/**
 * RatioCells — Pattern 8 (Scene09-style công thức / tỉ lệ).
 *
 * Visual: BG cream flat + photo overlay cream tint. 3-5 cells (200px wide, border 8px, shadow 20px) + extras footer.
 *
 * Example:
 *   <RatioCells
 *     pillar="a"
 *     cells={[
 *       { num: '1', label: 'NƯỚC MẮM', variant: 'yellow' },
 *       { num: '1', label: 'ĐƯỜNG',    variant: 'cream' },
 *       { num: '3', label: 'NƯỚC',     variant: 'coral' },
 *     ]}
 *     extras="+ giấm + tỏi + ớt"
 *     extrasHighlight="ớt"
 *     photoSrc="bunchaha/09_sauce.jpg"
 *   />
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import theme, { type PillarKey } from '../theme';
import { PhotoBackdrop } from '../components';

const { color, font } = theme;

const useEntry = (delay: number, damping: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.8 } });
};

const CELL_VARIANTS: Record<string, { bg: string; fg: string }> = {
  yellow: { bg: '#F8B147', fg: '#1A1A1A' },
  cream:  { bg: '#FFF4E0', fg: '#1A1A1A' },
  coral:  { bg: '#E85D2F', fg: '#FFFFFF' },
  teal:   { bg: '#4FC3D1', fg: '#1A1A1A' },
  ink:    { bg: '#1A1A1A', fg: '#F8B147' },
};

export interface RatioCell {
  num: string;
  label: string;
  variant: 'yellow' | 'cream' | 'coral' | 'teal' | 'ink';
}

export const RatioCells: React.FC<{
  pillar?: PillarKey;
  cells: RatioCell[];       // 3-5 cells
  extras?: string;          // '+ giấm + tỏi + ớt'
  extrasHighlight?: string; // 'ớt' — phần inline yellow highlight
  photoSrc?: string;
  bg?: string;              // default cream
  /** BG opacity 0..1 (default 0.5). Content luôn full opacity. */
  bgOpacity?: number;
}> = ({
  pillar = 'a',
  cells,
  extras,
  extrasHighlight,
  photoSrc,
  bg,
  bgOpacity = 0.5,
}) => {
  const frame = useCurrentFrame();
  const extrasOp = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {/* BG group dimmed */}
      <AbsoluteFill style={{ opacity: bgOpacity }}>
        <AbsoluteFill style={{ background: bg ?? color.brand.cream }} />
      {photoSrc && (
        <PhotoBackdrop src={photoSrc} pillar={pillar} tint="rgba(255,244,224,0.55)" vignette={0} />
      )}
      </AbsoluteFill>

      <AbsoluteFill style={{
        alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 30,
      }}>
        <div style={{ display: 'flex', gap: 24 }}>
          {cells.map((c, i) => {
            const v = CELL_VARIANTS[c.variant];
            const cellPop = useEntry(i * 6, 12);
            return (
              <div key={i} style={{
                transform: `scale(${cellPop})`,
                width: 200,
                padding: '32px 0',
                background: v.bg,
                color: v.fg,
                border: `8px solid ${color.outline}`,
                borderRadius: 24,
                boxShadow: '20px 20px 0 0 #1A1A1A',
                textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: font.family.mono,
                  fontWeight: 700,
                  fontSize: 180,
                  lineHeight: 0.9,
                }}>{c.num}</div>
                <div style={{
                  fontFamily: font.family.heading,
                  fontWeight: 800,
                  fontSize: 36,
                  letterSpacing: 4,
                  marginTop: 14,
                }}>{c.label}</div>
              </div>
            );
          })}
        </div>
        {extras && (
          <div style={{
            opacity: extrasOp,
            fontFamily: font.family.heading,
            fontWeight: 700,
            fontSize: 48,
            color: color.outline,
            marginTop: 20,
            letterSpacing: 2,
          }}>
            {extrasHighlight && extras.includes(extrasHighlight)
              ? extras.split(extrasHighlight).map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span style={{
                        background: color.brand.yellow,
                        padding: '4px 14px',
                        borderRadius: 6,
                        border: `3px solid ${color.outline}`,
                      }}>{extrasHighlight}</span>
                    )}
                  </React.Fragment>
                ))
              : extras}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
