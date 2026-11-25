import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Loader2,
  Building2,
  User,
  AlertCircle,
} from 'lucide-react';
import { toCanvas } from 'html-to-image';
import { jsPDF } from 'jspdf';
import {
  InvoiceRecord,
  InvoiceTitlePreset,
  InvoiceTitleType,
  InvoiceType,
  RechargeOrder,
} from '../../types';

/** Convert numeric amount (e.g. 120.00) to Chinese RMB uppercase words */
export function numberToChineseRMB(amount: number): string {
  const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const cnIntRadice = ['', '拾', '佰', '仟'];
  const cnIntUnits = ['', '万', '亿', '兆'];
  const cnDecUnits = ['角', '分'];
  const cnInteger = '整';
  const cnIntLast = '元';
  const maxNum = 999999999999.99;

  if (amount >= maxNum || amount < 0) return '金额超出范围';
  if (amount === 0) return '零元整';

  const moneyStr = amount.toFixed(2);
  const [integerNum, decimalNum] = moneyStr.split('.');
  let chineseStr = '';

  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0;
    const intLen = integerNum.length;
    for (let i = 0; i < intLen; i++) {
      const n = integerNum.substring(i, i + 1);
      const p = intLen - i - 1;
      const q = Math.floor(p / 4);
      const m = p % 4;
      if (n === '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) chineseStr += cnNums[0];
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n, 10)] + cnIntRadice[m];
      }
      if (m === 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }

  if (decimalNum && decimalNum !== '00') {
    for (let i = 0; i < 2; i++) {
      const n = decimalNum.substring(i, i + 1);
      if (n !== '0') {
        chineseStr += cnNums[parseInt(n, 10)] + cnDecUnits[i];
      }
    }
  } else {
    chineseStr += cnInteger;
  }

  return chineseStr;
}

interface InvoiceApplyViewProps {
  selectedOrders: RechargeOrder[];
  savedTitles: InvoiceTitlePreset[];
  onBack: () => void;
  onSubmitInvoice: (
    payload: Omit<InvoiceRecord, 'id' | 'invoiceNo' | 'issuedAt' | 'status'>,
    saveAsPreset: boolean
  ) => void;
}

