/**
 * RootShared v1.6 — side-effect import to ensure fonts loaded.
 *
 * Usage in src/Root.tsx:
 *   import './shared/RootShared';   // first line
 *
 * fonts.ts uses Remotion's @remotion/google-fonts API which both:
 *   1. Loads font assets at render time
 *   2. Returns the actual fontFamily name registered in browser
 *
 * theme.ts re-exports FONT_FAMILY (the actual names) → components dùng
 * fontFamily đúng → KHÔNG còn fallback system-ui khi font register tên khác.
 */
export * from './fonts';
