/**
 * PillarBadge v1.12 — per-pillar text contrast.
 *
 * Pillar A (yellow): ink text + ink dot + yellow letter   (light BG → dark text)
 * Pillar B (red):    WHITE text + ink dot + yellow letter (dark BG → white text)
 * Pillar C (coral):  WHITE text + ink dot + yellow letter (dark BG → white text)
 * Pillar D (teal):   ink text + ink dot + yellow letter   (light BG → dark text)
 */
import React from 'react';
import theme, { getPillar, type PillarKey } from '../theme';

const { color, font, border, radius, shadow } = theme;
const { weight } = font;

const PILLAR_LABEL_COLOR: Record<PillarKey, string> = {
  a: color.outline,        // ink on yellow
  b: color.neutral[0],     // WHITE on red — contrast
  c: color.neutral[0],     // WHITE on coral — contrast
  d: color.outline,        // ink on teal
};

const PILLAR_NAME: Record<PillarKey, string> = {
  a: 'KHẨU PHẦN ĐẶC THÙ',
  b: 'MÓN LẠ QUỐC GIA',
  c: 'KỶ LỤC THẾ GIỚI',
  d: 'VĂN HÓA & CÁCH LÀM',
};

export const PillarBadge: React.FC<{
  pillar?: PillarKey;
  letter?: string;
  label?: string;
}> = ({ pillar = 'a', letter, label }) => {
  const p = getPillar(pillar);
  const _letter = letter ?? pillar.toUpperCase();
  const _label = label ?? PILLAR_NAME[pillar];
  const labelColor = PILLAR_LABEL_COLOR[pillar];
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
        color: labelColor,
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
          color: color.brand.yellow,
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
