/**
 * Font loader v1.6 — load via @remotion/google-fonts API + capture fontFamily đúng.
 *
 * Reason: Remotion register fontFamily theo tên thực tế của package, có khi `'Baloo 2'`,
 * có khi `'Baloo Two'`. Hardcode dễ fail. `loadFont()` trả về `{fontFamily, waitUntilDone}` —
 * dùng `fontFamily` ensure CSS-in-JS dùng đúng tên.
 *
 * Side-effect: call `loadFont(...)` triggers Remotion register fonts.
 * Side-effect import: `import './fonts'` đủ để load.
 */
import { loadFont as loadBaloo2 } from '@remotion/google-fonts/Baloo2';
import { loadFont as loadBeVietnamPro } from '@remotion/google-fonts/BeVietnamPro';
import { loadFont as loadJetBrainsMono } from '@remotion/google-fonts/JetBrainsMono';

const baloo2 = loadBaloo2('normal', {
  weights: ['500', '700', '800'],
  subsets: ['latin', 'vietnamese'],
});

const beVietnam = loadBeVietnamPro('normal', {
  weights: ['400', '500', '600', '700', '800'],
  subsets: ['latin', 'vietnamese'],
});

const mono = loadJetBrainsMono('normal', {
  weights: ['500', '600', '700'],
  subsets: ['latin'],
});

/** fontFamily strings registered by Remotion — guaranteed match. */
export const FONT_FAMILY = {
  display: `${baloo2.fontFamily}, system-ui, sans-serif`,
  heading: `${beVietnam.fontFamily}, system-ui, sans-serif`,
  body:    `${beVietnam.fontFamily}, system-ui, sans-serif`,
  mono:    `${mono.fontFamily}, ui-monospace, monospace`,
} as const;

/** Promise array — await để đảm bảo fonts ready trước render. */
export const fontWaiters = {
  baloo2: baloo2.waitUntilDone(),
  beVietnam: beVietnam.waitUntilDone(),
  mono: mono.waitUntilDone(),
};

/** Helper component — wrap composition để đảm bảo fonts loaded.
 *  Usage in Root.tsx:
 *    <Composition id="..." component={WithFonts(MyClip)} ... />
 */
import React from 'react';
import { delayRender, continueRender } from 'remotion';

export const FontWaiter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = React.useState(() => delayRender('load-fonts'));
  React.useEffect(() => {
    Promise.all([fontWaiters.baloo2, fontWaiters.beVietnam, fontWaiters.mono])
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);
  return <>{children}</>;
};