export const InvoiceApplyView: React.FC<InvoiceApplyViewProps> = ({
  selectedOrders,
  savedTitles,
  onBack,
  onSubmitInvoice,
}) => {
  const firstPreset = savedTitles[0];

  const [invoiceType, setInvoiceType] = useState<InvoiceType>('normal');
  const [titleType, setTitleType] = useState<InvoiceTitleType>(
    firstPreset?.titleType || 'enterprise'
  );
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    firstPreset?.id || 'manual'
  );
  const [titleName, setTitleName] = useState(firstPreset?.titleName || '');
  const [taxId, setTaxId] = useState(firstPreset?.taxId || '');
  const [bankName, setBankName] = useState(firstPreset?.bankName || '');
  const [bankAccount, setBankAccount] = useState(firstPreset?.bankAccount || '');
  const [companyAddress, setCompanyAddress] = useState(
    firstPreset?.companyAddress || ''
  );
  const [companyPhone, setCompanyPhone] = useState(
    firstPreset?.companyPhone || ''
  );
  const [remarks, setRemarks] = useState(
    selectedOrders.length > 0
      ? `订单号: ${selectedOrders.map((o) => o.id).join(', ')}`
      : ''
  );
  const [showMoreFields, setShowMoreFields] = useState(false);
  const [saveAsPreset, setSaveAsPreset] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = selectedOrders.reduce((sum, o) => sum + o.amount, 0);
  const totalPages = selectedOrders.reduce((sum, o) => sum + o.pages, 0);
  const orderSummary =
    selectedOrders.length === 1
      ? selectedOrders[0].title
      : `${selectedOrders[0]?.title || ''} 等 ${selectedOrders.length} 笔充值订单`;

  const applyPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    setErrorMsg(null);
    if (presetId === 'manual') {
      setTitleName('');
      setTaxId('');
      setBankName('');
      setBankAccount('');
      setCompanyAddress('');
      setCompanyPhone('');
      return;
    }
    const found = savedTitles.find((t) => t.id === presetId);
    if (found) {
      setTitleType(found.titleType);
      setTitleName(found.titleName);
      setTaxId(found.taxId || '');
      setBankName(found.bankName || '');
      setBankAccount(found.bankAccount || '');
      setCompanyAddress(found.companyAddress || '');
      setCompanyPhone(found.companyPhone || '');
    }
  };

  const handleInvoiceTypeChange = (nextType: InvoiceType) => {
    setInvoiceType(nextType);
    setErrorMsg(null);
    if (nextType === 'special') {
      setTitleType('enterprise');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (selectedOrders.length === 0) {
      setErrorMsg('请至少选择一笔待开票订单');
      return;
    }
    if (!titleName.trim()) {
      setErrorMsg('请填写发票抬头');
      return;
    }
    const effectiveTitleType =
      invoiceType === 'special' ? 'enterprise' : titleType;

    if (effectiveTitleType === 'enterprise') {
      const cleanTax = taxId.trim().toUpperCase();
      if (!cleanTax) {
        setErrorMsg('企业开票请填写纳税人识别号（统一社会信用代码）');
        return;
      }
      if (!/^[A-Z0-9]{15,20}$/.test(cleanTax)) {
        setErrorMsg('纳税人识别号格式不正确，应为 15 至 20 位字母或数字');
        return;
      }
    }

    if (invoiceType === 'special') {
      if (!bankName.trim() || !bankAccount.trim()) {
        setErrorMsg('增值税专用发票需填写完整的开户银行和银行账号');
        return;
      }
      if (!companyAddress.trim() || !companyPhone.trim()) {
        setErrorMsg('增值税专用发票需填写企业注册地址和联系电话');
        return;
      }
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitInvoice(
        {
          orderIds: selectedOrders.map((o) => o.id),
          orderSummary,
          totalPages,
          amount: parseFloat(totalAmount.toFixed(2)),
          invoiceType,
          titleType: effectiveTitleType,
          titleName: titleName.trim(),
          taxId:
            effectiveTitleType === 'enterprise'
              ? taxId.trim().toUpperCase()
              : undefined,
          bankName: bankName.trim() || undefined,
          bankAccount: bankAccount.trim() || undefined,
          companyAddress: companyAddress.trim() || undefined,
          companyPhone: companyPhone.trim() || undefined,
          remarks: remarks.trim() || undefined,
        },
        saveAsPreset
      );
    }, 600);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col h-[620px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
        <div>
          <h4 className="text-lg font-bold text-slate-900">申请开具电子发票</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            开票金额：<span className="font-semibold text-indigo-600 font-mono tabular-nums">¥{totalAmount.toFixed(2)}</span> · 提交申请后将在三个工作日内开具发票
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          返回我的订单
        </button>
      </div>

      {/* Scrollable Form */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto pr-2 pt-5 space-y-5"
      >
        {/* 3-Business-Day SLA Notice */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs">
          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            开票说明：提交开票申请后，我们将在 <span className="font-semibold">三个工作日内</span> 为您开具发票，开具完成后可在「我的订单」中点击「查看发票」查看及下载。
          </span>
        </div>

        {/* Saved Titles Quick-Select */}
        {savedTitles.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">
              常用开票抬头
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {savedTitles.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset.id)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    selectedPresetId === preset.id
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {preset.titleName}
                </button>
              ))}
              <button
                type="button"
                onClick={() => applyPreset('manual')}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  selectedPresetId === 'manual'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                + 填写新抬头
              </button>
            </div>
          </div>
        )}

        {/* Invoice Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            发票类型 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleInvoiceTypeChange('normal')}
              className={`text-left p-3.5 rounded-lg border transition-all ${
                invoiceType === 'normal'
                  ? 'border-indigo-600 bg-indigo-50/40'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-900">
                  增值税电子普通发票
                </span>
                {invoiceType === 'normal' && (
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                数电普票 · 企业或个人均可开具，支持报销入账
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleInvoiceTypeChange('special')}
              className={`text-left p-3.5 rounded-lg border transition-all ${
                invoiceType === 'special'
                  ? 'border-indigo-600 bg-indigo-50/40'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-900">
                  增值税电子专用发票
                </span>
                {invoiceType === 'special' && (
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                数电专票 · 仅限一般纳税人企业，可用于进项税抵扣
              </p>
            </button>
          </div>
        </div>

        {/* Title Type (for normal invoice) */}
        {invoiceType === 'normal' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              抬头类型 <span className="text-red-500">*</span>
            </label>
            <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setTitleType('enterprise')}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  titleType === 'enterprise'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                企业单位
              </button>
              <button
                type="button"
                onClick={() => setTitleType('personal')}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  titleType === 'personal'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                个人 / 非企业单位
              </button>
            </div>
          </div>
        )}

        {/* Core Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={invoiceType === 'normal' && titleType === 'personal' ? 'sm:col-span-2' : ''}>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              发票抬头 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={titleName}
              onChange={(e) => setTitleName(e.target.value)}
              placeholder={
                titleType === 'personal' && invoiceType === 'normal'
                  ? '请输入姓名或单位名称'
                  : '请输入营业执照上的企业全称'
              }
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all"
            />
          </div>

          {(invoiceType === 'special' || titleType === 'enterprise') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                纳税人识别号 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value.toUpperCase())}
                placeholder="18位统一社会信用代码"
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm font-mono text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all"
              />
            </div>
          )}
        </div>

        {/* Extended Company Info (Required for Special, Optional Toggle for Normal) */}
        {invoiceType === 'normal' && titleType === 'enterprise' && (
          <div>
            <button
              type="button"
              onClick={() => setShowMoreFields((prev) => !prev)}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              {showMoreFields
                ? '收起开户行及地址信息'
                : '+ 选填开户银行、账号及注册地址信息'}
            </button>
          </div>
        )}

        {(invoiceType === 'special' ||
          (titleType === 'enterprise' && showMoreFields)) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                开户银行{' '}
                {invoiceType === 'special' && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="例如：中国建设银行合肥庐阳支行"
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                银行账号{' '}
                {invoiceType === 'special' && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="请输入对公银行账号"
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm font-mono text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                企业注册地址{' '}
                {invoiceType === 'special' && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <input
                type="text"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                placeholder="请输入营业执照注册地址"
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                企业电话{' '}
                {invoiceType === 'special' && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <input
                type="text"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                placeholder="例如：0551-62865500"
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm font-mono text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
              />
            </div>
          </div>
        )}

        {/* Remarks */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            发票备注（选填）
          </label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="可填写项目编号、合同号等备注信息"
            className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
          />
        </div>

        {/* Save Preset */}
        <label className="inline-flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={saveAsPreset}
            onChange={(e) => setSaveAsPreset(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span>将本次开票信息保存为常用抬头，方便下次快速开票</span>
        </label>

        {/* Error Alert */}
        {errorMsg && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Footer Submit */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <span className="text-xs text-slate-500">
            预计三个工作日内完成开票
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium whitespace-nowrap shrink-0"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition-colors text-sm font-medium shadow-sm whitespace-nowrap shrink-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  正在提交申请...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  提交开票申请
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

interface InvoicePreviewViewProps {
  invoice: InvoiceRecord;
  justIssued?: boolean;
  onBack: () => void;
}

export const InvoicePreviewView: React.FC<InvoicePreviewViewProps> = ({
  invoice,
  justIssued = false,
  onBack,
}) => {
  const invoiceCardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const taxRate = 0.06;
  const amountExclTax = invoice.amount / (1 + taxRate);
  const taxAmount = invoice.amount - amountExclTax;
  const unitPriceExclTax =
    invoice.totalPages > 0 ? amountExclTax / invoice.totalPages : amountExclTax;

  const formattedDate = (() => {
    const datePart = invoice.issuedAt.split(' ')[0] || '2026-05-01';
    const [y, m, d] = datePart.split('-');
    return `${y}年${m}月${d}日`;
  })();

  const handleDownloadPDF = async () => {
    if (!invoiceCardRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await toCanvas(invoiceCardRef.current, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const yOffset = Math.max(10, (pdfHeight - imgHeight) / 2);
      pdf.addImage(imgData, 'PNG', 10, yOffset, imgWidth, imgHeight);
      pdf.save(`电子发票_${invoice.invoiceNo}.pdf`);
    } catch (err) {
      console.error('Invoice PDF export error', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col h-[620px] overflow-hidden">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            返回订单列表
          </button>
          <div>
            <h4 className="text-base font-bold text-slate-900">
              电子发票详情
            </h4>
            <p className="text-xs text-slate-500 font-mono tabular-nums">
              发票号码：{invoice.invoiceNo} · 开具时间：{invoice.issuedAt}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition-colors text-sm font-medium shadow-sm whitespace-nowrap shrink-0"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              生成 PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              下载电子发票 (PDF)
            </>
          )}
        </button>
      </div>

      {/* Scrollable Invoice Canvas */}
      <div className="flex-1 overflow-y-auto pt-4 pr-1 space-y-3">
        {justIssued && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              开票申请已受理，预计将在三个工作日内开具电子发票，届时您可在此页面查看并下载。
            </span>
          </div>
        )}

        {/* Authentic Chinese Electronic Invoice Voucher */}
        <div
          ref={invoiceCardRef}
          className="bg-white border border-red-800/40 rounded p-5 text-slate-900 select-text"
        >
          {/* Invoice Top Header */}
          <div className="flex items-start justify-between pb-3 relative">
            <div className="w-44 text-xs text-red-900/80 space-y-1">
              <div>机器编号：电子开票平台</div>
              <div>状态：{invoice.status}</div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative">
              <h3 className="text-xl font-bold tracking-wider text-red-800">
                {invoice.invoiceType === 'special'
                  ? '电子发票（增值税专用发票）'
                  : '电子发票（普通发票）'}
              </h3>
              <div className="w-56 h-[2px] bg-red-800 mt-1.5" />
              <div className="w-56 h-[1px] bg-red-800 mt-0.5" />
            </div>

            <div className="w-56 text-xs text-slate-800 space-y-1 text-right font-mono tabular-nums">
              <div>
                <span className="text-red-900/80 font-sans">发票号码：</span>
                {invoice.invoiceNo}
              </div>
              <div>
                <span className="text-red-900/80 font-sans">开票日期：</span>
                {formattedDate}
              </div>
            </div>
          </div>

          {/* Main Invoice Grid */}
          <div className="border border-red-800 text-xs">
            {/* Buyer & Seller Row */}
            <div className="grid grid-cols-2 border-b border-red-800">
              {/* Buyer */}
              <div className="flex border-r border-red-800">
                <div className="w-8 shrink-0 border-r border-red-800 flex items-center justify-center text-red-900 font-medium py-3 text-center leading-tight">
                  购<br />买<br />方<br />信<br />息
                </div>
                <div className="flex-1 p-2.5 space-y-1.5 leading-snug">
                  <div>
                    <span className="text-red-900/80">名　　称：</span>
                    <span className="font-medium text-slate-900">
                      {invoice.titleName}
                    </span>
                  </div>
                  <div>
                    <span className="text-red-900/80">纳税人识别号：</span>
                    <span className="font-mono tabular-nums text-slate-900">
                      {invoice.taxId || '—（个人/非企业免填）'}
                    </span>
                  </div>
                  {(invoice.companyAddress || invoice.companyPhone) && (
                    <div>
                      <span className="text-red-900/80">地址、电话：</span>
                      <span className="text-slate-700">
                        {[invoice.companyAddress, invoice.companyPhone]
                          .filter(Boolean)
                          .join(' ')}
                      </span>
                    </div>
                  )}
                  {(invoice.bankName || invoice.bankAccount) && (
                    <div>
                      <span className="text-red-900/80">开户行及账号：</span>
                      <span className="text-slate-700 font-mono tabular-nums">
                        {[invoice.bankName, invoice.bankAccount]
                          .filter(Boolean)
                          .join(' ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Seller */}
              <div className="flex">
                <div className="w-8 shrink-0 border-r border-red-800 flex items-center justify-center text-red-900 font-medium py-3 text-center leading-tight">
                  销<br />售<br />方<br />信<br />息
                </div>
                <div className="flex-1 p-2.5 space-y-1.5 leading-snug">
                  <div>
                    <span className="text-red-900/80">名　　称：</span>
                    <span className="font-medium text-slate-900">
                      安徽国泰新点软件有限公司
                    </span>
                  </div>
                  <div>
                    <span className="text-red-900/80">纳税人识别号：</span>
                    <span className="font-mono tabular-nums text-slate-900">
                      91340100MA2W5D5208
                    </span>
                  </div>
                  <div>
                    <span className="text-red-900/80">地址、电话：</span>
                    <span className="text-slate-700">
                      安徽省合肥市高新区黄山路622号高芯光谷601室 0551-64664620
                    </span>
                  </div>
                  <div>
                    <span className="text-red-900/80">开户行及账号：</span>
                    <span className="text-slate-700 font-mono tabular-nums">
                      招商银行合肥分行创新大道支行 551907108210701
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-red-800 text-red-900">
                  <th className="py-1.5 px-2 border-r border-red-800 font-medium text-left">
                    项目名称
                  </th>
                  <th className="py-1.5 px-2 border-r border-red-800 font-medium text-left w-28">
                    规格型号
                  </th>
                  <th className="py-1.5 px-2 border-r border-red-800 font-medium text-center w-12">
                    单位
                  </th>
                  <th className="py-1.5 px-2 border-r border-red-800 font-medium text-right w-16">
                    数量
                  </th>
                  <th className="py-1.5 px-2 border-r border-red-800 font-medium text-right w-20">
                    单价
                  </th>
                  <th className="py-1.5 px-2 border-r border-red-800 font-medium text-right w-24">
                    金额
                  </th>
                  <th className="py-1.5 px-2 border-r border-red-800 font-medium text-center w-14">
                    税率
                  </th>
                  <th className="py-1.5 px-2 font-medium text-right w-20">
                    税额
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-red-800 align-top">
                  <td className="py-2.5 px-2 border-r border-red-800 text-slate-900">
                    *信息技术服务*云保标比对服务
                  </td>
                  <td className="py-2.5 px-2 border-r border-red-800 text-slate-600">
                    {invoice.orderSummary}
                  </td>
                  <td className="py-2.5 px-2 border-r border-red-800 text-center text-slate-700">
                    页
                  </td>
                  <td className="py-2.5 px-2 border-r border-red-800 text-right font-mono tabular-nums">
                    {invoice.totalPages}
                  </td>
                  <td className="py-2.5 px-2 border-r border-red-800 text-right font-mono tabular-nums">
                    {unitPriceExclTax.toFixed(4)}
                  </td>
                  <td className="py-2.5 px-2 border-r border-red-800 text-right font-mono tabular-nums">
                    {amountExclTax.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-2 border-r border-red-800 text-center font-mono tabular-nums">
                    6%
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono tabular-nums">
                    {taxAmount.toFixed(2)}
                  </td>
                </tr>
                <tr className="border-b border-red-800 bg-red-50/20 font-medium">
                  <td
                    colSpan={5}
                    className="py-1.5 px-2 border-r border-red-800 text-red-900"
                  >
                    合　计
                  </td>
                  <td className="py-1.5 px-2 border-r border-red-800 text-right font-mono tabular-nums text-slate-900">
                    ¥{amountExclTax.toFixed(2)}
                  </td>
                  <td className="py-1.5 px-2 border-r border-red-800" />
                  <td className="py-1.5 px-2 text-right font-mono tabular-nums text-slate-900">
                    ¥{taxAmount.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Total RMB */}
            <div className="flex items-center border-b border-red-800">
              <div className="w-40 shrink-0 py-2 px-2.5 border-r border-red-800 text-red-900 font-medium">
                价税合计（大写）
              </div>
              <div className="flex-1 py-2 px-3 flex items-center justify-between">
                <span className="font-semibold text-slate-900">
                  {numberToChineseRMB(invoice.amount)}
                </span>
                <span className="font-mono tabular-nums font-bold text-slate-900">
                  <span className="text-red-900 font-sans font-medium mr-1.5">
                    （小写）
                  </span>
                  ¥{invoice.amount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Remarks */}
            <div className="flex min-h-[48px]">
              <div className="w-8 shrink-0 border-r border-red-800 flex items-center justify-center text-red-900 font-medium py-2 text-center leading-tight">
                备<br />注
              </div>
              <div className="flex-1 p-2.5 text-slate-700 leading-relaxed flex items-center justify-between gap-4">
                <div>
                  {invoice.remarks || `订单号: ${invoice.orderIds.join(', ')}`}
                </div>
                <div className="shrink-0 text-right text-[11px] text-slate-500">
                  <div>开票人：系统自动开具</div>
                  <div className="text-red-700/80 font-medium mt-0.5">
                    电子发票专用章（有效）
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
