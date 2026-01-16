import { Quest } from '../types';

// Mock Quests
const DAILY_QUESTS: Quest[] = [
  {
    id: 'q_login',
    title: 'ลงชื่อเข้าใช้รายวัน',
    description: 'รับพลังแห่งจักรวาลในเช้าวันใหม่',
    reward: 1,
    isClaimed: false,
    isReady: false,
    type: 'daily_login',
    icon: 'Sun'
  },
  {
    id: 'q_share',
    title: 'บอกต่อกัลยาณมิตร',
    description: 'แชร์แอปพลิเคชันให้เพื่อน 1 คน',
    reward: 2,
    isClaimed: false,
    isReady: false,
    type: 'share',
    icon: 'Share2'
  },
  {
    id: 'q_fortune',
    title: 'เปิดดวงชะตา',
    description: 'ทำการทำนายดวง 1 ครั้ง',
    reward: 1,
    isClaimed: false,
    isReady: false,
    type: 'read_fortune',
    icon: 'Scroll'
  }
];

const getStorageKey = (userId: string) => `quests_${userId}_${new Date().toDateString()}`;

export const getDailyQuests = (userId: string): Quest[] => {
  const storageKey = getStorageKey(userId);
  const stored = localStorage.getItem(storageKey);
  
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Return default quests if not stored for today
  localStorage.setItem(storageKey, JSON.stringify(DAILY_QUESTS));
  return DAILY_QUESTS;
};

export const markQuestComplete = (userId: string, questId: string): Quest | null => {
  const quests = getDailyQuests(userId);
  const index = quests.findIndex(q => q.id === questId);
  
  if (index !== -1) {
    // If already ready or claimed, do nothing but return it
    if (quests[index].isReady || quests[index].isClaimed) {
        return quests[index];
    }
    
    quests[index].isReady = true;
    localStorage.setItem(getStorageKey(userId), JSON.stringify(quests));
    return quests[index];
  }
  return null;
};

export const claimQuestReward = (userId: string, questId: string): number => {
  const quests = getDailyQuests(userId);
  const questIndex = quests.findIndex(q => q.id === questId);
  
  if (questIndex !== -1 && quests[questIndex].isReady && !quests[questIndex].isClaimed) {
    quests[questIndex].isClaimed = true;
    localStorage.setItem(getStorageKey(userId), JSON.stringify(quests));
    return quests[questIndex].reward;
  }
  
  return 0;
};

export const getReferralCode = (userId: string): string => {
  return `DESTINY-${userId.substring(0, 4).toUpperCase()}`;
};

export const copyReferralCode = async (code: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(code);
    return true;
  } catch (err) {
    console.error('Failed to copy', err);
    return false;
  }
};