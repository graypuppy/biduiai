import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldAlert, FileText, Wallet, Coins, ArrowRight, ArrowRightLeft, Sparkles, AlertCircle } from 'lucide-react';
import { FileItem } from '../../types';

interface DeductionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  files: FileItem[];
  userBalance: number;
  requiredPages: number;
  onRechargeClick: () => void;
}

export default function DeductionConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  files,
  userBalance,
  requiredPages,
  onRechargeClick
}: DeductionConfirmModalProps) {
  const isSufficient = userBalance >= requiredPages;
  const remainingPages = userBalance - requiredPages;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 z-10"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-indigo-500" />
                <h3 className="text-lg font-bold text-slate-800">比对额度扣减确认</h3>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Alert */}
              {isSufficient ? (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-800">账户余额充足</h4>
                    <p className="text-xs text-emerald-600 mt-0.5">您可以直接开始本次多版本文件深度比对分析</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-amber-800">账户余额不足</h4>
                    <p className="text-xs text-amber-600 mt-0.5">本次比对所需额度超出您当前账户的剩余页数，请先充值</p>
                  </div>
                </div>
              )}

              {/* Files list / Page summary */}
              <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/30">
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>待比对项目文件</span>
                  <span>预计比对页数</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-32 overflow-y-auto custom-scrollbar">
                  {files.map(file => (
                    <div key={file.id} className="px-4 py-3 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 overflow-hidden mr-4">
                        <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="text-slate-700 truncate font-medium">{file.name}</span>
                      </div>
                      <span className="text-slate-500 font-mono text-xs whitespace-nowrap shrink-0">{file.pages || 50} 页</span>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-slate-800">
                  <span>合计消耗：</span>
                  <span className="text-indigo-600 font-mono">{requiredPages} 页</span>
                </div>
              </div>

              {/* Balance comparison layout */}
              <div className="grid grid-cols-3 gap-3 items-center bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                <div className="text-center">
                  <p className="text-xs text-slate-500 font-medium mb-1">当前余额</p>
                  <div className="flex items-baseline justify-center gap-0.5">
                    <span className="text-lg font-bold text-slate-700 font-mono">{userBalance.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 font-medium">页</span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center text-slate-400">
                  <ArrowRightLeft className="w-5 h-5 text-indigo-400" />
                  <span className="text-[10px] font-medium text-slate-400 mt-1">扣减 {requiredPages} 页</span>
                </div>

                <div className="text-center">
                  <p className="text-xs text-slate-500 font-medium mb-1">预计剩余</p>
                  {isSufficient ? (
                    <div className="flex items-baseline justify-center gap-0.5">
                      <span className="text-lg font-bold text-emerald-600 font-mono">{remainingPages.toLocaleString()}</span>
                      <span className="text-[10px] text-emerald-600 font-medium">页</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline justify-center gap-0.5 text-red-500" title="额度不足">
                      <span className="text-lg font-bold font-mono">不足</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/30">
              <button 
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium text-sm transition-colors"
                onClick={onClose}
              >
                取消
              </button>
              {isSufficient ? (
                <button 
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-lg shadow-indigo-600/10 flex items-center gap-1"
                  onClick={onConfirm}
                >
                  确认扣减并开始
                </button>
              ) : (
                <button 
                  className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg font-semibold text-sm transition-colors shadow-lg shadow-orange-500/10 flex items-center gap-1.5"
                  onClick={onRechargeClick}
                >
                  <Wallet className="w-4 h-4" />
                  立即去充值额度
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
