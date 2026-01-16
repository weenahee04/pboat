import React from 'react';
import { X, Coins, Sparkles, CreditCard, Star } from 'lucide-react';

interface TopUpModalProps {
  onClose: () => void;
  onTopUp: (amount: number) => void;
}

const TopUpModal: React.FC<TopUpModalProps> = ({ onClose, onTopUp }) => {
  const packages = [
    { amount: 1, price: 9, label: 'เริ่มต้น', popular: false },
    { amount: 5, price: 39, label: 'คุ้มค่า', popular: true },
    { amount: 10, price: 69, label: 'มหาเฮง', popular: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md glass-panel border-y-2 border-y-amber-600/50 border-x-0 md:border md:border-amber-600/30 md:rounded-sm shadow-[0_0_50px_rgba(217,119,6,0.15)] p-6 overflow-hidden animate-fade-in-up">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-red-600/10 rounded-full blur-[50px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors z-20">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 mb-4 shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-pulse">
            <Coins className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100 mystical-font-th drop-shadow-sm">
            เติมเครดิตบุญ
          </h2>
          <p className="text-xs text-amber-500/60 mt-2 font-light tracking-wider uppercase">สะสมแต้มบุญเพื่อเปิดดวงชะตาฟ้าลิขิต</p>
        </div>

        <div className="space-y-3 relative z-10">
          {packages.map((pkg) => (
            <button
              key={pkg.amount}
              onClick={() => onTopUp(pkg.amount)}
              className={`relative w-full group flex items-center justify-between p-4 border transition-all duration-300 rounded-sm overflow-hidden
                ${pkg.popular 
                  ? 'bg-gradient-to-r from-amber-900/40 to-black border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                  : 'bg-white/5 border-white/10 hover:border-amber-500/40 hover:bg-amber-900/10'
                }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0">
                   <div className="bg-red-600 text-white text-[9px] font-bold px-3 py-1 rounded-bl-lg shadow-md flex items-center gap-1">
                     <Star className="w-3 h-3 fill-current" /> ขายดี
                   </div>
                </div>
              )}
              
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors
                  ${pkg.popular ? 'bg-amber-500 text-black border-amber-300' : 'bg-black/50 text-amber-500 border-amber-500/30 group-hover:border-amber-500 group-hover:text-amber-400'}
                `}>
                  <span className="font-bold text-lg">{pkg.amount}</span>
                </div>
                <div className="text-left">
                  <div className={`font-bold text-base flex items-center gap-2 ${pkg.popular ? 'text-amber-100' : 'text-gray-300 group-hover:text-amber-100'}`}>
                    {pkg.amount} เครดิต
                  </div>
                  <div className="text-xs text-gray-500 group-hover:text-gray-400">{pkg.label}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 pr-2">
                <div className="flex flex-col items-end">
                   <span className={`text-xl font-bold ${pkg.popular ? 'text-amber-400' : 'text-gray-300 group-hover:text-amber-300'}`}>฿{pkg.price}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t border-white/5 text-center">
            <p className="text-[10px] text-white/20 flex items-center justify-center gap-1.5 font-light">
               <CreditCard className="w-3 h-3" /> Payment via Secure Simulator System
            </p>
        </div>
      </div>
    </div>
  );
};

export default TopUpModal;