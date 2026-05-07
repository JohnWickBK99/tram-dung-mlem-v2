/** ChannelMark — top-right "Trạm Dừng Mlem" watermark. */
import React from 'react';
import theme from '../theme';

const { color, font, border, radius, shadow } = theme;

export const ChannelMark: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: 60,
      right: 60,
      zIndex: 10,
      background: color.outline,
      color: color.brand.yellow,
      border: `${border.thin}px solid ${color.outline}`,
      borderRadius: radius.pill,
      padding: '10px 22px',
      boxShadow: shadow.stickerSm,
      fontFamily: font.family.display,
      fontWeight: 800,
      fontSize: 26,
      letterSpacing: 2,
      textTransform: 'uppercase',
    }}
  >
    Trạm Dừng Mlem
  </div>
);
