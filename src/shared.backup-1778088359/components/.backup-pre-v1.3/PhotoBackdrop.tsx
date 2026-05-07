/**
 * PhotoBackdrop — static photo + dark vignette + optional pillar tint.
 *
 * v1.1: default opacity 0.6 (was 1.0) cho text overlay legibility.
 * Override per-scene khi cần ảnh full color: <PhotoBackdrop opacity={1.0} />
 */
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import theme from '../theme';

const { color } = theme;

export const PhotoBackdrop: React.FC<{
  src: string;
  tint?: string;
  vignette?: number;
  fallbackBg?: string;
  saturate?: number;
  contrast?: number;
  brightness?: number;
  opacity?: number;
}> = ({
  src,
  tint,
  vignette = 0.45,
  fallbackBg = '#1A1A1A',
  saturate = 1.25,
  contrast = 1.18,
  brightness = 1.05,
  opacity = 0.6,
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
