import React from 'react';
import { Sun } from 'lucide-react';

interface DailyRewardModalProps {
  isOpen: boolean;
  onClaim: () => void;
  rewardAmount: number;
}

const DailyRewardModal: React.FC<DailyRewardModalProps> = ({ isOpen, onClaim, rewardAmount }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md"></div>
      
      <div className="relative w-full max-w-sm glass-panel p-8 rounded-sm text-center border-t-4 border-t-amber-500 animate-fade-in-up shadow-[0_0_60px_rgba(251,191,36,0.15)]">
        {/* Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="inline-block p-4 rounded-full bg-gradient-to-tr from-amber-400 to-red-600 shadow-[0_0_30px_rgba(251,191,36,0.6)] mb-6 animate-pulse ring-4 ring-black">
            <Sun className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 mystical-font-th mb-2 drop-shadow-sm">
            พรแห่งรุ่งอรุณ
          </h2>
          <p className="text-sm text-gray-400 mb-8 font-light">
            การเริ่มต้นวันใหม่ด้วยใจที่ผ่องใส<br/>คือกุญแจสู่ความสำเร็จ
          </p>

          <div className="flex flex-col items-center gap-2 mb-8 bg-black/30 py-4 rounded-sm border border-white/5 mx-4">
             <span className="text-5xl font-bold text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">+{rewardAmount}</span>
             <span className="text-[10px] uppercase tracking-[0.2em] text-amber-500/80">Divine Credits</span>
          </div>

          <button
            onClick={onClaim}
            className="w-full py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 bg-[length:200%_auto] hover:bg-right text-black font-bold text-lg rounded-sm shadow-[0_0_20px_rgba(217,119,6,0.4)] transition-all transform hover:-translate-y-1 active:scale-95 duration-500"
          >
            น้อมรับพร
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyRewardModal;