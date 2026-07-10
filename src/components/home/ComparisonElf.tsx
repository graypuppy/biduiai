import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Clock, 
  FileSearch, 
  Fingerprint, 
  Cpu,
  RefreshCw,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

interface InfoItem {
  id: string;
  title: string;
  shortDesc: string;
  fullSpeech: string;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  accentColor: string;
  expression: 'happy' | 'analytical' | 'thinking' | 'detective';
}

export default function ComparisonElf() {
  const [activeTab, setActiveTab] = useState<'function' | 'value'>('function');
  const [activeId, setActiveId] = useState<string>('fun-1');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [bubbleKey, setBubbleKey] = useState<number>(0);

  const functionItems: InfoItem[] = [
    {
      id: 'fun-1',
      title: '资信标比对',
      shortDesc: '深度比对代表、身份证及关键资质',
      fullSpeech: '哇哈！我是最严厉的审计官！我会帮您穿透核对法人、核心技术人员的身份证、手机、邮箱、业绩甚至盖章及引用等细节。任何复制、改字、编造的行为，一秒就被我抓住啦！',
      icon: <Clock className="w-5 h-5" />,
      colorClass: 'text-blue-600',
      bgClass: 'bg-blue-50/70',
      borderClass: 'border-blue-100 hover:border-blue-300',
      accentColor: '#3B82F6',
      expression: 'analytical'
    },
    {
      id: 'fun-2',
      title: '技术标比对',
      shortDesc: 'AI语义分析，看破文字洗稿与图表拼凑',
      fullSpeech: '看我的！基于先进的NLP大语言模型语义对齐技术，不仅能精确查找相同的词句，还能看懂段落的实际内涵！表格、图纸和图片里的文字(OCR)也能关联核对，不管怎么调换语序、润色洗稿我都一眼识破！',
      icon: <FileSearch className="w-5 h-5" />,
      colorClass: 'text-emerald-600',
      bgClass: 'bg-emerald-50/70',
      borderClass: 'border-emerald-100 hover:border-emerald-300',
      accentColor: '#10B981',
      expression: 'thinking'
    },
    {
      id: 'fun-3',
      title: '经济标比对',
      shortDesc: '清单报价与定额子目，一键异常分析',
      fullSpeech: '哼哼，算账也是我的拿手好戏！项目属性差异、定额子目对齐、不平衡报价预警，还有人材机汇总偏差。我能在瞬息之间完成上万行清单的比对分析，把造价陷阱全部给您标出来！',
      icon: <Fingerprint className="w-5 h-5" />,
      colorClass: 'text-amber-600',
      bgClass: 'bg-amber-50/70',
      borderClass: 'border-amber-100 hover:border-amber-300',
      accentColor: '#F59E0B',
      expression: 'analytical'
    },
    {
      id: 'fun-4',
      title: '文件设备特征比对',
      shortDesc: '穿透式提取MAC、硬盘序列号硬件指纹',
      fullSpeech: '别想瞒天过海！有些作弊者会假装是不同人写的标书，但只要是在同一台电脑制作的，其MAC地址、硬盘/CPU序列号、Office元数据属性等设备基因就会一模一样！我可以直接穿透硬件底层，揪出“代写”与“串标”铁证！',
      icon: <Cpu className="w-5 h-5" />,
      colorClass: 'text-purple-600',
      bgClass: 'bg-purple-50/70',
      borderClass: 'border-purple-100 hover:border-purple-300',
      accentColor: '#8B5CF6',
      expression: 'detective'
    }
  ];

  const valueItems: InfoItem[] = [
    {
      id: 'val-1',
      title: '极致增效',
      shortDesc: '繁重比对几分钟搞定，省下95%精力',
      fullSpeech: '专家看几十万字标书看到老花眼？现在交给我这个机灵鬼，一键上传、全流程自动比对，以往需要数天的工作量，我几分钟就能完成，而且完全不会疲倦！',
      icon: <Zap className="w-5 h-5" />,
      colorClass: 'text-orange-600',
      bgClass: 'bg-orange-50/70',
      borderClass: 'border-orange-100 hover:border-orange-300',
      accentColor: '#F97316',
      expression: 'happy'
    },
    {
      id: 'val-2',
      title: '语义防线',
      shortDesc: '同义词、洗稿等高级伪装无处遁形',
      fullSpeech: '传统字句比对容易被一两个“标点符号”或者“同义词替换”蒙混过关。而我懂得理解前后文！哪怕是高级的改写、拼接，也逃不过我的AI雷达！',
      icon: <ShieldCheck className="w-5 h-5" />,
      colorClass: 'text-sky-600',
      bgClass: 'bg-sky-50/70',
      borderClass: 'border-sky-100 hover:border-sky-300',
      accentColor: '#0EA5E9',
      expression: 'thinking'
    },
    {
      id: 'val-3',
      title: '追根溯源',
      shortDesc: '全景留痕，从纸面比对到物理级印记',
      fullSpeech: '不单单是文字雷同，我们连写标书的人、用的电脑和操作痕迹都全部存证归档，在招投标、法律审查等场景提供不可抵赖、扎扎实实的物理设备证据链路！',
      icon: <Activity className="w-5 h-5" />,
      colorClass: 'text-rose-600',
      bgClass: 'bg-rose-50/70',
      borderClass: 'border-rose-100 hover:border-rose-300',
      accentColor: '#F43F5E',
      expression: 'detective'
    },
    {
      id: 'val-4',
      title: '护航正义',
      shortDesc: '三级红黄绿预警，护航招投标公平合规',
      fullSpeech: '招投标是一场公平公正的竞争。我会根据各种线索自动评估并亮起红黄绿三色预警，输出最专业的合规报告，全力维护每一家诚信企业的利益，击破灰色串标链条！',
      icon: <Sparkles className="w-5 h-5" />,
      colorClass: 'text-violet-600',
      bgClass: 'bg-violet-50/70',
      borderClass: 'border-violet-100 hover:border-violet-300',
      accentColor: '#8B5CF6',
      expression: 'happy'
    }
  ];

  const currentItems = activeTab === 'function' ? functionItems : valueItems;
  const currentActiveItem = currentItems.find(item => item.id === activeId) || currentItems[0];

  // Whenever item changes, let speech bubble animate and increment bubbleKey to trigger a clean exit/entrance
  useEffect(() => {
    setBubbleKey(prev => prev + 1);
  }, [activeId, activeTab]);

  // Set initial active id on tab changes
  const handleTabChange = (tab: 'function' | 'value') => {
    setActiveTab(tab);
    setActiveId(tab === 'function' ? 'fun-1' : 'val-1');
  };

  const triggerSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setBubbleKey(prev => prev + 1);
    setTimeout(() => {
      setIsSpinning(false);
    }, 1000);
  };

  // SVG representation of the comparison little elf (Mascot)
  const renderElfSvg = () => {
    const expression = currentActiveItem.expression;
    
    // Choose antenna glow color based on the item color
    const glowColor = currentActiveItem.accentColor;

    return (
      <svg 
        width="110" 
        height="125" 
        viewBox="0 0 110 125" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_10px_15px_rgba(99,102,241,0.15)]"
      >
        <defs>
          <linearGradient id="bodyGrad" x1="55" y1="20" x2="55" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EEF2FF" />
            <stop offset="35%" stopColor="#E0E7FF" />
            <stop offset="100%" stopColor="#C7D2FE" />
          </linearGradient>
          <linearGradient id="screenGrad" x1="55" y1="35" x2="55" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="bellyGrad" x1="55" y1="78" x2="55" y2="98" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Floating Ring / Jet Effect at the bottom */}
        <motion.ellipse 
          cx="55" 
          cy="115" 
          rx="22" 
          ry="5" 
          fill="#818CF8" 
          opacity="0.4"
          animate={{
            rx: [22, 28, 22],
            opacity: [0.4, 0.15, 0.4]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.ellipse 
          cx="55" 
          cy="115" 
          rx="12" 
          ry="3" 
          fill={glowColor} 
          opacity="0.8"
          filter="url(#glowFilter)"
          animate={{
            rx: [12, 16, 12],
            opacity: [0.8, 0.4, 0.8]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Connecting Neck Joint */}
        <rect x="52" y="70" width="6" height="10" rx="3" fill="#64748B" />

        {/* Main Body (Egg / Capsule Shaped) */}
        <rect x="32" y="72" width="46" height="32" rx="20" fill="url(#bodyGrad)" stroke="#818CF8" strokeWidth="2.5" />
        
        {/* Shiny Belly Core */}
        <ellipse cx="55" cy="88" rx="14" ry="10" fill="url(#bellyGrad)" stroke="#94A3B8" strokeWidth="1" />
        <circle cx="55" cy="88" r="4" fill={glowColor} filter="url(#glowFilter)" />

        {/* Head */}
        <motion.g
          animate={{
            y: [0, -2, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Antennas */}
          <line x1="55" y1="36" x2="55" y2="18" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
          <motion.circle 
            cx="55" 
            cy="15" 
            r="5" 
            fill={glowColor}
            filter="url(#glowFilter)"
            animate={{
              scale: [1, 1.25, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Ears/Side-screws */}
          <rect x="18" y="44" width="6" height="14" rx="3" fill="#475569" />
          <rect x="86" y="44" width="6" height="14" rx="3" fill="#475569" />

          {/* Main Helmet / Head Container */}
          <rect x="22" y="30" width="66" height="46" rx="23" fill="url(#bodyGrad)" stroke="#818CF8" strokeWidth="2.5" />

          {/* Face Visor Screen */}
          <rect x="28" y="35" width="54" height="34" rx="17" fill="url(#screenGrad)" stroke="#475569" strokeWidth="1.5" />

          {/* Glowing Eyes & Mouth depending on current Elf's expression */}
          {expression === 'happy' && (
            <g>
              {/* Joyful closed eyes arcs */}
              <path d="M38,51 Q42,44 46,51" stroke="#10B981" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M64,51 Q68,44 72,51" stroke="#10B981" strokeWidth="3" fill="none" strokeLinecap="round" />
              {/* Cute curved smile */}
              <path d="M51,60 Q55,65 59,60" stroke="#10B981" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
          )}

          {expression === 'analytical' && (
            <g>
              {/* Glowing analytical scanning lines / hex-like eyes */}
              <line x1="38" y1="48" x2="46" y2="48" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
              <line x1="38" y1="52" x2="46" y2="52" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="64" y1="48" x2="72" y2="48" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
              <line x1="64" y1="52" x2="72" y2="52" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
              {/* Straight composed mouth */}
              <line x1="51" y1="59" x2="59" y2="59" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          )}

          {expression === 'thinking' && (
            <g>
              {/* Curious expression, one eyebrow high, eyes round */}
              <path d="M37,43 Q41,41 45,43" stroke="#EC4899" strokeWidth="2" fill="none" strokeLinecap="round" />
              <circle cx="41" cy="49" r="3" fill="#EC4899" />
              <circle cx="69" cy="49" r="3" fill="#EC4899" />
              {/* Small "o" mouth */}
              <circle cx="55" cy="59" r="2.5" stroke="#EC4899" strokeWidth="2" fill="none" />
            </g>
          )}

          {expression === 'detective' && (
            <g>
              {/* Magnifying visual lens over left eye, squinting right eye */}
              <circle cx="41" cy="48" r="5" stroke="#A78BFA" strokeWidth="2" fill="none" filter="url(#glowFilter)" />
              <line x1="45" y1="52" x2="49" y2="56" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="65" y1="48" x2="73" y2="48" stroke="#A78BFA" strokeWidth="3.5" strokeLinecap="round" />
              {/* Smart smirk */}
              <path d="M51,59 Q55,62 58,58" stroke="#A78BFA" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
          )}
        </motion.g>

        {/* Floating Wings / Arms */}
        {/* Left Arm */}
        <motion.path 
          d="M26,82 Q12,78 16,70" 
          stroke="#C7D2FE" 
          strokeWidth="4.5" 
          strokeLinecap="round"
          fill="none"
          animate={{
            rotate: [0, -8, 0],
            y: [0, 2, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Right Arm */}
        <motion.path 
          d="M84,82 Q98,78 94,70" 
          stroke="#C7D2FE" 
          strokeWidth="4.5" 
          strokeLinecap="round"
          fill="none"
          animate={{
            rotate: [0, 8, 0],
            y: [0, -2, 0]
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
    );
  };

  return (
    <section className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden relative">
      {/* Dynamic Background Grid Pattern to make it look highly technical */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
      
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-200/60 relative z-10 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <Lightbulb className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">小精灵的智能洞察</h2>
            <p className="text-xs text-slate-500">点击小精灵或卡片，听听它的专业解析</p>
          </div>
        </div>

        {/* Interactive Tab Switcher */}
        <div className="flex p-0.5 bg-slate-200/80 rounded-lg text-xs font-semibold self-start sm:self-center">
          <button
            onClick={() => handleTabChange('function')}
            className={`px-4 py-1.5 rounded-md transition-all duration-200 ${
              activeTab === 'function'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            🛠️ 核心功能
          </button>
          <button
            onClick={() => handleTabChange('value')}
            className={`px-4 py-1.5 rounded-md transition-all duration-200 ${
              activeTab === 'value'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            🌟 产品价值
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
        
        {/* Left: Little Elf / Sprite & Dialogue Bubble */}
        <div className="md:col-span-5 flex flex-col items-center justify-center py-4 relative group">
          
          {/* Floating Speech Bubble */}
          <div className="w-full max-w-[280px] mb-4 relative min-h-[110px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={bubbleKey}
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-white px-4 py-3.5 rounded-2xl border border-slate-200/80 shadow-md text-slate-700 text-xs leading-relaxed relative w-full text-center sm:text-left select-none"
                style={{
                  borderLeft: `3.5px solid ${currentActiveItem.accentColor}`
                }}
              >
                {/* Speech Bubble Arrow pointing down */}
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-slate-200/80 rotate-45"></div>
                
                {/* Text typing placeholder / raw string */}
                <p className="font-medium text-slate-800">
                  {currentActiveItem.fullSpeech}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Interactive Floating Mascot */}
          <motion.div
            onClick={triggerSpin}
            title="点击让我转个圈！"
            className="cursor-pointer select-none active:scale-95 transition-transform"
            animate={isSpinning ? {
              rotate: 360,
              y: [-12, -22, -12],
              scale: [1, 1.1, 1]
            } : {
              y: [-8, 4, -8],
            }}
            transition={isSpinning ? {
              duration: 0.8,
              ease: "easeInOut"
            } : {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {renderElfSvg()}
          </motion.div>

          {/* Tiny Prompt to Spin */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mt-2 text-[10px] text-indigo-400 font-medium flex items-center gap-1 cursor-pointer"
            onClick={triggerSpin}
          >
            <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} /> 
            点击精灵互动
          </motion.div>
        </div>

        {/* Right: Detailed Card Grid */}
        <div className="md:col-span-7 flex flex-col gap-3">
          {currentItems.map((item) => {
            const isActive = activeId === item.id;
            return (
              <motion.div
                key={item.id}
                onClick={() => {
                  setActiveId(item.id);
                }}
                onMouseEnter={() => {
                  setActiveId(item.id);
                }}
                whileHover={{ scale: 1.01, x: 2 }}
                transition={{ duration: 0.15 }}
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  isActive 
                    ? 'bg-white shadow-md border-indigo-200 scale-[1.01]' 
                    : `bg-white/60 border-slate-200/80 hover:bg-white`
                }`}
              >
                {/* Icon Column */}
                <div className={`p-2.5 rounded-lg shrink-0 transition-colors ${
                  isActive 
                    ? `${item.bgClass} ${item.colorClass}` 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {item.icon}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-sm font-bold truncate transition-colors ${
                      isActive ? 'text-indigo-600' : 'text-slate-800'
                    }`}>
                      {item.title}
                    </h3>
                    
                    {/* Active Indicator Pin */}
                    {isActive && (
                      <motion.span 
                        layoutId="activeDot"
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: item.accentColor }}
                      />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {item.shortDesc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
