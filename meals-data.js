export const MEALS = {
  Mon: {
    breakfast: { dish: "Oats + 3 boiled eggs + banana", ingredients: "Oats 40g, 3 eggs (150g), 1 banana", cal: 460, protein: 28, cost: 15500, prep: "Steep oats in hot water 5 min; boil eggs; banana on the side." },
    lunch: { dish: "Rice + boiled chicken breast + water spinach", ingredients: "Rice 150g, chicken breast 200g, water spinach 150g", cal: 550, protein: 52, cost: 20000, prep: "Boil chicken with ginger; dip in salt-pepper-lime." },
    dinner: { dish: "Rice + tofu in tomato sauce + greens soup", ingredients: "Rice 120g, tofu 200g, 2 tomatoes, mustard greens 100g", cal: 500, protein: 26, cost: 13000, prep: "Simmer tofu in tomato sauce; light greens soup." },
    snack: { dish: "Unsweetened yogurt + 2 boiled eggs", ingredients: "Yogurt 150g, 2 eggs", cal: 300, protein: 22, cost: 12500, prep: "Eat within 30 min after training." }
  },
  Tue: {
    breakfast: { dish: "Egg baguette + milk", ingredients: "1 baguette, 2 eggs, unsweetened milk 200ml", cal: 420, protein: 24, cost: 17000, prep: "Fry eggs both sides, fill baguette; milk on the side." },
    lunch: { dish: "Rice + braised lean pork + boiled cabbage", ingredients: "Rice 150g, lean pork 180g, cabbage 150g", cal: 560, protein: 44, cost: 27000, prep: "Braise lean pork on low heat; boil cabbage until just done." },
    dinner: { dish: "Rice + steamed fish + greens", ingredients: "Rice 120g, fish 200g, mustard greens 100g, ginger, scallion", cal: 480, protein: 38, cost: 21000, prep: "Steam fish with ginger and scallion; boil greens." },
    snack: { dish: "2 boiled eggs + unsweetened milk", ingredients: "2 eggs, unsweetened milk 200ml", cal: 300, protein: 22, cost: 13000, prep: "Protein top-up snack." }
  },
  Wed: {
    breakfast: { dish: "Egg fried rice (light oil)", ingredients: "Cold rice 150g, 3 eggs, scallion, salt", cal: 460, protein: 24, cost: 12500, prep: "Crack eggs straight into rice; toss fast on high heat." },
    lunch: { dish: "Rice + pan-seared chicken breast + broccoli", ingredients: "Rice 150g, chicken breast 200g, broccoli 150g, garlic", cal: 540, protein: 52, cost: 22000, prep: "Season chicken with salt-pepper-garlic; sear both sides." },
    dinner: { dish: "Rice noodles + boiled lean pork + herbs", ingredients: "Rice noodles 150g, lean pork 150g, bean sprouts, herbs", cal: 450, protein: 34, cost: 27000, prep: "Slice boiled pork; serve over noodles with herbs and dip." },
    snack: { dish: "Unsweetened yogurt + 2 boiled eggs", ingredients: "Yogurt 150g, 2 eggs", cal: 300, protein: 22, cost: 12500, prep: "Eat after training." }
  },
  Thu: {
    breakfast: { dish: "Oats + 3 boiled eggs + banana", ingredients: "Oats 40g, 3 eggs, 1 banana", cal: 460, protein: 28, cost: 15500, prep: "Filling breakfast, steady energy." },
    lunch: { dish: "Rice + lemongrass chicken thigh (skinless) + water spinach", ingredients: "Rice 150g, chicken thigh 220g (skinless), water spinach 150g", cal: 560, protein: 44, cost: 19000, prep: "Braise chicken with lemongrass; remove skin to cut fat." },
    dinner: { dish: "Rice + tofu stuffed with pork (steamed) + soup", ingredients: "Rice 120g, tofu 200g, ground pork 80g, mushroom, scallion", cal: 500, protein: 32, cost: 20500, prep: "Hollow tofu, stuff with pork + mushroom, steam 15 min." },
    snack: { dish: "2 boiled eggs + unsweetened milk", ingredients: "2 eggs, unsweetened milk 200ml", cal: 300, protein: 22, cost: 13000, prep: "Afternoon snack." }
  },
  Fri: {
    breakfast: { dish: "Egg baguette + milk", ingredients: "1 baguette, 2 eggs, unsweetened milk 200ml", cal: 420, protein: 24, cost: 17000, prep: "Fry eggs, fill baguette, milk on the side." },
    lunch: { dish: "Rice + boiled chicken breast + winter melon soup", ingredients: "Rice 150g, chicken breast 200g, winter melon 150g, scallion", cal: 500, protein: 50, cost: 19500, prep: "Boil chicken; light winter melon soup." },
    dinner: { dish: "Rice + steamed egg-pork loaf + boiled greens", ingredients: "Rice 120g, 3 eggs, ground pork 80g, fish sauce", cal: 500, protein: 34, cost: 22000, prep: "Mix eggs + pork + fish sauce; steam or pan-cook." },
    snack: { dish: "Unsweetened yogurt + 2 boiled eggs", ingredients: "Yogurt 150g, 2 eggs", cal: 300, protein: 22, cost: 12500, prep: "Eat after training." }
  },
  Sat: {
    breakfast: { dish: "Beef pho (simple homemade)", ingredients: "Pho noodles 150g, lean beef 100g, sprouts, herbs, broth", cal: 450, protein: 28, cost: 33000, prep: "Thin-slice beef; pour hot broth over; add sprouts + herbs." },
    lunch: { dish: "Rice + black-pepper braised pork + water spinach", ingredients: "Rice 150g, lean pork 180g, water spinach 150g", cal: 560, protein: 44, cost: 28000, prep: "Braise pork with black pepper; boil water spinach." },
    dinner: { dish: "Rice + sour fish soup (light) + greens", ingredients: "Rice 120g, fish 180g, tomato, pineapple, tamarind, greens", cal: 480, protein: 34, cost: 19500, prep: "Light sour soup, minimal sugar; serve with greens." },
    snack: { dish: "Unsweetened yogurt + 2 boiled eggs", ingredients: "Yogurt 150g, 2 eggs", cal: 300, protein: 22, cost: 12500, prep: "Snack." }
  },
  Sun: {
    breakfast: { dish: "Chicken sticky rice (light portion)", ingredients: "Glutinous rice 100g, chicken breast 120g, fried shallots, fish sauce", cal: 480, protein: 30, cost: 13000, prep: "Steam sticky rice; shred boiled chicken on top; keep portion modest." },
    lunch: { dish: "Rice + pan-seared chicken breast + salad", ingredients: "Rice 150g, chicken breast 200g, lettuce, tomato, cucumber", cal: 520, protein: 52, cost: 21000, prep: "Sear chicken; serve with fresh salad + lime." },
    dinner: { dish: "Rice + tofu braised with egg + cabbage", ingredients: "Rice 120g, tofu 150g, 2 eggs, cabbage", cal: 480, protein: 28, cost: 15000, prep: "Braise tofu with egg; season fish sauce-sugar-scallion." },
    snack: { dish: "2 boiled eggs + unsweetened milk", ingredients: "2 eggs, unsweetened milk 200ml", cal: 300, protein: 22, cost: 13000, prep: "Afternoon / post-workout snack." }
  }
};
