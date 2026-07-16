import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Edit2, 
  Check, 
  FileText, 
  Plus, 
  PlayCircle, 
  AlertCircle, 
  File, 
  Loader2, 
  X, 
  Settings, 
  Info, 
  Zap, 
  Briefcase,
  UploadCloud,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { FileItem, Template, PageType } from '../../types';
import { ALL_CHECK_TYPES, ALL_CREDIT_ITEMS, ALL_TECH_ITEMS, ALL_ECONOMIC_ITEMS, ALL_DEVICE_ITEMS } from '../../constants';
import { handleCheckTypeToggle } from '../../utils/checkTypeUtils';

import { CustomSelect } from '../ui/CustomSelect';

interface ProjectProps {
  setCurrentPage: (page: PageType) => void;
  isEditingName: boolean;
  setIsEditingName: (val: boolean) => void;
  projectName: string;
  setProjectName: (val: string) => void;
  nameInputRef: React.RefObject<HTMLInputElement | null>;
  files: FileItem[];
  formatSize: (size: number) => string;
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStartComparisonClick: () => void;
  errorMsg: string | null;
  removeFile: (id: string) => void;
  updateSubFileCategory: (fileId: string, subFileId: string, category: any) => void;
  activeTemplateId: string;
  applyTemplate: (id: string) => void;
  templates: Template[];
  availableCheckTypes: string[];
  selectedCheckTypes: string[];
  setSelectedCheckTypes: (types: string[]) => void;
  selectedCreditItems: string[];
  setSelectedCreditItems: (items: string[]) => void;
  selectedTechItems: string[];
  setSelectedTechItems: (items: string[]) => void;
  disabledItems: string[];
  selectedEconomicItems: string[];
  setSelectedEconomicItems: (items: string[]) => void;
  selectedDeviceItems: string[];
  setSelectedDeviceItems: (items: string[]) => void;
  sentenceThreshold: number;
  setSentenceThreshold: (val: number) => void;
  riskThreshold: number;
  setRiskThreshold: (val: number) => void;
  filterBiddingDoc: boolean;
  setFilterBiddingDoc: (val: boolean) => void;
  excludeTableHeaders: boolean;
  setExcludeTableHeaders: (val: boolean) => void;
  excludeTableTitles: boolean;
  setExcludeTableTitles: (val: boolean) => void;
  biddingDocFile: { id: string; name: string; size: number } | null;
  biddingDocError: string | null;
  handleBiddingDocInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeBiddingDoc: () => void;
  economicRegion: { province: string; city: string };
  setEconomicRegion: (val: { province: string; city: string }) => void;
  economicListType: string;
  setEconomicListType: (val: string) => void;
}

