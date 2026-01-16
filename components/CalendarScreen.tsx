import React, { useEffect, useState } from 'react';
import { CalendarDay, CalendarResponse } from '../types';
import { generateCalendar } from '../services/geminiService';
import { CalendarDays, Sun, Moon, ThumbsUp, ThumbsDown, Clock, Loader2, Sparkles, ScrollText, AlertTriangle, Heart } from 'lucide-react';

interface CalendarScreenProps {
  userId: string;
}

const CalendarScreen: React.FC<CalendarScreenProps> = ({ userId }) => {
  const [data, setData] = useState<CalendarResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendar = async () => {
      // Simulate checking local storage first for cache
      const cached = localStorage.getItem(`calendar_${userId}_${new Date().toDateString()}`);
      if (cached) {
        setData(JSON.parse(cached));
        setLoading(false);
        return;
      }

      try {
        // Fetch next 7 days
        const today = new Date().toISOString().split('T')[0];
        const result = await generateCalendar(today, 7);
        setData(result);
        localStorage.setItem(`calendar_${userId}_${new Date().toDateString()}`, JSON.stringify(result));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, [userId]);

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-amber-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="text-sm tracking-widest uppercase animate-pulse">คำนวณปฏิทินทงซู...</p>
      </div>
    );
  }

  if (!data) return <div className="text-center p-10 text-red-400">ไม่สามารถเชื่อมต่อดวงดาวได้</div>;

  return (
    <div className="w-full max-w-5xl animate-fade-in pb-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block p-3 rounded-full bg-red-900/20 border border-red-600/30 mb-4 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
          <CalendarDays className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-amber-100 mystical-font-th mb-2">ปฏิทินมงคล (ทงซู)</h2>
        <p className="text-sm text-gray-400 max-w-lg mx-auto leading-relaxed border-l-2 border-amber-600 pl-4 italic">
          "{data.month_insight}"
        </p>
      </div>

      {/* Calendar Grid - 2 Cols on Large Screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {data.days.map((day, idx) => (
          <div 
            key={idx} 
            className={`glass-panel p-0 rounded-sm overflow-hidden border-l-4 relative group transition-all duration-500 flex flex-col
              ${day.daily_energy.includes('ดี') || day.daily_energy.includes('รุ่งเรือง') || day.daily_energy.includes('สำเร็จ') ? 'border-l-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]' : 
                day.daily_energy.includes('ระวัง') || day.daily_energy.includes('แตก') || day.daily_energy.includes('อันตราย') ? 'border-l-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.15)]' : 'border-l-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]'}`}
          >
            {/* Header Strip */}
            <div className="p-3 md:p-4 bg-white/5 border-b border-white/10 flex flex-wrap justify-between items-center gap-2">
               <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-sm bg-black border border-white/10 shrink-0">
                     <span className="text-[10px] uppercase text-red-500 font-bold">{new Date(day.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                     <span className="text-lg md:text-xl font-bold text-white leading-none">{new Date(day.date).getDate()}</span>
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-amber-100 mystical-font-th">
                       {day.daily_pillar}
                    </h3>
                    <span className="text-[10px] md:text-xs text-amber-500/60 flex items-center gap-1">
                       <Moon className="w-3 h-3" /> {day.lunar_date}
                    </span>
                  </div>
               </div>
               
               <div className={`px-2 py-1 md:px-3 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${
                 day.daily_energy.includes('ดี') || day.daily_energy.includes('สำเร็จ') ? 'bg-green-950/40 border-green-500/50 text-green-400' : 
                 day.daily_energy.includes('ระวัง') || day.daily_energy.includes('แตก') ? 'bg-red-950/40 border-red-500/50 text-red-400' : 'bg-amber-950/40 border-amber-500/50 text-amber-400'
               }`}>
                  <ScrollText className="w-3 h-3" /> {day.daily_energy}
               </div>
            </div>

            <div className="p-4 md:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 relative flex-1">
               {/* Background Watermark */}
               <div className="absolute right-4 bottom-4 text-8xl md:text-9xl font-chinese opacity-[0.03] pointer-events-none select-none">
                  吉
               </div>

               {/* Left Col: Activities */}
               <div className="md:col-span-7 space-y-4">
                  {/* Lucky Activities */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-green-400 text-xs font-bold uppercase tracking-wider">
                       <ThumbsUp className="w-3 h-3" /> กิจกรรมมงคล
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {day.auspicious_activities.length > 0 ? day.auspicious_activities.map((act, i) => (
                        <span key={i} className="text-xs md:text-sm text-gray-300 bg-green-900/10 border border-green-500/20 px-2 py-0.5 rounded-sm">{act}</span>
                      )) : <span className="text-xs text-gray-500 italic">- ไม่มีกิจกรรม -</span>}
                    </div>
                  </div>

                  {/* Unlucky Activities */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-red-400 text-xs font-bold uppercase tracking-wider">
                       <ThumbsDown className="w-3 h-3" /> กิจกรรมอัปมงคล
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {day.inauspicious_activities.length > 0 ? day.inauspicious_activities.map((act, i) => (
                        <span key={i} className="text-xs md:text-sm text-gray-400 bg-red-900/10 border border-red-500/20 px-2 py-0.5 rounded-sm">{act}</span>
                      )) : <span className="text-xs text-gray-500 italic">- ไม่มีข้อห้าม -</span>}
                    </div>
                  </div>

                  {/* Lucky Hours */}
                  <div className="flex items-center gap-2 pt-2 text-amber-200/80 text-xs md:text-sm mt-auto">
                    <Clock className="w-3 h-3 md:w-4 md:h-4 text-amber-500" />
                    ยามมงคล: <span className="font-bold text-amber-100">{day.lucky_hours}</span>
                  </div>
               </div>

               {/* Right Col: Zodiac Compatibility */}
               <div className="md:col-span-5 bg-black/20 rounded-sm p-3 border border-white/5 flex flex-col justify-center space-y-2">
                  <h4 className="text-[9px] text-gray-400 uppercase tracking-widest text-center mb-1">ความสมพงษ์</h4>
                  
                  {/* Best Match */}
                  <div className="flex items-center justify-between group/zodiac">
                     <span className="text-[10px] md:text-xs text-green-400 flex items-center gap-1"><Heart className="w-3 h-3 fill-green-400" /> ถูกโฉลก</span>
                     <span className="text-sm font-bold text-green-100">{day.zodiac_compatibility.best}</span>
                  </div>

                  {/* Harmony (Ok) */}
                  <div className="flex items-start justify-between">
                     <span className="text-[10px] md:text-xs text-blue-400 flex items-center gap-1 mt-0.5"><Sparkles className="w-3 h-3" /> สมพงษ์</span>
                     <div className="text-right flex flex-col">
                        {day.zodiac_compatibility.ok.map((z, i) => (
                           <span key={i} className="text-xs md:text-sm font-medium text-blue-100">{z}</span>
                        ))}
                     </div>
                  </div>

                  <div className="w-full h-px bg-white/10 my-1"></div>

                  {/* Clash */}
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] md:text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> ชง (ระวัง)</span>
                     <span className="text-sm font-bold text-red-100">{day.zodiac_compatibility.clash}</span>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center pb-8">
         <p className="text-[10px] text-white/30 flex items-center justify-center gap-2">
            <ScrollText className="w-3 h-3" />
            คำนวณตามตำราปฏิทินจีน (ทงซู) และหลักโป๊ยยี่
         </p>
      </div>
    </div>
  );
};

export default CalendarScreen;