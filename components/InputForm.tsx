import React, { useState } from 'react';
import { UserInput, LineUserProfile } from '../types';
import { ArrowRight, Clock, Calendar, User as UserIcon, Sparkles, Coins, Plus, Heart, User, Info } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: UserInput, cost: number) => void;
  isLoading: boolean;
  userProfile: LineUserProfile | null;
  onTopUp: () => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, userProfile, onTopUp }) => {
  const [mode, setMode] = useState<'solo' | 'couple'>('solo');
  
  // User Data
  const [dob, setDob] = useState('');
  const [time, setTime] = useState('');
  const [gender, setGender] = useState('Not Specified');

  // Partner Data
  const [partnerDob, setPartnerDob] = useState('');
  const [partnerTime, setPartnerTime] = useState('');
  const [partnerGender, setPartnerGender] = useState('Not Specified');

  const cost = mode === 'solo' ? 1 : 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob) return;
    if (mode === 'couple' && !partnerDob) return;

    const data: UserInput = { 
      dob, 
      time, 
      gender,
      ...(mode === 'couple' && {
        partner_dob: partnerDob,
        partner_time: partnerTime,
        partner_gender: partnerGender
      })
    };
    
    onSubmit(data, cost);
  };

  const hasCredits = userProfile ? userProfile.credits >= cost : false;

  const TimeInfoTooltip = () => (
    <div className="group relative inline-flex ml-1">
      <Info className="w-3 h-3 text-gray-500 hover:text-amber-500 cursor-help transition-colors" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-black/95 border border-amber-500/20 rounded-sm text-xs text-gray-300 hidden group-hover:block z-50 shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md animate-fade-in pointer-events-none">
        <p className="leading-relaxed">
          <span className="text-amber-500 font-bold">เวลาเกิดสำคัญไฉน?</span><br/>
          การระบุเวลาที่แน่นอนช่วยให้คำนวณ "หลักยาม" และลัคนาได้แม่นยำยิ่งขึ้น ส่งผลต่อคำทำนายเรื่องบริวารและบั้นปลายชีวิต
        </p>
        <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-black border-r border-b border-amber-500/20 rotate-45"></div>
      </div>
    </div>
  );

  return (
    <div className="relative z-10 w-full max-w-lg glass-panel rounded-sm border border-red-900/40 animate-fade-in-up shadow-2xl flex flex-col mb-4">
      
      {/* Decorative Top Border */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>

      {/* Mode Tabs */}
      <div className="flex border-b border-red-900/30">
        <button
          onClick={() => setMode('solo')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 transition-all duration-300 ${mode === 'solo' ? 'bg-red-950/30 text-amber-400 shadow-[inset_0_-2px_0_#f59e0b]' : 'bg-transparent text-white/30 hover:text-white/60 hover:bg-white/5'}`}
        >
          <User className="w-4 h-4" /> 
          <span className="text-sm font-medium">ดูดวงส่วนตัว</span>
        </button>
        <button
          onClick={() => setMode('couple')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 transition-all duration-300 ${mode === 'couple' ? 'bg-pink-950/30 text-pink-400 shadow-[inset_0_-2px_0_#ec4899]' : 'bg-transparent text-white/30 hover:text-white/60 hover:bg-white/5'}`}
        >
          <Heart className="w-4 h-4" />
          <span className="text-sm font-medium">ผูกดวงสมพงษ์</span>
        </button>
      </div>

      <div className="p-6 md:p-8">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-1">
            <h1 className="relative text-5xl font-chinese text-transparent bg-clip-text bg-gradient-to-b from-amber-300 via-yellow-500 to-amber-700 drop-shadow-sm select-none">
              {mode === 'solo' ? '天命' : '緣分'}
            </h1>
          </div>
          <h2 className="text-lg font-bold text-amber-100 mystical-font-th tracking-wide">
             {mode === 'solo' ? 'กรอกข้อมูลชะตา' : 'ข้อมูลคู่สร้างคู่สม'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* User Section */}
          <div className="space-y-4">
             {mode === 'couple' && <div className="text-xs text-amber-500 uppercase tracking-widest border-b border-white/10 pb-1 mb-2 font-bold">ข้อมูลของคุณ</div>}
             
             <div className="group space-y-1">
              <label className="text-[10px] uppercase text-gray-400 font-medium tracking-wider">วันเกิด</label>
              <input 
                type="date" 
                required 
                value={dob} 
                onChange={(e) => setDob(e.target.value)} 
                placeholder="DD/MM/YYYY"
                className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-sm focus:border-amber-500 focus:bg-white/10 focus:outline-none text-amber-50 text-sm transition-colors placeholder-white/20" 
              />
             </div>
             <div className="flex gap-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center">
                    <label className="text-[10px] uppercase text-gray-400 font-medium tracking-wider">เวลาเกิด</label>
                    <TimeInfoTooltip />
                  </div>
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-sm focus:border-amber-500 focus:bg-white/10 focus:outline-none text-amber-50 text-sm transition-colors" />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] uppercase text-gray-400 font-medium tracking-wider">เพศ</label>
                  <div className="relative">
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-sm focus:border-amber-500 focus:bg-white/10 focus:outline-none text-amber-50 text-sm appearance-none transition-colors">
                      <option value="Not Specified" className="bg-gray-900">ไม่ระบุ</option>
                      <option value="Male" className="bg-gray-900">ชาย</option>
                      <option value="Female" className="bg-gray-900">หญิง</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
             </div>
          </div>

          {/* Partner Section */}
          {mode === 'couple' && (
             <div className="space-y-4 pt-2 animate-fade-in bg-pink-900/10 p-4 rounded-sm border border-pink-500/20">
               <div className="text-xs text-pink-400 uppercase tracking-widest border-b border-pink-500/20 pb-1 mb-2 font-bold">ข้อมูลคู่ของคุณ</div>
               
               <div className="group space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-medium tracking-wider">วันเกิด</label>
                <input 
                  type="date" 
                  required 
                  value={partnerDob} 
                  onChange={(e) => setPartnerDob(e.target.value)} 
                  placeholder="DD/MM/YYYY"
                  className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-sm focus:border-pink-500 focus:bg-white/10 focus:outline-none text-pink-50 text-sm transition-colors placeholder-white/20" 
                />
               </div>
               <div className="flex gap-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center">
                      <label className="text-[10px] uppercase text-gray-400 font-medium tracking-wider">เวลาเกิด</label>
                      <TimeInfoTooltip />
                    </div>
                    <input type="time" value={partnerTime} onChange={(e) => setPartnerTime(e.target.value)} className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-sm focus:border-pink-500 focus:bg-white/10 focus:outline-none text-pink-50 text-sm transition-colors" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] uppercase text-gray-400 font-medium tracking-wider">เพศ</label>
                    <div className="relative">
                      <select value={partnerGender} onChange={(e) => setPartnerGender(e.target.value)} className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-sm focus:border-pink-500 focus:bg-white/10 focus:outline-none text-pink-50 text-sm appearance-none transition-colors">
                        <option value="Not Specified" className="bg-gray-900">ไม่ระบุ</option>
                        <option value="Male" className="bg-gray-900">ชาย</option>
                        <option value="Female" className="bg-gray-900">หญิง</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {hasCredits ? (
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-6 group relative flex items-center justify-center py-4 px-6 rounded-sm text-white font-bold transition-all duration-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed border
                ${mode === 'couple' 
                  ? 'bg-gradient-to-r from-pink-800 via-pink-600 to-pink-800 hover:from-pink-500 hover:to-pink-600 border-pink-500/30 shadow-pink-900/20' 
                  : 'bg-gradient-to-r from-red-800 via-red-600 to-red-800 hover:from-amber-600 hover:to-amber-600 border-red-500/30 shadow-red-900/20'
                }`}
            >
              {isLoading ? (
                <span className="flex items-center tracking-wide text-sm">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังทำนาย...
                </span>
              ) : (
                <div className="flex flex-col items-center leading-none">
                  <span className="flex items-center font-kanit tracking-wide">
                    {mode === 'couple' ? 'ผูกดวงสมพงษ์' : 'เปิดดวงชะตา'} 
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform text-white/80" />
                  </span>
                  <span className="text-[10px] text-white/60 mt-1 font-light">ใช้ {cost} เครดิต</span>
                </div>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onTopUp}
              className="w-full mt-6 group relative flex items-center justify-center py-4 px-6 rounded-sm text-black font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-white hover:to-amber-200 focus:outline-none transition-all duration-500 shadow-[0_0_20px_rgba(217,119,6,0.4)] border border-amber-500/50"
            >
               <span className="flex items-center font-kanit tracking-wide">
                <Coins className="mr-2 w-5 h-5" /> เติมเครดิต ({cost - (userProfile?.credits || 0)} ขาดอีก)
              </span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default InputForm;