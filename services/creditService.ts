const CREDIT_KEY_PREFIX = 'cheewit_credits_';

// Default initial credits for new users
const INITIAL_CREDITS = 3;

export const getCredits = (userId: string): number => {
  const key = `${CREDIT_KEY_PREFIX}${userId}`;
  const stored = localStorage.getItem(key);
  if (stored !== null) {
    return parseInt(stored, 10);
  }
  // Initialize if not exists
  localStorage.setItem(key, INITIAL_CREDITS.toString());
  return INITIAL_CREDITS;
};

export const updateCredits = (userId: string, amount: number): void => {
  const key = `${CREDIT_KEY_PREFIX}${userId}`;
  localStorage.setItem(key, amount.toString());
};

export const deductCredit = (userId: string, cost: number = 1): boolean => {
  const current = getCredits(userId);
  if (current >= cost) {
    updateCredits(userId, current - cost);
    return true;
  }
  return false;
};

export const addCredits = (userId: string, amount: number): number => {
  const current = getCredits(userId);
  const newBalance = current + amount;
  updateCredits(userId, newBalance);
  return newBalance;
};