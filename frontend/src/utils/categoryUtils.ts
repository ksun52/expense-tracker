import categoriesData from '@/data/categories.json';

export interface CategoryOption {
  name: string;
  color: string;
}

export function getCategoryColor(categoryName: string): string {
  const category = categoriesData.find(cat => cat.name === categoryName);
  return category?.color || 'gray';
}

export function getAllCategories(): CategoryOption[] {
  return categoriesData;
}

// Function to convert Notion color to actual CSS color values
export function getNotionColorCSS(color: string): string {
  const colorMap: { [key: string]: string } = {
    'default': '#3b82f6', // blue-500
    'gray': '#6b7280', // gray-500
    'brown': '#b45309', // amber-700
    'orange': '#f97316', // orange-500
    'yellow': '#eab308', // yellow-500
    'green': '#22c55e', // green-500
    'blue': '#3b82f6', // blue-500
    'purple': '#a855f7', // purple-500
    'pink': '#ec4899', // pink-500
    'red': '#ef4444', // red-500
  };
  
  return colorMap[color] || '#3b82f6';
}

// Function to convert Notion color to Tailwind background color class
export function getNotionColorClass(color: string): string {
  const colorMap: { [key: string]: string } = {
    'default': 'bg-blue-500',
    'gray': 'bg-gray-500',
    'brown': 'bg-amber-700',
    'orange': 'bg-orange-500',
    'yellow': 'bg-yellow-500',
    'green': 'bg-green-500',
    'blue': 'bg-blue-500',
    'purple': 'bg-purple-500',
    'pink': 'bg-pink-500',
    'red': 'bg-red-500',
  };
  
  return colorMap[color] || 'bg-gray-500';
} 