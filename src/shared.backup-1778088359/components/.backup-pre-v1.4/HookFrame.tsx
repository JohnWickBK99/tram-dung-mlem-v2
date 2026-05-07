/**
 * HookFrame v1.4 — match handoff: default bg = pillar.dark.
 */
import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { getPillar, type PillarKey } from '../theme';
import { OutlineText } from './OutlineText';

export const HookFrame: React.FC<{
  text: string;
  pillar?: PillarKey;
  bg?: string;
  mascotSrc?: string;
  textSize?: number;
  mascotSize?: number;
  textColor?: string;
}> = ({
  text, pillar = 'a', bg, mascotSrc,
  textSize = 140, mascotSize = 240, textColor,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 8], [0.6, 1.0], { extrapolateRight: 'clamp' });
  const fade = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: 'clamp' });
  const p = getPillar(pillar);
  return (
    <AbsoluteFill style={{
      background: bg ?? p.dark,
      alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ opacity: fade, transform: `scale(${scale})`, padding: 60, textAlign: 'center' }}>
        <OutlineText size={textSize} color={textColor ?? '#FFFFFF'} variant="hook">{text}</OutlineText>
      </div>
      {mascotSrc && (
        <div style={{
          position: 'absolute', bottom: 40, right: 40,
          width: mascotSize, height: mascotSize, opacity: fade,
        }}>
          <Img src={mascotSrc} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
      )}
    </AbsoluteFill>
  );
};
