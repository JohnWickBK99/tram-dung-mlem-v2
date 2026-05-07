/**
 * Trạm Dừng Mlem — Universal Theme v1.0
 * ────────────────────────────────────────────────────────────
 * Use this in:
 *   • Remotion clips (TikTok 1080×1920, IG, YT)
 *   • Next.js / React web (landing, blog)
 *   • Email templates (inline css)
 *   • Print/poster (use video pixel scale)
 *
 * Direction A — Playful Foodtoon (chunky outline, kawaii bold).
 *
 * Token naming: W3C-style hierarchical (color.pillar.a.base, font.video.hookXL, ...).
 * Source of truth: ./tokens.json — this file is a typed accessor with helpers.
 *
 * @version 1.0.0
 * @lastUpdated 2026-04-29
 */

// ─────────────────────────────────────────────────────────────
// COLOR
// ─────────────────────────────────────────────────────────────

export const color = {
  brand: {
    yellow: '#F8B147',
    orange: '#F39820',
    coral:  '#E85D2F',
    red:    '#C8302D',
    teal:   '#4FC3D1',
    cream:  '#FFF4E0',
  },
  pillar: {
    a: { name: 'Khẩu phần đặc thù', light: '#FFE0A8', base: '#F8B147', dark: '#B87808' },
    b: { name: 'Món lạ quốc gia',   light: '#F4B0AE', base: '#C8302D', dark: '#7A1614' },
    c: { name: 'Kỷ lục & Cực đoan', light: '#F9C5AE', base: '#E85D2F', dark: '#8E2F0F' },
    d: { name: 'Văn hóa & Cách làm',light: '#BEE7ED', base: '#4FC3D1', dark: '#1F6E79' },
  },
  neutral: {
    0:   '#FFFFFF',
    50:  '#FFFAF0',
    200: '#EFE6D2',
    400: '#A89C84',
    600: '#5C5443',
    800: '#2B2620',
    900: '#1A1A1A',
  },
  fg: {
    primary:   '#1A1A1A',
    secondary: '#5C5443',
    muted:     '#A89C84',
    inverted:  '#FFFFFF',
    brand:     '#F8B147',
    link:      '#4FC3D1',
  },
  bg: {
    page:     '#FFFAF0',
    surface:  '#FFFFFF',
    subtle:   '#FFF4E0',
    inverted: '#1A1A1A',
  },
  border: {
    subtle: '#EFE6D2',
    strong: '#1A1A1A',
  },
  state: {
    success: '#3FB28E',
    warning: '#E85D2F',
    danger:  '#C8302D',
    info:    '#4FC3D1',
  },
  outline: '#1A1A1A',

  // Dark mode (auto via prefers-color-scheme)
  dark: {
    fg: { primary: '#FFFAF0', secondary: '#EFE6D2', muted: '#A89C84' },
    bg: { page: '#16130E', surface: '#221E16', subtle: '#2E2820', inverted: '#FFFAF0' },
  },
} as const;

export type PillarKey = 'a' | 'b' | 'c' | 'd';

// ─────────────────────────────────────────────────────────────
// FONT
// ─────────────────────────────────────────────────────────────

export const font = {
  family: {
    display: "'Baloo 2', system-ui, sans-serif",
    heading: "'Be Vietnam Pro', system-ui, sans-serif",
    body:    "'Be Vietnam Pro', system-ui, sans-serif",
    mono:    "'JetBrains Mono', ui-monospace, monospace",
  },
  weight: {
    regular:   400,
    medium:    500,
    semibold:  600,
    bold:      700,
    extrabold: 800,
  },

  // Pixel scale for Remotion 1080×1920 — DO NOT scale by viewport
  video: {
    hookXL:   { size: 140, lineHeight: 1.0,  weight: 800, family: 'display' as const },
    hookL:    { size: 96,  lineHeight: 1.05, weight: 800, family: 'display' as const },
    title:    { size: 72,  lineHeight: 1.1,  weight: 800, family: 'display' as const },
    subtitle: { size: 48,  lineHeight: 1.2,  weight: 700, family: 'heading' as const },
    body:     { size: 40,  lineHeight: 1.4,  weight: 500, family: 'body'    as const },
    monoStat: { size: 120, lineHeight: 1.0,  weight: 600, family: 'mono'    as const },
    tag:      { size: 28,  lineHeight: 1.2,  weight: 700, family: 'heading' as const },
  },

  // rem-based for responsive web (1rem = 16px)
  web: {
    '5xl': { size: '4.5rem',   lineHeight: 1.0,  weight: 800, family: 'display' as const },
    '4xl': { size: '3rem',     lineHeight: 1.05, weight: 800, family: 'display' as const },
    '3xl': { size: '2.25rem',  lineHeight: 1.1,  weight: 800, family: 'display' as const },
    '2xl': { size: '1.75rem',  lineHeight: 1.2,  weight: 700, family: 'heading' as const },
    xl:    { size: '1.375rem', lineHeight: 1.3,  weight: 700, family: 'heading' as const },
    lg:    { size: '1.125rem', lineHeight: 1.5,  weight: 500, family: 'body'    as const },
    md:    { size: '1rem',     lineHeight: 1.5,  weight: 500, family: 'body'    as const },
    sm:    { size: '0.875rem', lineHeight: 1.45, weight: 500, family: 'body'    as const },
    xs:    { size: '0.75rem',  lineHeight: 1.4,  weight: 600, family: 'heading' as const },
  },

  stroke: {
    outline:     { width: 4, color: '#1A1A1A' },
    outlineHook: { width: 6, color: '#1A1A1A' },
    outlineThin: { width: 2, color: '#1A1A1A' },
  },
} as const;

