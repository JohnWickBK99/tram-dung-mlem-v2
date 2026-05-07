/** StickerCard — chunky outline + offset shadow. The signature TDM card. */
import React from 'react';
import theme from '../theme';

const { color, border, radius, shadow } = theme;

export const StickerCard: React.FC<{
  bg?: string;
  borderColor?: string;
  shadow?: string;
  radius?: number;
  padding?: string | number;
  rotate?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({
  bg = color.brand.cream,
  borderColor = color.outline,
  shadow: shadowProp = shadow.stickerLg,
  radius: radiusProp = radius.xl,
  padding = '40px 48px',
  rotate = 0,
  style,
  children,
}) => (
  <div
    style={{
      background: bg,
      border: `${border.thick}px solid ${borderColor}`,
      borderRadius: radiusProp,
      boxShadow: shadowProp,
      padding,
      transform: `rotate(${rotate}deg)`,
      ...style,
    }}
  >
    {children}
  </div>
);
