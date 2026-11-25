import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ChevronRight, ChevronLeft, Loader2, AlertCircle, Wallet, CheckCircle, XCircle, CheckCircle2, FileText } from 'lucide-react';
import { InvoiceRecord, InvoiceTitlePreset, RechargeOrder } from '../../types';
import { InvoiceApplyView, InvoicePreviewView } from './InvoiceViews';

export type PurchaseViewState = 'main' | 'transfer' | 'records' | 'coupons' | 'invoice_apply' | 'invoice_preview';

interface OrderPaymentInfo {
  title: string;
  unitPriceDesc: string;
  pages: number;
  amount: number;
  paymentMethod: string;
}

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSku: string;
  setSelectedSku: (sku: string) => void;
  onPaymentSuccess: (addedPages?: number, orderDetails?: OrderPaymentInfo) => void;
  initialView?: PurchaseViewState;
  userBalance: number;
  rechargeOrders: RechargeOrder[];
  invoiceRecords: InvoiceRecord[];
  savedInvoiceTitles: InvoiceTitlePreset[];
  onApplyInvoice: (
    payload: Omit<InvoiceRecord, 'id' | 'invoiceNo' | 'issuedAt' | 'status'>,
    saveAsPreset: boolean
  ) => InvoiceRecord;
}

