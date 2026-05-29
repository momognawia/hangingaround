export type ThemeCategory = 'Food' | 'Culture' | 'Music' | 'Tech' | 'Outdoor' | 'Sports' | 'Lifestyle' | 'Networking';
export type ThemeStatus = 'active' | 'paused' | 'closed';
export type RestaurantBudget = 1 | 2 | 3 | 4;

export interface Theme {
  id: string;
  creatorUserId: string;
  title: string;
  description: string;
  category: ThemeCategory;
  imageUrl?: string;
  city: string;
  ageMin?: number;
  ageMax?: number;
  maxMembers: number;
  targetGroupSize: number;
  frequency: string;
  restaurantBudgetLevel: RestaurantBudget;
  status: ThemeStatus;
  membersCount: number;
  groupsGenerated: number;
  nextEventDate?: Date;
  createdAt: Date;
}

export interface ThemeMember {
  themeId: string;
  userId: string;
  joinedAt: Date;
  status: 'active' | 'paused' | 'left';
}

export const THEME_CATEGORIES: ThemeCategory[] = [
  'Food', 'Culture', 'Music', 'Tech', 'Outdoor', 'Sports', 'Lifestyle', 'Networking'
];

export const CATEGORY_ICONS: Record<ThemeCategory, string> = {
  Food: '🍽️',
  Culture: '🎭',
  Music: '🎵',
  Tech: '💻',
  Outdoor: '🌿',
  Sports: '⚽',
  Lifestyle: '✨',
  Networking: '🤝',
};
