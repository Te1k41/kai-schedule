# Input — Kai fitness program

## Goal
Lose fat AND build muscle (recomposition).

## Fitness level
True beginner. Keep existing "keep 3 days" pattern.

## Stats
- Height: 165cm
- Weight: 82kg
- Age: 23
- BMI ~30.1 (obese range) — fat loss is the priority driver of the recomp, protein target must stay high to preserve muscle during the deficit.

## Available resources
- 3 days/week (Mon/Wed/Fri), matches existing schedule.html training slot 18:30-19:00 (~30 min window)
- Home only. Fragile home — NO free weights/equipment that could damage things. Bodyweight-only, or resistance bands at most (silent, no swing risk). No gym.

## Injury history
None reported.

## Existing program (already live in schedule.html — DO NOT contradict, iterate on top of it)
- Mon/Wed/Fri 18:30-19:00: "Full-Body A" bodyweight circuit — wall push-up, assisted squat, glute bridge, superman hold, dead bug, wall sit. 2 sets each, 60-90s rest, ~25 min.
- Tue/Thu/Fri(non-train)/other weekdays: 30 min brisk interval walk.
- Sat: 30 min interval walk. Sun: 30+ min long easy walk.
- Existing meal plan (MEALS object in schedule.html): lean-protein Vietnamese home meals, roughly 1900-2150 kcal/day, protein 22-52g per meal, cost-tracked in VND. Sunday = weigh-in day ("judge the 3-week trend, not any single day").
- User has ADHD: needs small concrete steps, checklists over prose, short instructions, no big walls of text. Prefers terminal/editor, not gym.

## Constraints for program design
- Keep session length ~25-30 min (fits the existing 18:30-19:00 slot) unless user is told explicitly a longer block is worth carving out.
- 3 training days/week fixed (Mon/Wed/Fri) — do not increase frequency.
- Bodyweight-only, silent-friendly, nothing that risks breaking things in a small fragile home.
- Nutrition plan should build on top of the existing MEALS structure/cost level (VND, home-cooked Vietnamese) rather than replacing it wholesale — adjust portions/macros, don't demand a new cuisine.
- Deliverables should be usable as an update to schedule.html later (progressive periodized version of "Full-Body A"), but for this pipeline just produce the _workspace docs per skill spec.
