/**
 * KenBurns — slow zoom over an image. Used in clip 02/03/04 for setup scenes.
 * Default-OFF for new clips per Universal Theme v1.0 (preferred: PhotoBackdrop static).
 * Use only when scene needs implicit motion despite no video footage.
 */
import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';

export const KenBurns: React.FC<{
  src: string;                     // already-resolved staticFile() URL
  from?: number;                   // start scale (default 1.0)
  to?: number;                     // end scale (default 1.06)
  durationFrames?: number;
  opacity?: number;                // image opacity 0..1
  saturate?: number;
  contrast?: number;
  brightness?: number;
  panX?: 'left' | 'right' | 'none'; // pan direction
}> = ({
  src,
  from = 1.0,
  to = 1.06,
  durationFrames = 240,
  opacity = 1.0,
  saturate = 1.25,
  contrast = 1.18,
  brightness = 1.05,
  panX = 'none',
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, durationFrames], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const offset = panX === 'none'
    ? 0
    : interpolate(frame, [0, durationFrames], [0, panX === 'left' ? -40 : 40], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity,
          transform: `scale(${scale}) translateX(${offset}px)`,
          filter: `saturate(${saturate}) contrast(${contrast}) brightness(${brightness})`,
        }}
      />
    </AbsoluteFill>
  );
};
