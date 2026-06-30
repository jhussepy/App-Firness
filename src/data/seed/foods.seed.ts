import type { FoodItem } from '../models/nutrition';

function food(
  id: string,
  name: string,
  servingLabel: string,
  caloriesPerServing: number,
  proteinG: number,
  carbG: number,
  fatG: number
): FoodItem {
  return { id: `food-${id}`, name, servingLabel, caloriesPerServing, proteinG, carbG, fatG, isCustom: false };
}

export const seedFoods: FoodItem[] = [
  // Proteins
  food('chicken-breast', 'Chicken Breast (cooked)', '100 g', 165, 31, 0, 3.6),
  food('chicken-thigh', 'Chicken Thigh (cooked)', '100 g', 209, 26, 0, 10.9),
  food('ground-beef-90', 'Ground Beef 90/10 (cooked)', '100 g', 176, 20, 0, 10),
  food('salmon', 'Salmon (cooked)', '100 g', 208, 20, 0, 13),
  food('tuna-canned', 'Tuna, Canned in Water', '100 g', 116, 26, 0, 1),
  food('shrimp', 'Shrimp (cooked)', '100 g', 99, 24, 0.2, 0.3),
  food('egg', 'Egg, Whole', '1 large', 72, 6.3, 0.4, 4.8),
  food('egg-white', 'Egg White', '1 large', 17, 3.6, 0.2, 0.1),
  food('greek-yogurt', 'Greek Yogurt, Plain Nonfat', '170 g', 100, 17, 6, 0.7),
  food('cottage-cheese', 'Cottage Cheese, Low Fat', '100 g', 81, 11, 4, 1.9),
  food('whey-protein', 'Whey Protein Powder', '1 scoop (30 g)', 120, 24, 3, 1.5),
  food('tofu', 'Tofu, Firm', '100 g', 144, 15, 3, 8),
  food('tempeh', 'Tempeh', '100 g', 192, 20, 8, 11),
  food('black-beans', 'Black Beans, Cooked', '1 cup (172 g)', 227, 15, 41, 0.9),
  food('lentils', 'Lentils, Cooked', '1 cup (198 g)', 230, 18, 40, 0.8),
  food('chickpeas', 'Chickpeas, Cooked', '1 cup (164 g)', 269, 14.5, 45, 4.2),
  food('pork-loin', 'Pork Loin (cooked)', '100 g', 197, 27, 0, 9),
  food('turkey-breast', 'Turkey Breast (cooked)', '100 g', 135, 30, 0, 1),
  food('edamame', 'Edamame, Cooked', '1 cup (155 g)', 189, 17, 14, 8),

  // Carbs / grains
  food('white-rice', 'White Rice, Cooked', '1 cup (158 g)', 205, 4.3, 45, 0.4),
  food('brown-rice', 'Brown Rice, Cooked', '1 cup (195 g)', 216, 5, 45, 1.8),
  food('quinoa', 'Quinoa, Cooked', '1 cup (185 g)', 222, 8, 39, 3.6),
  food('oats', 'Rolled Oats, Dry', '1/2 cup (40 g)', 150, 5, 27, 2.5),
  food('whole-wheat-bread', 'Whole Wheat Bread', '1 slice', 81, 4, 14, 1.1),
  food('white-bread', 'White Bread', '1 slice', 75, 2.6, 14, 1),
  food('pasta', 'Pasta, Cooked', '1 cup (140 g)', 221, 8, 43, 1.3),
  food('sweet-potato', 'Sweet Potato, Baked', '1 medium (114 g)', 103, 2.3, 24, 0.2),
  food('potato', 'Potato, Baked', '1 medium (173 g)', 161, 4.3, 37, 0.2),
  food('tortilla-corn', 'Corn Tortilla', '1 (26 g)', 52, 1.4, 11, 0.6),
  food('tortilla-flour', 'Flour Tortilla', '1 (49 g)', 146, 4, 24, 3.6),
  food('bagel', 'Bagel, Plain', '1 (98 g)', 245, 10, 48, 1.5),
  food('granola', 'Granola', '1/2 cup (61 g)', 298, 7.5, 39, 13),
  food('cereal', 'Cereal, Whole Grain', '1 cup (40 g)', 150, 4, 32, 1.5),
  food('couscous', 'Couscous, Cooked', '1 cup (157 g)', 176, 6, 36, 0.3),

  // Fats / nuts / dairy
  food('avocado', 'Avocado', '1/2 medium (100 g)', 160, 2, 8.5, 14.7),
  food('almonds', 'Almonds', '1 oz (28 g)', 164, 6, 6, 14),
  food('peanut-butter', 'Peanut Butter', '2 tbsp (32 g)', 188, 8, 6, 16),
  food('olive-oil', 'Olive Oil', '1 tbsp (14 g)', 119, 0, 0, 13.5),
  food('walnuts', 'Walnuts', '1 oz (28 g)', 185, 4.3, 4, 18.5),
  food('cheddar-cheese', 'Cheddar Cheese', '1 oz (28 g)', 113, 7, 0.4, 9.3),
  food('mozzarella', 'Mozzarella, Part Skim', '1 oz (28 g)', 72, 6.9, 0.8, 4.5),
  food('whole-milk', 'Whole Milk', '1 cup (244 g)', 149, 7.7, 12, 8),
  food('skim-milk', 'Skim Milk', '1 cup (245 g)', 83, 8.3, 12, 0.2),
  food('almond-milk', 'Almond Milk, Unsweetened', '1 cup (240 g)', 39, 1.5, 1.4, 2.9),
  food('butter', 'Butter', '1 tbsp (14 g)', 102, 0.1, 0, 11.5),
  food('chia-seeds', 'Chia Seeds', '1 tbsp (12 g)', 58, 2, 5, 3.7),

  // Vegetables
  food('broccoli', 'Broccoli, Steamed', '1 cup (156 g)', 55, 3.7, 11, 0.6),
  food('spinach', 'Spinach, Raw', '1 cup (30 g)', 7, 0.9, 1.1, 0.1),
  food('mixed-salad', 'Mixed Green Salad', '2 cups (60 g)', 15, 1.4, 2.9, 0.2),
  food('carrots', 'Carrots, Raw', '1 cup (128 g)', 52, 1.2, 12, 0.3),
  food('bell-pepper', 'Bell Pepper', '1 medium (119 g)', 24, 1, 6, 0.2),
  food('tomato', 'Tomato', '1 medium (123 g)', 22, 1.1, 4.8, 0.2),
  food('cucumber', 'Cucumber', '1 cup (104 g)', 16, 0.7, 3.8, 0.1),
  food('green-beans', 'Green Beans, Steamed', '1 cup (125 g)', 44, 2.4, 10, 0.4),
  food('cauliflower', 'Cauliflower, Steamed', '1 cup (124 g)', 29, 2.3, 5.3, 0.6),
  food('zucchini', 'Zucchini, Cooked', '1 cup (180 g)', 27, 2, 5.5, 0.4),
  food('mushrooms', 'Mushrooms, Sauteed', '1 cup (156 g)', 44, 3.4, 4, 3.6),

  // Fruit
  food('banana', 'Banana', '1 medium (118 g)', 105, 1.3, 27, 0.4),
  food('apple', 'Apple', '1 medium (182 g)', 95, 0.5, 25, 0.3),
  food('orange', 'Orange', '1 medium (131 g)', 62, 1.2, 15, 0.2),
  food('blueberries', 'Blueberries', '1 cup (148 g)', 84, 1.1, 21, 0.5),
  food('strawberries', 'Strawberries', '1 cup (152 g)', 49, 1, 12, 0.5),
  food('grapes', 'Grapes', '1 cup (151 g)', 104, 1.1, 27, 0.2),
  food('mango', 'Mango', '1 cup (165 g)', 99, 1.4, 25, 0.6),
  food('pineapple', 'Pineapple', '1 cup (165 g)', 82, 0.9, 22, 0.2),
  food('watermelon', 'Watermelon', '1 cup (152 g)', 46, 0.9, 11.5, 0.2),
  food('dates', 'Dates, Dried', '3 pieces (24 g)', 67, 0.6, 18, 0),

  // Prepared / mixed
  food('greek-salad', 'Greek Salad', '1 bowl (250 g)', 220, 7, 12, 16),
  food('chicken-caesar-salad', 'Chicken Caesar Salad', '1 bowl (350 g)', 460, 38, 14, 28),
  food('beef-burrito-bowl', 'Beef Burrito Bowl', '1 bowl (450 g)', 650, 35, 65, 26),
  food('protein-shake', 'Protein Shake (whey + milk)', '1 shake', 260, 30, 14, 8),
  food('oatmeal-with-fruit', 'Oatmeal with Banana and Honey', '1 bowl (300 g)', 320, 9, 62, 5),
  food('grilled-chicken-plate', 'Grilled Chicken with Rice and Veggies', '1 plate (400 g)', 520, 42, 55, 12),
  food('salmon-quinoa-bowl', 'Salmon and Quinoa Bowl', '1 bowl (400 g)', 540, 36, 45, 22),
  food('veggie-stir-fry', 'Vegetable Stir Fry with Tofu', '1 bowl (350 g)', 310, 18, 28, 14),
  food('protein-bar', 'Protein Bar', '1 bar (60 g)', 220, 20, 24, 7),
  food('hummus', 'Hummus', '2 tbsp (30 g)', 70, 2, 6, 4.5),
];
