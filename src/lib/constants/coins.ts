// Coin costs for different features
export const COIN_COSTS = {
  resume_ai: 3,
  ats_check: 1,
  cover_letter: 1,
} as const;

export type CoinFeature = keyof typeof COIN_COSTS;

export const DAILY_COIN_LIMIT = 5;
