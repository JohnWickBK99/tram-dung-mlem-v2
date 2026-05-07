/**
 * SceneFrame — root container per scene (v1.4 — match handoff).
 *
 * Default bg = `bg.page` cream `#FFFAF0` (handoff style).
 * Per-scene override với:
 *   - photo scenes: bỏ bg, dùng <PhotoBackdrop> bên trong
 *   - flat color scenes: bg=COLOR.yellow / coral / cream / outline tùy design
 *   - special: bg=outline (đen) cho stat scene
 *
 * Examples:
 *   <SceneFrame pillar="a">                    cream default
 *   <SceneFrame pillar="a" bg="#F8B147">       full yellow scene
 *   <SceneFrame pillar="a" bg="#1A1A1A">       ink BG cho stat scene
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
  bg = color.bg.page,           // v1.4: cream default (handoff)
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