// ─────────────────────────────────────────────────────────────
// SPACING (4-base scale, 0–96 px)
// ─────────────────────────────────────────────────────────────

export const spacing = {
  0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24,
  8: 32, 10: 40, 12: 48, 16: 64, 20: 80, 24: 96,
} as const;

// ─────────────────────────────────────────────────────────────
// RADIUS
// ─────────────────────────────────────────────────────────────

export const radius = {
  xs: 4, sm: 6, md: 12, lg: 16, xl: 24, '2xl': 32, pill: 999,
} as const;

// ─────────────────────────────────────────────────────────────
// SHADOW (sticker chunky — solid offset)
// ─────────────────────────────────────────────────────────────

export const shadow = {
  none:       'none',
  stickerSm:  '3px 3px 0 0 #1A1A1A',
  stickerMd:  '6px 6px 0 0 #1A1A1A',
  stickerLg:  '10px 10px 0 0 #1A1A1A',
  softSm:     '0 2px 4px rgba(26,26,26,0.08)',
  softMd:     '0 8px 24px rgba(26,26,26,0.10)',
  innerInset: 'inset 0 -3px 0 0 #1A1A1A',
} as const;

// ─────────────────────────────────────────────────────────────
// BORDER
// ─────────────────────────────────────────────────────────────

export const border = {
  none: 0, thin: 2, base: 3, thick: 4, xthick: 6,
} as const;

// ─────────────────────────────────────────────────────────────
// COMPOSITION
// ─────────────────────────────────────────────────────────────

export const composition = {
  video: {
    tiktok:      { width: 1080, height: 1920, fps: 30, aspect: '9:16' as const },
    youtubeHd:   { width: 1920, height: 1080, fps: 30, aspect: '16:9' as const },
    instaSquare: { width: 1080, height: 1080, fps: 30, aspect: '1:1'  as const },
  },
  web: {
    containerSm: 640, containerMd: 768, containerLg: 1024,
    containerXl: 1280, container2xl: 1536,
  },
  print: {
    posterA3:    { width: 297,  height: 420, unit: 'mm', dpi: 300 },
    thumbnailYt: { width: 1280, height: 720, unit: 'px' },
  },
} as const;

// ─────────────────────────────────────────────────────────────
// MOTION
// ─────────────────────────────────────────────────────────────

