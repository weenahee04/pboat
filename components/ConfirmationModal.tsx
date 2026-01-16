import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'ยืนยัน',
  cancelText = 'ยกเลิก',
  isDanger = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className={`relative w-full max-w-sm glass-panel p-6 shadow-[0_0_40px_rgba(0,0,0,0.6)] animate-fade-in-up border-t-4 ${isDanger ? 'border-t-red-600' : 'border-t-amber-500'}`}>
        <div className="flex flex-col items-center text-center">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-5 shadow-lg ${isDanger ? 'bg-red-950/40 text-red-500 border border-red-500/30' : 'bg-amber-950/40 text-amber-500 border border-amber-500/30'}`}>
            {isDanger ? <AlertTriangle className="w-7 h-7" /> : <Info className="w-7 h-7" />}
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2 mystical-font-th">{title}</h3>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed font-light">{message}</p>
          
          <div className="flex gap-3 w-full">
            <button 
              onClick={onClose}
              className="flex-1 py-3 rounded-sm border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white transition-all text-sm font-medium"
            >
              {cancelText}
            </button>
            <button 
              onClick={() => { onConfirm(); onClose(); }}
              className={`flex-1 py-3 rounded-sm text-black font-bold text-sm transition-all shadow-lg transform active:scale-95 ${isDanger ? 'bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white' : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300'}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;