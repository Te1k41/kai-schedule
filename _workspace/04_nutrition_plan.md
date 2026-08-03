# Nutrition Integration Table

## Assumptions & Calculation
- **BMR** (Mifflin-St Jeor, using male coefficients — no gender specified in intake; flag for correction if wrong, ~165 kcal/day swing): `10×82 + 6.25×165 - 5×23 + 5` = **1741 kcal**
- **Activity multiplier**: 1.375 (lightly active) — sedentary WFH desk job as the base, but *some* structured movement happens 7/7 days (3× bodyweight circuit + daily brisk/easy walks already in schedule.html), so plain "sedentary" (1.2) undercounts it.
- **TDEE**: 1741 × 1.375 ≈ **2395 kcal/day**
- **Deficit used**: **18%** (mid-point of the architect's 15–20% recommended range — moderate, not aggressive, per BMI ~30 + muscle-retention goal) → average target **≈1960 kcal/day**
- **Protein used**: **2.0 g/kg** = **165 g/day** (mid-point of the 1.6–2.2 g/kg / 130–180 g floor the architect set — high end justified because this is a fat-loss-priority cut, protein needs rise as deficit tightens)
- Calories are **cycled**, not flat: higher on training days (more fuel + bigger post-workout window), lower on rest days, protein held constant both types of day (protein doesn't need to cycle — ISSN position stand). Weighted average of the two below ≈1960 kcal, matching the TDEE−18% target.

**Reality check against the current plan**: the actual MEALS totals in schedule.html sum to ~1720–1820 kcal/day (not the ~1900–2150 noted in the input — recompute confirms lower), which is already a ~25% deficit — steeper than the architect wants. Current protein is a flat ~126–132 g/day across every day, under the 165 g target by ~35 g. **Net instruction to the meal plan: add calories (mostly carbs, training days) and add protein (every day) — don't cut further.**

## Nutrition Targets
| Item | Training Day (Mon/Wed/Fri) | Rest Day (Tue/Thu/Sat/Sun) | Basis |
|------|-------------|----------|-------|
| Calories | ~2100 kcal | ~1850 kcal | Weighted avg (3×2100 + 4×1850)/7 ≈ 1960 kcal = TDEE 2395 × 0.82 |
| Carbohydrates | 220g (2.7 g/kg) | 150g (1.8 g/kg) | Carb-cycled: more fuel/glycogen refill on lifting days; session is short (25-30min) bodyweight circuit so not endurance-level carb needs |
| Protein | 165g (2.0 g/kg) | 165g (2.0 g/kg) | Constant — protects muscle regardless of training/rest; mid-point of architect's 1.6-2.2 g/kg floor |
| Fat | 62g (0.76 g/kg) | 66g (0.8 g/kg) | Kept ≥0.7 g/kg both days for hormonal health; slightly higher on rest day to fill calories since carbs are lower |

*(Current plan is flat ~126-132g protein every day — the fix is +30-35g protein daily, not a training/rest split on protein.)*

## Training Day Nutrition Timing
Training slot is fixed at **18:30–19:00** (30 min). Schedule.html's own blocks around it: Commute/out 17:00–18:30, Dinner 19:00–19:30. This timing is already close to ideal — dinner sits right in the post-workout window. The one gap: **the `snack` meal exists in the MEALS data but is never actually placed on the timetable** (no `mealBlock(m.snack, ...)` call in `weekdayTemplate()`). That snack is the natural pre-workout meal — it should be eaten during the 17:00–18:30 commute/out block, not left unscheduled.

### Pre-Workout (~17:00–17:30, during "Commute / out" block — ~1–1.5h before training)
- **Purpose**: Top up energy without a heavy stomach for a bodyweight circuit, avoid training in a post-work energy dip
- **Recommended Intake**: The existing `snack` meal (yogurt + 2 eggs, or 2 eggs + milk) is protein-heavy but carb-light (~10-15g carb) — fine as-is for a short session, but add a piece of fruit (banana, or whatever's on hand) if energy feels low pre-workout
- **Macros**: Carbs 20-30g, Protein 20-25g (existing snack is ~22g protein — keep it, just relabel timing)
- **Example Meal**: Unsweetened yogurt + 2 boiled eggs + banana

### Intra-Workout (during exercise)
- **Not applicable** — session is 25-30 min, below the 60-min threshold for intra-workout fueling per ISSN guidance. Water only, sip as needed.

### Post-Workout (19:00–19:30, dinner block — already 0 min after training ends)
- **Purpose**: Recovery, muscle protein synthesis, glycogen replenishment
- **Recommended Intake**: The existing dinner already does this job (rice + lean protein + veg) — just needs a slightly larger rice/carb portion on training days specifically (see Meal-by-Meal table below)
- **Macros**: Carbs 60-70g, Protein 30-40g (dinner already averages 26-38g protein — close, small bump needed)

## Meal-by-Meal Diet Guide
Adjustments to layer onto the **existing** MEALS object (don't replace dishes — adjust portions):

| Meal | Training Day Adjustment | Rest Day Adjustment | Target Calories |
|------|---------------------|-----------------|----------|
| Breakfast | Unchanged (already carb+protein balanced, e.g. oats+eggs+banana) | Unchanged | ~440-460 |
| Lunch | Unchanged — already the highest-protein meal (44-52g) | Unchanged | ~500-560 |
| Snack (reposition to 17:00-17:30, pre-workout) | Add 1 piece fruit (~15g carb) to existing yogurt/eggs snack | Keep as-is, or move to afternoon as a protein top-up | ~330-350 (train) / ~300 (rest) |
| Dinner (post-workout, 19:00-19:30) | Add +50g rice (+~65 kcal, +15g carb) to the existing dish | Unchanged | ~550-570 (train) / ~480-500 (rest) |
| **Daily protein top-up** (every day, any meal) | Add 1 extra egg or +50g lean protein to lunch or dinner (+~8-12g protein) | Same | +~50-70 kcal |

This lands training days around ~2080-2130 kcal / ~160-170g protein, rest days around ~1830-1870 kcal / ~155-165g protein — both within a reasonable band of the targets above without inventing new dishes, new cuisine, or a new cost tier.

## Supplement Guide
| Supplement | Evidence Grade | Dose | Timing | Effect | Notes |
|-----------|---------------|------|--------|--------|-------|
| Creatine Monohydrate | A | 3-5g/day | Anytime, consistency matters more than timing | Strength retention + slight muscle support during a cut | Cheap, well-studied, safe long-term. Stay hydrated. Not currently needed to hit any target — purely optional upside. |
| Whey Protein | A | 20-30g | If daily protein target (165g) is hard to hit via food alone | Convenient protein top-up | Food-first: the existing egg/chicken/fish/tofu diet can hit 165g without it. Only add if the +30-35g adjustment above is genuinely hard to fit in. |
| Caffeine | A | 100-150mg (~1.5-2mg/kg, conservative) | **Skip, or only very small dose, before the 18:30 session** | Modest performance/focus boost | Session ends 19:00, sleep starts 22:30-23:00 — caffeine's ~5h half-life means a pre-workout dose lands too close to bedtime. Given the ADHD + fixed 8h sleep target, this is a net negative here. Skip pre-workout caffeine; morning coffee (well before work) is fine. |
| Vitamin D3 | B | 1000-2000 IU/day | With a meal containing fat | General health, common desk-worker deficiency | Optional, not performance-critical. Food-first alternative: more sun exposure during walks. |

**No doping-related concerns** — this is a personal recomposition program, not competitive/tested sport. All supplements above are non-banned in any federation context if that ever changes.

## Hydration Plan
Ho Chi Minh City climate (hot/humid) pushes fluid needs above temperate-climate defaults.

| Timing | Target Amount | Notes |
|--------|--------------|-------|
| Baseline (spread through the day) | ~2.9L (35ml/kg × 82kg) | Water/unsweetened tea; existing meals already include soups which count toward this |
| Before exercise (during 17:00-18:30 window) | 300-500ml | Finish ~30 min before the 18:30 start |
| During exercise (18:30-19:00) | Sip as needed, ~150-250ml total | Short session, low sweat loss — don't overthink this one |
| After exercise | 300-500ml with dinner | Home training in a hot climate — replace what's lost even for a short session |
| Rest/walk days (Tue/Thu/Sat/Sun) | +300-500ml around the walk | Same logic, walks are outdoors and Vietnam is hot |

No electrolyte supplementation needed for sessions this short/moderate — plain water is sufficient. Reassess only if Kai reports cramping or the walk durations increase significantly.

## Weekly Nutrition Adjustments
| Phase | Period | Calorie Adjustment | Macro Adjustment | Notes |
|-------|--------|--------------------|-----------------|-------|
| Adaptation | Wk 1-2 | Baseline as above (train 2100 / rest 1850) | Protein 165g/day fixed | Focus purely on hitting the protein floor consistently — biggest lever, easiest to slip on |
| Accumulation | Wk 3-6 | Hold baseline; re-check at Wk 3 and Wk 6 weigh-in trend | Unchanged | If the 3-week trend shows <0.3%/week bodyweight loss, tighten deficit by ~5% (drop ~100 kcal, from carbs first) |
| Intensification | Wk 7-9 | Hold baseline unless recovery suffers | If sleep/soreness/RPE reports run high, add 100-150 kcal via carbs on training days only | Harder exercise variants land here — don't let the deficit choke recovery mid-phase |
| Deload | Wk 10 | Training days drop to rest-day level (~1850 kcal) | Protein stays 165g | Volume is cut 50% this week — matching intake down avoids an unintended surplus |
| Re-accumulation | Wk 11-12 | Return to Wk 1-9 baseline (train 2100 / rest 1850) | Unchanged | Re-check weigh-in trend at Wk 12 — bodyweight will likely be lower, so TDEE needs a full recalculation before Wk 13 restarts the training cycle |

**Expected pace at these numbers**: ~430 kcal/day average deficit → ~0.4kg/week fat loss (~0.5% bodyweight/week), which is an appropriate, muscle-sparing rate for BMI ~30. If Sunday's 3-week trend shows faster loss than this, that's a signal to *add* calories, not celebrate — too-fast loss on a beginner recomp risks muscle loss.

## Notes for Template Builder
Tracking items to add (relayed from nutrition side, on top of what program-architect already specified):
- **Sunday weigh-in** (already existing convention) — judge 3-week trend, not single readings
- **Daily protein intake (g)** — the single highest-leverage adherence metric here, given the current gap is ~35g/day short
- **Daily calorie adherence** (rough — training day ~2100 / rest day ~1850 target vs actual)
- **Waist circumference**, monthly — better recomp signal than scale weight alone (already flagged by program-architect, seconding it — matters more here than usual since the goal is recomp, not pure weight loss)
- **Hydration**, optional simple checkbox (glasses/bottles per day) given the climate
- **Pre-workout snack eaten (Y/N)** on training days — this is a new schedule block that doesn't exist yet (the `snack` meal in MEALS is defined but never placed in `weekdayTemplate()`); worth flagging to whoever eventually wires this into schedule.html
