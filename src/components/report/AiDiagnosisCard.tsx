import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Sparkles, 
  ShieldAlert, 
  Wand2, 
  ChevronRight, 
  AlertCircle,
  Clock,
  Zap,
  Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AiDiagnosisCardProps {
  projectName: string;
  riskLevel: string;
  riskPercentage: number;
  riskData: {
    credit: number;
    tech: number;
    economic: number;
    device: number;
  };
}

export default function AiDiagnosisCard({
  projectName,
  riskLevel,
  riskPercentage,
  riskData
}: AiDiagnosisCardProps) {
  const [activeTab, setActiveTab] = useState<'conclusion' | 'advice'>('conclusion');
  const [robotMood, setRobotMood] = useState<'analyzing' | 'warning' | 'helpful'>('warning');

  // Sync robot mood with tab changes or actions
  useEffect(() => {
    if (activeTab === 'conclusion') {
      setRobotMood('warning');
    } else {
      setRobotMood('helpful');
    }
  }, [activeTab]);

  // Robot speech context
  const getRobotSpeech = () => {
    if (activeTab === 'conclusion') {
      return {
        tag: "雷达合规预警",
        text: `报告主人！经我全量指纹比对，当前项目检出 ${riskData.device + riskData.tech + riskData.economic + riskData.credit} 处高度同源的异常重合！这在招投标行政核查中属于【视为串通投标】的红线地带，请务必当心。`,
        alert: "安全评分：极度高危 (红线)"
      };
    } else {
      return {
        tag: "避坑实战策略",
        text: "我为您连夜整理了全套整改指南！最核心的就是【物理隔离+干净新建】。请按照我给您的三步走策略进行标书重构，轻轻松松规避高风险检测，顺利上岸！",
        alert: "合规建议：已针对性优化"
      };
    }
  };

  const speech = getRobotSpeech();

  return (
    <div className="bg-gradient-to-br from-indigo-50/40 via-violet-50/30 to-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden relative">
      {/* Top ambient glow decor */}
      <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-l from-indigo-200/20 to-transparent blur-2xl rounded-full pointer-events-none" />
      <div className="absolute top-12 left-24 w-40 h-16 bg-violet-200/10 blur-xl rounded-full pointer-events-none" />

      {/* Header */}
      <div className="px-6 py-5 border-b border-indigo-100/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl text-white shadow-md shadow-indigo-600/10">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 text-base">比对结果 AI 智能诊断</h3>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-700 uppercase animate-pulse border border-indigo-200">
                <Sparkles className="w-2.5 h-2.5" />
                Gemini Powered
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">基于大模型与招投标合规审计规则，进行穿透式风险研判与防范处置分析</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-indigo-100/60 min-h-[420px]">
        
        {/* Left Side: Diagnostic tabs & static structured insights */}
        <div className="lg:col-span-7 p-6 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Nav Tabs */}
            <div className="flex bg-slate-100/80 p-1 rounded-lg w-fit">
              <button 
                onClick={() => setActiveTab('conclusion')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === 'conclusion' ? 'bg-white text-indigo-700 shadow-sm font-extrabold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                AI 诊断结论
              </button>
              <button 
                onClick={() => setActiveTab('advice')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === 'advice' ? 'bg-white text-indigo-700 shadow-sm font-extrabold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                AI 整改建议
              </button>
            </div>

            {/* Dynamic content rendering with motion */}
            <AnimatePresence mode="wait">
              {activeTab === 'conclusion' ? (
                <motion.div 
                  key="conclusion"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <div className="bg-white/75 p-4 rounded-xl border border-indigo-50/80 shadow-sm space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-indigo-600 rounded" />
                      <h4 className="text-sm font-bold text-slate-800">风控审计判词</h4>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600">
                      经系统审计与大模型深度剖析，本项目「{projectName || '当前项目'}」共检出 <span className="font-bold text-red-600">{riskData.device + riskData.tech + riskData.economic + riskData.credit}</span> 处高危或中危异常行为指纹，综合判定风险概率为 <span className="font-extrabold text-red-600 font-mono text-sm">{riskPercentage}%</span>。其中，物理硬件标识重合是重度违规迹象，极易在行政及司法核查中被认定为 **视为投标人相互串通投标** 的法定行为，整改合规迫在眉睫。
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Item 1 */}
                    <div className="p-3 bg-white/50 border border-slate-100 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500">设备同源性检测</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${riskData.device > 0 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600'}`}>
                          {riskData.device > 0 ? '高危重合' : '安全无虞'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        检出 <span className="font-bold text-slate-800">{riskData.device}</span> 处完全一致的MAC地址与硬盘硬件序列号，在物理设备层面提供了确凿的同源编写证据。
                      </p>
                    </div>

                    {/* Item 2 */}
                    <div className="p-3 bg-white/50 border border-slate-100 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500">技术标文本抄袭</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${riskData.tech > 0 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600'}`}>
                          {riskData.tech > 5 ? '中高度雷同' : '微量重合'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        检出 <span className="font-bold text-slate-800">{riskData.tech}</span> 处100%完全重叠的施工或技术方案段落，存在明显的跨标书整段抄袭、套用同一源模板迹象。
                      </p>
                    </div>

                    {/* Item 3 */}
                    <div className="p-3 bg-white/50 border border-slate-100 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500">经济标锁号校验</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${riskData.economic > 0 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600'}`}>
                          {riskData.economic > 0 ? '锁号重合' : '未见异常'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        发现相同的计价软件加密狗锁号 <span className="font-bold text-slate-800">({riskData.economic}处)</span>，暗示不同单位的报价标书是由同一把物理加密狗汇算并生成。
                      </p>
                    </div>

                    {/* Item 4 */}
                    <div className="p-3 bg-white/50 border border-slate-100 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500">资信基本要素雷同</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${riskData.credit > 0 ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-emerald-50 text-emerald-600'}`}>
                          {riskData.credit > 0 ? '交叉混淆' : '正常通过'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        发现法人名称、联系方式、往来信用担保等基础数据混淆一致，极可能是由同一编制团队串联起草相关申报材料。
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="advice"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <div className="bg-white/75 p-4 rounded-xl border border-indigo-50/80 shadow-sm space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-indigo-600 rounded" />
                      <h4 className="text-sm font-bold text-slate-800">紧急合规避雷动作</h4>
                    </div>
                    <ul className="text-xs space-y-2.5 text-slate-600">
                      <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded bg-red-100 text-red-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                        <div>
                          <strong className="text-slate-800">投标文件必须进行物理编制隔离：</strong>
                          严禁在同一部办公电脑、同个无线局域网中完成不同投标文件的修改及上传，彻底隔断硬件指纹（MAC和硬盘码）的重复路径。
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                        <div>
                          <strong className="text-slate-800">一锁一预算，彻底替换经济标加密锁：</strong>
                          必须重新指派预算人员，在独立的、合法的机器上，搭载各自公司的授权加密锁独立完成套价，重新导出最终的GEF/XML投标文件，覆盖现有异常版本。
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                        <div>
                          <strong className="text-slate-800">技术标方案深度重构：</strong>
                          对100%相似段落进行手工定制重写，杜绝套用公共模板行为，确保各家施工标准、进度网格 and 质检保障等具备鲜明的排他性特色。
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-[10px] text-amber-800 leading-normal">
                      <strong>合规铁律提示：</strong> 在合规审计阶段，切忌只做字面文字替换。现在的多维指纹识别能够穿透文档内部的元属性（如历史编辑人、文档建立时间等），直接在新物理环境中“干净新建”是最低风险的修正策略。
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-4 pt-4 border-t border-indigo-50/80 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> ai输出内容具备随机性，请以实际检测环节结果为准</span>
          </div>
        </div>

        {/* Right Side: Animated AI Robot Mascot Panel */}
        <div className="lg:col-span-5 p-6 bg-slate-50/80 flex flex-col items-center justify-between min-h-[380px] relative overflow-hidden">
          
          {/* Cyber grid decorative background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
          
          {/* Top telemetry line */}
          <div className="w-full flex items-center justify-between border-b border-slate-200/60 pb-3 z-10">
            <div className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-700">AI 智能风控数字人</span>
            </div>
            <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
              ON-LINE SYSTEM
            </span>
          </div>

          {/* AI Mascot & Speech Section */}
          <div className="flex flex-col items-center justify-center flex-1 w-full gap-5 py-4 z-10">
            
            {/* Robot Container with customized floating animation */}
            <div className="relative flex items-center justify-center">
              
              {/* Radar scanner glowing rings */}
              <div className="absolute w-36 h-36 bg-indigo-100/30 rounded-full border border-indigo-200/50 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
              <div className="absolute w-28 h-28 bg-indigo-50/50 rounded-full border border-indigo-300/30 animate-pulse pointer-events-none" />

              {/* Glowing backlighting */}
              <div className={`absolute w-16 h-16 rounded-full filter blur-md transition-colors duration-500 ${
                robotMood === 'analyzing' ? 'bg-indigo-400/40' :
                robotMood === 'warning' ? 'bg-red-400/30' : 'bg-emerald-400/30'
              }`} />

              {/* Exquisite SVG "云保标" Cloud Robot Mascot */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-40 h-40 relative drop-shadow-2xl cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <defs>
                    <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#E2E8F0" />
                    </linearGradient>
                    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
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
                  <path d="M 32 46 
                           C 24 46, 22 36, 30 32 
                           C 28 20, 42 16, 50 21 
                           C 58 16, 72 20, 70 32 
                           C 78 36, 76 46, 68 46 
                           Z" 
                        fill="url(#cloudGrad)" stroke="#CBD5E1" strokeWidth="0.8" />

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
                    <path d="M 42 41 Q 50 43, 58 41 C 58 50, 54 56, 50 60 C 46 56, 42 50, 42 41 Z" fill="url(#shieldGrad)" stroke="#FEE2E2" strokeWidth="0.8" />
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
                  <AnimatePresence mode="wait">
                    {robotMood === 'analyzing' ? (
                      /* Analyzing / Scanning State */
                      <motion.g 
                        key="analyzing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {/* Orange scan grid line */}
                        <motion.line 
                          x1="34" y1="29.5" x2="66" y2="29.5" 
                          stroke="#F97316" strokeWidth="1" 
                          animate={{ y: [30.5, 43.5, 30.5] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        />
                        {/* Scanning eye-indicators */}
                        <circle cx="42.5" cy="37" r="2.5" stroke="#F97316" strokeWidth="1" fill="none" strokeDasharray="1.5 1" className="animate-spin" style={{ transformOrigin: '42.5px 37px' }} />
                        <circle cx="57.5" cy="37" r="2.5" stroke="#F97316" strokeWidth="1" fill="none" strokeDasharray="1.5 1" className="animate-spin" style={{ transformOrigin: '57.5px 37px', animationDirection: 'reverse' }} />
                        <path d="M 48 41.5 L 52 41.5" stroke="#F97316" strokeWidth="1" strokeLinecap="round" />
                      </motion.g>
                    ) : robotMood === 'warning' ? (
                      /* Warning / Critical State */
                      <motion.g 
                        key="warning"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {/* Serious tilted eyes and glowing pulses */}
                        <path d="M 37 36 L 44 38.5" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" />
                        <path d="M 63 36 L 56 38.5" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" />
                        <circle cx="41.5" cy="41" r="1.5" fill="#EF4444" className="animate-pulse" />
                        <circle cx="58.5" cy="41" r="1.5" fill="#EF4444" className="animate-pulse" />
                        {/* Flat serious mouth */}
                        <path d="M 47 43.5 Q 50 41.5, 53 43.5" stroke="#EF4444" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                      </motion.g>
                    ) : (
                      /* Helpful / Friendly Cute State (Matches the uploaded picture perfectly) */
                      <motion.g 
                        key="helpful"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {/* Friendly Arching Eyes "∩ ∩" */}
                        <path d="M 38 39 Q 41.5 34.5, 45 39" stroke="#F97316" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        <path d="M 55 39 Q 58.5 34.5, 62 39" stroke="#F97316" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        {/* Smiling mouth */}
                        <path d="M 47.5 42 Q 50 44, 52.5 42" stroke="#F97316" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      </motion.g>
                    )}
                  </AnimatePresence>
                </svg>
              </motion.div>
            </div>

            {/* Smart Speeches bubble */}
            <div className="w-full space-y-3 font-sans">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className={`p-4 rounded-2xl border relative flex flex-col justify-between shadow-sm min-h-[110px] ${
                    activeTab === 'conclusion' ? 'bg-rose-500/10 border-rose-400/30 text-slate-800' :
                    'bg-emerald-500/10 border-emerald-400/30 text-slate-800'
                  }`}
                >
                  {/* Speaking triangle tail arrow pointing up to the robot */}
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-0 h-0 border-8 border-transparent border-b-current ${
                    activeTab === 'conclusion' ? 'text-rose-50/80' : 'text-emerald-50/80'
                  }`} style={{ color: activeTab === 'conclusion' ? '#FFF1F2' : '#ECFDF5' }} />

                  <div>
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'conclusion' ? 'bg-red-500 animate-ping' : 'bg-emerald-500 animate-ping'}`} />
                      <span className={activeTab === 'conclusion' ? 'text-red-700' : 'text-emerald-700'}>
                        【{speech.tag}】
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600 font-medium">
                      {speech.text}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-slate-200/50 text-[10px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Zap className={`w-3 h-3 ${activeTab === 'conclusion' ? 'text-amber-500' : 'text-emerald-500'}`} />
                      {speech.alert}
                    </span>
                    <span>AI助理风控评级：V2.5</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* Bottom telemetry widgets */}
          <div className="w-full grid grid-cols-3 gap-2 border-t border-slate-200/60 pt-3 text-center text-[10px] text-slate-500 font-medium z-10">
            <div className="flex flex-col bg-white/60 p-1.5 rounded-lg border border-slate-100/80">
              <span className="text-slate-400">词法查重深度</span>
              <span className="font-bold text-slate-700 font-mono mt-0.5">NLP 12层</span>
            </div>
            <div className="flex flex-col bg-white/60 p-1.5 rounded-lg border border-slate-100/80">
              <span className="text-slate-400">穿透性硬件审计</span>
              <span className="font-bold text-slate-700 font-mono mt-0.5">MAC / HD</span>
            </div>
            <div className="flex flex-col bg-white/60 p-1.5 rounded-lg border border-slate-100/80">
              <span className="text-slate-400">合规审计基准</span>
              <span className="font-bold text-slate-700 font-mono mt-0.5">DB11 V2026</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
