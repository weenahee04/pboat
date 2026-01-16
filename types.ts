
export interface UserProfile {
  thai_zodiac: string;
  chinese_zodiac: string;
  element: string;
}

// New: Structure for a single Pillar (Year, Month, Day, Hour)
export interface BaZiPillar {
  stem: string; // Heavenly Stem (e.g., Jia, Yi) in Thai
  branch: string; // Earthly Branch (e.g., Rat, Ox) in Thai
  element: string; // Main Element of this pillar
  stem_char: string; // Chinese Character for Stem
  branch_char: string; // Chinese Character for Branch
}

// New: Full Ba Zi Chart
export interface BaZiChart {
  year: BaZiPillar;
  month: BaZiPillar;
  day: BaZiPillar;
  hour: BaZiPillar;
  day_master: string; // The Self Element (from Day Stem)
  element_balance: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  }; // Percentage 0-100
}

export interface HeroPrediction {
  headline: string;
  mood_tone: string;
}

export interface DeepDive {
  personality_strength: string;
  current_challenge: string;
  guidance: string;
}

export interface Stats {
  luck_score: number;
  wealth_score: number;
  love_score: number;
}

export interface ActionableRitual {
  lucky_color: string;
  lucky_direction: string;
  suggested_activity: string;
}

export interface Compatibility {
  score: number; // 0-100
  insight: string; // Description of the relationship
  challenge: string; // Conflict points
}

export interface FortuneResponse {
  user_profile: UserProfile;
  bazi_chart?: BaZiChart; // Added Ba Zi Chart
  hero_prediction: HeroPrediction;
  deep_dive: DeepDive;
  stats: Stats;
  actionable_ritual: ActionableRitual;
  compatibility?: Compatibility | null;
}

export interface UserInput {
  dob: string; // YYYY-MM-DD
  time?: string; // HH:MM
  gender: string;
  partner_dob?: string;
  partner_time?: string;
  partner_gender?: string;
}

export interface LineUserProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  credits: number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  data: FortuneResponse;
}

// New: Calendar Day Data
export interface CalendarDay {
  date: string; // YYYY-MM-DD
  lunar_date: string; // Chinese Lunar Date description
  daily_pillar: string; // e.g. "Water Rat (Ren Zi)"
  auspicious_activities: string[]; // Things to do
  inauspicious_activities: string[]; // Things to avoid
  daily_energy: string; // General vibe (e.g., "Clash", "Harmony")
  lucky_hours: string; // e.g. 09:00 - 11:00"
  zodiac_compatibility: {
    best: string; // Hexagonal harmony
    ok: string[]; // Triangular harmony
    clash: string; // Chong (Clash)
  };
}

export interface CalendarResponse {
  month_insight: string;
  days: CalendarDay[];
}

// New: Quest System
export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  isClaimed: boolean;
  isReady: boolean; // Can be claimed?
  type: 'daily_login' | 'share' | 'read_fortune';
  icon: string;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

// --- Community Features ---

export type PostCategory = 'general' | 'love' | 'work' | 'ritual';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: number;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  category: PostCategory;
  title: string;
  content: string;
  likes: string[]; // Array of User IDs who liked
  comments: Comment[];
  timestamp: number;
  views: number;
}
