/** Per-clip theme overrides for bunocnguoi. Extends shared/theme. */
import sharedTheme, { getPillar } from '../../shared/theme';

export const PILLAR_KEY = 'b' as const;
export const PILLAR = getPillar(PILLAR_KEY);

// Override / extend shared tokens here.
// Example: change karaoke highlight cho scene nền vàng → coral
export const KARAOKE_HIGHLIGHT_OVERRIDE: Record<string, string> = {
  // 'S04_BITE_REACTION': '#E85D2F',  // coral khi BG vàng
};

export default sharedTheme;
