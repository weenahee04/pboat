import React from 'react';
import { LineUserProfile } from '../types';
import { Home, User, Coins, LogOut, Sparkles, CalendarDays, Menu, Users } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  userProfile: LineUserProfile | null;
  activeTab: 'home' | 'profile' | 'calendar' | 'community';
  onNavigate: (tab: 'home' | 'profile' | 'calendar' | 'community') => void;
  onTopUp: () => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  userProfile, 
  activeTab, 
  onNavigate, 
  onTopUp, 
  onLogout 
}) => {
  return (
    <div className="flex flex-col min-h-screen w-full md:max-w-4xl lg:max-w-6xl mx-auto relative transition-all duration-300">
      
      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-red-900/30 h-16 flex items-center justify-between px-4 lg:px-8 shadow-lg transition-all duration-300">
        
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-800 to-amber-600 flex items-center justify-center border border-amber-500/50 group-hover:rotate-12 transition-transform shrink-0 shadow-[0_0_10px_rgba(220,38,38,0.4)]">
            <span className="font-chinese text-xl text-white pt-1 select-none">命</span>
          </div>
          <div className="flex flex-col">
             <h1 className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 mystical-font-th leading-none">
               ชีวิตเหนือดวง
             </h1>
             <span className="text-[9px] text-red-300/60 uppercase tracking-widest hidden sm:block leading-tight">
               Grandmaster Edition
             </span>
          </div>
        </div>

        {userProfile && (
          <>
            {/* Center: Desktop Navigation (Hidden on Mobile) */}
            <nav className="hidden md:flex items-center gap-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <button 
                onClick={() => onNavigate('home')} 
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'home' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'}`}
              >
                 <Home className="w-4 h-4" /> ทำนาย
              </button>
              <button 
                onClick={() => onNavigate('calendar')} 
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'calendar' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'}`}
              >
                 <CalendarDays className="w-4 h-4" /> ปฏิทิน
              </button>
               <button 
                onClick={() => onNavigate('community')} 
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'community' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'}`}
              >
                 <Users className="w-4 h-4" /> ชุมชน
              </button>
              <button 
                onClick={() => onNavigate('profile')} 
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'profile' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'}`}
              >
                 <User className="w-4 h-4" /> โปรไฟล์
              </button>
            </nav>

            {/* Right: Credits & Profile */}
            <div className="flex items-center gap-3">
              {/* Credit Badge (Visible on Mobile too, but compact) */}
              <button 
                onClick={onTopUp}
                className="flex items-center gap-1.5 bg-red-950/40 border border-amber-500/30 pl-2 pr-2 md:pr-3 py-1 rounded-full hover:bg-red-900/50 transition-colors group active:scale-95"
              >
                <Coins className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform" />
                <span className="text-xs font-bold text-amber-100">{userProfile.credits}</span>
                <div className="hidden md:flex w-3.5 h-3.5 bg-amber-600 rounded-full items-center justify-center text-[8px] text-black font-bold ml-1">
                  +
                </div>
              </button>

              {/* User Avatar */}
              <div className="relative group cursor-pointer">
                <div className="w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 to-red-900 shadow-md transition-transform active:scale-95" onClick={() => onNavigate('profile')}>
                  <img 
                    src={userProfile.pictureUrl || "https://cdn-icons-png.flaticon.com/512/1077/1077114.png"} 
                    alt="User" 
                    className="w-full h-full rounded-full object-cover border-2 border-black"
                  />
                </div>
                
                {/* Desktop Dropdown */}
                <div className="hidden md:group-hover:block absolute top-full right-0 mt-3 w-56 bg-[#0a0a0a] border border-white/10 rounded-sm shadow-2xl overflow-hidden animate-fade-in z-50 ring-1 ring-white/5">
                   <div className="p-4 bg-gradient-to-b from-red-900/20 to-transparent border-b border-white/10">
                      <p className="text-[10px] uppercase text-amber-500 font-bold tracking-wider mb-1">เข้าสู่ระบบโดย</p>
                      <p className="text-sm font-bold text-white truncate">{userProfile.displayName}</p>
                   </div>
                   <button onClick={onLogout} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-900/10 flex items-center gap-2 transition-colors">
                     <LogOut className="w-4 h-4" /> ออกจากระบบ
                   </button>
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 w-full pt-20 pb-28 md:pb-12 px-4 sm:px-6 md:px-8 flex flex-col items-center">
        {children}
      </main>

      {/* --- BOTTOM NAVIGATION BAR (Mobile Fixed) --- */}
      {userProfile && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#050505]/95 backdrop-blur-xl border-t border-white/10 md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.8)] pb-safe-area">
          <div className="grid grid-cols-5 h-[70px] px-2 relative">
             
             {/* 1. Home */}
             <button 
                onClick={() => onNavigate('home')}
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 active:scale-95 ${activeTab === 'home' ? 'text-amber-400' : 'text-white/40 hover:text-white/70'}`}
              >
                <div className={`relative ${activeTab === 'home' ? '-translate-y-1' : ''} transition-transform`}>
                   <Home className={`w-6 h-6 ${activeTab === 'home' ? 'fill-amber-500/20 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : ''}`} />
                   {activeTab === 'home' && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full"></span>}
                </div>
                <span className="text-[9px] font-medium tracking-wide">ทำนาย</span>
             </button>

             {/* 2. Calendar */}
             <button 
                onClick={() => onNavigate('calendar')}
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 active:scale-95 ${activeTab === 'calendar' ? 'text-amber-400' : 'text-white/40 hover:text-white/70'}`}
              >
                <div className={`relative ${activeTab === 'calendar' ? '-translate-y-1' : ''} transition-transform`}>
                   <CalendarDays className={`w-6 h-6 ${activeTab === 'calendar' ? 'fill-amber-500/20 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : ''}`} />
                   {activeTab === 'calendar' && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full"></span>}
                </div>
                <span className="text-[9px] font-medium tracking-wide">ปฏิทิน</span>
             </button>

             {/* 3. Top Up (Floating) */}
             <div className="relative flex justify-center">
                <button 
                  onClick={onTopUp}
                  className="absolute -top-6 w-14 h-14 rounded-full bg-gradient-to-br from-red-600 via-red-700 to-red-900 border-[3px] border-[#050505] flex items-center justify-center shadow-[0_4px_20px_rgba(220,38,38,0.5)] active:scale-90 transition-transform hover:scale-105 hover:-translate-y-1 z-10"
                >
                  <Coins className="w-6 h-6 text-amber-100 drop-shadow-md" />
                </button>
                <span className="absolute bottom-3 text-[9px] font-bold text-amber-500/80 tracking-wide">เติมเครดิต</span>
             </div>

             {/* 4. Community (NEW) */}
             <button 
                onClick={() => onNavigate('community')}
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 active:scale-95 ${activeTab === 'community' ? 'text-amber-400' : 'text-white/40 hover:text-white/70'}`}
              >
                <div className={`relative ${activeTab === 'community' ? '-translate-y-1' : ''} transition-transform`}>
                   <Users className={`w-6 h-6 ${activeTab === 'community' ? 'fill-amber-500/20 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : ''}`} />
                   {activeTab === 'community' && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full"></span>}
                </div>
                <span className="text-[9px] font-medium tracking-wide">ชุมชน</span>
             </button>

             {/* 5. Profile */}
             <button 
                onClick={() => onNavigate('profile')}
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 active:scale-95 ${activeTab === 'profile' ? 'text-amber-400' : 'text-white/40 hover:text-white/70'}`}
              >
                <div className={`relative ${activeTab === 'profile' ? '-translate-y-1' : ''} transition-transform`}>
                   <User className={`w-6 h-6 ${activeTab === 'profile' ? 'fill-amber-500/20 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : ''}`} />
                   {activeTab === 'profile' && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full"></span>}
                </div>
                <span className="text-[9px] font-medium tracking-wide">โปรไฟล์</span>
             </button>

          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;