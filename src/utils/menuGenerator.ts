import { MenuItem } from '../types';

const MAIN_NAMES = [
  'Grilled Chicken', 'Beef Steak', 'Salmon Fillet', 'Vegetable Curry', 'Pasta Carbonara',
  'Turkey Sandwich', 'Mushroom Risotto', 'BBQ Ribs', 'Fish Tacos', 'Quinoa Bowl',
  'Lamb Chops', 'Tofu Stir Fry', 'Burger Deluxe', 'Chicken Teriyaki', 'Shrimp Scampi'
];

const SIDE_NAMES = [
  'French Fries', 'Caesar Salad', 'Garlic Bread', 'Steamed Broccoli', 'Mashed Potatoes',
  'Coleslaw', 'Onion Rings', 'Rice Pilaf', 'Roasted Vegetables', 'Mac and Cheese'
];

const DRINK_NAMES = [
  'Fresh Orange Juice', 'Iced Coffee', 'Green Tea', 'Sparkling Water', 'Coca Cola',
  'Mango Smoothie', 'Hot Chocolate', 'Lemonade', 'Energy Drink', 'Herbal Tea'
];

const TASTE_PROFILES = ['sweet', 'savory', 'spicy'] as const;

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateDailyMenu(): { mains: MenuItem[], sides: MenuItem[], drinks: MenuItem[] } {
  const mains: MenuItem[] = [];
  const sides: MenuItem[] = [];
  const drinks: MenuItem[] = [];

  // Generate 5 main courses
  for (let i = 0; i < 5; i++) {
    mains.push({
      name: `${getRandomElement(MAIN_NAMES)}_${getRandomInt(1, 999)}`,
      category: 'main',
      calories: getRandomInt(200, 400),
      taste: getRandomElement(TASTE_PROFILES),
      popularity: getRandomInt(1, 100)
    });
  }

  // Generate 4 side dishes
  for (let i = 0; i < 4; i++) {
    sides.push({
      name: `${getRandomElement(SIDE_NAMES)}_${getRandomInt(1, 999)}`,
      category: 'side',
      calories: getRandomInt(100, 300),
      taste: getRandomElement(TASTE_PROFILES),
      popularity: getRandomInt(1, 100)
    });
  }

  // Generate 4 drinks
  for (let i = 0; i < 4; i++) {
    drinks.push({
      name: `${getRandomElement(DRINK_NAMES)}_${getRandomInt(1, 999)}`,
      category: 'drink',
      calories: getRandomInt(50, 200),
      taste: getRandomElement(TASTE_PROFILES),
      popularity: getRandomInt(1, 100)
    });
  }

  return { mains, sides, drinks };
}