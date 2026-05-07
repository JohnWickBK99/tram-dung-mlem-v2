/**
 * CTAStriped — Pattern 11 (Scene14-style CTA).
 *
 * Visual: BG yellow + striped pattern overlay. Ink eyebrow + HUGE outline FOLLOW + coral CTA pill.
 *
 * Example:
 *   <CTAStriped
 *     pillar="a"
 *     eyebrow="ĐĂNG KÝ KÊNH"
 *     mainText="FOLLOW"
 *     ctaText="Trạm Dừng Mlem"
 *     subtitle="+ món hot mỗi tuần"
 *     subtitleHighlight="món hot"
 *   />
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import theme, { type PillarKey } from '../theme';
import { OutlineText, Chip } from '../components';

const { color, font } = theme;

const useEntry = (delay: number, damping: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.8 } });
};

export const CTAStriped: React.FC<{
  pillar?: PillarKey;
  eyebrow?: string;         // 'ĐĂNG KÝ KÊNH'
  mainText: string;         // 'FOLLOW'
  mainTextColor?: string;   // default coral
  mainSize?: number;        // default 240
  ctaText: string;          // 'Trạm Dừng Mlem'
  subtitle?: string;        // '+ món hot mỗi tuần'
  subtitleHighlight?: string;
  bg?: string;              // default brand.yellow
  /** Dark overlay 0..1 trên BG (default 0). Dùng khi BG quá sáng — dim chữ trên rõ hơn. */
  darkMask?: number;
}> = ({
  pillar = 'a',
  eyebrow,
  mainText,
  mainTextColor,
  mainSize = 240,
  ctaText,
  subtitle,
  subtitleHighlight,
  bg,
  darkMask = 0,
}) => {
  const ebPop = useEntry(0, 12);
  const mainPop = useEntry(10, 11);
  const ctaPop = useEntry(25, 12);
  const _mainColor = mainTextColor ?? color.brand.coral;

  return (
    <AbsoluteFill style={{ background: bg ?? color.brand.yellow }}>
      {darkMask > 0 && (
        <AbsoluteFill style={{ background: `rgba(0,0,0,${darkMask})`, pointerEvents: 'none' }} />
      )}

      {/* Striped pattern overlay */}
      <AbsoluteFill style={{
        background: `repeating-linear-gradient(45deg, ${color.brand.yellow} 0 60px, #FFE0A8 60px 120px)`,
        opacity: 0.5,
      }} />
      <AbsoluteFill style={{
        alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 30,
      }}>
        {eyebrow && (
          <div style={{ transform: `scale(${ebPop})` }}>
            <Chip variant="ink" size="sm">
              {eyebrow}
            </Chip>
          </div>
        )}

        <div style={{ transform: `scale(${mainPop})` }}>
          <OutlineText size={mainSize} color={_mainColor} variant="hook" letterSpacing={-6}>
            {mainText}
          </OutlineText>
        </div>

        <div style={{
          transform: `scale(${ctaPop})`,
          background: color.brand.coral,
          color: color.neutral[0],
          border: `8px solid ${color.outline}`,
          borderRadius: 999,
          padding: '28px 64px',
          boxShadow: '20px 20px 0 0 #1A1A1A',
          fontFamily: font.family.display,
          fontWeight: 800,
          fontSize: 72,
          letterSpacing: 4,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          {ctaText}
        </div>

        {subtitle && (
          <div style={{
            fontFamily: font.family.heading,
            fontWeight: 700,
            fontSize: 46,
            color: color.outline,
            letterSpacing: 2,
          }}>
            {subtitleHighlight && subtitle.includes(subtitleHighlight)
              ? subtitle.split(subtitleHighlight).map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span style={{
                        background: color.outline,
                        color: color.brand.yellow,
                        padding: '4px 14px',
                        borderRadius: 6,
                      }}>{subtitleHighlight}</span>
                    )}
                  </React.Fragment>
                ))
              : subtitle}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
