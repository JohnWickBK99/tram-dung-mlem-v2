/**
 * ZoomPunch — 13-frame transition wrapper @ 30fps (~430ms).
 * 4 phase: zoom-in (4f) → hold (2f) → whip blur (3f) → zoom-out (4f)
 *
 * Wrap quanh scene root. Disabled by default during preview để tránh giật.
 */
import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const ZoomPunch: React.FC<{
  children: React.ReactNode;
  /** Disable transition (preview mode). Default false. */
  disabled?: boolean;
}> = ({ children, disabled }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const remain = durationInFrames - frame;

  if (disabled) return <>{children}</>;

  const enterScale = interpolate(frame, [0, 4], [1.15, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitScale = interpolate(remain, [13, 7], [1.0, 1.15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const blur = interpolate(remain, [7, 4], [0, 30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = remain < 7 ? exitScale : enterScale;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        transformOrigin: 'center center',
      }}
    >
      {children}
    </div>
  );
};
