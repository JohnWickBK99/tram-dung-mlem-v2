/**
 * PillarBadge — top-left chip identifying which pillar this clip is.
 * Default = Pillar A. Pass `pillar` prop to switch.
 */
import React from 'react';
import theme, { getPillar, type PillarKey } from '../theme';

const { color, font, border, radius, shadow } = theme;
const weight = font.weight;

export const PillarBadge: React.FC<{
  pillar?: PillarKey;
  letter?: string;
  label?: string;
}> = ({ pillar = 'a', letter, label }) => {
  const p = getPillar(pillar);
  const _letter = letter ?? pillar.toUpperCase();
  const _label = label ?? p.name.toUpperCase();
  return (
    <div
      style={{
        position: 'absolute',
        top: 60,
        left: 60,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: p.base,
        color: color.outline,
        border: `${border.base}px solid ${color.outline}`,
        borderRadius: radius.pill,
        padding: '12px 22px 12px 14px',
        boxShadow: shadow.stickerMd,
        fontFamily: font.family.heading,
        fontWeight: weight.extrabold,
        letterSpacing: 1.5,
        fontSize: 28,
      }}
    >
      <span
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: color.outline,
          color: p.base,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: font.family.display,
          fontWeight: 800,
          fontSize: 30,
        }}
      >
        {_letter}
      </span>
      <span>{_label}</span>
    </div>
  );
};
