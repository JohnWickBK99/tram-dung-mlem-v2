/**
 * HookFrame — 0-3s hook frame with big text + optional mascot bottom-right.
 * Use for the very first 90 frames (0-3s @ 30fps) of any clip.
 */
import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import theme, { getPillar, type PillarKey } from '../theme';
import { OutlineText } from './OutlineText';

const { color, font } = theme;

export const HookFrame: React.FC<{
  text: string;
  pillar?: PillarKey;
  bg?: string;
  mascotSrc?: string;          // staticFile() URL; e.g. mascot/mlem-shocked.png
  textSize?: number;            // default 140 (hookXL = 200 is too big for >2 words)
  mascotSize?: number;          // default 240
  textColor?: string;
}> = ({
  text,
  pillar = 'a',
  bg,
  mascotSrc,
  textSize = 140,
  mascotSize = 240,
  textColor = color.neutral[0],
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 8], [0.6, 1.0], { extrapolateRight: 'clamp' });
  const fade = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: 'clamp' });
  const p = getPillar(pillar);
  return (
    <AbsoluteFill
      style={{
        background: bg ?? p.base,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ opacity: fade, transform: `scale(${scale})`, padding: 60, textAlign: 'center' }}>
        <OutlineText size={textSize} color={textColor} variant="hook">
          {text}
        </OutlineText>
      </div>
      {mascotSrc && (
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 40,
            width: mascotSize,
            height: mascotSize,
            opacity: fade,
          }}
        >
          <Img src={mascotSrc} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
      )}
    </AbsoluteFill>
  );
};