export const motion = {
  duration: { instant: 100, fast: 180, base: 280, slow: 430, slower: 700 },
  easing: {
    linear:     'linear',
    standard:   'cubic-bezier(0.4, 0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.7, 0, 0.84, 0)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    bounce:     'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  spring: {
    logoBounce:  { stiffness: 180, damping: 12 },
    hookSlide:   { stiffness: 120, damping: 14 },
    mascotPop:   { stiffness: 200, damping: 10 },
    buttonPress: { stiffness: 300, damping: 20 },
  },
  transition: {
    zoomPunchWhip: {
      totalFrames: 13,
      totalMs: 433,
      phases: [
        { name: 'zoomIn',       frames: 4, scaleFrom: 1.0,  scaleTo: 1.15, easing: 'standard'   },
        { name: 'hold',         frames: 2, easing: 'linear' },
        { name: 'whipBlurCut',  frames: 3, blurFrom: 0,     blurTo: 30,    easing: 'accelerate' },
        { name: 'zoomOutEnter', frames: 4, scaleFrom: 1.15, scaleTo: 1.0,  easing: 'decelerate' },
      ],
    },
  },
  preset: {
    hoverPop:   { transform: 'translate(-2px, -2px)', shadow: '10px 10px 0 0 #1A1A1A', duration: 180, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    clickPress: { transform: 'translate(3px, 3px)',   shadow: 'none',                  duration: 100, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    fadeUp:     { from: { opacity: 0, y: 20 }, to: { opacity: 1, y: 0 }, duration: 280, easing: 'decelerate' },
    bounceIn:   { from: { opacity: 0, scale: 0 }, mid: { scale: 1.1 }, to: { opacity: 1, scale: 1 }, duration: 430, easing: 'bounce' },
  },
  captionKaraoke: {
    highlightFadeInFrames: 2,
    highlightFadeOutFrames: 3,
    highlightBg: '#F8B147',
    highlightRadius: 6,
    highlightPadding: { x: 12, y: 4 },
  },
  factPop: {
    popInFrames: 8,
    popInScales: [0, 1.2, 1.0],
    popOutFrames: 4,
    holdDurationSec: [1.5, 2.5] as [number, number],
  },
} as const;

// ─────────────────────────────────────────────────────────────
// SOUND
// ─────────────────────────────────────────────────────────────

export const sound = {
  library: {
    whoosh:     { file: 'assets/sfx/whoosh-01.mp3',   volume: 0.55 },
    impactHook: { file: 'assets/sfx/impact-boom.mp3', volume: 0.6  },
    chimeFact:  { file: 'assets/sfx/chime-ting.mp3',  volume: 0.5  },
    mlemSting:  { file: 'assets/sfx/mlem-sting.mp3',  volume: 0.7  },
    popSticker: { file: 'assets/sfx/pop.mp3',         volume: 0.5  },
  },
  mix: { voiceover: 1.0, bgMusic: 0.18, sfxDefault: 0.5 },
} as const;

// ─────────────────────────────────────────────────────────────
// PHOTO TREATMENT
// ─────────────────────────────────────────────────────────────

export const photoTreatment = {
  preset: 'Vibrant Foodtoon',
  saturation: 1.25,
  contrast:   1.20,
  highlights: 1.10,
  shadows:    0.85,
  vignette:   { enabled: true, amount: 0.10, color: '#1A1A1A' },
  grain:      0,
  warmShift:  5,
  outlineOverlay: { enabled: true, thickness: 3, color: '#1A1A1A' },
} as const;

// ─────────────────────────────────────────────────────────────
// Z-INDEX
// ─────────────────────────────────────────────────────────────

export const z = {
  base: 0, raised: 10, sticky: 100, overlay: 1000, modal: 2000, toast: 3000,
} as const;

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

/** Get pillar config by key (a/b/c/d). */
export const getPillar = (key: PillarKey) => color.pillar[key];

/** CSS-style font shorthand for video text. */
export const videoFontCss = (token: keyof typeof font.video) => {
  const t = font.video[token];
  return {
    fontFamily: font.family[t.family],
    fontSize: `${t.size}px`,
    fontWeight: t.weight,
    lineHeight: t.lineHeight,
  };
};

/** CSS-style font shorthand for web text. */
export const webFontCss = (token: keyof typeof font.web) => {
  const t = font.web[token];
  return {
    fontFamily: font.family[t.family],
    fontSize: t.size,
    fontWeight: t.weight,
    lineHeight: t.lineHeight,
  };
};

/** Outline text style for video (use as React.CSSProperties). */
export const outlineText = (variant: 'hook' | 'body' | 'thin' = 'body'): React.CSSProperties => {
  const stroke =
    variant === 'hook' ? font.stroke.outlineHook
    : variant === 'thin' ? font.stroke.outlineThin
    : font.stroke.outline;
  return {
    WebkitTextStroke: `${stroke.width}px ${stroke.color}`,
    paintOrder: 'stroke fill' as const,
    textShadow: variant === 'hook' ? `0 6px 0 ${color.outline}` : undefined,
  };
};

/** Default theme export for convenience. */
export const theme = {
  color, font, spacing, radius, shadow, border,
  composition, motion, sound, photoTreatment, z,
  helpers: { getPillar, videoFontCss, webFontCss, outlineText },
} as const;

export default theme;

// React import shim — only here so outlineText() typechecks if file is consumed standalone.
// Remove if you import from a project that already has React types.
declare namespace React {
  interface CSSProperties { [key: string]: string | number | undefined; }
}
