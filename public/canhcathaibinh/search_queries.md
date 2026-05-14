# 🔎 Search Queries — Clip 08 Canh Cá Rô Đồng Quỳnh Côi (LONG-FORM 90s · 7 scenes)

> Pipeline TDM auto-fetch ảnh/video từ Pexels / Pixabay / Mixkit / Wikimedia / Google CC.
> Mỗi shot có: source priority + keyword tiếng Anh + keyword tiếng Việt + pick rule.
> Fallback Freepik prompt khi auto-fetch không ra ảnh chuẩn (xem `freepik_prompts.md`).

---

## Strategy chung

- **Pillar B (đặc sản vùng miền)** → ưu tiên ảnh thực tế Pexels/Pixabay/Wikimedia/Google CC, vibe documentary
- **CC ưu tiên:** Pexels Videos cho hook, Pixabay/Wikimedia cho lịch sử/cảnh quê, Google CC cho quán Thái Bình thực tế
- **CRITICAL — KHÔNG cá rán nguyên con:** TẤT CẢ ảnh canh cá phải có **thịt cá đã gỡ xương + xào săn vàng nâu** trên mặt bát, KHÔNG bao giờ là nguyên con cá rán giòn. Auto-fetch nào ra ảnh cá rán → reject.
- **Cá rô đồng nhỏ:** ảnh cá phải nhỏ (2-3 ngón tay), thân đen xám. Không được fetch ảnh cá hồi / cá vược / cá nuôi to.
- **Bản quyền:** mỗi clip nguồn ≤ 4-5s. Tránh Netflix, Discovery, NatGeo, VTV. Log credits vào `credits.json`.

---

## S01_HOOK · image/video · 4s

**Pexels (priority 1):**
- `vietnamese fish noodle soup close up top down`
- `canh ca quynh coi bowl steam`
- `vietnamese countryside food bowl rustic`

**Pixabay (priority 2):**
- `vietnamese rice noodle fish bowl`
- `traditional fish soup vietnam`

**Google CC fallback:**
- `canh cá Quỳnh Côi cận cảnh bát gốm`
- `bún cá Thái Bình tô đầy`

⚠️ **Pick rule:** beauty shot top-down, bát gốm trắng/đất, có sợi bánh đa trắng + thịt cá xào săn vàng + thì là xanh. **REJECT** ảnh có nguyên con cá rán giòn.

---

## S02A_PHO_DAU_GIA_ROAD · image · 6s

**Wikimedia + Pixabay:**
- `vietnamese rural village road tree shaded`
- `northern vietnam countryside road traditional`
- `dau gia tree (Baccaurea ramiflora) tree-lined road vietnam`

**Google CC:**
- `Phố Dâu Gia thị trấn Quỳnh Côi`
- `con đường rợp bóng dâu gia làng quê Bắc Bộ`
- `thị trấn nhỏ Thái Bình đường rợp cây`

**Freepik fallback prompt:** xem `freepik_prompts.md` S02

⚠️ **Pick rule:** con đường nhỏ làng quê + cây dâu gia (hoặc cây xanh rợp bóng) hai bên · ánh chiều ấm · không có xe hơi hiện đại.

---

## S02B_MAP_QUYNH_COI · synth/image · 5s

**Synth (Remotion component):**
- Map vector Vietnam → zoom Thái Bình → highlight thị trấn Quỳnh Côi với pin amber `#D97742`

**Wikimedia fallback:**
- `Thai Binh province Vietnam map`
- `Quynh Phu district map`

✓ Khuyến nghị render bằng component `<MapZoom>` thay vì fetch ảnh map.

---

## S03A_BANH_DA_DRYING · image · 6s

**Pexels + Pixabay:**
- `vietnamese rice paper drying racks bamboo sun`
- `rice noodle sheets drying bamboo frames traditional`
- `vietnamese banh da village craft`

**Google CC:**
- `làng nghề bánh đa phơi nắng Bắc Bộ`
- `bánh đa làng Đợi xã Đông Hải Quỳnh Phụ`
- `giàn tre phơi bánh đa trắng`

⚠️ **Pick rule:** giàn tre + bánh đa trắng phơi nắng vàng · không có rooftop tile hiện đại · vibe làng quê Bắc Bộ.

---

## S03B_BANH_DA_MACRO · image · 6s

**Pexels:**
- `thin white rice noodles macro close up`
- `vietnamese rice noodle strands texture`
- `cooked rice noodles glistening macro`

**Google CC:**
- `sợi bánh đa làng Đợi macro trắng`
- `bánh đa Thái Bình sợi mảnh 3mm`

⚠️ **Pick rule:** sợi mảnh trắng trong (~3mm), tốt nhất là split: bánh đa sống + bánh đa nấu chín side-by-side.

---

