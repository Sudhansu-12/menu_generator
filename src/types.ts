export interface MenuItem {
  name: string;
  category: 'main' | 'side' | 'drink';
  calories: number;
  taste: 'sweet' | 'savory' | 'spicy';
  popularity: number;
}

export interface Combo {
  main: MenuItem;
  side: MenuItem;
  drink: MenuItem;
  total_calories: number;
  taste_profile: string;
  popularity_score: number;
}

export interface DayOutput {
  day: string;
  date: string;
  combos: Combo[];
  menu: {
    mains: MenuItem[];
    sides: MenuItem[];
    drinks: MenuItem[];
  };
}

export interface UserPreferences {
  dietaryRestrictions: string[];
  preferredTastes: string[];
  calorieRange: {
    min: number;
    max: number;
  };
  avoidIngredients: string[];
}

export interface ComboHistory {
  [key: string]: string[]; // date -> array of combo signatures
}