import { MenuItem, Combo, UserPreferences, ComboHistory } from '../types';

const ALLOWED_TASTES: { [key: string]: string[] } = {
  'Monday': ['sweet', 'savory'],
  'Tuesday': ['sweet', 'savory'],
  'Wednesday': ['sweet', 'savory'],
  'Thursday': ['spicy', 'savory'],
  'Friday': ['spicy', 'savory'],
  'Saturday': ['sweet', 'savory', 'spicy'],
  'Sunday': ['sweet', 'savory', 'spicy']
};

function getTasteProfile(main: MenuItem, side: MenuItem, drink: MenuItem): string {
  const tastes = [main.taste, side.taste, drink.taste];
  const tasteCounts = tastes.reduce((acc, taste) => {
    acc[taste] = (acc[taste] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const maxCount = Math.max(...Object.values(tasteCounts));
  if (maxCount >= 2) {
    return Object.keys(tasteCounts).find(taste => tasteCounts[taste] === maxCount) || 'mixed';
  }
  return 'mixed';
}

function isValidTasteForDay(dayName: string, main: MenuItem, side: MenuItem, drink: MenuItem): boolean {
  const allowedTastes = ALLOWED_TASTES[dayName];
  const tastes = [main.taste, side.taste, drink.taste];
  
  if (allowedTastes.length === 3) return true; // Saturday/Sunday - any taste allowed
  
  // Check if combo includes at least one item from each required taste
  return allowedTastes.every(requiredTaste => 
    tastes.some(taste => taste === requiredTaste)
  );
}

function getComboSignature(main: MenuItem, side: MenuItem, drink: MenuItem): string {
  return `${main.name}|${side.name}|${drink.name}`;
}

function isComboUnique(signature: string, history: ComboHistory, currentDate: string): boolean {
  const dates = Object.keys(history).sort();
  const currentIndex = dates.indexOf(currentDate);
  
  if (currentIndex === -1) return true;
  
  // Check previous 2 days
  for (let i = Math.max(0, currentIndex - 2); i < currentIndex; i++) {
    if (history[dates[i]]?.includes(signature)) {
      return false;
    }
  }
  
  return true;
}

export function generateDailyCombos(
  menu: { mains: MenuItem[], sides: MenuItem[], drinks: MenuItem[] },
  dayName: string,
  date: string,
  preferences: UserPreferences,
  history: ComboHistory
): Combo[] {
  const combos: Combo[] = [];
  const usedItems = new Set<string>();
  const maxAttempts = 1000;
  
  for (let comboIndex = 0; comboIndex < 3; comboIndex++) {
    let attempts = 0;
    let validCombo: Combo | null = null;
    
    while (attempts < maxAttempts && !validCombo) {
      attempts++;
      
      // Try different combinations
      for (const main of menu.mains) {
        if (usedItems.has(main.name)) continue;
        
        for (const side of menu.sides) {
          if (usedItems.has(side.name)) continue;
          
          for (const drink of menu.drinks) {
            if (usedItems.has(drink.name)) continue;
            
            const totalCalories = main.calories + side.calories + drink.calories;
            
            // Check calorie constraints
            if (totalCalories < Math.max(550, preferences.calorieRange.min) || 
                totalCalories > Math.min(800, preferences.calorieRange.max)) {
              continue;
            }
            
            // Check taste constraints
            if (!isValidTasteForDay(dayName, main, side, drink)) {
              continue;
            }
            
            // Check user taste preferences
            const tasteProfile = getTasteProfile(main, side, drink);
            if (preferences.preferredTastes.length > 0 && 
                !preferences.preferredTastes.includes(tasteProfile) &&
                !preferences.preferredTastes.includes('any')) {
              continue;
            }
            
            // Check uniqueness in 3-day window
            const signature = getComboSignature(main, side, drink);
            if (!isComboUnique(signature, history, date)) {
              continue;
            }
            
            const popularityScore = main.popularity + side.popularity + drink.popularity;
            
            // Check popularity balance (±10 from other combos)
            if (combos.length > 0) {
              const avgPopularity = combos.reduce((sum, c) => sum + c.popularity_score, 0) / combos.length;
              if (Math.abs(popularityScore - avgPopularity) > 10) {
                continue;
              }
            }
            
            validCombo = {
              main,
              side,
              drink,
              total_calories: totalCalories,
              taste_profile: tasteProfile,
              popularity_score: popularityScore
            };
            
            break;
          }
          if (validCombo) break;
        }
        if (validCombo) break;
      }
      
      if (validCombo) {
        combos.push(validCombo);
        usedItems.add(validCombo.main.name);
        usedItems.add(validCombo.side.name);
        usedItems.add(validCombo.drink.name);
        
        // Update history
        if (!history[date]) history[date] = [];
        history[date].push(getComboSignature(validCombo.main, validCombo.side, validCombo.drink));
        
        break;
      }
    }
    
    // If no valid combo found, create a fallback
    if (!validCombo && combos.length < 3) {
      const availableMains = menu.mains.filter(item => !usedItems.has(item.name));
      const availableSides = menu.sides.filter(item => !usedItems.has(item.name));
      const availableDrinks = menu.drinks.filter(item => !usedItems.has(item.name));
      
      if (availableMains.length > 0 && availableSides.length > 0 && availableDrinks.length > 0) {
        const fallbackCombo = {
          main: availableMains[0],
          side: availableSides[0],
          drink: availableDrinks[0],
          total_calories: availableMains[0].calories + availableSides[0].calories + availableDrinks[0].calories,
          taste_profile: getTasteProfile(availableMains[0], availableSides[0], availableDrinks[0]),
          popularity_score: availableMains[0].popularity + availableSides[0].popularity + availableDrinks[0].popularity
        };
        
        combos.push(fallbackCombo);
        usedItems.add(fallbackCombo.main.name);
        usedItems.add(fallbackCombo.side.name);
        usedItems.add(fallbackCombo.drink.name);
        
        if (!history[date]) history[date] = [];
        history[date].push(getComboSignature(fallbackCombo.main, fallbackCombo.side, fallbackCombo.drink));
      }
    }
  }
  
  return combos;
}