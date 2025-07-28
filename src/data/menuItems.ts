import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  // Main courses
  { name: 'Paneer Butter Masala', category: 'main', calories: 450, taste: 'spicy', popularity: 90 },
  { name: 'Chicken Biryani', category: 'main', calories: 600, taste: 'spicy', popularity: 95 },
  { name: 'Vegetable Pulao', category: 'main', calories: 400, taste: 'savory', popularity: 70 },
  { name: 'Rajma Chawal', category: 'main', calories: 500, taste: 'savory', popularity: 80 },
  { name: 'Chole Bhature', category: 'main', calories: 650, taste: 'spicy', popularity: 85 },
  { name: 'Masala Dosa', category: 'main', calories: 480, taste: 'savory', popularity: 88 },
  { name: 'Grilled Sandwich', category: 'main', calories: 370, taste: 'savory', popularity: 60 },
  
  // Side dishes
  { name: 'Garlic Naan', category: 'side', calories: 200, taste: 'savory', popularity: 90 },
  { name: 'Mixed Veg Salad', category: 'side', calories: 150, taste: 'sweet', popularity: 75 },
  { name: 'French Fries', category: 'side', calories: 350, taste: 'savory', popularity: 80 },
  { name: 'Curd Rice', category: 'side', calories: 250, taste: 'savory', popularity: 70 },
  { name: 'Papad', category: 'side', calories: 100, taste: 'savory', popularity: 65 },
  { name: 'Paneer Tikka', category: 'side', calories: 300, taste: 'spicy', popularity: 85 },
  
  // Drinks
  { name: 'Masala Chaas', category: 'drink', calories: 100, taste: 'spicy', popularity: 80 },
  { name: 'Sweet Lassi', category: 'drink', calories: 220, taste: 'sweet', popularity: 90 },
  { name: 'Lemon Soda', category: 'drink', calories: 90, taste: 'savory', popularity: 70 },
  { name: 'Cold Coffee', category: 'drink', calories: 180, taste: 'sweet', popularity: 75 },
  { name: 'Coconut Water', category: 'drink', calories: 60, taste: 'sweet', popularity: 60 },
  { name: 'Iced Tea', category: 'drink', calories: 120, taste: 'sweet', popularity: 78 }
];

export const getItemsByCategory = (category: 'main' | 'side' | 'drink'): MenuItem[] => {
  return MENU_ITEMS.filter(item => item.category === category);
};

export const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};