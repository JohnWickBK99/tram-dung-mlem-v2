# Clip 04 — Chuột đồng nướng lu — Lessons learned

> Clip đầu tiên ship long-form 90s (2700 frames). Pillar B Red.

## Pattern thành công (reuse cho long-form sau)

1. **Tương phản quốc tế làm hook** — "Mỹ chi $50 DIỆT vs An Giang trả 80K ĂN" ngay 0-3s.
2. **Lịch sử + tutorial deep-dive** thành 12s scene riêng — giữ retention sau giây 30.
3. **Carousel 3-panel** so sánh quốc tế (Pháp/Ghana/VN) ở giây 76-90 → tăng share rate.
4. **FAO credibility stamp** cuối → giảm comment lo ngại an toàn.

## Risk specific long-form

- **Mid-clip drop** giây 30-35 (sau tutorial) — nếu retention drop > 30% → cắt tutorial xuống 8s clip sau.
- **Asset 13 file** (vs 8 short) → PHASE 4 mất 20-25 phút.
- **TikTok auto-flag "chuột"** → caption viết "ch.uột" 1-2 chỗ.

## Re-applicable cho clip Pillar B/D có depth tương tự
- Mắm bò hóc Cambodia (lịch sử fermentation + tutorial + so sánh)
- Casu Marzu Sardinia (lịch sử cấm + tutorial maggot + so sánh fermented other)
- Hákarl Iceland (lịch sử Viking + tutorial chôn cát + so sánh cured shark)

## Components đã production-tested ở clip 04
- `Carousel3Panel` (S06b) — verify tốt
- `StatOverlay` size 240 (S06_PRICE_KFC) — verify tốt
- `PhotoBackdrop` opacity 0.5 + fallback `#1A1A1A` (KHÔNG pillar.dark vàng nâu)
