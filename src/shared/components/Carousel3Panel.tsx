/**
 * Carousel3Panel — 3-row stacked panel carousel (handoff S10 style).
 * Big 140px outlined label centered per panel, ink divider between rows.
 */
import React from 'react';
import { AbsoluteFill, Img, useCurrentFrame } from 'remotion';
import theme from '../theme';

const { color, font } = theme;

export interface CarouselPanel {
  src: string;
  label: string;
  color: string;                         // label text color
  /** [startFrame, endFrame] when this panel is active */
  activeFrame: [number, number];
}

export const Carousel3Panel: React.FC<{
  panels: CarouselPanel[];
}> = ({ panels }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ flexDirection: 'column', background: color.outline }}>
      {panels.map((p, i) => {
        const active = f >= p.activeFrame[0] && f < p.activeFrame[1];
        return (
          <div
            key={i}
            style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              borderTop: i > 0 ? `8px solid ${color.outline}` : undefined,
              opacity: active ? 1.0 : 0.55,
              transform: active ? 'scale(1.0)' : 'scale(0.97)',
              transition: 'all 0.25s ease',
            }}
          >
            <Img
              src={p.src}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.55,
              }}
            />
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                fontFamily: font.family.display,
                fontWeight: 800,
                fontSize: 140,
                color: p.color,
                letterSpacing: -4,
                WebkitTextStroke: `6px ${color.outline}`,
                paintOrder: 'stroke fill' as const,
                textShadow: `0 8px 0 ${color.outline}`,
                padding: '20px 40px',
                whiteSpace: 'nowrap',
              }}
            >
              {p.label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
