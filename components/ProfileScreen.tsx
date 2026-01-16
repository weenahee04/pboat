import React, { useEffect, useState } from 'react';
import { LineUserProfile, HistoryItem, Quest, ToastType } from '../types';
import { getHistory, clearHistory } from '../services/historyService';
import { getDailyQuests, claimQuestReward, getReferralCode, copyReferralCode, markQuestComplete } from '../services/rewardService';
import { Trash2, Calendar, Scroll, ChevronRight, LogOut, Gift, Share2, Copy, CheckCircle, Sparkles, Coins, Users, Lock } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

interface ProfileScreenProps {
  user: LineUserProfile;
  onLogout: () => void;
  onSelectHistory: (item: HistoryItem) => void;
  onAddCredits: (amount: number) => void;
  addToast: (type: ToastType, message: string) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onLogout, onSelectHistory, onAddCredits, addToast }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'history' | 'missions'>('missions');
  const [quests, setQuests] = useState<Quest[]>([]);
  const [referralCode, setReferralCode] = useState('');
  
  // Modals
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    setHistory(getHistory(user.userId));
    setQuests(getDailyQuests(user.userId));
    setReferralCode(getReferralCode(user.userId));
  }, [user.userId]);

  const handleClearHistory = () => {
    clearHistory(user.userId);
    setHistory([]);
    addToast('success', 'ลบประวัติคำทำนายทั้งหมดแล้ว');
  };

  const handleClaimQuest = (questId: string) => {
    const reward = claimQuestReward(user.userId, questId);
    if (reward > 0) {
      onAddCredits(reward);
      setQuests(prev => prev.map(q => q.id === questId ? { ...q, isClaimed: true } : q));
      addToast('success', `รับรางวัลสำเร็จ! ได้รับ ${reward} เครดิต`);
    }
  };

  const handleCopyCode = () => {
    copyReferralCode(referralCode).then(() => {
      addToast('success', 'คัดลอกรหัสแนะนำแล้ว');
      // Complete Share Quest when copying
      const quest = markQuestComplete(user.userId, 'q_share');
      if (quest) {
         setQuests(prev => prev.map(q => q.id === 'q_share' ? { ...q, isReady: true } : q));
      }
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getZodiacChar = (zodiacName: string) => {
    const map = [
      { keys: ['ชวด', 'หนู'], char: '鼠', animal: 'RAT' },
      { keys: ['ฉลู', 'วัว'], char: '牛', animal: 'OX' },
      { keys: ['ขาล', 'เสือ'], char: '虎', animal: 'TIGER' },
      { keys: ['เถาะ', 'กระต่าย'], char: '兔', animal: 'RABBIT' },
      { keys: ['มะโรง', 'มังกร', 'งูใหญ่'], char: '龍', animal: 'DRAGON' },
      { keys: ['มะเส็ง', 'งูเล็ก', 'งู'], char: '蛇', animal: 'SNAKE' },
      { keys: ['มะเมีย', 'ม้า'], char: '馬', animal: 'HORSE' },
      { keys: ['มะแม', 'แพะ'], char: '羊', animal: 'GOAT' },
      { keys: ['วอก', 'ลิง'], char: '猴', animal: 'MONKEY' },
      { keys: ['ระกา', 'ไก่'], char: '雞', animal: 'ROOSTER' },
      { keys: ['จอ', 'หมา', 'สุนัข'], char: '狗', animal: 'DOG' },
      { keys: ['กุน', 'หมู'], char: '豬', animal: 'PIG' },
    ];

    const found = map.find(m => m.keys.some(k => zodiacName.includes(k)));
    return found || { char: '命', animal: 'DESTINY' };
  };

  const latestHistory = history[0];
  const zodiacInfo = latestHistory ? getZodiacChar(latestHistory.data.user_profile.chinese_zodiac) : null;

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in pb-12 md:pb-0">
      
      {/* Confirmation Modals */}
      <ConfirmationModal 
        isOpen={showClearConfirm} 
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearHistory}
        title="ยืนยันการลบประวัติ"
        message="คุณแน่ใจหรือไม่ที่จะลบประวัติการทำนายทั้งหมด? การกระทำนี้ไม่สามารถเรียกคืนได้"
        confirmText="ลบข้อมูล"
        isDanger
      />

      <ConfirmationModal 
        isOpen={showLogoutConfirm} 
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={onLogout}
        title="ยืนยันการออกจากระบบ"
        message="คุณต้องการออกจากระบบใช่หรือไม่?"
        confirmText="ออกจากระบบ"
        isDanger
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card (Left) */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-panel p-6 md:p-8 rounded-sm flex flex-col items-center text-center border-t-4 border-t-amber-600 relative overflow-hidden">
             {/* Decorative BG */}
             <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-transparent pointer-events-none"></div>

             <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-yellow-400 to-red-600 mb-4 shadow-[0_0_30px_rgba(217,119,6,0.3)] relative z-10">
               <img 
                 src={user.pictureUrl || "https://cdn-icons-png.flaticon.com/512/1077/1077114.png"} 
                 alt={user.displayName} 
                 className="w-full h-full rounded-full object-cover border-4 border-black"
               />
             </div>
             
             <h2 className="text-xl font-bold text-amber-100 mb-1 mystical-font-th">{user.displayName}</h2>
             <div className="px-3 py-1 bg-amber-900/30 border border-amber-500/30 rounded-full text-[10px] text-amber-500 uppercase tracking-widest mb-6">
               Grandmaster Member
             </div>
             
             <div className="w-full border-t border-white/10 pt-4 mt-2 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">เครดิตบุญ</span>
                  <span className="text-amber-400 font-bold">{user.credits} เหรียญ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">อ่านดวงแล้ว</span>
                  <span className="text-gray-300">{history.length} ครั้ง</span>
                </div>
             </div>

             <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="mt-6 w-full py-2 border border-red-500/30 text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-sm text-sm flex items-center justify-center gap-2 transition-colors md:hidden"
              >
                <LogOut className="w-4 h-4" /> ออกจากระบบ
              </button>
          </div>

          {/* Interactive Zodiac Card */}
          {zodiacInfo && latestHistory && (
            <div className="glass-panel p-6 rounded-sm flex flex-col items-center justify-center text-center relative overflow-hidden group cursor-pointer border border-red-500/30 hover:border-red-500 transition-all duration-500 hover:shadow-[0_0_30px_rgba(220,38,38,0.2)]">
              <div className="absolute inset-0 bg-red-900/10 group-hover:bg-red-900/20 transition-colors duration-500"></div>
              
              <h3 className="text-xs text-red-400 uppercase tracking-widest mb-4 relative z-10 transition-colors group-hover:text-amber-400">นักษัตรประจำตัว</h3>
              
              <div className="relative z-10 transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 ease-in-out">
                 <div className="text-7xl md:text-8xl font-chinese text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-amber-600 drop-shadow-sm select-none transition-all duration-500 group-hover:brightness-125 filter">
                    {zodiacInfo.char}
                 </div>
              </div>
              
              <div className="mt-4 relative z-10">
                 <span className="text-xl md:text-2xl font-bold text-amber-100 tracking-wider mystical-font-th group-hover:text-white transition-colors duration-300">{latestHistory.data.user_profile.chinese_zodiac}</span>
                 <p className="text-xs text-amber-500/60 mt-1 font-light tracking-[0.2em] group-hover:text-amber-400/80 transition-colors duration-300">{zodiacInfo.animal}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Content Area (Tabs) */}
        <div className="md:col-span-2">
           <div className="glass-panel rounded-sm min-h-[400px] md:min-h-[500px] flex flex-col border-t-4 border-t-red-700 relative overflow-hidden">
              
              {/* Tabs */}
              <div className="flex border-b border-white/10">
                 <button 
                   onClick={() => setActiveTab('missions')}
                   className={`flex-1 py-4 text-center text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all ${activeTab === 'missions' ? 'bg-amber-900/20 text-amber-400 border-b-2 border-b-amber-500' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                 >
                   <Gift className="w-4 h-4" /> ภารกิจ & ชวนเพื่อน
                 </button>
                 <button 
                   onClick={() => setActiveTab('history')}
                   className={`flex-1 py-4 text-center text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all ${activeTab === 'history' ? 'bg-red-900/20 text-red-400 border-b-2 border-b-red-500' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                 >
                   <Scroll className="w-4 h-4" /> ประวัติคำทำนาย
                 </button>
              </div>

              {/* Tab Content: Missions */}
              {activeTab === 'missions' && (
                <div className="p-4 md:p-6 space-y-6 overflow-y-auto max-h-[500px] custom-scrollbar animate-fade-in">
                  
                  {/* Referral Section */}
                  <div className="bg-gradient-to-r from-amber-950/40 to-black border border-amber-500/20 rounded-sm p-4 md:p-5 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-20 h-20 text-amber-500" />
                     </div>
                     <h3 className="text-lg font-bold text-amber-200 mb-2 flex items-center gap-2">
                       <Share2 className="w-5 h-5" /> บอกต่อกัลยาณมิตร
                     </h3>
                     <p className="text-sm text-gray-400 mb-4 max-w-sm">
                       ส่งต่อความโชคดีให้เพื่อนของคุณ เมื่อเพื่อนสมัครใช้งานด้วยโค้ดของคุณ รับทันที <span className="text-amber-400 font-bold">2 เครดิต</span> ทั้งคุณและเพื่อน
                     </p>
                     
                     <div className="flex items-center gap-2 bg-black/50 p-2 rounded border border-amber-500/30 max-w-md">
                        <div className="flex-1 text-center font-mono text-lg tracking-widest text-amber-400 font-bold select-all truncate">
                          {referralCode}
                        </div>
                        <button 
                          onClick={handleCopyCode}
                          className="p-2 hover:bg-white/10 rounded transition-colors"
                          title="คัดลอกโค้ด"
                        >
                           <Copy className="w-5 h-5 text-gray-400 hover:text-white" />
                        </button>
                     </div>
                  </div>

                  {/* Daily Quests Section */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <Sparkles className="w-4 h-4 text-amber-500" /> ภารกิจสะสมแต้มบุญรายวัน
                    </h3>
                    <div className="space-y-3">
                       {quests.map((quest) => (
                         <div key={quest.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-amber-500/30 rounded-sm transition-all">
                            <div className="flex items-center gap-4">
                               <div className={`w-10 h-10 rounded-full flex items-center justify-center ${quest.isClaimed ? 'bg-green-900/20 text-green-500' : quest.isReady ? 'bg-amber-900/20 text-amber-500' : 'bg-gray-800 text-gray-500'}`}>
                                  {quest.icon === 'Sun' && <Sparkles className="w-5 h-5" />}
                                  {quest.icon === 'Share2' && <Share2 className="w-5 h-5" />}
                                  {quest.icon === 'Scroll' && <Scroll className="w-5 h-5" />}
                               </div>
                               <div>
                                  <h4 className={`text-sm font-bold ${quest.isClaimed ? 'text-gray-500 line-through' : 'text-amber-100'}`}>{quest.title}</h4>
                                  <p className="text-xs text-gray-500">{quest.description}</p>
                               </div>
                            </div>
                            
                            {quest.isClaimed ? (
                               <span className="text-xs text-green-500 font-bold flex items-center gap-1 px-3 py-1 bg-green-950/30 rounded-full">
                                 <CheckCircle className="w-3 h-3" /> สำเร็จ
                               </span>
                            ) : quest.isReady ? (
                               <button 
                                 onClick={() => handleClaimQuest(quest.id)}
                                 className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-black text-xs font-bold rounded flex items-center gap-1 transition-colors shadow-[0_0_10px_rgba(217,119,6,0.3)] animate-pulse"
                               >
                                 <Coins className="w-3 h-3" /> รับ {quest.reward}
                               </button>
                            ) : (
                               <span className="text-xs text-gray-600 flex items-center gap-1 px-3 py-1 border border-white/5 rounded-full">
                                  <Lock className="w-3 h-3" /> ล็อค
                               </span>
                            )}
                         </div>
                       ))}
                    </div>
                  </div>

                </div>
              )}

              {/* Tab Content: History */}
              {activeTab === 'history' && (
                <div className="flex-1 flex flex-col h-full animate-fade-in">
                  <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
                    <span className="text-xs text-gray-400">ประวัติการทำนายทั้งหมด</span>
                    {history.length > 0 && (
                      <button onClick={() => setShowClearConfirm(true)} className="text-xs text-red-500 hover:text-red-300 flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
                        <Trash2 className="w-3 h-3" /> ล้างประวัติ
                      </button>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto max-h-[400px] p-4 space-y-3 custom-scrollbar">
                    {history.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-white/30 p-10 text-center">
                        <Scroll className="w-12 h-12 mb-4 opacity-20" />
                        <p>ยังไม่มีบันทึกการทำนาย</p>
                        <p className="text-xs mt-2 opacity-60">เริ่มต้นทำนายดวงชะตาเพื่อเก็บสถิติ</p>
                      </div>
                    ) : (
                      history.map((item) => (
                        <div 
                          key={item.id}
                          onClick={() => onSelectHistory(item)}
                          className="group p-4 rounded-sm bg-white/5 border border-white/5 hover:bg-amber-900/20 hover:border-amber-500/50 transition-all cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex-1 overflow-hidden">
                            <div className="flex items-center text-[10px] text-amber-500/80 mb-1 uppercase tracking-wider gap-2">
                              <Calendar className="w-3 h-3" />
                              {formatDate(item.timestamp)}
                            </div>
                            <h4 className="text-sm md:text-base font-medium text-gray-200 group-hover:text-amber-100 transition-colors mystical-font-th truncate">
                              {item.data.hero_prediction.headline}
                            </h4>
                            <div className="mt-2 text-xs text-gray-500 group-hover:text-gray-400 truncate">
                              {item.data.user_profile.thai_zodiac} {item.data.user_profile.element.includes('ธาตุ') ? `(${item.data.user_profile.element})` : `(ธาตุ${item.data.user_profile.element})`}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-amber-500 transition-colors shrink-0 ml-2" />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileScreen;