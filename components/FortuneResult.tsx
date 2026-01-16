import React from 'react';
import { FortuneResponse, BaZiPillar } from '../types';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis, Cell, PieChart, Pie, Tooltip } from 'recharts';
import { Compass, RefreshCw, Heart, Award } from 'lucide-react';

interface FortuneResultProps {
  data: FortuneResponse;
  onReset: () => void;
}

const PillarCard: React.FC<{ title: string; pillar: BaZiPillar }> = ({ title, pillar }) => {
  const getElementColor = (el: string) => {
    if (el.includes('ไฟ')) return 'text-red-500 border-red-500/30';
    if (el.includes('น้ำ')) return 'text-blue-400 border-blue-400/30';
    if (el.includes('ไม้')) return 'text-green-500 border-green-500/30';
    if (el.includes('ทอง')) return 'text-amber-200 border-amber-200/30';
    if (el.includes('ดิน')) return 'text-yellow-700 border-yellow-700/30';
    return 'text-gray-400 border-gray-400/30';
  };

  const style = getElementColor(pillar.element);

  return (
    <div className={`flex flex-col items-center bg-black/40 border rounded-sm p-2 md:p-3 min-w-[60px] sm:min-w-[70px] flex-1 ${style.split(' ')[1]}`}>
      <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-white/50 mb-1 md:mb-2">{title}</span>
      <div className="flex flex-col gap-1 md:gap-2 font-chinese text-xl md:text-2xl font-bold">
        <div className="flex flex-col items-center">
           <span className={`${style.split(' ')[0]}`}>{pillar.stem_char}</span>
        </div>
        <div className="w-full h-px bg-white/10"></div>
        <div className="flex flex-col items-center">
           <span className={`${style.split(' ')[0]}`}>{pillar.branch_char}</span>
        </div>
      </div>
      <div className="mt-2 text-[9px] md:text-[10px] text-center opacity-70 leading-tight">
        <div className="truncate w-full">{pillar.stem}</div>
        <div className="truncate w-full">{pillar.branch}</div>
      </div>
    </div>
  );
};