## S04A_CA_RO_DONG_FRESH · image · 6s

**Pexels + Pixabay:**
- `small wild vietnamese climbing perch fresh`
- `ca ro dong mudfish fresh basket`
- `small freshwater fish dark scales banana leaf`

**Wikimedia:**
- `Anabas testudineus climbing perch`
- `Vietnamese mudfish fresh`

**Google CC:**
- `cá rô đồng tươi Bắc Bộ 2 ngón tay`
- `cá rô ruộng nước thân đen xám`

⚠️ **Pick rule:** cá nhỏ (8-12cm = 2-3 ngón tay), thân ĐEN XÁM, vảy bạc lấp lánh. **REJECT** ảnh cá to nuôi công nghiệp (cá rô đầu vuông to ~300-500g), cá hồi, cá vược.

---

## S04B_CA_RO_VS_NUOI_COMPARE · synth/image · 6s

**Synth (Remotion):** 2-column compare card render bằng `<CompareCard>` với 2 ảnh nhỏ + text label.

**Optional Google CC:**
- `cá rô đồng vs cá rô nuôi so sánh`
- `ca ro dong wild vs farmed compare`

✓ Khuyến nghị render synth bằng component.

---

## S05A_HAP_BAMBOO_STEAMER · image · 4s

**Pexels + Pixabay:**
- `bamboo steamer vietnamese small fish gentle steam`
- `xửng tre hấp cá steamer`
- `traditional vietnamese steamer kitchen`

**Google CC:**
- `xửng tre hấp cá rô đồng bốc hơi`
- `hấp cá lửa vừa nồi đất`

⚠️ **Pick rule:** xửng tre tròn, bốc hơi NHẸ (không phải khói đậm), có cá rô đồng nhỏ bên trong.

---

## S05B_DEBONING_HANDS · image · 4s

**Pexels:**
- `hands deboning cooked fish vietnamese kitchen`
- `craftsman fingers picking fish meat from bones`
- `vietnamese fish deboning banana leaf`

**Google CC:**
- `gỡ thịt cá rô đồng bằng tay khéo léo`
- `tách thịt cá khỏi xương`

⚠️ **Pick rule:** chỉ thấy đôi tay (không thấy mặt người) đang gỡ thịt cá nhỏ trên lá chuối / mâm gỗ.

---

## S05C_NUONG_THAN_GRILL · image · 5s

**Pexels + Pixabay:**
- `vietnamese fish meat grilling charcoal brazier turmeric`
- `marinated fish meat grilled hot coals`
- `vietnamese country kitchen grill flames`

**Google CC:**
- `nướng thịt cá ướp nghệ than hồng`
- `vỉ nướng cá rô đồng ướp gia vị`

⚠️ **Pick rule:** thịt cá nhỏ (đã gỡ xương) đặt vỉ nướng trên than hồng cam, ánh lửa ấm, hơi khói nhẹ. **KHÔNG phải nguyên con cá rán giòn**.

---

## S05D_HAM_XUONG_POT · image · 5s

**Pexels:**
- `large clay pot simmering broth slow stew`
- `vietnamese countryside kitchen bone broth pot steam`
- `pork bone broth simmering 16 hours`

**Google CC:**
- `nồi hầm xương heo cá rô đồng 16 tiếng`
- `nước dùng hầm liu riu nồi đất`

⚠️ **Pick rule:** nồi đất to / inox to, có xương heo (ống/sườn) lộ ra + xương cá nhỏ, bốc hơi nhẹ, vibe ninh chậm.

---

## S05E_XAO_WOK · image · 5s

**Pexels + Pixabay:**
- `cast iron wok stir fry fish meat shallots turmeric`
- `vietnamese kitchen wok sizzling shallots`
- `sautéed fish meat with fried onions golden brown`

**Google CC:**
- `chảo xào thịt cá rô đồng hành phi nghệ tươi`
- `xào thịt cá xèo lửa to 3 phút`

⚠️ **Pick rule:** chảo gang cũ, thịt cá đã gỡ xương đang xèo xào với hành phi vàng + nghệ tươi. **KHÔNG phải nguyên miếng cá to rán**.

---

## S06A_QUAN_BAY_QUYNH_COI · image · 4s

**Google CC + Facebook public:**
- `Quán Bẩy canh cá 63 Đào Đình Luyện Quỳnh Côi`
- `quán Bẩy chuyên canh cá rô đồng Thái Bình`
- `Quan Bay Quynh Coi Dao Dinh Luyen Thai Binh`

**Pexels fallback (generic Vietnamese eatery):**
- `vietnamese small countryside eatery wooden signboard`
- `traditional vietnamese food shop morning customers`

⚠️ **Pick rule:** quán nhỏ vỉa hè / mặt phố thị trấn, bàn ghế nhựa thấp đỏ, biển hiệu chữ viết tay/sơn đỏ. Khách (nếu có) silhouette/blur.

