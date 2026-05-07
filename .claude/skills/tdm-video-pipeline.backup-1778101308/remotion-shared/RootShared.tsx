/**
 * RootShared — font loader for all clips.
 *
 * Usage in src/Root.tsx:
 *   import './shared/RootShared';   // side-effect import to load fonts globally
 *   import { Composition } from 'remotion';
 *   import { CaPheTrung } from './compositions/CaPheTrung';
 *   ...
 *
 * ⚠️ GOTCHA: @remotion/google-fonts/Baloo2 đăng ký vào browser dưới tên "Baloo Two"
 * (hai từ, có khoảng cách). Nhưng @remotion/google-fonts/Baloo2 module và CSS-IN-JS
 * có thể cần "Baloo 2" (số). Kiểm bằng test render trước khi commit.
 *
 * Universal Theme v1.0 chuẩn dùng "'Baloo 2', system-ui, sans-serif" (số 2, cách).
 */
import { loadFont as loadBaloo2 } from '@remotion/google-fonts/Baloo2';
import { loadFont as loadBeVietnamPro } from '@remotion/google-fonts/BeVietnamPro';
import { loadFont as loadJetBrainsMono } from '@remotion/google-fonts/JetBrainsMono';

loadBaloo2();
loadBeVietnamPro();
loadJetBrainsMono();
