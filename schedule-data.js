import { MEALS } from "./meals-data.js";

export const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
export const DAY_FULL = { Mon:"Monday", Tue:"Tuesday", Wed:"Wednesday", Thu:"Thursday", Fri:"Friday", Sat:"Saturday", Sun:"Sunday" };
export const TRAIN_DAYS = new Set(["Mon", "Wed", "Fri"]);

const FULL_BODY_A_NOTE = "2 sets each, 60-90s rest — Wall push-up · Assisted squat · Glute bridge · Superman hold · Dead bug · Wall sit. ~25 min.";
const FULL_BODY_A_DETAIL = "Warm-up (2-3 min): march in place 30s · arm circles 20s each way · hip circles 20s each way · 5 slow partial squats · shoulder rolls 15s.\n\nMain — 2 sets each, rest 60-90s:\n1. Wall Push-up — 8-12 reps. Body straight, elbows ~45°, chest near wall.\nEasier: stand closer. Harder: feet back / incline.\n2. Assisted Squat — 8-12 reps. Knees over toes, weight in heels, chest up.\nEasier: more hand support. Harder: free squat, 3s down.\n3. Glute Bridge — 10-15 reps. Drive through heels, squeeze glutes, ribs down.\nEasier: partial lift. Harder: 2-3s pause / single leg.\n4. Superman Hold — 20-30s. Lift with back not neck, eyes down, small lift.\nEasier: chest+arms only. Harder: hold up to 45s.\n5. Dead Bug — 6-8/side. Low back pressed flat, move slow, exhale on extend.\nEasier: legs only. Harder: limbs closer to floor.\n6. Wall Sit — 15-30s. Knees over ankles, back flat on wall, breathe.\nEasier: don't slide as low. Harder: toward 90°, +time.\n\nCool-down (2-3 min): doorway chest stretch 20s · standing quad stretch 20s each · standing hamstring reach 20s · cat-cow x5 · child's pose 30s.\n\nMuscle burn is OK. Sharp or joint pain means stop.\n\nProgress: add reps first, creeping up within the range each session. At the top of the range for 2 weeks straight, move to the harder variation. Log it in the tracker — beat last week's number, even by one rep. Too tired for the full session? Just the warm-up + one set of wall push-ups still counts — it keeps the streak alive.";

const INTERVAL_WALK_NOTE = "30 min brisk walk — get the heart rate up.";
const INTERVAL_WALK_DETAIL = "A brisk 30 min walk, outdoors if you can. This is a non-lifting training day — the goal is simply a pace that raises your heart rate, not a strict interval structure.";

const LONG_WALK_NOTE = "A longer, easy-paced walk — no rush.";
const LONG_WALK_DETAIL = "30+ min at an easy, conversational pace. Sunday's walk is about time on your feet, not intensity — a good one for headphones or a podcast.";

const LEARNING_NOTE = "Alternate nights: Security+ study, or a hands-on lab.";
const LEARNING_DETAIL = "Alternate night to night between two tracks:\n\nDeep study — Professor Messer's free SY0-701 course, in order. Watch one lesson for the current domain, write your own notes, then do the matching practice questions while it's fresh.\nDomain order: 1) General Security Concepts 2) Threats, Vulnerabilities & Mitigations 3) Security Architecture 4) Security Operations 5) Security Program Management. Domains 2 and 4 are the biggest by exam weight.\n\nHands-on labs — continue TryHackMe's SOC Level 1 path from where you left off, or run one LetsDefend alert-triage scenario start to finish. Keep a running doc of what you did — this becomes portfolio write-ups later.\n\nCheck the Roadmap page for exactly what's next.";

function mealBlock(meal, slot) {
  return {
    label: `${slot}: ${meal.dish}`,
    note: `${meal.cal} kcal · ${meal.protein}g protein · ${meal.cost.toLocaleString()}₫`,
    detail: `Ingredients: ${meal.ingredients}\n\n${meal.prep}`
  };
}

