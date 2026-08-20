import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Layers, ShieldCheck, Users, Zap, ChevronDown, Lock, User, KeyRound, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

type LoginMethod = 'password' | 'phone' | 'forgot_password' | 'set_password_after_phone';

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('phone');

  // Handle phone login click - simulate going to set password step
  const handlePhoneLogin = () => {
    // In a real app, you would verify the OTP here.
    // If it's a new user (or user without a password), we prompt them to set one.
    setLoginMethod('set_password_after_phone');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-[800px] h-[560px] rounded-xl shadow-2xl overflow-hidden flex animate-in fade-in zoom-in-95 duration-200">
            {/* Left Side - Blue */}
            <div className="w-[360px] shrink-0 bg-[#2b6bff] p-10 text-white flex flex-col relative overflow-hidden">
              <div className="relative z-10 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-12">
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-bold text-xl tracking-wider">云端保</span>
                </div>
                
                <h2 className="text-[32px] font-bold mb-4 tracking-tight leading-tight">云保标文件比对</h2>
                <p className="text-blue-100/90 text-[13px] leading-relaxed mb-10 pr-4">
                  智能识别文件差异，快速定位问题内容，提高工作效率
                </p>
                
                <div className="space-y-8 pl-1">
                  <div className="flex gap-4 items-start">
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 font-bold text-[15px] mt-0.5 shadow-inner">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold mb-1 text-[17px] leading-tight">智能比对</h4>
                      <p className="text-blue-100/80 text-[13px]">多维度文件内容分析</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 font-bold text-[15px] mt-0.5 shadow-inner">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold mb-1 text-[17px] leading-tight">快速定位</h4>
                      <p className="text-blue-100/80 text-[13px]">精准定位差异内容</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 font-bold text-[15px] mt-0.5 shadow-inner">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold mb-1 text-[17px] leading-tight">一键导出</h4>
                      <p className="text-blue-100/80 text-[13px]">生成专业比对报告</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Login Form */}
            <div className="w-[440px] shrink-0 p-12 relative flex flex-col">
              <button 
                onClick={() => {
                  setLoginMethod('phone');
                  onClose();
                }} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2"
              >
                <X className="w-5 h-5" />
              </button>
              
              {loginMethod === 'set_password_after_phone' ? (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col">
                  <div className="flex items-center gap-3 text-emerald-600 mb-6 mt-4">
                    <CheckCircle2 className="w-8 h-8" />
                    <h3 className="text-2xl font-bold text-slate-800">验证成功</h3>
                  </div>
                  
                  <p className="text-slate-500 mb-8">
                    检测到您是首次登录，为了您的账号安全及下次能使用密码快速登录，建议您设置一个登录密码。
                    <span className="block text-sm text-slate-400 mt-2">（如果您选择跳过，后续登录时可通过“忘记密码”重置，或在登录后点击右上角头像进行修改）</span>
                  </p>
                  
                  <div className="space-y-5">
                    <div className="flex border border-slate-300 rounded-md overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                      <div className="px-4 py-3 text-slate-400 flex items-center justify-center">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <input 
                        type="password" 
                        placeholder="请输入新密码 (不少于8位)" 
                        className="flex-1 py-3 outline-none text-slate-800 placeholder:text-slate-400"
                      />
                    </div>

                    <div className="flex border border-slate-300 rounded-md overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                      <div className="px-4 py-3 text-slate-400 flex items-center justify-center">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <input 
                        type="password" 
                        placeholder="请再次输入新密码" 
                        className="flex-1 py-3 outline-none text-slate-800 placeholder:text-slate-400"
                      />
                    </div>
                    
                    <div className="flex gap-4 mt-8 pt-4">
                      <button 
                        onClick={() => {
                          onLogin();
                          setTimeout(() => setLoginMethod('phone'), 500); // reset state after closing
                        }}
                        className="flex-1 bg-slate-100 text-slate-600 font-medium py-3 rounded-md hover:bg-slate-200 transition-colors"
                      >
                        跳过，直接进入
                      </button>
                      <button 
                        onClick={() => {
                          onLogin();
                          setTimeout(() => setLoginMethod('phone'), 500);
                        }}
                        className="flex-[2] bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        保存密码并进入
                      </button>
                    </div>
                  </div>
                </div>
              ) : loginMethod === 'forgot_password' ? (
                <>
                  <h3 className="text-2xl font-bold text-slate-800 mb-8 mt-4">找回密码</h3>
                  
                  <div className="space-y-5">
                    <div className="flex border border-slate-300 rounded-md overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                      <div className="bg-slate-50 px-4 py-3 border-r border-slate-300 text-slate-600 flex items-center gap-1">
                        +86 <ChevronDown className="w-4 h-4 ml-1" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="请输入注册手机号码" 
                        className="flex-1 px-4 py-3 outline-none text-slate-800 placeholder:text-slate-400"
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
                        className="flex-1 py-3 outline-none text-slate-800 placeholder:text-slate-400"
                      />
                    </div>

                    <div className="flex border border-slate-300 rounded-md overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                      <div className="px-4 py-3 text-slate-400 flex items-center justify-center">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <input 
                        type="password" 
                        placeholder="请再次输入新密码" 
                        className="flex-1 py-3 outline-none text-slate-800 placeholder:text-slate-400"
                      />
                    </div>
                    
                    <button 
                      onClick={() => setLoginMethod('password')}
                      className="w-full bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-700 transition-colors mt-4"
                    >
                      重置密码并登录
                    </button>

                    <div className="text-center mt-4">
                      <button 
                        onClick={() => setLoginMethod('password')}
                        className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
                      >
                        返回密码登录
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-[22px] font-bold text-slate-800 mb-8 mt-4">
                    {loginMethod === 'phone' ? '手机号登录' : '账号密码登录'}
                  </h3>
                  
                  <div className="flex gap-6 border-b border-slate-200 mb-8">
                    <button 
                      onClick={() => setLoginMethod('password')}
                      className={`pb-3 font-medium transition-colors ${loginMethod === 'password' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      账号密码登录
                    </button>
                    <button 
                      onClick={() => setLoginMethod('phone')}
                      className={`pb-3 font-medium transition-colors ${loginMethod === 'phone' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      验证码登录
                    </button>
                  </div>
                  
                  {loginMethod === 'phone' && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-left-2 duration-300">
                      <div className="flex border border-slate-300 rounded-md overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                        <div className="bg-slate-50 px-4 py-3 border-r border-slate-300 text-slate-600 flex items-center gap-1">
                          +86 <ChevronDown className="w-4 h-4 ml-1" />
                        </div>
                        <input 
                          type="text" 
                          placeholder="请输入手机号码 (未注册自动创建)" 
                          className="flex-1 px-4 py-3 outline-none text-slate-800 placeholder:text-slate-400"
                        />
                      </div>
                      
                      <div className="flex gap-4">
                        <input 
                          type="text" 
                          placeholder="请输入验证码" 
                          className="w-0 flex-1 border border-slate-300 rounded-md px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
                        />
                        <button className="bg-slate-100 text-slate-600 px-4 py-3 rounded-md font-medium hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0">
                          获取验证码(38s)
                        </button>
                      </div>

                      <button 
                        onClick={handlePhoneLogin}
                        className="w-full bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-700 transition-colors mt-8"
                      >
                        登录 / 注册
                      </button>
                    </div>
                  )}

                  {loginMethod === 'password' && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-300">
                      <div className="flex border border-slate-300 rounded-md overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                        <div className="px-4 py-3 text-slate-400 flex items-center justify-center">
                          <User className="w-5 h-5" />
                        </div>
                        <input 
                          type="text" 
                          placeholder="请输入手机号" 
                          className="flex-1 py-3 pr-4 outline-none text-slate-800 placeholder:text-slate-400"
                        />
                      </div>
                      
                      <div className="flex border border-slate-300 rounded-md overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                        <div className="px-4 py-3 text-slate-400 flex items-center justify-center">
                          <Lock className="w-5 h-5" />
                        </div>
                        <input 
                          type="password" 
                          placeholder="请输入密码" 
                          className="flex-1 py-3 pr-4 outline-none text-slate-800 placeholder:text-slate-400"
                        />
                      </div>

                      <div className="flex justify-between items-start px-1">
                        <span className="text-xs text-slate-500 leading-relaxed max-w-[280px]">
                          未注册账号输入密码即可自动注册。<br/>
                          <span className="text-slate-400">已注册用户若未设置密码，请点击<button onClick={() => setLoginMethod('forgot_password')} className="text-blue-600 hover:underline">找回密码</button></span>
                        </span>
                        <button 
                          onClick={() => setLoginMethod('forgot_password')}
                          className="text-sm text-blue-600 hover:underline whitespace-nowrap pt-0.5"
                        >
                          忘记密码？
                        </button>
                      </div>

                      <button 
                        onClick={onLogin}
                        className="w-full bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-700 transition-colors mt-8"
                      >
                        登录 / 注册
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
