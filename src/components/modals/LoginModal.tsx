import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Layers, ShieldCheck, Users, Zap, ChevronDown, Lock, User, KeyRound } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

type LoginMethod = 'password' | 'phone' | 'qrcode' | 'forgot_password';

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('phone');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-[800px] h-[560px] rounded-xl shadow-2xl overflow-hidden flex animate-in fade-in zoom-in-95 duration-200">
            {/* Left Side - Blue */}
            <div className="w-[360px] bg-blue-600 p-10 text-white flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-12">
                  <div className="bg-white p-2 rounded-lg">
                    <Layers className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="font-bold text-xl">SaaS 业务平台</span>
                </div>
                
                <h2 className="text-3xl font-bold mb-12">上云即享超值福利</h2>
                
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="bg-blue-500/50 p-2.5 rounded-lg h-fit">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">首购享特惠</h4>
                      <p className="text-blue-100 text-sm leading-relaxed">丰富云产品即刻体验，极致的性能，首购低至1元</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-blue-500/50 p-2.5 rounded-lg h-fit">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">全链路支撑</h4>
                      <p className="text-blue-100 text-sm leading-relaxed">全方位产品矩阵与丰富解决方案，助力业务增长闭环</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-blue-500/50 p-2.5 rounded-lg h-fit">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">优质的服务</h4>
                      <p className="text-blue-100 text-sm leading-relaxed">提供专业的方案定制与技术支持，7x24小时全天候客服</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Login Form */}
            <div className="flex-1 p-12 relative flex flex-col">
              <button 
                onClick={() => {
                  setLoginMethod('phone');
                  onClose();
                }} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2"
              >
                <X className="w-5 h-5" />
              </button>
              
              {loginMethod === 'forgot_password' ? (
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
                        className="flex-1 border border-slate-300 rounded-md px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
                      />
                      <button className="bg-slate-100 text-slate-600 px-4 py-3 rounded-md font-medium hover:bg-slate-200 transition-colors whitespace-nowrap">
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
                  <h3 className="text-2xl font-bold text-slate-800 mb-8 mt-4">欢迎来到 SaaS 业务平台</h3>
                  
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
                          placeholder="请输入验证码 (测试: 1234)" 
                          className="flex-1 border border-slate-300 rounded-md px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
                        />
                        <button className="bg-slate-100 text-slate-600 px-4 py-3 rounded-md font-medium hover:bg-slate-200 transition-colors whitespace-nowrap">
                          获取验证码(38s)
                        </button>
                      </div>
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

                      <div className="flex justify-between items-center px-1">
                        <span className="text-xs text-slate-500">未注册账号输入密码即可自动注册</span>
                        <button 
                          onClick={() => setLoginMethod('forgot_password')}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          忘记密码？
                        </button>
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={onLogin}
                    className="w-full bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-700 transition-colors mt-8"
                  >
                    登录 / 注册
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
