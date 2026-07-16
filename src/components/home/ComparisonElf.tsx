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
      title: '资信标信息重复，人工查重形同虚设',
      shortDesc: '关键人员信息分散，人工核对百页文件极易遗漏',
      fullSpeech: '项目负责人、技术负责人、安全员等关键人员信息分散在投标文件的各个章节，不同版本之间人员姓名、证件号、资质编号等是否重复或冲突，靠人眼在几百页文件里逐一比对，几乎不可能做到无遗漏。',
      icon: <Clock className="w-5 h-5" />,
      colorClass: 'text-blue-600',
      bgClass: 'bg-blue-50/70',
      borderClass: 'border-blue-100 hover:border-blue-300',
      accentColor: '#3B82F6',
      expression: 'analytical'
    },
    {
      id: 'fun-2',
      title: '技术标内容雷同，隐患藏在细节里',
      shortDesc: '篇幅长相似度高，细微改动易忽略导致前后矛盾',
      fullSpeech: '施工方案、质量保证措施、安全文明施工等技术标内容篇幅长、表述相似度高，不同版本之间的细微改动容易被忽略，一旦核心章节出现未同步修改或前后矛盾，评标专家一眼就能发现。',
      icon: <FileSearch className="w-5 h-5" />,
      colorClass: 'text-emerald-600',
      bgClass: 'bg-emerald-50/70',
      borderClass: 'border-emerald-100 hover:border-emerald-300',
      accentColor: '#10B981',
      expression: 'thinking'
    },
    {
      id: 'fun-3',
      title: '经济标报价变动多，差异点难以穷尽',
      shortDesc: '调整项多且分散，人工核对极易漏掉关键偏差',
      fullSpeech: '工程量清单的单价、合价、暂估价、规费税率等调整项多且分散，某一条清单项的微调可能影响整体报价逻辑，人工核对既慢又容易漏掉关键偏差，而报价错误直接拉低评标得分。',
      icon: <Fingerprint className="w-5 h-5" />,
      colorClass: 'text-amber-600',
      bgClass: 'bg-amber-50/70',
      borderClass: 'border-amber-100 hover:border-amber-300',
      accentColor: '#F59E0B',
      expression: 'analytical'
    },
    {
      id: 'fun-4',
      title: '设备特征码、文件属性等底层信息无从察觉',
      shortDesc: '隐藏属性肉眼难辨，开标后暴露为时已晚',
      fullSpeech: '不同版本文件若在同一台电脑上编辑，设备型号编码、文件创建时间、修改作者等隐藏属性完全一致，肉眼和常规查重软件根本无法识别，这类深层信息直到开标后被系统检测才暴露，为时已晚。',
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
      title: '几分钟替代几小时人工比对',
      shortDesc: '压缩比对时间，释放核心人力',
      fullSpeech: '投标团队动辄花半天甚至一天逐页核对多版本文件，云保标自动完成31项交叉检测，将比对时间压缩到分钟级，释放人力去做更有价值的投标策略工作。',
      icon: <Zap className="w-5 h-5" />,
      colorClass: 'text-orange-600',
      bgClass: 'bg-orange-50/70',
      borderClass: 'border-orange-100 hover:border-orange-300',
      accentColor: '#F97316',
      expression: 'happy'
    },
    {
      id: 'val-2',
      title: '发现肉眼看不到的深层差异',
      shortDesc: '穿透表层数据，锁定隐蔽风险',
      fullSpeech: '设备特征码、文件隐藏属性、底层数据关联等信息人工根本无法察觉，云保标穿透文件表层数据进行深层比对，把隐蔽风险提前暴露出来。',
      icon: <ShieldCheck className="w-5 h-5" />,
      colorClass: 'text-sky-600',
      bgClass: 'bg-sky-50/70',
      borderClass: 'border-sky-100 hover:border-sky-300',
      accentColor: '#0EA5E9',
      expression: 'thinking'
    },
    {
      id: 'val-3',
      title: '一次上传，四大维度全覆盖',
      shortDesc: '同步完成自检，一站式解决',
      fullSpeech: '资信标、技术标、经济标、设备特征四大比对维度同步完成，无需多个工具来回切换，一个平台解决投标文件合规自检的全部需求。',
      icon: <Activity className="w-5 h-5" />,
      colorClass: 'text-rose-600',
      bgClass: 'bg-rose-50/70',
      borderClass: 'border-rose-100 hover:border-rose-300',
      accentColor: '#F43F5E',
      expression: 'detective'
    },
    {
      id: 'val-4',
      title: '提交前兜底，守住最后一道防线',
      shortDesc: '提前拦截低级错误，避免废标',
      fullSpeech: '标书封标前跑一遍云保标，文件疏漏、信息重复、报价偏差等问题在提交前被拦截，避免因低级错误导致废标或扣分，保住每一次投标机会。',
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
    
    // Choose active glow color based on the item color
    const glowColor = currentActiveItem.accentColor;

    return (
      <svg 
        width="150" 
        height="150" 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="cloudGradElf" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="shieldGradElf" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>
        </defs>

        {/* Background Soft Glow */}
        <circle cx="50" cy="40" r="22" fill="#FEE2E2" opacity="0.35" filter="blur(3px)" />

        {/* Floating Left Document */}
        <motion.g
          animate={{ y: [0, -2, 0], rotate: [-15, -12, -15] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <path d="M 8 16 L 18 13 C 19 13, 19.5 13.5, 19.5 14 L 17 28 C 17 28.5, 16.5 29, 16 29 L 6 32 C 5.5 32, 5 31.5, 5 31 L 7.5 17 C 7.5 16.5, 8 16, 8 16 Z" fill="#FFFFFF" stroke="#FCA5A5" strokeWidth="0.5" />
          <text x="12" y="21.5" fill="#EF4444" fontSize="2.2" fontWeight="bold" transform="rotate(-15, 12, 21.5)" textAnchor="middle">标书</text>
          <line x1="8" y1="23.5" x2="15" y2="21.5" stroke="#F87171" strokeWidth="0.4" opacity="0.5" />
          <line x1="7.5" y1="25.5" x2="14" y2="23.5" stroke="#F87171" strokeWidth="0.4" opacity="0.5" />
          <line x1="7" y1="27.5" x2="12.5" y2="25.5" stroke="#F87171" strokeWidth="0.4" opacity="0.5" />
        </motion.g>

        {/* Floating Right Document */}
        <motion.g
          animate={{ y: [0, 2, 0], rotate: [12, 15, 12] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
        >
          <path d="M 82 15 L 92 18 C 92.5 18, 93 18.5, 93 19 L 90 33 C 90 33.5, 89.5 34, 89 34 L 79 31 C 78.5 31, 78 30.5, 78 30 L 81 16 C 81 15.5, 81.5 15, 82 15 Z" fill="#FFFFFF" stroke="#FCA5A5" strokeWidth="0.5" />
          <circle cx="86" cy="22" r="2" fill="none" stroke="#EF4444" strokeWidth="0.6" />
          <path d="M 86 22 L 86 20 A 2 2 0 0 1 88 22 Z" fill="#EF4444" />
          <line x1="81" y1="26" x2="89" y2="28" stroke="#F87171" strokeWidth="0.4" opacity="0.5" />
          <line x1="80.5" y1="28" x2="87" y2="30" stroke="#F87171" strokeWidth="0.4" opacity="0.5" />
        </motion.g>

        {/* Outer Floating Red/Pink Ring */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          style={{ transformOrigin: '50px 54px' }}
        >
          <ellipse cx="50" cy="54" rx="46" ry="6" fill="none" stroke="#FCA5A5" strokeWidth="0.8" opacity="0.4" strokeDasharray="3 2" />
        </motion.g>

        {/* Symmetrical Ears/Headphones */}
        <rect x="22" y="29" width="4" height="10" rx="2" fill="#EF4444" stroke="#DC2626" strokeWidth="0.4" />
        <circle cx="24" cy="34" r="1.5" fill="#FFFFFF" />

        <rect x="74" y="29" width="4" height="10" rx="2" fill="#EF4444" stroke="#DC2626" strokeWidth="0.4" />
        <circle cx="76" cy="34" r="1.5" fill="#FFFFFF" />

        {/* The Cloud Head (Mascot Body) */}
        <path d="M 32 46 C 24 46, 22 36, 30 32 C 28 20, 42 16, 50 21 C 58 16, 72 20, 70 32 C 78 36, 76 46, 68 46 Z" fill="url(#cloudGradElf)" stroke="#CBD5E1" strokeWidth="0.8" />

        {/* Circular Forehead Logo with stylised "云" */}
        <circle cx="50" cy="22" r="5.5" fill="#EF4444" />
        <path d="M 47.5 20.2 L 52.5 20.2 M 46.8 22 L 53.2 22 M 50 22 L 50 24.2 Q 50 25.5, 52 25" stroke="#FFFFFF" strokeWidth="0.8" fill="none" strokeLinecap="round" />

        {/* Black Digital Screen Face */}
        <rect x="33" y="28" width="34" height="18" rx="8" fill="#1E293B" stroke="#F1F5F9" strokeWidth="1" />
        <rect x="34.5" y="29.5" width="31" height="15" rx="6.5" fill="#0F172A" />

        {/* Symmetrical Arms */}
        <path d="M 33 41 Q 38 46, 43 45" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <path d="M 67 41 Q 62 46, 57 45" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <circle cx="43" cy="45" r="2.2" fill="#475569" />
        <circle cx="57" cy="45" r="2.2" fill="#475569" />

        {/* Symmetrical Red Shield with white border and a white Checkmark */}
        <g>
          <path d="M 41 42 Q 50 44, 59 42 C 59 51, 55 57, 50 61 C 45 57, 41 51, 41 42 Z" fill="#FCA5A5" opacity="0.3" />
          <path d="M 42 41 Q 50 43, 58 41 C 58 50, 54 56, 50 60 C 46 56, 42 50, 42 41 Z" fill="url(#shieldGradElf)" stroke="#FEE2E2" strokeWidth="0.8" />
          <path d="M 44 43 Q 50 44.5, 56 43 C 56 49, 53 54, 50 57.5 C 47 54, 44 49, 44 43 Z" fill="none" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.8" />
          <path d="M 47 49 L 49.2 51.5 L 53.5 46.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>

        {/* Symmetrical 3D Platform Base */}
        <g>
          {/* Base Shadows and depth */}
          <ellipse cx="50" cy="88" rx="42" ry="10" fill="#DC2626" />
          <rect x="8" y="88" width="84" height="4" fill="#DC2626" />
          <ellipse cx="50" cy="92" rx="42" ry="10" fill="#991B1B" />

          {/* Base White top cap */}
          <ellipse cx="50" cy="85" rx="39" ry="8" fill="#FFFFFF" stroke="#EF4444" strokeWidth="1" />

          {/* Big red text title: 云保标 */}
          <text x="50" y="80.5" fill="#EF4444" fontSize="10.5" fontWeight="900" textAnchor="middle" style={{ letterSpacing: '1px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            云保标
          </text>

          {/* Ribbon slogan: 标书查重 · 安心投标 */}
          <rect x="25" y="85" width="50" height="7" rx="3.5" fill="#EF4444" />
          <text x="50" y="90" fill="#FFFFFF" fontSize="3" fontWeight="bold" textAnchor="middle" style={{ letterSpacing: '0.4px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            标书查重 · 安心投标
          </text>
        </g>

        {/* Face Expression Screen inside the digital visor */}
        <g>
          {expression === 'happy' && (
            <g>
              {/* Friendly Arching Eyes "∩ ∩" */}
              <path d="M 38 39 Q 41.5 34.5, 45 39" stroke={glowColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 55 39 Q 58.5 34.5, 62 39" stroke={glowColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Smiling mouth */}
              <path d="M 47.5 42 Q 50 44, 52.5 42" stroke={glowColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </g>
          )}

          {expression === 'analytical' && (
            <g>
              {/* Glowing analytical scanning lines */}
              <line x1="38" y1="36" x2="45" y2="36" stroke={glowColor} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="38" y1="39.5" x2="45" y2="39.5" stroke={glowColor} strokeWidth="1.2" strokeLinecap="round" />
              <line x1="55" y1="36" x2="62" y2="36" stroke={glowColor} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="55" y1="39.5" x2="62" y2="39.5" stroke={glowColor} strokeWidth="1.2" strokeLinecap="round" />
              {/* Straight composed mouth */}
              <line x1="47.5" y1="42.5" x2="52.5" y2="42.5" stroke={glowColor} strokeWidth="2" strokeLinecap="round" />
              {/* active glow scan line moving up and down */}
              <motion.line 
                x1="34" y1="29.5" x2="66" y2="29.5" 
                stroke={glowColor} strokeWidth="1" 
                animate={{ y: [0, 13, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            </g>
          )}

          {expression === 'thinking' && (
            <g>
              {/* Curious expression, eyebrow and circles */}
              <path d="M 37.5 34.5 Q 41.5 33, 44.5 34.5" stroke={glowColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <circle cx="41.5" cy="38" r="2.2" fill={glowColor} />
              <circle cx="58.5" cy="38" r="2.2" fill={glowColor} />
              {/* Small "o" mouth */}
              <circle cx="50" cy="42" r="1.5" stroke={glowColor} strokeWidth="1.2" fill="none" />
            </g>
          )}

          {expression === 'detective' && (
            <g>
              {/* Magnifying visual lens over left eye, squinting right eye */}
              <circle cx="41" cy="37" r="3.5" stroke={glowColor} strokeWidth="1.5" fill="none" />
              <line x1="43.5" y1="39.5" x2="46" y2="42" stroke={glowColor} strokeWidth="1.8" strokeLinecap="round" />
              <line x1="56" y1="37" x2="62" y2="37" stroke={glowColor} strokeWidth="2.5" strokeLinecap="round" />
              {/* Smart smirk */}
              <path d="M 47.5 42 Q 50.5 44, 52 41" stroke={glowColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </g>
          )}
        </g>
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
            <h2 className="text-lg font-bold text-slate-900">云保标的智能洞察</h2>
            <p className="text-xs text-slate-500">点击云保标或卡片，听听它的专业解析</p>
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
            🚨 招投标痛点排查
          </button>
          <button
            onClick={() => handleTabChange('value')}
            className={`px-4 py-1.5 rounded-md transition-all duration-200 ${
              activeTab === 'value'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            🌟 核心价值增效
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
            点击云保标互动
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
