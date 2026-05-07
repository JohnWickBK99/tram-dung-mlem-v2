/** useEntry — sticker pop entry spring. */
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const useEntry = (delay: number = 0, damping: number = 12, mass: number = 0.8) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: { damping, mass },
  });
};
