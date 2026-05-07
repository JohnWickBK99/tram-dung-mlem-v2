import { Scene01 } from './Scene01';
import { Scene02 } from './Scene02';
import { Scene03 } from './Scene03';
import { Scene04 } from './Scene04';
import { Scene05 } from './Scene05';
import { Scene06 } from './Scene06';
import { Scene07 } from './Scene07';
import { Scene08 } from './Scene08';
import { Scene09 } from './Scene09';
import { Scene10 } from './Scene10';
import { Scene11 } from './Scene11';
import { Scene12 } from './Scene12';

export const SHOT_MAP = {
  S01_HOOK_USA_VN: Scene01,
  S02_SETUP_PHUDAT: Scene02,
  S03_HISTORY_NUOCNOI: Scene03,
  S04_PROCESS_NGUYENLIEU: Scene04,
  S05_TUTORIAL_LU_DEEP: Scene05,
  S06_BITE_REACTION: Scene06,
  S07_FLAVOR_GATATHO: Scene07,
  S08_PHUDAT_MARKET: Scene08,
  S09_PRICE_KFC: Scene09,
  S10_GLOBAL_RAT_DISHES: Scene10,
  S11_FAO_HEALTH: Scene11,
  S12_CTA: Scene12,
} as const;

export type ShotKey = keyof typeof SHOT_MAP;
