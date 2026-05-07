/**
 * PhotoBackdrop — static photo + dark vignette + optional pillar tint.
 * Production rules:
 *   - opacity 0.5 + fallbackBg = pillar.dark (KHÔNG thuần black trừ scene đặc thù)
 *   - vignette default 0.45
 *   - filter: saturate(1.25) contrast(1.18) brightness(1.05) — vibrant foodtoon
 */
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import theme from '../theme';

const { color } = theme;

export const PhotoBackdrop: React.FC<{
  src: string;          // public path (no leading slash)
  tint?: string;        // overlay color (multiply)
  vignette?: number;    // 0..1
  fallbackBg?: string;  // when image missing
  saturate?: number;
  contrast?: number;
  brightness?: number;
  opacity?: number;     // image opacity (0..1) — production tested 0.5 cho dark scenes
}> = ({
  src,
  tint,
  vignette = 0.45,
  fallbackBg = '#1A1A1A',
  saturate = 1.25,
  contrast = 1.18,
  brightness = 1.05,
  opacity = 1.0,
}) => {
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: fallbackBg }}>
      <Img
        src={staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity,
          filter: `saturate(${saturate}) contrast(${contrast}) brightness(${brightness})`,
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      {tint && (
        <AbsoluteFill style={{ background: tint, mixBlendMode: 'multiply' }} />
      )}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,${vignette}) 100%)`,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