export function weekdayTemplate(day) {
  const m = MEALS[day];
  const snackBlock = mealBlock(m.snack, "Snack");
  const trainingBlock = TRAIN_DAYS.has(day)
    ? { cat: "fitness", label: "Full-Body A — bodyweight workout", note: FULL_BODY_A_NOTE, detail: FULL_BODY_A_DETAIL }
    : { cat: "fitness", label: "Interval walk", note: INTERVAL_WALK_NOTE, detail: INTERVAL_WALK_DETAIL };
  return [
    { start: "06:45", end: "07:15", cat: "life", label: "Wake + intention" },
    { start: "07:15", end: "07:45", cat: "life", ...mealBlock(m.breakfast, "Breakfast") },
    { start: "07:45", end: "08:00", cat: "life", label: "Commute" },
    { start: "08:00", end: "12:00", cat: "work", label: "Work", ...(day === "Mon" ? { note: "Take a 2 min break each hour." } : {}) },
    { start: "12:00", end: "13:00", cat: "life", ...mealBlock(m.lunch, "Lunch"), label: `Lunch + walk: ${m.lunch.dish}` },
    { start: "13:00", end: "17:00", cat: "work", label: "Work" },
    { start: "17:00", end: "17:30", cat: "life", ...snackBlock, note: `${snackBlock.note} · pre-workout` },
    { start: "17:30", end: "18:30", cat: "life", label: "Commute / out" },
    { start: "18:30", end: "19:00", ...trainingBlock },
    { start: "19:00", end: "19:30", cat: "life", ...mealBlock(m.dinner, "Dinner") },
    { start: "19:30", end: "20:30", cat: "study", label: "Learning — Security+ or hands-on labs", note: LEARNING_NOTE, detail: LEARNING_DETAIL },
    { start: "20:30", end: "22:30", cat: "life", label: "Free time" },
    { start: "22:30", end: "23:00", cat: "life", label: "Wind-down — screens off" },
    { start: "23:00", end: "06:45", cat: "life", label: "Sleep", note: "8 hours. Phone down — tomorrow's you will thank tonight's you." }
  ];
}

export function defaultWeekSeed() {
  const week = {};
  for (const d of DAYS) {
    week[d] = (d === "Sat" || d === "Sun") ? weekendTemplate(d) : weekdayTemplate(d);
  }
  return week;
}

export function weekendTemplate(day) {
  const m = MEALS[day];
  if (day === "Sat") {
    return [
      { start: "06:45", end: "07:15", cat: "life", label: "Wake" },
      { start: "07:15", end: "07:45", cat: "life", ...mealBlock(m.breakfast, "Breakfast") },
      { start: "07:45", end: "08:00", cat: "life", label: "Free time" },
      { start: "08:00", end: "12:00", cat: "life", label: "Chores / project" },
      { start: "12:00", end: "13:00", cat: "life", ...mealBlock(m.lunch, "Lunch") },
      { start: "13:00", end: "17:00", cat: "life", label: "Project / learning" },
      { start: "17:00", end: "17:30", cat: "life", label: "Meal prep" },
      { start: "17:30", end: "18:00", cat: "life", label: "Free time" },
      { start: "18:00", end: "18:30", cat: "fitness", label: "Interval walk", note: INTERVAL_WALK_NOTE, detail: INTERVAL_WALK_DETAIL },
      { start: "18:30", end: "19:00", cat: "life", ...mealBlock(m.dinner, "Dinner") },
      { start: "19:00", end: "22:30", cat: "life", label: "Free time" },
      { start: "22:30", end: "23:00", cat: "life", label: "Wind-down — screens off" },
      { start: "23:00", end: "06:45", cat: "life", label: "Sleep", note: "8 hours. Phone down — tomorrow's you will thank tonight's you." }
    ];
  }
  return [
    { start: "06:45", end: "07:15", cat: "life", label: "Wake" },
    { start: "07:15", end: "07:45", cat: "life", ...mealBlock(m.breakfast, "Breakfast") },
    { start: "07:45", end: "08:00", cat: "life", label: "Free time" },
    { start: "08:00", end: "12:00", cat: "life", label: "Rest / weekly review", note: "Weigh in and log it — judge the 3-week trend, not any single day." },
    { start: "12:00", end: "13:00", cat: "life", ...mealBlock(m.lunch, "Lunch") },
    { start: "13:00", end: "17:30", cat: "life", label: "Meal prep — 15 boxes", note: "Cook and portion meals for the week ahead into containers." },
    { start: "17:30", end: "18:00", cat: "life", label: "Free time" },
    { start: "18:00", end: "18:30", cat: "fitness", label: "Long walk", note: LONG_WALK_NOTE, detail: LONG_WALK_DETAIL },
    { start: "18:30", end: "19:00", cat: "life", ...mealBlock(m.dinner, "Dinner") },
    { start: "19:00", end: "20:30", cat: "life", label: "Free time" },
    { start: "20:30", end: "22:30", cat: "life", label: "Prep for the week", note: "Lay out clothes, check the Roadmap, get ahead of Monday." },
    { start: "22:30", end: "23:00", cat: "life", label: "Wind-down — screens off" },
    { start: "23:00", end: "06:45", cat: "life", label: "Sleep", note: "8 hours. Phone down — tomorrow's you will thank tonight's you." }
  ];
}
