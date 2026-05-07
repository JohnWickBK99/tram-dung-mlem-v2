/**
 * Font loader v1.6 — load via @remotion/google-fonts API + capture fontFamily đúng.
 *
 * Reason: Remotion register fontFamily theo tên thực tế của package. Hardcode dễ fail.
 * `loadFont()` trả về `{fontFamily, waitUntilDone}` — dùng `fontFamily` ensure CSS dùng đúng tên.
 */
import { loadFont as loadBaloo2 } from '@remotion/google-fonts/Baloo2';
import { loadFont as loadBeVietnamPro } from '@remotion/google-fonts/BeVietnamPro';
import { loadFont as loadJetBrainsMono } from '@remotion/google-fonts/JetBrainsMono';
import React from 'react';
import { delayRender, continueRender } from 'remotion';

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

export const FONT_FAMILY = {
  display: `${baloo2.fontFamily}, system-ui, sans-serif`,
  heading: `${beVietnam.fontFamily}, system-ui, sans-serif`,
  body:    `${beVietnam.fontFamily}, system-ui, sans-serif`,
  mono:    `${mono.fontFamily}, ui-monospace, monospace`,
} as const;

export const fontWaiters = {
  baloo2: baloo2.waitUntilDone(),
  beVietnam: beVietnam.waitUntilDone(),
  mono: mono.waitUntilDone(),
};

export const FontWaiter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = React.useState(() => delayRender('load-fonts'));
  React.useEffect(() => {
    Promise.all([fontWaiters.baloo2, fontWaiters.beVietnam, fontWaiters.mono])
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);
  return <>{children}</>;
};
