/**
 * PhotoBackdrop v1.4 — pure handoff (vignette 0.45 + pillar.dark fallback).
 */
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { getPillar, type PillarKey } from '../theme';

export const PhotoBackdrop: React.FC<{
  src: string;
  tint?: string;
  vignette?: number;
  fallbackBg?: string;
  pillar?: PillarKey;
  saturate?: number;
  contrast?: number;
  brightness?: number;
}> = ({
  src, tint, vignette = 0.45, fallbackBg, pillar = 'a',
  saturate = 1.25, contrast = 1.18, brightness = 1.05,
}) => {
  const bg = fallbackBg ?? getPillar(pillar).dark;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: bg }}>
      <Img src={staticFile(src)} style={{
        width: '100%', height: '100%', objectFit: 'cover',
        filter: `saturate(${saturate}) contrast(${contrast}) brightness(${brightness})`,
      }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      {tint && <AbsoluteFill style={{ background: tint, mixBlendMode: 'multiply' }} />}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,${vignette}) 100%)`,
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
