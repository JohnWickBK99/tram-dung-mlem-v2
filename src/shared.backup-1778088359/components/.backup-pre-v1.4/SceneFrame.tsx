/**
 * SceneFrame v1.4 — match handoff: default bg cream #FFFAF0.
 * Per-scene override: photo / yellow / coral / cream / ink.
 */
import React from 'react';
import { AbsoluteFill } from 'remotion';
import theme, { type PillarKey } from '../theme';
import { PillarBadge } from './PillarBadge';
import { ChannelMark } from './ChannelMark';

const { color } = theme;

export const SceneFrame: React.FC<{
  bg?: string;
  pillar?: PillarKey;
  withBadge?: boolean;
  withMark?: boolean;
  children?: React.ReactNode;
}> = ({
  bg = color.bg.page,
  pillar = 'a',
  withBadge = true,
  withMark = true,
  children,
}) => (
  <AbsoluteFill style={{ background: bg, overflow: 'hidden' }}>
    {children}
    {withBadge && <PillarBadge pillar={pillar} />}
    {withMark && <ChannelMark />}
  </AbsoluteFill>
);
