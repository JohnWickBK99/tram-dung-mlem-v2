# Search queries — 13 shot × 5-6 nguồn

> Pipeline: thử **CC0 (Pexels/Pixabay/Mixkit)** → fallback **Wikimedia** → fallback **YouTube CC** → fallback **Google Images** → cuối cùng Freepik manual.
> Mỗi shot ưu tiên 4-6 candidate vào `raw_pool/SXX/`, script `pick_best.py` tự score chọn.

---

## S01_USA — exterminator USA chuột (image)

```
asset_fetch.py: "rat exterminator USA pest control" 4
asset_fetch.py: "pest control technician rodent" 4
google_fetch.py: "rat extermination service usa" 3
google_fetch.py: "pest control truck rat" 2
```
**Tone:** corporate, đồng phục, xe pest control. Tránh ảnh chuột bị giết gore.

## S01_VN — chuột đồng nướng lu (image, REUSE cho S10_VN)

```
asset_fetch.py: "vietnam grilled rat clay jar food" 4
google_fetch.py: "chuột đồng nướng lu an giang" 4
google_fetch.py: "vietnamese field rat dish" 3
```
**Tone:** food close-up, da vàng giòn, thấy lu đất. Tránh ảnh quá raw.

## S02_SETUP_PHUDAT — chợ Phù Dật / cánh đồng An Giang (image)

```
asset_fetch.py: "vietnam mekong delta market" 4
asset_fetch.py: "an giang rice field landscape" 4
google_fetch.py: "chợ phù dật an giang" 4
google_fetch.py: "an giang chợ chuột" 3
```

## S03_HISTORY_NUOCNOI — mùa nước nổi đồng bằng sông Cửu Long (image)

```
asset_fetch.py: "mekong delta flooding season" 4
asset_fetch.py: "vietnam flood paddy field" 4
google_fetch.py: "mùa nước nổi miền tây" 4
google_fetch.py: "đồng bằng sông cửu long ngập nước" 3
```

## S04_PROCESS_NGUYENLIEU — chuột đồng vs chuột cống (split image)

### S04_DONG (chuột đồng sạch)
```
asset_fetch.py: "field rat asia rice paddy" 4
google_fetch.py: "chuột đồng sạch ăn lúa" 3
```

### S04_CONG (chuột cống texture)
```
asset_fetch.py: "sewer rat dirty texture" 3
google_fetch.py: "chuột cống đô thị" 2
```
**Lưu ý:** chọn ảnh không gore, chỉ texture đối lập. Ưu tiên ảnh minh hoạ vector/foodtoon style.

## S05_TUTORIAL_LU_DEEP — tutorial nướng lu 4 step (video)

```
youtube_fetch.py: "vietnam clay jar grilled meat tutorial" 2 --cc-only
youtube_fetch.py: "chuột đồng nướng lu cách làm" 2
asset_fetch.py: "clay pot cooking vietnam" 4
google_fetch.py: "lu đất nướng chuột" 3
```
**Cần:** clip 12s combine 4 panel (làm sạch / treo lu / nướng than / da giòn).

## S06_BITE_REACTION — money shot bite (video)

```
youtube_fetch.py: "crispy meat bite slow motion" 2 --cc-only
asset_fetch.py: "vietnamese grilled meat closeup" 4
google_fetch.py: "chuột đồng nướng lu close up" 3
```
**Cần:** 4-5s slow-mo cắn miếng, da giòn nứt. Có thể split 2 clip ngắn.

## S07_FLAVOR_GATATHO — gà ta + thỏ (image)

### S07_GATA
```
asset_fetch.py: "free range chicken vietnam" 4
google_fetch.py: "gà ta nướng" 3
```

### S07_THO
```
asset_fetch.py: "rabbit meat dish" 4
google_fetch.py: "thịt thỏ" 3
```

## S08_PHUDAT_MARKET — b-roll chợ Phù Dật (video)

```
youtube_fetch.py: "phu dat rat market vietnam" 2
youtube_fetch.py: "chợ phù dật an giang" 2
asset_fetch.py: "vietnam local market vendor" 4
google_fetch.py: "chợ chuột phù dật" 3
```
**Cần:** 8-10s b-roll chợ + map An Giang flash.

## S10_GLOBAL_PARIS — Paris siege 1870 (image, Wikimedia ưu tiên)

```
wikimedia_fetch.py: "Siege of Paris 1870" 3
wikimedia_fetch.py: "Defense de Paris 1870 illustration" 3
asset_fetch.py: "paris siege 1870 historical illustration" 2
google_fetch.py: "siege of paris 1870 rat food" 2
```
**Fallback hardcode URL nếu fail:**
- `https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Defence_of_Paris_1870.jpg/1024px-Defence_of_Paris_1870.jpg`

## S10_GLOBAL_GHANA — grasscutter Ghana (image)

```
wikimedia_fetch.py: "Thryonomys swinderianus" 3
wikimedia_fetch.py: "grasscutter ghana cane rat" 3
asset_fetch.py: "cane rat ghana market" 2
google_fetch.py: "grasscutter ghana delicacy" 2
```
**Fallback:** `https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Greater_cane_rat.jpg/1024px-Greater_cane_rat.jpg`

## S11_FAO_HEALTH — synth (không cần fetch)

BG cream + FAO logo SVG inline + quote box outline + stamp ✅ AN TOÀN rotate -8°.

## S12_CTA — synth (không cần fetch)

BG đen text vàng + Mèo Mlem `assets/mascot/mlem-happy.png` (đã có sẵn).

---

## Fetch order recommend (tối ưu thời gian)

1. **Batch 1 (parallel):** S02, S03, S04_DONG, S04_CONG, S07_GATA, S07_THO — 6 ảnh CC. ~5 phút.
2. **Batch 2:** S01_USA, S01_VN — 2 ảnh quan trọng nhất, manual review nếu cần.
3. **Batch 3:** S10_PARIS, S10_GHANA — 2 ảnh Wikimedia (fallback URL nếu fail).
4. **Batch 4 (chậm nhất):** S05 video 12s, S06 video bite 7s, S08 video b-roll 10s. ~10-15 phút.
5. **Total:** ~20-25 phút PHASE 4.
