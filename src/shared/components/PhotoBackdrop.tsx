/**
 * PhotoBackdrop — static photo + dark vignette + optional pillar tint (v1.4 — pure handoff).
 *
 * Source of truth: handoff `_chrome.tsx` PhotoBackdrop.
 *   - vignette default 0.45 (radial gradient ellipse, transparent 30% → rgba(0,0,0,0.45))
 *   - fallbackBg = pillar.dark (đậm vàng nâu/đỏ tía/coral/teal tùy pillar)
 *   - filter: saturate(1.25) contrast(1.18) brightness(1.05)
 *   - tint optional (mixBlendMode multiply per-scene)
 *
 * Per-scene tint examples (từ preview HTML):
 *   - S01 hook: tint = 'rgba(184, 120, 8, 0.35)' (orange tint cho mood ấm)
 *   - S02 sidewalk: tint = 'rgba(255, 224, 168, 0.45)' (yellow nhạt)
 *   - S04 old hanoi: tint = 'rgba(184, 120, 8, 0.40)' (vintage warm)
 *   - S07 meat: tint = 'rgba(40, 8, 8, 0.55)' (red dim)
 *   - S08 grill: tint = 'rgba(232, 93, 47, 0.50)' (coral overlay)
 *
 * Pillar dark fallback:
 *   A — '#B87808' (vàng nâu)
 *   B — '#7A1614' (đỏ đậm)
 *   C — '#8E2F0F' (cam đậm)
 *   D — '#1F6E79' (teal đậm)
 */
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import theme, { getPillar, type PillarKey } from '../theme';

void theme;

export const PhotoBackdrop: React.FC<{
  src: string;
  /** Optional color overlay (mix-blend multiply). */
  tint?: string;
  /** Radial vignette opacity 0..1 (default 0.45). */
  vignette?: number;
  /** Fallback BG khi ảnh missing. Default = pillar.dark theo prop pillar. */
  fallbackBg?: string;
  /** Pillar key để compute fallbackBg mặc định (a/b/c/d). */
  pillar?: PillarKey;
  saturate?: number;
  contrast?: number;
  brightness?: number;
  /** Image opacity 0..1 (default 0.5). */
  opacity?: number;
}> = ({
  src,
  tint,
  vignette = 0.45,
  fallbackBg,
  pillar = 'a',
  saturate = 1.25,
  contrast = 1.18,
  brightness = 1.05,
  opacity = 0.6,
}) => {
  const bg = fallbackBg ?? getPillar(pillar).dark;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: bg }}>
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
