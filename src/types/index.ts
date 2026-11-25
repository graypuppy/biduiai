import { ReactNode } from 'react';

export type SubFileCategory = 'credit' | 'tech' | 'economic' | 'other';

export type SubFile = {
  id: string;
  name: string;
  category: SubFileCategory;
};

export type FileItem = { 
  id: string; 
  name: string; 
  size: number; 
  pages?: number;
  status: '未比对' | '比对中' | '已完成';
  supportedTypes?: string[];
  subFiles?: SubFile[];
  risks?: {
    credit: number;
    tech: number;
    economic: number;
    device: number;
  }
};

export type Notification = {
  id: number;
  type: string;
  title: string;
  content: string;
  time: string;
  read: boolean;
};

export type Template = {
  id: string;
  name: string;
  desc: string;
  config: {
    types: string[];
    credit: string[];
    tech: string[];
    economic: string[];
    device: string[];
    sentenceThreshold: number;
    riskThreshold: number;
    filterBiddingDoc: boolean;
    excludeTableHeaders: boolean;
    excludeTableTitles: boolean;
    techCompareMethod?: 'semantic' | 'text';
  };
};

export type PageType = 'home' | 'project' | 'comparing' | 'report' | 'history' | 'rules' | 'news';

export type PdfPreviewState = {
  isOpen: boolean;
  fileName: string;
  internalFile?: string;
  value: string;
  type: string;
  contentType?: 'text' | 'image' | 'table' | 'sensitive';
  duplicates?: { fileName: string; internalFile?: string; value: string; occurrencesCount?: number }[];
  item?: any;
  occurrencesCount?: number;
};

export type InvoiceType = 'normal' | 'special';
export type InvoiceTitleType = 'enterprise' | 'personal';

export type InvoiceTitlePreset = {
  id: string;
  titleType: InvoiceTitleType;
  titleName: string;
  taxId?: string;
  bankName?: string;
  bankAccount?: string;
  companyAddress?: string;
  companyPhone?: string;
};

export type InvoiceRecord = {
  id: string;
  invoiceNo: string;
  orderIds: string[];
  orderSummary: string;
  totalPages: number;
  amount: number;
  invoiceType: InvoiceType;
  titleType: InvoiceTitleType;
  titleName: string;
  taxId?: string;
  bankName?: string;
  bankAccount?: string;
  companyAddress?: string;
  companyPhone?: string;
  remarks?: string;
  issuedAt: string;
  status: '已开具';
};

export type RechargeOrder = {
  id: string;
  time: string;
  title: string;
  unitPriceDesc: string;
  pages: number;
  amount: number;
  paymentMethod: string;
  invoiceStatus: 'unbilled' | 'issued';
  invoiceId?: string;
};

