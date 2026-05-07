// S11/S12/S13: Shop card template — sticker chunky outline
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLOR, FONT, FW, BORDER, RADIUS, SHADOW, PILLAR_A, outlineText } from './_theme';
import { PhotoBackdrop, useEntry, OutlineText } from './_chrome';

type Props = {
  number: string;
  name: string;
  addr: string;
  tag: string;
  tone?: string;       // accent color for badge
  bgImage: string;
};

export const ShotShopCard: React.FC<Props> = ({ number, name, addr, tag, tone = COLOR.coral, bgImage }) => {
  const card = useEntry(0, 12);
  const num = useEntry(8, 10);
  const stamp = useEntry(34, 10);

  return (
    <AbsoluteFill style={{ background: PILLAR_A.dark }}>
      <PhotoBackdrop src={bgImage} tint="rgba(0,0,0,0.45)" vignette={0.5} />

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 880, padding: '60px 50px 50px',
          background: COLOR.cream, color: COLOR.ink,
          border: `${BORDER.xthick}px solid ${COLOR.outline}`,
          borderRadius: RADIUS['2xl'],
          boxShadow: SHADOW.stickerXL,
          transform: `scale(${card})`,
          textAlign: 'center', position: 'relative',
        }}>
          {/* number circle */}
          <div style={{
            transform: `scale(${num})`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 120, height: 120, borderRadius: '50%',
            background: tone, color: COLOR.white,
            border: `${BORDER.thick}px solid ${COLOR.outline}`,
            boxShadow: SHADOW.stickerMd,
            fontFamily: FONT.display, fontWeight: 800, fontSize: 80,
            marginBottom: 30,
          }}>{number}</div>

          <div style={{
            fontFamily: FONT.display, fontWeight: 800,
            fontSize: 130, color: COLOR.ink, lineHeight: 1.0, letterSpacing: -2,
          }}>{name}</div>

          <div style={{
            marginTop: 24, display: 'inline-flex', gap: 8, alignItems: 'center',
            background: COLOR.yellow, color: COLOR.ink,
            border: `${BORDER.base}px solid ${COLOR.outline}`,
            borderRadius: RADIUS.pill,
            padding: '12px 28px',
            boxShadow: SHADOW.stickerSm,
            fontFamily: FONT.heading, fontWeight: FW.bold, fontSize: 40,
          }}>📍 {addr}</div>

          <div style={{
            marginTop: 22,
            fontFamily: FONT.heading, fontWeight: FW.bold,
            fontSize: 38, color: COLOR.body,
          }}>{tag}</div>

          {/* corner sticker stamp */}
          <div style={{
            position: 'absolute', top: -30, right: -40,
            transform: `scale(${stamp}) rotate(12deg)`,
            background: COLOR.coral, color: COLOR.white,
            border: `${BORDER.thick}px solid ${COLOR.outline}`,
            borderRadius: RADIUS.pill,
            padding: '14px 28px',
            boxShadow: SHADOW.stickerMd,
            fontFamily: FONT.display, fontWeight: 800, fontSize: 40,
            letterSpacing: 2,
          }}>MLEM!</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Scene11HuongLien: React.FC = () => (
  <ShotShopCard number="1" name="Hương Liên" addr="24 Lê Văn Hưu"
    tag="Obama & Bourdain · 2016" tone={COLOR.red} bgImage="visuals/bun-cha/S11.jpg" />
);
export const Scene12DacKim: React.FC = () => (
  <ShotShopCard number="2" name="Đắc Kim" addr="1 Hàng Mành"
    tag="Gia truyền từ 1965" tone={COLOR.yellow} bgImage="visuals/bun-cha/S12.jpg" />
);
export const Scene13TuongBeo: React.FC = () => (
  <ShotShopCard number="3" name="Tưởng Béo" addr="Ngõ Đặng Văn Ngữ"
    tag="Vỉa hè · giá sinh viên" tone={COLOR.coral} bgImage="visuals/bun-cha/S13.jpg" />
);
