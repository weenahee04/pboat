import React from 'react';
import { Sparkles } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
  isLoading: boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, isLoading }) => {
  return (
    <div className="relative z-10 w-full max-w-md p-10 glass-panel rounded-none border-y-4 border-y-red-700 border-x-0 animate-fade-in-up shadow-[0_0_50px_rgba(185,28,28,0.15)] flex flex-col items-center">
       {/* Corner Ornaments */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500"></div>

      <div className="text-center mb-12 relative">
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 bg-red-600 blur-3xl opacity-20 rounded-full"></div>
          <h1 className="relative text-8xl font-chinese text-transparent bg-clip-text bg-gradient-to-b from-amber-300 via-yellow-500 to-amber-700 drop-shadow-sm select-none">
            天命
          </h1>
        </div>
        
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-white mystical-font-th tracking-wide drop-shadow-md">
          ชีวิตเหนือดวง
        </h2>
        <p className="mt-4 text-red-200/60 text-sm font-light tracking-wider">
          ปลดล็อคชะตาฟ้าลิขิต ด้วยบัญชี LINE ของคุณ
        </p>
      </div>

      <button
        onClick={onLogin}
        disabled={isLoading}
        className="w-full group relative flex items-center justify-center py-4 px-6 rounded-sm bg-[#06C755] hover:bg-[#05b34c] transition-all duration-300 shadow-[0_0_15px_rgba(6,199,85,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center text-white font-bold tracking-wide">
             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            กำลังเชื่อมต่อ...
          </span>
        ) : (
          <div className="flex items-center gap-3">
            {/* LINE Icon SVG */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path fillRule="evenodd" clipRule="evenodd" d="M19.98 9.54C19.98 5.43 16.38 2.1 11.94 2.1C7.5 2.1 3.9 5.43 3.9 9.54C3.9 12.96 5.94 15.9 8.94 16.68C9.27 16.74 9.39 16.8 9.42 17.04C9.42 17.22 9.42 17.58 9.42 17.58C9.42 17.58 9.3 18.27 9.27 18.42C8.97 19.8 10.77 18.9 11.49 18.39C11.55 18.33 11.61 18.3 11.64 18.27C13.29 17.37 19.98 13.77 19.98 9.54ZM7.92 10.59H6.39V7.53C6.39 7.29 6.21 7.11 5.97 7.11C5.73 7.11 5.55 7.29 5.55 7.53V10.98C5.55 11.1 5.61 11.22 5.67 11.31C5.76 11.37 5.85 11.4 5.97 11.4H7.92C8.16 11.4 8.34 11.22 8.34 10.98C8.34 10.74 8.16 10.59 7.92 10.59ZM9.93 11.4C10.17 11.4 10.35 11.22 10.35 10.98V7.53C10.35 7.29 10.17 7.11 9.93 7.11C9.69 7.11 9.51 7.29 9.51 7.53V10.98C9.51 11.22 9.69 11.4 9.93 11.4ZM13.83 10.08L12.51 8.07V10.98C12.51 11.22 12.33 11.4 12.09 11.4C11.85 11.4 11.67 11.22 11.67 10.98V7.53C11.67 7.29 11.85 7.11 12.09 7.11C12.21 7.11 12.3 7.14 12.39 7.23L13.71 9.27V7.53C13.71 7.29 13.89 7.11 14.13 7.11C14.37 7.11 14.55 7.29 14.55 7.53V10.98C14.55 11.22 14.37 11.4 14.13 11.4C13.98 11.4 13.89 11.34 13.83 11.28C13.83 11.25 13.83 10.17 13.83 10.08ZM18.3 9.42H16.74V10.17H18.3C18.54 10.17 18.72 10.35 18.72 10.59C18.72 10.83 18.54 11.01 18.3 11.01H16.32C16.08 11.01 15.9 10.83 15.9 10.59V7.53C15.9 7.29 16.08 7.11 16.32 7.11H18.3C18.54 7.11 18.72 7.29 18.72 7.53C18.72 7.77 18.54 7.95 18.3 7.95H16.74V8.58H18.3C18.54 8.58 18.72 8.76 18.72 9C18.72 9.24 18.54 9.42 18.3 9.42Z" fill="white"/>
            </svg>
            <span className="text-white font-bold tracking-wide">เข้าสู่ระบบด้วย LINE</span>
          </div>
        )}
      </button>

      <div className="mt-8 flex items-center justify-center gap-2 opacity-50">
        <Sparkles className="w-3 h-3 text-amber-500" />
        <span className="text-xs text-amber-100/50">ปลอดภัยและเป็นส่วนตัว 100%</span>
        <Sparkles className="w-3 h-3 text-amber-500" />
      </div>
    </div>
  );
};

export default LoginScreen;