export default function PurchaseModal({
  isOpen,
  onClose,
  selectedSku,
  setSelectedSku,
  onPaymentSuccess,
  initialView = 'main',
  userBalance,
  rechargeOrders,
  invoiceRecords,
  savedInvoiceTitles,
  onApplyInvoice,
}: PurchaseModalProps) {
  const [view, setView] = useState<PurchaseViewState>(initialView);
  const [showTransferAlert, setShowTransferAlert] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay'>('wechat');
  const [recordsTab, setRecordsTab] = useState<'recharge' | 'usage' | 'invoices'>('recharge');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'paying' | 'failed' | 'success'>('idle');
  const [paymentSimulationResult, setPaymentSimulationResult] = useState<'success' | 'failed'>('success');
  const [rechargePage, setRechargePage] = useState(1);
  const [usagePage, setUsagePage] = useState(1);
  const [invoicePage, setInvoicePage] = useState(1);
  const [customPages, setCustomPages] = useState<number>(100);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [activeInvoiceOrders, setActiveInvoiceOrders] = useState<RechargeOrder[]>([]);
  const [previewInvoice, setPreviewInvoice] = useState<InvoiceRecord | null>(null);
  const [justIssuedInvoice, setJustIssuedInvoice] = useState(false);
  const [invoiceSuccessNotice, setInvoiceSuccessNotice] = useState<string | null>(null);

  const getPriceAndPages = () => {
    if (selectedSku === 'pages100') {
      return { price: 30, pages: 100, label: '100页 充值套餐' };
    } else if (selectedSku === 'pages2000') {
      return { price: 400, pages: 2000, label: '2000页 充值套餐' };
    } else if (selectedSku === 'custom') {
      const pageCount = isNaN(customPages) ? 0 : customPages;
      const calculatedPrice = parseFloat((pageCount * 0.3).toFixed(2));
      return { price: calculatedPrice, pages: pageCount, label: `自定义充值 (${pageCount}页)` };
    } else {
      // Default: 'pages500'
      return { price: 120, pages: 500, label: '500页 充值套餐' };
    }
  };

  // Reset view when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setShowTransferAlert(false);
      setPaymentMethod('wechat');
      setPaymentStatus('idle');
      setPaymentSimulationResult('success');
      setSelectedOrderIds([]);
      setJustIssuedInvoice(false);
      setInvoiceSuccessNotice(null);
    }
  }, [isOpen, initialView]);

  // Handle successful payment delay
  React.useEffect(() => {
    if (paymentStatus === 'paying') {
      const timer = setTimeout(() => {
        setPaymentStatus(paymentSimulationResult);
      }, 2000);
      return () => clearTimeout(timer);
    }
    if (paymentStatus === 'success') {
      const timer = setTimeout(() => {
        const info = getPriceAndPages();
        const unitPrice = info.pages > 0 ? (info.price / info.pages).toFixed(2) : '0.30';
        onPaymentSuccess(info.pages, {
          title: info.label,
          unitPriceDesc: `单价: ${unitPrice}元/页`,
          pages: info.pages,
          amount: info.price,
          paymentMethod: paymentMethod === 'wechat' ? '微信支付' : '支付宝',
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, paymentSimulationResult, onPaymentSuccess]);

  const PAGE_SIZE = 5;
  const unbilledOrders = rechargeOrders.filter((o) => o.invoiceStatus === 'unbilled');
  const totalRechargePages = Math.max(1, Math.ceil(rechargeOrders.length / PAGE_SIZE));
  const pagedRechargeOrders = rechargeOrders.slice(
    (rechargePage - 1) * PAGE_SIZE,
    rechargePage * PAGE_SIZE
  );
  const totalInvoicePages = Math.max(1, Math.ceil(invoiceRecords.length / PAGE_SIZE));
  const pagedInvoiceRecords = invoiceRecords.slice(
    (invoicePage - 1) * PAGE_SIZE,
    invoicePage * PAGE_SIZE
  );

  const selectedOrdersAmount = rechargeOrders
    .filter((o) => selectedOrderIds.includes(o.id))
    .reduce((sum, o) => sum + o.amount, 0);

  const toggleOrderSelect = (orderId: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const toggleSelectAllUnbilled = () => {
    const unbilledIds = unbilledOrders.map((o) => o.id);
    const allSelected = unbilledIds.length > 0 && unbilledIds.every((id) => selectedOrderIds.includes(id));
    setSelectedOrderIds(allSelected ? [] : unbilledIds);
  };

  const openInvoiceApplyForOrders = (orders: RechargeOrder[]) => {
    setActiveInvoiceOrders(orders);
    setJustIssuedInvoice(false);
    setInvoiceSuccessNotice(null);
    setView('invoice_apply');
  };

  const openInvoicePreviewById = (invoiceId?: string) => {
    if (!invoiceId) return;
    const found = invoiceRecords.find((inv) => inv.id === invoiceId);
    if (found) {
      setPreviewInvoice(found);
      setJustIssuedInvoice(false);
      setView('invoice_preview');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div className="bg-white w-[880px] max-w-[95vw] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 relative">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-medium text-slate-800">
                {view === 'transfer' ? '对公转账' : 
                 view === 'records' ? '我的订单' : 
                 view === 'coupons' ? '优惠券' :
                 view === 'invoice_apply' ? '申请开票' :
                 view === 'invoice_preview' ? '电子发票' : '充值'}
              </h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 bg-[#F5F8FF] flex-1">
              {view === 'main' && (
                <>
                  {/* Blue Bar */}
                  <div className="bg-[#6B9DF8] text-white px-5 py-3 rounded-t-lg flex justify-between items-center">
                    <span className="font-medium text-lg">请选择购买方案</span>
                    <div className="text-sm opacity-90 flex items-center gap-3">
                      <button onClick={() => setView('transfer')} className="hover:text-white text-white/90 transition-colors">对公转账</button>
                      <span className="text-white/40">|</span>
                      <button onClick={() => setView('records')} className="hover:text-white text-white/90 transition-colors">我的订单</button>
                      <span className="text-white/40">|</span>
                      <button onClick={() => setView('coupons')} className="border border-white/50 px-2 py-0.5 rounded text-white hover:bg-white/20 transition-all shadow-sm">优惠券</button>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-b-lg border border-t-0 border-slate-200 shadow-sm space-y-6">
                    {/* Product Info */}
                    <div className="flex items-start gap-4">
                      <span className="text-slate-600 mt-1 whitespace-nowrap">购买商品：</span>
                      <div className="flex gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-serif text-2xl font-bold font-mono">
                          P
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-lg">云保标-按页充值</h4>
                          <p className="text-sm text-slate-500 mt-1">支持资信标、技术标、经济标及底层设备特征的深度比对分析，按实际比对页数扣费</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* SKUs */}
                    <div className="flex items-start gap-4">
                      <span className="text-slate-600 mt-2 whitespace-nowrap">选择套餐：</span>
                      <div className="flex flex-col flex-1 gap-4">
                        <div className="grid grid-cols-4 gap-4">
                          {/* Pages 100 */}
                          <div 
                            className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedSku === 'pages100' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-200 hover:border-blue-300'}`}
                            onClick={() => setSelectedSku('pages100')}
                          >
                            {selectedSku === 'pages100' && (
                              <div className="absolute top-0 right-0 bg-blue-600 text-white rounded-bl-lg rounded-tr-sm p-0.5">
                                <Check className="w-4 h-4" />
                              </div>
                            )}
                            <div className="font-bold text-lg text-slate-800">100页</div>
                            <div className="text-xs text-slate-500 mt-1">中小型项目</div>
                            <div className="mt-3 flex items-baseline gap-1.5">
                              <span className="text-2xl font-bold text-blue-600">¥30</span>
                              <span className="text-xs text-slate-400 line-through">¥45</span>
                            </div>
                            <div className="text-xs text-slate-400 mt-1">0.30元/页</div>
                          </div>
                          
                          {/* Pages 500 */}
                          <div 
                            className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedSku === 'pages500' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-200 hover:border-blue-300'}`}
                            onClick={() => setSelectedSku('pages500')}
                          >
                            {selectedSku === 'pages500' && (
                              <div className="absolute top-0 right-0 bg-blue-600 text-white rounded-bl-lg rounded-tr-sm p-0.5">
                                <Check className="w-4 h-4" />
                              </div>
                            )}
                            <div className="absolute -top-2.5 left-4 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                              推荐
                            </div>
                            <div className="font-bold text-lg text-slate-800">500页</div>
                            <div className="text-xs text-slate-500 mt-1">常规项目比对</div>
                            <div className="mt-3 flex items-baseline gap-1.5">
                              <span className="text-2xl font-bold text-blue-600">¥120</span>
                              <span className="text-xs text-slate-400 line-through">¥180</span>
                            </div>
                            <div className="text-xs text-slate-400 mt-1">0.24元/页</div>
                          </div>

                          {/* Pages 2000 */}
                          <div 
                            className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedSku === 'pages2000' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-200 hover:border-blue-300'}`}
                            onClick={() => setSelectedSku('pages2000')}
                          >
                            {selectedSku === 'pages2000' && (
                              <div className="absolute top-0 right-0 bg-blue-600 text-white rounded-bl-lg rounded-tr-sm p-0.5">
                                <Check className="w-4 h-4" />
                              </div>
                            )}
                            <div className="absolute -top-2.5 left-4 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                              特惠
                            </div>
                            <div className="font-bold text-lg text-slate-800">2000页</div>
                            <div className="text-xs text-slate-500 mt-1">长期及多项目</div>
                            <div className="mt-3 flex items-baseline gap-1.5">
                              <span className="text-2xl font-bold text-blue-600">¥400</span>
                              <span className="text-xs text-slate-400 line-through">¥600</span>
                            </div>
                            <div className="text-xs text-slate-400 mt-1">0.20元/页</div>
                          </div>

                          {/* Custom */}
                          <div 
                            className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedSku === 'custom' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-200 hover:border-blue-300'}`}
                            onClick={() => setSelectedSku('custom')}
                          >
                            {selectedSku === 'custom' && (
                              <div className="absolute top-0 right-0 bg-blue-600 text-white rounded-bl-lg rounded-tr-sm p-0.5">
                                <Check className="w-4 h-4" />
                              </div>
                            )}
                            <div className="font-bold text-lg text-slate-800">自定义页数</div>
                            <div className="text-xs text-slate-500 mt-1">按需自主填写</div>
                            <div className="mt-3 flex items-baseline gap-1.5">
                              <span className="text-2xl font-bold text-blue-600">自定义</span>
                            </div>
                            <div className="text-xs text-slate-400 mt-1">0.30元/页</div>
                          </div>
                        </div>

                        {/* Custom Input Block */}
                        {selectedSku === 'custom' && (
                          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-200">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-slate-700">请输入购买页数：</span>
                              <div className="flex items-center">
                                <input 
                                  type="number" 
                                  min="10"
                                  value={customPages}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    setCustomPages(isNaN(val) ? 0 : Math.max(0, val));
                                  }}
                                  className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm w-32 outline-none focus:border-blue-500 bg-white text-slate-800 font-semibold font-mono text-center"
                                />
                                <span className="text-sm font-medium text-slate-500 ml-2">页</span>
                              </div>
                            </div>
                            <div className="text-xs text-slate-500">
                              * 最少购买 10 页，单价 0.3 元/页
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Promo */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                      <div className="flex items-center gap-4">
                        <span className="text-slate-600 whitespace-nowrap">使用优惠：</span>
                        <select className="border border-slate-300 bg-white rounded px-3 py-1.5 text-sm w-48 outline-none focus:border-blue-500">
                          <option>暂无优惠券</option>
                          <option>新用户专享券 (¥50)</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600 text-sm whitespace-nowrap">推广码：</span>
                        <div className="flex items-center">
                          <input type="text" placeholder="选填" className="border border-slate-300 rounded px-3 py-1.5 text-sm w-32 outline-none focus:border-blue-500 focus:z-10 relative bg-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Area */}
                  <div className="bg-white mt-4 p-6 rounded-lg border border-slate-200 shadow-sm flex justify-between items-center">
                    <div className="flex gap-6 items-center">
                      {/* QR Code Area */}
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-32 h-32 border border-slate-200 rounded p-1 flex items-center justify-center bg-white overflow-hidden">
                          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=simulate_payment_${paymentMethod}`} alt="QR Code" className="w-full h-full opacity-80" />
                        </div>
                        <div className="flex gap-2 w-full">
                          <button onClick={() => { setPaymentSimulationResult('success'); setPaymentStatus('paying'); }} className="text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1.5 rounded transition-colors flex-1 border border-emerald-100 flex items-center justify-center gap-1">
                            <CheckCircle className="w-3 h-3" /> 扫码成功
                          </button>
                          <button onClick={() => { setPaymentSimulationResult('failed'); setPaymentStatus('paying'); }} className="text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-1.5 rounded transition-colors flex-1 border border-rose-100 flex items-center justify-center gap-1">
                            <XCircle className="w-3 h-3" /> 扫码失败
                          </button>
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-600 flex items-baseline gap-2 mb-3">
                          需支付: <span className="text-3xl font-bold text-[#D97706]">¥{getPriceAndPages().price}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setPaymentMethod('wechat')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-colors ${paymentMethod === 'wechat' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                          >
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${paymentMethod === 'wechat' ? 'bg-green-500 text-white' : 'border border-slate-300'}`}>
                              {paymentMethod === 'wechat' && <Check className="w-3 h-3" />}
                            </div>
                            <span className="text-sm font-medium">微信支付</span>
                          </button>
                          <button 
                            onClick={() => setPaymentMethod('alipay')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-colors ${paymentMethod === 'alipay' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                          >
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${paymentMethod === 'alipay' ? 'bg-blue-500 text-white' : 'border border-slate-300'}`}>
                              {paymentMethod === 'alipay' && <Check className="w-3 h-3" />}
                            </div>
                            <span className="text-sm font-medium">支付宝</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setView('transfer')} className="text-slate-500 text-sm hover:text-slate-800 flex items-center group">
                      我要对公转账 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  
                  <div className="mt-4 text-xs text-slate-400 text-center flex flex-col gap-1.5">
                    <span>支付即代表你同意 <a href="#" className="text-blue-500 hover:underline">《用户协议》</a> 及 <a href="#" className="text-blue-500 hover:underline">《隐私协议》</a> ，购买后不支持7天无理由退货</span>
                    <span className="text-amber-600/80 font-medium flex items-center justify-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      温馨提示：充值额度购买后有效期为一年，请在有效期内使用
                    </span>
                  </div>
                </>
              )}

              {/* Transfer View */}
              {view === 'transfer' && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 relative">
                  {showTransferAlert && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                      <div className="bg-white border border-slate-200 shadow-xl rounded-xl p-6 w-96 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Check className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 mb-2">付款信息已提交</h4>
                        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                          请等待财务核验，欢迎致电商务经理<br/><span className="font-bold text-blue-600 text-base">18906181561</span><br/>获取更多帮助！
                        </p>
                        <button 
                          onClick={() => setShowTransferAlert(false)} 
                          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          确定
                        </button>
                      </div>
                    </div>
                  )}
                  <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    对公转账指引
                  </h4>
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-100">
                      请通过企业网银或银行柜台汇款至以下账户，并在附言中备注您的账号信息（手机号或邮箱）以便快速核销。转账成功后，可联系客服加快处理。
                    </div>
                    <div className="border border-slate-200 rounded-lg overflow-hidden flex flex-col text-sm">
                      <div className="flex px-6 py-3 border-b border-slate-100 bg-slate-50">
                        <span className="w-32 text-slate-500 font-medium shrink-0">收款户名</span>
                        <span className="font-bold text-slate-900">安徽国泰新点软件有限公司</span>
                      </div>
                      <div className="flex px-6 py-3 border-b border-slate-100">
                        <span className="w-32 text-slate-500 font-medium shrink-0">开户银行</span>
                        <span className="font-bold text-slate-900">招商银行合肥分行创新大道支行</span>
                      </div>
                      <div className="flex px-6 py-3 border-b border-slate-100 bg-slate-50">
                        <span className="w-32 text-slate-500 font-medium shrink-0">收款账号</span>
                        <span className="font-bold text-slate-900 font-mono tracking-wider text-blue-700">551907108210701</span>
                      </div>
                      <div className="flex px-6 py-3 border-b border-slate-100">
                        <span className="w-32 text-slate-500 font-medium shrink-0">开户行行号</span>
                        <span className="text-slate-900 font-mono tracking-wider">308361030033</span>
                      </div>
                      <div className="flex px-6 py-3 border-b border-slate-100 bg-slate-50">
                        <span className="w-32 text-slate-500 font-medium shrink-0">税号</span>
                        <span className="text-slate-900 font-mono tracking-wider">91340100MA2W5D5208</span>
                      </div>
                      <div className="flex px-6 py-3 border-b border-slate-100">
                        <span className="w-32 text-slate-500 font-medium shrink-0">单位地址</span>
                        <span className="text-slate-900 leading-snug">安徽省合肥市高新区黄山路622号高芯光谷601室</span>
                      </div>
                      <div className="flex px-6 py-3 bg-slate-50">
                        <span className="w-32 text-slate-500 font-medium shrink-0">电话</span>
                        <span className="text-slate-900 font-mono tracking-wider">0551-64664620</span>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                      <button onClick={() => setView('main')} className="px-5 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium">返回支付页</button>
                      <button onClick={() => setShowTransferAlert(true)} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">我已付款</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Records View */}
              {view === 'records' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200/90 p-6 flex flex-col h-[620px] overflow-hidden">
                  <div className="flex items-center justify-between mb-5 shrink-0">
                    <h4 className="text-xl font-bold text-slate-800">账号与权益</h4>
                    <button onClick={() => setView('main')} className="px-4 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium text-sm whitespace-nowrap shrink-0">
                      返回购买
                    </button>
                  </div>
                  
                  <div className="overflow-y-auto pr-1 space-y-5 flex-1 custom-scrollbar">
                    {invoiceSuccessNotice && (
                      <div className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{invoiceSuccessNotice}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setInvoiceSuccessNotice(null)}
                          className="text-emerald-600 hover:text-emerald-800"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    {/* Account Info & Rights */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-slate-200/90 p-5 rounded-xl bg-white flex flex-col justify-center">
                        <div className="text-slate-500 mb-2 whitespace-nowrap text-xs">当前账号</div>
                        <div className="text-2xl font-bold text-slate-800 tracking-tight font-mono tabular-nums">18906181561</div>
                      </div>
                      <div className="border border-indigo-100 p-5 rounded-xl bg-[#F8FAFF] flex flex-col justify-center">
                        <div className="text-indigo-600 mb-2.5 whitespace-nowrap text-xs font-medium">当前权益</div>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">权益名称：</span>
                            <span className="text-indigo-600 font-medium">云保标比对页数</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">剩余页数：</span>
                            <span className="text-indigo-600 font-bold font-mono tabular-nums">{userBalance.toLocaleString()} 页</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tabs for Records */}
                    <div className="pt-1 pb-4">
                       <div className="flex items-center justify-between border-b border-slate-200 mb-4">
                         <div className="flex">
                           <button 
                             onClick={() => setRecordsTab('recharge')}
                             className={`px-4 py-2.5 font-medium text-sm border-b-2 transition-colors -mb-px whitespace-nowrap shrink-0 ${recordsTab === 'recharge' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                           >
                             充值记录
                           </button>
                           <button 
                             onClick={() => setRecordsTab('usage')}
                             className={`px-4 py-2.5 font-medium text-sm border-b-2 transition-colors -mb-px whitespace-nowrap shrink-0 ${recordsTab === 'usage' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                           >
                             消耗记录
                           </button>
                           <button 
                             onClick={() => setRecordsTab('invoices')}
                             className={`px-4 py-2.5 font-medium text-sm border-b-2 transition-colors -mb-px whitespace-nowrap shrink-0 ${recordsTab === 'invoices' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                           >
                             开票记录
                           </button>
                         </div>

                         {recordsTab === 'recharge' && unbilledOrders.length > 0 && (
                           <div className="flex items-center gap-3 pb-1.5">
                             {selectedOrderIds.length > 0 ? (
                               <>
                                 <span className="text-xs text-slate-500 font-mono tabular-nums">
                                   已选 {selectedOrderIds.length} 笔 · ¥{selectedOrdersAmount.toFixed(2)}
                                 </span>
                                 <button
                                   onClick={() =>
                                     openInvoiceApplyForOrders(
                                       rechargeOrders.filter((o) => selectedOrderIds.includes(o.id))
                                     )
                                   }
                                   className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-xs font-medium whitespace-nowrap shrink-0"
                                 >
                                   {selectedOrderIds.length > 1 ? '合并开票' : '申请开票'}
                                 </button>
                               </>
                             ) : (
                               <button
                                 onClick={() => openInvoiceApplyForOrders(unbilledOrders)}
                                 className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors whitespace-nowrap shrink-0"
                               >
                                 批量合并开票 ({unbilledOrders.length})
                               </button>
                             )}
                           </div>
                         )}
                       </div>

                       {recordsTab === 'recharge' && (
                         <div className="flex flex-col gap-4">
                           <div className="border border-slate-200/80 rounded-xl overflow-hidden shrink-0">
                             <table className="w-full text-left text-sm">
                               <thead className="bg-slate-50/70 text-slate-500 border-b border-slate-200/80 text-xs">
                                 <tr>
                                   <th className="pl-4 pr-1 py-3.5 w-9">
                                     <input
                                       type="checkbox"
                                       title="全选可开票订单"
                                       disabled={unbilledOrders.length === 0}
                                       checked={
                                         unbilledOrders.length > 0 &&
                                         unbilledOrders.every((o) => selectedOrderIds.includes(o.id))
                                       }
                                       onChange={toggleSelectAllUnbilled}
                                       className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-40"
                                     />
                                   </th>
                                   <th className="px-4 py-3.5 font-medium">充值时间</th>
                                   <th className="px-4 py-3.5 font-medium">商品说明</th>
                                   <th className="px-4 py-3.5 font-medium">金额</th>
                                   <th className="px-5 py-3.5 font-medium text-right">开票</th>
                                 </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-100">
                                 {pagedRechargeOrders.map((order) => {
                                   const isUnbilled = order.invoiceStatus === 'unbilled';
                                   const isSelected = selectedOrderIds.includes(order.id);
                                   return (
                                     <tr
                                       key={order.id}
                                       className={`transition-colors ${
                                         isSelected ? 'bg-indigo-50/35' : 'hover:bg-slate-50/50'
                                       }`}
                                     >
                                       <td className="pl-4 pr-1 py-3.5">
                                         <input
                                           type="checkbox"
                                           disabled={!isUnbilled}
                                           checked={isSelected}
                                           onChange={() => toggleOrderSelect(order.id)}
                                           className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-25 disabled:cursor-not-allowed"
                                         />
                                       </td>
                                       <td className="px-4 py-3.5 text-slate-600 font-mono text-xs tabular-nums">
                                         {order.time}
                                       </td>
                                       <td className="px-4 py-3.5 text-slate-800">
                                         {order.title}
                                       </td>
                                       <td className="px-4 py-3.5 text-slate-900 font-semibold font-mono tabular-nums">
                                         ¥{order.amount.toFixed(2)}
                                       </td>
                                       <td className="px-5 py-3.5 text-right">
                                         {isUnbilled ? (
                                           <button
                                             onClick={() => openInvoiceApplyForOrders([order])}
                                             className="px-2.5 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border border-indigo-200 rounded-md transition-colors whitespace-nowrap shrink-0"
                                           >
                                             申请开票
                                           </button>
                                         ) : (
                                           <div className="inline-flex items-center justify-end gap-2.5">
                                             <span className="text-xs text-slate-400">已开票</span>
                                             <button
                                               onClick={() => openInvoicePreviewById(order.invoiceId)}
                                               className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-colors whitespace-nowrap shrink-0"
                                             >
                                               查看发票
                                             </button>
                                           </div>
                                         )}
                                       </td>
                                     </tr>
                                   );
                                 })}
                               </tbody>
                             </table>
                           </div>
                           <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                             <div>共 {rechargeOrders.length} 条记录</div>
                             <div className="flex items-center gap-2">
                               <button 
                                 disabled={rechargePage === 1}
                                 onClick={() => setRechargePage(p => Math.max(1, p - 1))}
                                 className="p-1 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                               >
                                 <ChevronLeft className="w-4 h-4" />
                               </button>
                               <span className="font-medium text-slate-700 font-mono tabular-nums">{rechargePage} / {totalRechargePages}</span>
                               <button 
                                 disabled={rechargePage >= totalRechargePages}
                                 onClick={() => setRechargePage(p => Math.min(totalRechargePages, p + 1))}
                                 className="p-1 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                               >
                                 <ChevronRight className="w-4 h-4" />
                               </button>
                             </div>
                           </div>
                         </div>
                       )}

                       {recordsTab === 'usage' && (
                         <div className="flex flex-col gap-4">
                           <div className="border border-slate-200 rounded-lg overflow-hidden shrink-0">
                             <table className="w-full text-left text-sm table-fixed">
                               <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                 <tr>
                                   <th className="px-5 py-3.5 font-medium w-[140px]">比对时间</th>
                                   <th className="px-5 py-3.5 font-medium">项目名称</th>
                                   <th className="px-5 py-3.5 font-medium w-[150px]">消耗扣减</th>
                                 </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-100">
                                 <tr className="hover:bg-slate-50/50 transition-colors">
                                   <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">2026-05-02 11:15</td>
                                   <td className="px-5 py-3.5 text-slate-900 font-medium truncate" title="某市第一人民医院门诊楼新建工程">某市第一人民医院门诊楼新建工程</td>
                                   <td className="px-5 py-3.5 text-slate-600">
                                     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 whitespace-nowrap border border-indigo-100">扣减 150 页</span>
                                   </td>
                                 </tr>
                                 <tr className="hover:bg-slate-50/50 transition-colors">
                                   <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">2026-04-16 09:40</td>
                                   <td className="px-5 py-3.5 text-slate-900 font-medium truncate" title="《产品需求文档(PRD)》比对">《产品需求文档(PRD)》比对</td>
                                   <td className="px-5 py-3.5 text-slate-600">
                                     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 whitespace-nowrap border border-indigo-100">扣减 80 页</span>
                                   </td>
                                 </tr>
                                 <tr className="hover:bg-slate-50/50 transition-colors">
                                   <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">2026-03-05 14:20</td>
                                   <td className="px-5 py-3.5 text-slate-900 font-medium truncate" title="年度采购合同审查记录">年度采购合同审查记录</td>
                                   <td className="px-5 py-3.5 text-slate-600">
                                     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 whitespace-nowrap border border-indigo-100">扣减 65 页</span>
                                   </td>
                                 </tr>
                               </tbody>
                             </table>
                           </div>
                           <div className="flex items-center justify-between text-sm text-slate-500 px-1">
                             <div>共 3 条记录</div>
                             <div className="flex items-center gap-2">
                               <button 
                                 disabled={usagePage === 1}
                                 onClick={() => setUsagePage(p => Math.max(1, p - 1))}
                                 className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                               >
                                 <ChevronLeft className="w-4 h-4" />
                               </button>
                               <span className="font-medium text-slate-700">{usagePage} / 1</span>
                               <button 
                                 disabled={usagePage === 1}
                                 onClick={() => setUsagePage(p => p + 1)}
                                 className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                               >
                                 <ChevronRight className="w-4 h-4" />
                               </button>
                             </div>
                           </div>
                         </div>
                       )}

                        {recordsTab === 'invoices' && (
                          <div className="flex flex-col gap-4">
                            {invoiceRecords.length > 0 ? (
                              <>
                                <div className="border border-slate-200/80 rounded-xl overflow-hidden shrink-0">
                                  <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50/70 text-slate-500 border-b border-slate-200/80 text-xs">
                                      <tr>
                                        <th className="px-5 py-3.5 font-medium">开票时间</th>
                                        <th className="px-4 py-3.5 font-medium">发票抬头 / 发票号码</th>
                                        <th className="px-4 py-3.5 font-medium">金额</th>
                                        <th className="px-5 py-3.5 font-medium text-right">操作</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                      {pagedInvoiceRecords.map((inv) => (
                                        <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                                          <td className="px-5 py-3.5 text-slate-600 font-mono text-xs tabular-nums">
                                            {inv.issuedAt}
                                          </td>
                                          <td className="px-4 py-3.5">
                                            <div className="font-medium text-slate-800">{inv.titleName}</div>
                                            <div className="text-xs text-slate-400 mt-0.5 font-mono tabular-nums">
                                              {inv.invoiceType === 'special' ? '数电专票' : '数电普票'} · {inv.invoiceNo}
                                            </div>
                                          </td>
                                          <td className="px-4 py-3.5 font-semibold text-slate-900 font-mono tabular-nums">
                                            ¥{inv.amount.toFixed(2)}
                                          </td>
                                          <td className="px-5 py-3.5 text-right">
                                            <div className="inline-flex items-center justify-end gap-2.5">
                                              <span className="text-xs text-emerald-700 font-medium">
                                                {inv.status}
                                              </span>
                                              <button
                                                onClick={() => {
                                                  setPreviewInvoice(inv);
                                                  setJustIssuedInvoice(false);
                                                  setView('invoice_preview');
                                                }}
                                                className="px-2.5 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border border-indigo-200 rounded-md transition-colors whitespace-nowrap shrink-0"
                                              >
                                                查看发票
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                                  <div>共 {invoiceRecords.length} 条记录</div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      disabled={invoicePage === 1}
                                      onClick={() => setInvoicePage((p) => Math.max(1, p - 1))}
                                      className="p-1 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                      <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="font-medium text-slate-700 font-mono tabular-nums">
                                      {invoicePage} / {totalInvoicePages}
                                    </span>
                                    <button
                                      disabled={invoicePage >= totalInvoicePages}
                                      onClick={() => setInvoicePage((p) => Math.min(totalInvoicePages, p + 1))}
                                      className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <ChevronRight className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="border border-slate-200 rounded-lg p-10 text-center text-slate-500">
                                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <div className="text-sm font-medium text-slate-700">暂无开票记录</div>
                                <p className="text-xs text-slate-400 mt-1">可在“充值记录”中选择已支付订单申请开具电子发票</p>
                              </div>
                            )}
                          </div>
                        )}
                     </div>
                   </div>
                 </div>
               )}

              {/* Invoice Application View */}
              {view === 'invoice_apply' && (
                <InvoiceApplyView
                  selectedOrders={activeInvoiceOrders}
                  savedTitles={savedInvoiceTitles}
                  onBack={() => setView('records')}
                  onSubmitInvoice={(payload, saveAsPreset) => {
                    onApplyInvoice(payload, saveAsPreset);
                    setSelectedOrderIds([]);
                    setInvoiceSuccessNotice(
                      '开票申请已提交，工作人员将在三个工作日内为您开具发票，开具后可在订单中点击「查看发票」下载。'
                    );
                    setRecordsTab('recharge');
                    setView('records');
                  }}
                />
              )}

              {/* Invoice Preview View */}
              {view === 'invoice_preview' && previewInvoice && (
                <InvoicePreviewView
                  invoice={previewInvoice}
                  justIssued={justIssuedInvoice}
                  onBack={() => {
                    setRecordsTab('recharge');
                    setView('records');
                  }}
                />
              )}

              {/* Coupons View */}
              {view === 'coupons' && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col h-[500px]">
                  <h4 className="text-xl font-bold text-slate-800 mb-6">我的优惠券</h4>
                  <div className="grid gap-4 flex-1 overflow-y-auto content-start">
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-xl p-5 flex items-center justify-between shadow-sm relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 w-16 h-16 bg-red-100 rounded-full opacity-50"></div>
                      <div className="flex items-center gap-5 relative z-10">
                        <div className="text-red-500 font-bold tracking-tighter">
                          <span className="text-2xl mr-0.5">¥</span><span className="text-5xl">50</span>
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-lg">新用户专享券</div>
                          <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                            <span className="bg-white/50 px-2 py-0.5 rounded text-red-600">满200元可用</span>
                            <span>按页充值通用</span>
                          </div>
                        </div>
                      </div>
                      <div className="relative z-10 pl-6 border-l border-red-200 border-dashed ml-2">
                        <button onClick={() => { setSelectedSku('pages2000'); setView('main'); }} className="bg-red-500 text-white px-5 py-2 rounded-full text-sm hover:bg-red-600 transition-colors font-medium shadow-md shadow-red-200">去使用</button>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-5 flex items-center justify-between opacity-70">
                      <div className="flex items-center gap-5">
                        <div className="text-slate-400 font-bold tracking-tighter">
                          <span className="text-5xl">8</span><span className="text-2xl ml-1">折</span>
                        </div>
                        <div>
                          <div className="font-bold text-slate-700 text-lg">双十一特惠折扣券</div>
                          <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                            <span className="bg-slate-200 px-2 py-0.5 rounded text-slate-600">无门槛</span>
                            <span>全场通用</span>
                          </div>
                        </div>
                      </div>
                      <div className="pl-6 border-l border-slate-300 border-dashed ml-2 h-full flex items-center">
                        <span className="text-slate-400 font-medium px-4">已过期</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6 border-t border-slate-100 pt-6">
                    <button onClick={() => setView('main')} className="px-5 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium">返回支付</button>
                  </div>
                </div>
              )}

            </div>
            
            {/* Payment Status Overlay */}
            {paymentStatus !== 'idle' && (
              <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                <div className="bg-white rounded-2xl p-8 w-[360px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] flex flex-col items-center border border-slate-100 animate-in zoom-in-95 duration-200">
                  {paymentStatus === 'paying' && (
                    <div className="flex flex-col items-center">
                      <div className="mb-6 relative w-32 h-24 flex items-center justify-center">
                        {/* Sparkles */}
                        <div className="absolute top-2 left-2 text-blue-400">✦</div>
                        <div className="absolute top-0 right-4 text-blue-400 scale-150">✦</div>
                        <div className="absolute bottom-4 right-2 text-blue-400">✦</div>
                        
                        {/* Custom Wallet Illustration */}
                        <svg width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="25" y="25" width="50" height="40" rx="6" fill="#D3E2FB"/>
                          <rect x="65" y="38" width="10" height="14" rx="4" fill="#FFFFFF"/>
                          <circle cx="70" cy="45" r="2" fill="#4F8AF6"/>
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">支付中，请稍候...</h3>
                      <p className="text-sm text-slate-500 text-center">正在等待支付中心确认返回结果</p>
                      <Loader2 className="w-6 h-6 text-indigo-400 animate-spin mt-6" />
                    </div>
                  )}

                  {paymentStatus === 'success' && (
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 mb-6 bg-green-50 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">支付成功！</h3>
                      <p className="text-sm text-slate-500">感谢您的购买，权益已自动到账</p>
                    </div>
                  )}

                  {paymentStatus === 'failed' && (
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 mb-6 bg-red-50 rounded-full flex items-center justify-center">
                        <XCircle className="w-10 h-10 text-red-500" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">支付失败</h3>
                      <p className="text-sm text-slate-500 mb-6 text-center">抱歉，支付过程中出现异常<br/>请检查网络或更换支付方式后重试</p>
                      <button 
                        onClick={() => setPaymentStatus('idle')} 
                        className="w-full py-2.5 bg-slate-900 text-white rounded-xl shadow-sm hover:bg-slate-800 transition-colors font-medium"
                      >
                        重新支付
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
