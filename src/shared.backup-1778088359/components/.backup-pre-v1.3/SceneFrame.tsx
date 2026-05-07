/**
 * SceneFrame — root container per scene.
 * Wraps with optional PillarBadge + ChannelMark.
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