const FortuneResult: React.FC<FortuneResultProps> = ({ data, onReset }) => {
  const isCompatibility = !!data.compatibility;

  const statsData = [
    { name: 'โชคลาภ', value: data.stats.luck_score, fill: '#f59e0b' },
    { name: 'ความมั่งคั่ง', value: data.stats.wealth_score, fill: '#dc2626' },
    { name: 'ความรัก', value: data.stats.love_score, fill: '#991b1b' },
  ];
  
  // Element Balance Data for Pie Chart
  const elementData = data.bazi_chart ? [
    { name: 'ไม้', value: data.bazi_chart.element_balance.wood, color: '#22c55e' },
    { name: 'ไฟ', value: data.bazi_chart.element_balance.fire, color: '#ef4444' },
    { name: 'ดิน', value: data.bazi_chart.element_balance.earth, color: '#a16207' },
    { name: 'ทอง', value: data.bazi_chart.element_balance.metal, color: '#fcd34d' },
    { name: 'น้ำ', value: data.bazi_chart.element_balance.water, color: '#3b82f6' },
  ] : [];

  return (
    <div className="w-full max-w-5xl animate-fade-in pb-12">
      
      {/* Hero Section */}
      <div className="text-center mb-10">
        <div className={`w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 border-[3px] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)] transform hover:scale-110 transition-transform duration-500 ${isCompatibility ? 'border-pink-500 bg-pink-950/50' : 'border-red-600 bg-red-950/50'}`}>
           <span className={`${isCompatibility ? 'text-pink-500' : 'text-red-500'} font-chinese text-4xl md:text-5xl drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]`}>
             {isCompatibility ? '双' : '運'}
           </span>
        </div>
        
        <h1 className="text-xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 mystical-font-th mb-4 md:mb-6 leading-tight drop-shadow-lg px-2">
          "{data.hero_prediction.headline}"
        </h1>
        
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 text-amber-100/90 max-w-2xl mx-auto">
             <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-sm border-l-2 border-amber-500 bg-black/60 flex items-center gap-2 shadow-lg min-w-[90px] justify-center">
               <span className="font-light text-[9px] md:text-[10px] text-amber-500 uppercase tracking-widest">ราศี</span>
               <span className="font-bold text-xs md:text-sm text-amber-100">{data.user_profile.thai_zodiac}</span>
             </div>
             <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-sm border-l-2 border-red-600 bg-black/60 flex items-center gap-2 shadow-lg min-w-[90px] justify-center">
               <span className="font-light text-[9px] md:text-[10px] text-red-500 uppercase tracking-widest">นักษัตร</span>
               <span className="font-bold text-xs md:text-sm text-amber-100">{data.user_profile.chinese_zodiac}</span>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mb-10">
        
        {/* Ba Zi Chart (Top or Left) - New Section */}
        {data.bazi_chart && !isCompatibility && (
          <div className="lg:col-span-12 glass-panel rounded-sm p-4 md:p-6 mb-4 border-t-4 border-t-red-800">
             <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
               
               {/* 4 Pillars */}
               <div className="flex-1 w-full">
                 <h3 className="text-sm font-bold tracking-[0.2em] uppercase mb-4 text-amber-500 border-b border-white/10 pb-2">
                   ผังดวงจีน (โป๊ยยี่สี่เถียว)
                 </h3>
                 <div className="flex justify-between md:justify-around gap-2">
                    <PillarCard title="ปี" pillar={data.bazi_chart.year} />
                    <PillarCard title="เดือน" pillar={data.bazi_chart.month} />
                    <div className="relative flex-1 flex">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-600 text-[8px] px-1 rounded text-white font-bold whitespace-nowrap z-10 shadow-md">ดิถี</div>
                      <PillarCard title="วัน" pillar={data.bazi_chart.day} />
                    </div>
                    <PillarCard title="ยาม" pillar={data.bazi_chart.hour} />
                 </div>
                 <div className="mt-4 text-center">
                    <span className="text-xs text-gray-400">ดิถีของคุณคือ: </span>
                    <span className="text-lg font-bold text-amber-400 mystical-font-th">{data.bazi_chart.day_master}</span>
                 </div>
               </div>

               {/* 5 Elements Balance */}
               <div className="w-full md:w-64 flex flex-col items-center border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                 <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-2 text-gray-400">สมดุลธาตุทั้ง 5</h3>
                 <div className="w-32 h-32 md:w-40 md:h-40 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={elementData}
                          innerRadius="60%"
                          outerRadius="100%"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {elementData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip 
                           contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '4px' }}
                           itemStyle={{ color: '#fff', fontSize: '12px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Center Icon */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white/20">
                       <Award className="w-6 h-6" />
                    </div>
                 </div>
                 <div className="flex flex-wrap justify-center gap-2 text-[10px] text-gray-500 mt-2">
                    {elementData.map((e, i) => (
                      <span key={i} style={{color: e.color}}>{e.name}</span>
                    ))}
                 </div>
               </div>

             </div>
          </div>
        )}

        {/* Stats Column */}
        <div className={`lg:col-span-4 glass-panel rounded-sm p-4 md:p-6 flex flex-col items-center justify-between min-h-[250px] md:min-h-[300px] relative overflow-hidden border-t-4 ${isCompatibility ? 'border-t-pink-500' : 'border-t-amber-600'}`}>
          <h3 className={`text-sm font-bold tracking-[0.2em] uppercase mb-4 flex items-center gap-2 border-b border-white/10 pb-2 w-full justify-center ${isCompatibility ? 'text-pink-500' : 'text-amber-500'}`}>
            {isCompatibility ? <><Heart className="w-4 h-4"/> ความสมพงษ์</> : <><Award className="w-4 h-4"/> พลังชีวิต</>}
          </h3>
          
          <div className="w-full flex-1 relative z-10 flex items-center justify-center min-h-[180px]">
             {isCompatibility && data.compatibility ? (
               <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                 <div className="absolute inset-0 bg-pink-600/20 rounded-full animate-pulse blur-xl"></div>
                 <svg className="w-full h-full text-pink-600 drop-shadow-[0_0_15px_rgba(219,39,119,0.5)]" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-white pt-2">
                   <span className="text-2xl md:text-3xl font-bold font-chinese drop-shadow-md">{data.compatibility.score}%</span>
                   <span className="text-[10px] uppercase tracking-widest mt-1 opacity-80">Sync Rate</span>
                 </div>
               </div>
             ) : (
               <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  innerRadius="40%" 
                  outerRadius="100%" 
                  data={statsData} 
                  startAngle={180} 
                  endAngle={0}
                  barSize={20}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar
                    label={{ position: 'insideStart', fill: '#fff', fontWeight: 'bold', fontSize: 12 }}
                    background={{ fill: 'rgba(255,255,255,0.03)' }}
                    dataKey="value"
                    cornerRadius={2} 
                  />
                </RadialBarChart>
              </ResponsiveContainer>
             )}
          </div>
        </div>

        {/* Content Column */}
        <div className="lg:col-span-8 space-y-4 md:space-y-5">
          {/* Main Insight Card */}
          <div className={`glass-panel rounded-sm p-5 md:p-8 border-r-4 relative overflow-hidden group bg-gradient-to-l to-black ${isCompatibility ? 'border-r-pink-500 from-pink-950/30' : 'border-r-amber-500 from-amber-950/30'}`}>
            <h4 className={`text-xs uppercase tracking-[0.25em] font-bold mb-3 flex items-center ${isCompatibility ? 'text-pink-500' : 'text-amber-500'}`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${isCompatibility ? 'bg-pink-500' : 'bg-amber-500'}`}></span> 
              {isCompatibility ? 'บทวิเคราะห์ความสัมพันธ์' : 'จุดแข็งที่ซ่อนเร้น'}
            </h4>
            <p className="text-amber-50 text-base md:text-xl font-light leading-relaxed">
              {isCompatibility && data.compatibility ? data.compatibility.insight : data.deep_dive.personality_strength}
            </p>
          </div>

          {/* Challenge/Conflict Card */}
          <div className="glass-panel rounded-sm p-5 md:p-8 border-r-4 border-r-red-700 bg-gradient-to-l from-red-950/30 to-black relative overflow-hidden group">
            <h4 className="text-red-500 text-xs uppercase tracking-[0.25em] font-bold mb-3 flex items-center">
               <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span> {isCompatibility ? 'จุดที่ต้องปรับจูน' : 'บททดสอบแห่งโชคชะตา'}
            </h4>
            <p className="text-white text-base md:text-xl font-light leading-relaxed">
              {isCompatibility && data.compatibility ? data.compatibility.challenge : data.deep_dive.current_challenge}
            </p>
          </div>

          {/* Guidance Card (Shared) */}
          <div className="glass-panel rounded-sm p-5 md:p-8 border border-amber-500/20 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] relative">
             <div className="relative z-10">
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-gradient-to-br from-amber-600 to-amber-800 rounded-sm shadow-lg"><Compass className="w-4 h-4 text-black" /></div>
                 <h4 className="text-amber-100 text-xs uppercase tracking-wider font-bold">กลยุทธ์พิชิตกรรม</h4>
               </div>
              <p className="text-white text-base md:text-lg font-medium leading-relaxed italic border-l-2 border-amber-500/50 pl-4 md:pl-6">
                "{data.deep_dive.guidance}"
              </p>
             </div>
          </div>
        </div>
      </div>

      {/* Rituals Footer (Horizontal Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'สีมงคล', value: data.actionable_ritual.lucky_color, icon: '色', color: 'text-amber-400' },
          { label: 'ทิศมงคล', value: data.actionable_ritual.lucky_direction, icon: '方', color: 'text-red-400' },
          { label: 'กิจกรรมเสริมดวง', value: data.actionable_ritual.suggested_activity, icon: '行', color: 'text-amber-200' }
        ].map((item, idx) => (
          <div key={idx} className="glass-panel p-4 rounded-sm flex flex-col items-center justify-center text-center group hover:bg-white/5 transition-colors cursor-default border-t border-t-white/10 hover:border-t-amber-500 relative overflow-hidden">
            <div className="absolute -right-2 -bottom-6 text-7xl md:text-8xl font-chinese text-white/5 group-hover:text-amber-500/10 transition-colors">{item.icon}</div>
            <span className="text-[10px] text-white/40 uppercase tracking-widest mb-2">{item.label}</span>
            <span className={`text-base md:text-lg font-bold ${item.color} drop-shadow-sm`}>{item.value}</span>
          </div>
        ))}
      </div>

      <div className="text-center pb-8">
        <button
          onClick={onReset}
          className="inline-flex items-center px-8 py-3 rounded-full bg-amber-500 text-black font-bold text-base hover:bg-amber-400 transition-all transform hover:-translate-y-1 shadow-[0_0_25px_rgba(217,119,6,0.4)] border border-amber-400/50"
        >
          <RefreshCw className="w-5 h-5 mr-2" /> ทำนายดวงใหม่
        </button>
      </div>

    </div>
  );
};

export default FortuneResult;