const Project: React.FC<ProjectProps> = ({
  setCurrentPage,
  isEditingName,
  setIsEditingName,
  projectName,
  setProjectName,
  nameInputRef,
  files,
  formatSize,
  handleFileInput,
  handleStartComparisonClick,
  errorMsg,
  removeFile,
  updateSubFileCategory,
  activeTemplateId,
  applyTemplate,
  templates,
  availableCheckTypes,
  selectedCheckTypes,
  setSelectedCheckTypes,
  selectedCreditItems,
  setSelectedCreditItems,
  selectedTechItems,
  setSelectedTechItems,
  disabledItems,
  selectedEconomicItems,
  setSelectedEconomicItems,
  selectedDeviceItems,
  setSelectedDeviceItems,
  sentenceThreshold,
  setSentenceThreshold,
  riskThreshold,
  setRiskThreshold,
  filterBiddingDoc,
  setFilterBiddingDoc,
  excludeTableHeaders,
  setExcludeTableHeaders,
  excludeTableTitles,
  setExcludeTableTitles,
  biddingDocFile,
  biddingDocError,
  handleBiddingDocInput,
  removeBiddingDoc,
  economicRegion,
  setEconomicRegion,
  economicListType,
  setEconomicListType,
}) => {
  const [expandedFiles, setExpandedFiles] = React.useState<Record<string, boolean>>({});

  const toggleExpand = (fileId: string) => {
    setExpandedFiles(prev => ({ ...prev, [fileId]: !prev[fileId] }));
  };

  return (
    <motion.div 
      key="project"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Project Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => setCurrentPage('home')}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 flex items-center gap-3">
          {isEditingName ? (
            <div className="flex items-center gap-2 w-full max-w-md">
              <input
                ref={nameInputRef}
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="flex-1 text-2xl font-bold text-slate-900 bg-white border border-indigo-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                onBlur={() => setIsEditingName(false)}
              />
              <button onClick={() => setIsEditingName(false)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md">
                <Check className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 group">
              <h1 className="text-2xl font-bold text-slate-900">{projectName}</h1>
              <button 
                onClick={() => setIsEditingName(true)}
                className="p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* 1. File List */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm relative">
          <div className="sticky top-16 z-10 px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/95 backdrop-blur-md shadow-sm rounded-t-xl">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                待比对文件
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                共 {files?.length || 0} 份文件，总大小 {formatSize(files?.reduce((acc, f) => acc + f.size, 0) || 0)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm cursor-pointer flex items-center gap-2">
                <Plus className="w-4 h-4" />
                添加文件
                <input type="file" multiple className="hidden" onChange={handleFileInput} accept=".doc,.docx,.pdf,.xls,.xlsx,.xml" />
              </label>
              <button 
                onClick={handleStartComparisonClick}
                disabled={!files || files.length < 2 || files.every(f => f.status === '比对中')}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlayCircle className="w-4 h-4" />
                开始比对
              </button>
            </div>
          </div>
          
          {errorMsg && (
            <div className="m-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          <div className="p-2">
            {(!files || files.length === 0) ? (
              <div className="text-center py-12">
                <File className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">暂无文件，请点击下方悬浮按钮添加</p>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map(file => (
                  <div key={file.id} className="flex flex-col border-b border-slate-100 last:border-0">
                    <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg group transition-colors">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <File className="w-5 h-5 text-slate-400 shrink-0" />
                        <div className="truncate">
                          <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0 pl-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                          file.status === '已完成' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          file.status === '比对中' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {file.status === '比对中' && <Loader2 className="w-3 h-3 animate-spin" />}
                          {file.status}
                        </span>
                        <button 
                          onClick={() => removeFile(file.id)} 
                          disabled={file.status === '比对中'}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all disabled:opacity-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {file.subFiles && file.subFiles.length > 0 && (
                      <div className="ml-10 mb-3 pl-3 border-l-2 border-slate-100 space-y-2">
                        {file.subFiles.slice(0, expandedFiles[file.id] ? undefined : 3).map(subFile => (
                          <div key={subFile.id} className="flex items-center justify-between bg-slate-50 p-2 rounded-md">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                              <span className="text-xs text-slate-600 truncate" title={subFile.name}>{subFile.name}</span>
                            </div>
                            <select
                              value={subFile.category}
                              onChange={(e) => updateSubFileCategory(file.id, subFile.id, e.target.value)}
                              className="text-xs border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="credit">资信标</option>
                              <option value="tech">技术标</option>
                              <option value="economic">经济标</option>
                              <option value="other">其他</option>
                            </select>
                          </div>
                        ))}
                        {file.subFiles.length > 3 && (
                          <div className="relative mt-4 mb-2">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                              <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center">
                              <button
                                onClick={() => toggleExpand(file.id)}
                                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-500 shadow-sm hover:bg-slate-50 hover:text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ring-offset-2"
                              >
                                {expandedFiles[file.id] ? (
                                  <><span>收起</span><ChevronDown className="w-3.5 h-3.5 rotate-180 transition-transform" /></>
                                ) : (
                                  <><span>展开全部 {file.subFiles.length} 个文件</span><ChevronDown className="w-3.5 h-3.5 transition-transform" /></>
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 2. Configuration */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
          {/* Header area with Sparkles icon and state badge */}
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-md sm:text-lg font-extrabold text-slate-800">智能比对模块推荐与配置</h2>
                <p className="text-xs text-slate-500 mt-0.5">智能比对模块推荐与一键精细化配置</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 self-end sm:self-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium shrink-0">应用规则模板:</span>
                <select 
                  value={activeTemplateId}
                  onChange={(e) => applyTemplate(e.target.value)}
                  className="text-xs border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white text-slate-700 font-semibold shadow-sm cursor-pointer hover:border-slate-300 transition-colors"
                >
                  {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5 shrink-0 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                已就绪
              </span>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* 1. 2x2 Grid of High-Fidelity Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: '资信标比对',
                  num: '1',
                  title: '人员与资质信息比对',
                  desc: '核验不同版本中项目负责人、技术负责人、资质证书等信息是否一致，防止人员重复或资质冲突'
                },
                {
                  id: '技术标比对',
                  num: '2',
                  title: '技术方案内容比对',
                  desc: '比对施工方案、质量措施等技术标章节是否前后一致，发现遗漏修改或内容矛盾'
                },
                {
                  id: '经济标比对',
                  num: '3',
                  title: '清单错误相似性比对',
                  desc: '核查工程量清单的清标结果是否存在雷同性错误。本项需配合上传招标文件'
                },
                {
                  id: '文件设备特征比对',
                  num: '4',
                  title: '文件底层属性比对',
                  desc: '检测文件创建设备、修改时间、作者等隐藏信息，识别文件真实来源'
                }
              ].map(card => {
                const isSupported = availableCheckTypes.includes(card.id);
                const isEconomicLocked = card.id === '经济标比对' && !biddingDocFile;
                const isSelected = selectedCheckTypes?.includes(card.id) && !isEconomicLocked;
                
                return (
                  <div
                    key={card.id}
                    onClick={() => {
                      if (isEconomicLocked) {
                        alert('必须先导入招标文件，才可勾选“经济标合规比对”');
                        const el = document.getElementById('bidding-doc-import-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        return;
                      }
                      if (isSupported) {
                        const isTurningOn = !isSelected;
                        handleCheckTypeToggle(card.id, selectedCheckTypes || [], setSelectedCheckTypes);
                        if (isTurningOn) {
                          if (card.id === '资信标比对') setSelectedCreditItems(ALL_CREDIT_ITEMS);
                          if (card.id === '技术标比对') setSelectedTechItems(ALL_TECH_ITEMS);
                          if (card.id === '经济标比对') setSelectedEconomicItems(ALL_ECONOMIC_ITEMS);
                          if (card.id === '文件设备特征比对') setSelectedDeviceItems(ALL_DEVICE_ITEMS);
                        }
                      }
                    }}
                    className={`p-4 rounded-xl border transition-all duration-300 relative select-none ${
                      isEconomicLocked ? 'cursor-pointer border-amber-200 bg-amber-50/5 hover:border-amber-300' :
                      isSupported ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                    } ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50/15 shadow-sm' 
                        : isEconomicLocked 
                          ? '' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Custom styled checkbox */}
                      <div className="mt-0.5 shrink-0">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'bg-indigo-600 border-indigo-600 text-white' 
                            : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-sm font-bold transition-colors ${
                          isSelected ? 'text-indigo-900' : 'text-slate-800'
                        }`}>
                          {card.num}. {card.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                          {card.desc}
                        </p>
                        {isEconomicLocked && (
                          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded-lg w-fit font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            请导入招标文件以开启此功能
                          </div>
                        )}
                      </div>

                      {/* Not supported fallback hint */}
                      {!isSupported && !isEconomicLocked && (
                        <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded self-start font-bold">
                          格式不支持
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 2. 招标文件导入 */}
            <div id="bidding-doc-import-section" className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">📄</span>
                  <h3 className="text-sm font-extrabold text-slate-800">招标文件导入</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/40 p-5 rounded-2xl border border-slate-100">
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all bg-white ${biddingDocFile ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50'}`}>
                  {biddingDocFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100/50 rounded-lg">
                          <FileText className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{biddingDocFile.name}</p>
                          <p className="text-[11px] text-slate-500">{formatSize(biddingDocFile.size)}</p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={removeBiddingDoc} 
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block py-4">
                      <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                      <p className="text-sm font-bold text-slate-600">点击或拖拽上传招标文件</p>
                      <p className="text-[10px] text-slate-400 mt-1">支持 .doc, .docx, .pdf 格式</p>
                      <input type="file" className="hidden" onChange={handleBiddingDocInput} accept=".doc,.docx,.pdf" />
                    </label>
                  )}
                </div>
                
                <div className="flex flex-col justify-center p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs text-slate-500 leading-relaxed italic">
                    <span className="font-bold text-amber-600 block mb-1">重要提示：</span>
                    导入招标文件不仅可以开启“内容过滤”功能，也是进行“经济标比对”的必要前提。系统将基于招标文件中的清单项进行深度一致性校验。
                  </p>
                </div>
              </div>
              {biddingDocError && <p className="text-[10px] text-red-500 font-medium pl-5">{biddingDocError}</p>}
            </div>

            {/* 3. 技术标高级调优配置 */}
            <div className="pt-6 border-t border-slate-100 space-y-5">
              <div className="flex items-center gap-2">
                <span className="text-base">🛠️</span>
                <h3 className="text-sm font-extrabold text-slate-800">技术标高级调优配置</h3>
              </div>

              {/* Sliders and Selectors Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50/55 p-5 rounded-2xl border border-slate-100">
                {/* 语句雷同判定阈值 */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-bold text-slate-700">语句雷同判定阈值</span>
                      <span className="bg-indigo-50 text-indigo-600 text-[10px] font-extrabold px-2 py-0.5 rounded border border-indigo-100">
                        标准
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-indigo-600">
                      {sentenceThreshold === 60 ? '严格' : sentenceThreshold === 80 ? '标准' : '宽松'}
                    </span>
                  </div>

                  <div className="flex bg-slate-200/50 p-1 rounded-lg">
                    {[
                      { label: '严格', value: 60 },
                      { label: '标准', value: 80 },
                      { label: '宽松', value: 100 },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setSentenceThreshold(opt.value)}
                        className={`flex-1 text-xs py-1.5 font-bold rounded-md transition-all duration-200 ${
                          sentenceThreshold === opt.value
                            ? 'bg-white text-indigo-600 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 整体重复风险红线 */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-slate-700">整体重复风险红线</span>
                    <span className="bg-rose-50 text-rose-600 text-xs font-bold px-2.5 py-0.5 rounded-full border border-rose-100">
                      {riskThreshold}%
                    </span>
                  </div>
                  
                  <div className="pt-2">
                    <input 
                      type="range" 
                      min="30" 
                      max="80" 
                      value={riskThreshold} 
                      onChange={(e) => setRiskThreshold(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between mt-1 text-[10px] text-slate-400 font-semibold">
                      <span>30% (极易触发)</span>
                      <span>80% (极难触发)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Checkboxes */}
              <div className="flex flex-wrap gap-x-6 gap-y-3.5 px-1 pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4.5 h-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer"
                    checked={filterBiddingDoc}
                    onChange={(e) => setFilterBiddingDoc(e.target.checked)}
                  />
                  <span className="text-xs sm:text-sm font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">
                    技术标过滤招标文件内容
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4.5 h-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer"
                    checked={excludeTableHeaders}
                    onChange={(e) => setExcludeTableHeaders(e.target.checked)}
                  />
                  <span className="text-xs sm:text-sm font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">
                    不对表格中的表头进行查重
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4.5 h-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer"
                    checked={excludeTableTitles}
                    onChange={(e) => setExcludeTableTitles(e.target.checked)}
                  />
                  <span className="text-xs sm:text-sm font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">
                    不对表格标题进行查重
                  </span>
                </label>
              </div>
            </div>

            {/* 4. 经济标地区及行业配置 */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">📊</span>
                  <h3 className="text-sm font-extrabold text-slate-800">经济标地区及行业配置</h3>
                </div>
                <span className="bg-amber-50 text-amber-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-amber-100 self-start sm:self-auto shadow-sm">
                  江苏/山东省标专享
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 bg-slate-50/40 p-5 rounded-2xl border border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">省份</label>
                  <CustomSelect
                    value={economicRegion.province}
                    onChange={(val) => setEconomicRegion({...economicRegion, province: val})}
                    options={[
                      { label: '山东省', value: '山东省' },
                      { label: '江苏省', value: '江苏省' },
                    ]}
                    className="w-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">城市</label>
                  <CustomSelect
                    value={economicRegion.city}
                    onChange={(val) => setEconomicRegion({...economicRegion, city: val})}
                    options={[
                      { label: '淄博市', value: '淄博市' },
                      { label: '济南市', value: '济南市' },
                      { label: '青岛市', value: '青岛市' },
                      { label: '南京市', value: '南京市' },
                      { label: '苏州市', value: '苏州市' },
                    ]}
                    className="w-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">行业清单编制规则</label>
                  <CustomSelect
                    value={economicListType}
                    onChange={(val) => setEconomicListType(val)}
                    options={[
                      { label: '房建', value: '房建' },
                      { label: '交通', value: '交通' },
                      { label: '水利', value: '水利' },
                      { label: '公路', value: '公路' },
                    ]}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Floating Action Bar removed */}
    </motion.div>
  );
};

export default Project;
