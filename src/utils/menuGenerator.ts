import { MenuItem } from '../types';
import { MENU_ITEMS, getItemsByCategory, getRandomItems } from '../data/menuItems';

export function generateDailyMenu(): { mains: MenuItem[], sides: MenuItem[], drinks: MenuItem[] } {
  const allMains = getItemsByCategory('main');
  const allSides = getItemsByCategory('side');
  const allDrinks = getItemsByCategory('drink');

  // Select 5 mains, 4 sides, and 4 drinks randomly from the available items
  const mains = getRandomItems(allMains, Math.min(5, allMains.length));
  const sides = getRandomItems(allSides, Math.min(4, allSides.length));
  const drinks = getRandomItems(allDrinks, Math.min(4, allDrinks.length));

  // If we don't have enough items, repeat some with slight variations
  while (mains.length < 5 && allMains.length > 0) {
    const randomMain = allMains[Math.floor(Math.random() * allMains.length)];
    mains.push({
      ...randomMain,
      name: `${randomMain.name} (Special)`,
      calories: randomMain.calories + Math.floor(Math.random() * 50) - 25, // ±25 calorie variation
      popularity: Math.min(100, randomMain.popularity + Math.floor(Math.random() * 10) - 5) // ±5 popularity variation
    });
  }

  while (sides.length < 4 && allSides.length > 0) {
    const randomSide = allSides[Math.floor(Math.random() * allSides.length)];
    sides.push({
      ...randomSide,
      name: `${randomSide.name} (Special)`,
      calories: randomSide.calories + Math.floor(Math.random() * 30) - 15, // ±15 calorie variation
      popularity: Math.min(100, randomSide.popularity + Math.floor(Math.random() * 10) - 5)
    });
  }

  while (drinks.length < 4 && allDrinks.length > 0) {
    const randomDrink = allDrinks[Math.floor(Math.random() * allDrinks.length)];
    drinks.push({
      ...randomDrink,
      name: `${randomDrink.name} (Special)`,
      calories: randomDrink.calories + Math.floor(Math.random() * 20) - 10, // ±10 calorie variation
      popularity: Math.min(100, randomDrink.popularity + Math.floor(Math.random() * 10) - 5)
    });
  }

  return { mains, sides, drinks };
}