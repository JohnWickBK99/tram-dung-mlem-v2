/**
 * Carousel3Panel — vertical 3-panel carousel.
 * Used in clip 04 S06b (3 cuộc so sánh quốc tế). Active panel scales 1.05 + colored border.
 */
import React from 'react';
import { AbsoluteFill, Img, useCurrentFrame } from 'remotion';
import theme from '../theme';

const { color, font, border, radius } = theme;
const weight = font.weight;

export interface CarouselPanel {
  src: string;                            // staticFile() URL
  label: string;
  color: string;
  /** [startFrame, endFrame] when this panel is active */
  activeFrame: [number, number];
}

export const Carousel3Panel: React.FC<{
  panels: CarouselPanel[];
  gap?: number;
  panelHeight?: number;
}> = ({ panels, gap = 30, panelHeight = 480 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap,
        padding: 80,
      }}
    >
      {panels.map((p, i) => {
        const active = f >= p.activeFrame[0] && f < p.activeFrame[1];
        return (
          <div
            key={i}
            style={{
              opacity: active ? 1.0 : 0.35,
              transform: active ? 'scale(1.05)' : 'scale(0.95)',
              transition: 'all 0.2s ease',
              borderRadius: radius.lg,
              border: `${border.base}px solid ${active ? p.color : '#444'}`,
              overflow: 'hidden',
              position: 'relative',
              height: panelHeight,
            }}
          >
            <Img
              src={p.src}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                top: 16,
                left: 16,
                background: p.color,
                color: color.neutral[0],
                padding: '8px 18px',
                borderRadius: radius.sm,
                border: `${border.thin}px solid ${color.outline}`,
                fontFamily: font.family.heading,
                fontWeight: weight.bold,
                fontSize: 38,
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