---

## S06B_VU_GIA_TRAN_HUNG_DAO · image · 3s

**Google CC + Facebook public:**
- `canh cá Vũ Gia Trần Hưng Đạo Quỳnh Côi`
- `Vu Gia canh ca Quynh Coi Thai Binh`
- `quán Vũ Gia phố Trần Hưng Đạo`

✓ Optional inset — nếu không có CC ảnh thật, chip text địa chỉ + phone là đủ.

---

## S06C_BON_MUA_QUYNH_HAI · image · 3s

**Google CC + Facebook public:**
- `quán Bốn Mùa canh cá Đoàn Xá Quỳnh Hải`
- `Bon Mua canh ca Quynh Coi`

✓ Optional inset.

---

## S06D_TRAN_HUNG_DAO_STREET · image · 4s

**Google CC + Wikimedia:**
- `phố Trần Hưng Đạo thị trấn Quỳnh Côi dãy quán san sát`
- `Quynh Coi town main street row of restaurants`
- `Tran Hung Dao street Quynh Coi market eateries`

⚠️ **Pick rule:** phố nhỏ thị trấn, nhiều biển hiệu quán ăn san sát hai bên · vibe sáng sớm chợ sớm.

---

## S07A_HERO_BOWL · image · 8s

**Pexels + Google CC:**
- `vietnamese fish noodle soup hero shot dramatic lighting`
- `canh ca quynh coi bowl chopsticks lifting noodles`
- `bún cá Thái Bình hero food photography`

**Pexels Video:**
- `vietnamese noodle soup steam slow motion close up`

⚠️ **Pick rule:** đũa gắp sợi bánh đa nâng lên, thịt cá xào săn vàng nâu trong bát (KHÔNG cá rán), thì là rắc trên mặt, hơi nóng ấm áp, ánh side-light vàng. Hero composition.

---

## S07B_RICE_PADDY_KENH · image/video · 5s

**Pexels + Pixabay:**
- `vietnamese rice paddy small canal sunset golden`
- `northern vietnam countryside rice fields water canal`
- `cánh đồng lúa dòng kênh nhỏ Bắc Bộ`

**Google CC:**
- `cánh đồng lúa Thái Bình chiều vàng`
- `kênh nhỏ ruộng đồng Quỳnh Phụ`

⚠️ **Pick rule:** cảnh thơ đồng lúa + kênh nhỏ + ánh chiều vàng · không có nhà cao tầng / xe hơi hiện đại.

---

## ⚠️ CONTENT-SAFE CHECKLIST

| Shot | Phải có | Phải KHÔNG có |
|------|---------|---------------|
| S01 hook | Bát canh cá top-down · thịt cá XÀO SĂN | Nguyên con cá rán giòn |
| S02A | Đường nhỏ rợp bóng dâu gia · vibe quê | Xe hơi hiện đại · nhà cao tầng |
| S03A | Giàn tre phơi bánh đa trắng | Bánh đa to / màu vàng / mì sợi to |
| S03B | Sợi bánh đa mảnh 3mm trắng trong | Mì sợi vàng / phở to |
| S04A | Cá rô đồng nhỏ 8-12cm thân đen xám | Cá hồi · cá vược · cá rô nuôi to 300-500g |
| S05A | Xửng tre hấp · hơi NHẸ | Khói đậm |
| S05B | Tay gỡ thịt cá khỏi xương | Mặt người · cá nguyên con |
| S05C | Thịt cá nướng vỉ than | Nguyên con cá rán giòn |
| S05D | Nồi xương heo + xương cá hầm | Nồi chỉ xương cá (cá quá nhỏ → không đủ) |
| S05E | Chảo xào thịt cá + hành phi | Cá rán nguyên miếng |
| S06A | Quán Bẩy / generic quán Quỳnh Côi | Quán chain hiện đại có brand lớn |
| S07A | Đũa gắp bánh đa · thịt xào săn | Khói đậm · cá rán |
| S07B | Cảnh thơ đồng lúa + kênh nhỏ | Cảnh đô thị |

---

## 🔧 PIPELINE NOTE

- Auto-fetch script: `scripts/fetch_assets.mjs --slug canhcathaibinh`
- Source priority: Pexels API → Pixabay → Mixkit → Wikimedia Commons → Google CC search
- Auto-reject heuristics: nếu metadata/title chứa `fried whole fish`, `salmon`, `tuna`, `farmed fish big` → skip
- Manual review queue: ảnh được fetch sẽ vào `_pick_proposed/`, user duyệt trước khi move sang `_pick/`
- Min count per scene: 1 ảnh primary + 1 fallback
- Format ưu tiên: image 1080×1920 vertical, video 1080×1920 ≤ 5s
