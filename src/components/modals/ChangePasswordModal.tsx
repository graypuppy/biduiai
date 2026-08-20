import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, KeyRound, ChevronDown } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white w-[480px] rounded-xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">修改登录密码</h3>
              <button 
                onClick={onClose} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 space-y-5">
              <div className="flex border border-slate-300 rounded-md overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all bg-slate-50">
                <div className="px-4 py-3 border-r border-slate-300 text-slate-500 flex items-center gap-1">
                  +86 <ChevronDown className="w-4 h-4 ml-1" />
                </div>
                <input 
                  type="text" 
                  className="flex-1 px-4 py-3 outline-none text-slate-600 bg-transparent"
                  defaultValue="138****8000"
                  disabled
                />
              </div>
              
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="请输入短信验证码" 
                  className="w-0 flex-1 border border-slate-300 rounded-md px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
                />
                <button className="bg-slate-100 text-slate-600 px-4 py-3 rounded-md font-medium hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0">
                  获取验证码
                </button>
              </div>

              <div className="flex border border-slate-300 rounded-md overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <div className="px-4 py-3 text-slate-400 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <input 
                  type="password" 
                  placeholder="请输入新密码 (不少于8位)" 
                  className="flex-1 py-3 pr-4 outline-none text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <div className="flex border border-slate-300 rounded-md overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <div className="px-4 py-3 text-slate-400 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <input 
                  type="password" 
                  placeholder="请再次输入新密码" 
                  className="flex-1 py-3 pr-4 outline-none text-slate-800 placeholder:text-slate-400"
                />
              </div>
              
              <button 
                onClick={onClose}
                className="w-full bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-700 transition-colors mt-6"
              >
                确认修改
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
