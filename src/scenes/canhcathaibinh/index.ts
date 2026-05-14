/** SHOT_MAP for canhcathaibinh. Add Scene imports khi scenes ready. */
// import { Scene01Hook } from './Scene01Hook';
// ...

export const SHOT_MAP = {
  // S01_HOOK: Scene01Hook,
} as const;

export type ShotKey = keyof typeof SHOT_MAP;
