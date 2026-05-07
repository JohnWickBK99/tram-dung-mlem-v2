/**
 * FunFactPop v1.14 — sticker overlay fun fact với pop animation.
 *
 * Visual:
 *   - Card cream rộng 600-700px + border 6px ink + shadow chunky 14/14
 *   - Label nhỏ vàng "💡 BIẾT KHÔNG?" / "🤯 FACT" (28px uppercase letterSpacing 4)
 *   - Fact text 56px ink (Be Vietnam Pro 700)
 *   - Rotate -3° default (per-instance overridable)
 *   - Pop spring entry (delay 0, damping 10)
 *   - Optional source pill nhỏ phía dưới (vd: "— FAO 2024")
 *
 * Position: absolute, default top-right corner.
 *
 * Example:
 *   <FunFactPop
 *     label="💡 BIẾT KHÔNG?"
 *     text="Chuột đồng nướng lu là đặc sản 30 năm tại An Giang"
 *     source="FAO khuyến cáo"
 *     position={{ top: 200, right: 80 }}
 *     delay={45}
 *   />
 */
import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import theme from '../theme';

const { color, font } = theme;

export const FunFactPop: React.FC<{
  /** Label nhỏ phía trên (default "💡 BIẾT KHÔNG?"). */
  label?: string;
  /** Fact text chính. */
  text: string;
  /** Source attribution optional (vd: "FAO 2024"). */
  source?: string;
  /** Position absolute (vd: {top: 200, right: 80}). Default top-right. */
  position?: React.CSSProperties;
  /** Frame delay before pop animation (default 0). */
  delay?: number;
  /** Frame to fade out (default never). */
  fadeOutAt?: number;
  /** Background color (default cream). */
  bg?: string;
  /** Label color (default coral). */
  labelColor?: string;
  /** Card rotate degrees (default -3). */
  rotate?: number;
  /** Width px (default 640). */
  width?: number;
}> = ({
  label = '💡 BIẾT KHÔNG?',
  text,
  source,
  position,
  delay = 0,
  fadeOutAt,
  bg,
  labelColor,
  rotate = -3,
  width = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({
    frame: frame - delay,
    fps,
    config: { damping: 10, mass: 0.7 },
  });
  const scale = interpolate(sp, [0, 1], [0.5, 1.0], { extrapolateRight: 'clamp' });
  const fadeOut = fadeOutAt
    ? interpolate(frame, [fadeOutAt - 4, fadeOutAt], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 1;

  return (
    <div
      style={{
        position: 'absolute',
        ...(position ?? { top: 200, right: 80 }),
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        opacity: sp * fadeOut,
        background: bg ?? color.brand.cream,
        color: color.outline,
        border: `6px solid ${color.outline}`,
        borderRadius: 24,
        boxShadow: '14px 14px 0 0 #1A1A1A',
        padding: '24px 36px',
        width,
        maxWidth: '90vw',
      }}
    >
      <div
        style={{
          fontFamily: font.family.heading,
          fontWeight: 800,
          fontSize: 28,
          letterSpacing: 4,
          color: labelColor ?? color.brand.coral,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: font.family.heading,
          fontWeight: 700,
          fontSize: 56,
          lineHeight: 1.15,
          marginTop: 8,
        }}
      >
        {text}
      </div>
      {source && (
        <div
          style={{
            marginTop: 14,
            display: 'inline-block',
            background: color.brand.yellow,
            border: `4px solid ${color.outline}`,
            borderRadius: 999,
            padding: '6px 18px',
            fontFamily: font.family.heading,
            fontWeight: 700,
            fontSize: 28,
            color: color.outline,
            boxShadow: '4px 4px 0 0 #1A1A1A',
          }}
        >
          — {source}
        </div>
      )}
    </div>
  );
};
