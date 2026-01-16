import React, { useState, useEffect } from 'react';
import StarBackground from './components/StarBackground';
import InputForm from './components/InputForm';
import LoginScreen from './components/LoginScreen';
import FortuneResult from './components/FortuneResult';
import ProfileScreen from './components/ProfileScreen';
import CalendarScreen from './components/CalendarScreen';
import CommunityScreen from './components/CommunityScreen';
import TopUpModal from './components/TopUpModal';
import Layout from './components/Layout';
import Toast from './components/Toast';
import DailyRewardModal from './components/DailyRewardModal';
import { UserInput, FortuneResponse, LineUserProfile, HistoryItem, ToastMessage, ToastType } from './types';
import { generateFortune } from './services/geminiService';
import { loginWithLine } from './services/authService';
import { saveHistory } from './services/historyService';
import { deductCredit, addCredits } from './services/creditService';
import { markQuestComplete, getDailyQuests, claimQuestReward } from './services/rewardService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'calendar' | 'community'>('home');
  const [step, setStep] = useState<'login' | 'input' | 'loading' | 'result'>('login');
  
  const [fortuneData, setFortuneData] = useState<FortuneResponse | null>(null);
  const [userProfile, setUserProfile] = useState<LineUserProfile | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  
  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Daily Reward
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [dailyRewardAmount, setDailyRewardAmount] = useState(0);

  // Loading Animation State
  const [loadingCharIndex, setLoadingCharIndex] = useState(0);
  const LOADING_CHARS = ['金', '木', '水', '火', '土', '命', '運', '吉'];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 'loading') {
      interval = setInterval(() => {
        setLoadingCharIndex((prev) => (prev + 1) % LOADING_CHARS.length);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [step]);

  const addToast = (type: ToastType, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleLogin = async () => {
    setIsLoginLoading(true);
    try {
      const profile = await loginWithLine();
      setUserProfile(profile);
      setStep('input');
      setActiveTab('home');
      
      // Check Daily Quest
      const quests = getDailyQuests(profile.userId);
      const loginQuest = quests.find(q => q.id === 'q_login');
      
      // If ready but not claimed, or not ready yet (complete it now)
      if (loginQuest && !loginQuest.isClaimed) {
         if (!loginQuest.isReady) {
             markQuestComplete(profile.userId, 'q_login');
         }
         // Show popup to claim
         setDailyRewardAmount(loginQuest.reward);
         setShowDailyReward(true);
      } else {
         addToast('success', `ยินดีต้อนรับคุณ ${profile.displayName}`);
      }

    } catch (error) {
      console.error("Login failed:", error);
      addToast('error', "การเข้าสู่ระบบล้มเหลว กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleClaimDailyReward = () => {
    if (userProfile) {
      const reward = claimQuestReward(userProfile.userId, 'q_login');
      if (reward > 0) {
        handleTopUp(reward);
        setShowDailyReward(false);
        addToast('success', 'ได้รับพรแห่งรุ่งอรุณเรียบร้อยแล้ว');
      }
    }
  };

  const handleLogout = () => {
    setUserProfile(null);
    setFortuneData(null);
    setStep('login');
    setActiveTab('home');
    addToast('info', 'ออกจากระบบเรียบร้อยแล้ว');
  };

  const handleFormSubmit = async (data: UserInput, cost: number) => {
    if (userProfile && userProfile.credits < cost) {
      setShowTopUp(true);
      return;
    }

    setStep('loading');
    try {
      const result = await generateFortune(data);
      setFortuneData(result);
      
      if (userProfile) {
        saveHistory(userProfile.userId, result);
        const success = deductCredit(userProfile.userId, cost);
        if (success) {
          setUserProfile(prev => prev ? ({ ...prev, credits: prev.credits - cost }) : null);
        }
        
        // Complete "Read Fortune" Quest
        const quest = markQuestComplete(userProfile.userId, 'q_fortune');
        if (quest && !quest.isClaimed) {
           addToast('success', 'ภารกิจสำเร็จ! ไปที่หน้าโปรไฟล์เพื่อรับรางวัล');
        }
      }

      setStep('result');
    } catch (error) {
      console.error(error);
      addToast('error', "ดวงดาวถูกบดบัง กรุณาลองใหม่อีกครั้ง");
      setStep('input');
    }
  };

  const handleReset = () => {
    setStep('input');
    setFortuneData(null);
  };

  const handleNavigate = (tab: 'home' | 'profile' | 'calendar' | 'community') => {
    setActiveTab(tab);
    if (tab === 'home' && step !== 'loading') {
       setStep(fortuneData ? 'result' : 'input');
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setFortuneData(item.data);
    setStep('result');
    setActiveTab('home');
  };

  const handleTopUp = (amount: number) => {
    if (userProfile) {
      const newBalance = addCredits(userProfile.userId, amount);
      setUserProfile(prev => prev ? ({ ...prev, credits: newBalance }) : null);
      if (showTopUp) setShowTopUp(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden selection:bg-red-900 selection:text-amber-400 bg-black">
      <StarBackground />
      
      <Toast toasts={toasts} onRemove={removeToast} />

      {showTopUp && (
        <TopUpModal 
          onClose={() => setShowTopUp(false)} 
          onTopUp={(amount) => {
             handleTopUp(amount);
             addToast('success', `เติมเงินสำเร็จ! คุณได้รับ ${amount} เครดิต`);
          }} 
        />
      )}

      {showDailyReward && (
        <DailyRewardModal 
           isOpen={showDailyReward}
           rewardAmount={dailyRewardAmount}
           onClaim={handleClaimDailyReward}
        />
      )}
      
      {step === 'login' ? (
        <main className="w-full h-screen flex flex-col items-center justify-center px-4">
          <LoginScreen onLogin={handleLogin} isLoading={isLoginLoading} />
        </main>
      ) : (
        <Layout 
          userProfile={userProfile} 
          activeTab={activeTab} 
          onNavigate={handleNavigate}
          onTopUp={() => setShowTopUp(true)}
          onLogout={handleLogout}
        >
          {activeTab === 'profile' && userProfile && (
            <ProfileScreen 
              user={userProfile} 
              onLogout={handleLogout}
              onSelectHistory={handleSelectHistory}
              onAddCredits={handleTopUp}
              addToast={addToast}
            />
          )}

          {activeTab === 'calendar' && userProfile && (
            <CalendarScreen userId={userProfile.userId} />
          )}

          {activeTab === 'community' && userProfile && (
            <CommunityScreen userProfile={userProfile} />
          )}

          {activeTab === 'home' && (
            <>
              {step === 'input' && (
                <InputForm 
                  onSubmit={handleFormSubmit} 
                  isLoading={false} 
                  userProfile={userProfile}
                  onTopUp={() => setShowTopUp(true)}
                />
              )}

              {step === 'loading' && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in relative z-20">
                  {/* Background Glow */}
                  <div className="absolute w-64 h-64 bg-red-900/10 rounded-full blur-[60px] animate-pulse pointer-events-none"></div>
                  
                  <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center my-8">
                    {/* Outer Rotating Ring (Bagua-ish) */}
                    <div className="absolute inset-0 border-[1px] border-amber-500/30 rounded-full animate-[spin_8s_linear_infinite]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,1)]"></div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1 w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                        <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1 w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                    </div>
                    
                    {/* Middle Spinning Ring (Reverse) */}
                    <div className="absolute inset-3 border border-red-500/20 rounded-full animate-[spin_4s_linear_infinite_reverse] border-dashed"></div>

                    {/* Inner Pulsing Circle */}
                    <div className="absolute inset-8 bg-black/40 backdrop-blur-sm rounded-full border border-amber-500/10 shadow-[0_0_30px_rgba(185,28,28,0.2)]"></div>

                    {/* Center Character */}
                    <div className="relative z-10 flex items-center justify-center w-full h-full">
                        <span key={loadingCharIndex} className="text-5xl md:text-6xl font-chinese text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-500 to-red-600 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-fade-in transition-all duration-500 scale-110">
                          {LOADING_CHARS[loadingCharIndex]}
                        </span>
                    </div>
                  </div>
                  
                  <div className="text-center space-y-3 relative z-10">
                    <p className="text-amber-500 font-bold tracking-[0.3em] uppercase text-xs md:text-sm animate-pulse drop-shadow-sm">
                      กำลังจัดเรียงดวงดาว...
                    </p>
                    <div className="flex justify-center gap-1">
                      <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce delay-0"></div>
                      <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                    <p className="text-[9px] text-red-400/40 font-light tracking-widest uppercase">
                      Aligning Celestial Bodies
                    </p>
                  </div>
                </div>
              )}

              {step === 'result' && fortuneData && (
                <FortuneResult 
                  data={fortuneData} 
                  onReset={handleReset} 
                />
              )}
            </>
          )}
        </Layout>
      )}

      {step !== 'login' && (
        <footer className="relative z-10 w-full py-4 text-center text-red-900/60 text-[10px] font-light uppercase tracking-widest hidden md:block">
          <p>&copy; {new Date().getFullYear()} Cheewit Nuer Duang. Grandmaster Edition.</p>
        </footer>
      )}
    </div>
  );
};

export default App;