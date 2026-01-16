import { FortuneResponse, HistoryItem } from '../types';

const STORAGE_KEY_PREFIX = 'cheewit_history_';

export const saveHistory = (userId: string, data: FortuneResponse): void => {
  const key = `${STORAGE_KEY_PREFIX}${userId}`;
  const existingJson = localStorage.getItem(key);
  let history: HistoryItem[] = existingJson ? JSON.parse(existingJson) : [];

  const newItem: HistoryItem = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    data: data,
  };

  // Add to beginning of array
  history.unshift(newItem);
  
  // Limit to last 20 items to save space
  if (history.length > 20) {
    history = history.slice(0, 20);
  }

  localStorage.setItem(key, JSON.stringify(history));
};

export const getHistory = (userId: string): HistoryItem[] => {
  const key = `${STORAGE_KEY_PREFIX}${userId}`;
  const existingJson = localStorage.getItem(key);
  return existingJson ? JSON.parse(existingJson) : [];
};

export const clearHistory = (userId: string): void => {
  const key = `${STORAGE_KEY_PREFIX}${userId}`;
  localStorage.removeItem(key);
};