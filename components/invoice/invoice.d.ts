export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE"; // adjust if your enum differs

export type Invoice = {
  id: string;
  userId: string;
  clientId?: string | null;

  title: string;

  paymentUpiId?: string | null;
  includeQrCode: boolean;

  invoiceNumber: string;
  status: InvoiceStatus;

  issueDate: string | Date;
  dueDate: string | Date;

  senderCompany?: string | null;
  senderGSTIN?: string | null;
  senderLogoUrl?: string | null;
  senderName: string;
  senderAddress?: string | null;
  senderCity?: string | null;
  senderState?: string | null;
  senderZip?: string | null;
  senderCountry?: string | null;

  clientCompany?: string | null;
  clientGSTIN?: string | null;
  clientName: string;
  clientAddress?: string | null;
  clientCity?: string | null;
  clientState?: string | null;
  clientZip?: string | null;
  clientCountry?: string | null;

  subTotal: number;
  taxTotal: number;
  totalAmount: number;

  paymentMethod?: string | null;
  bankName?: string | null;
  accountNumber?: string | null;
  ifscCode?: string | null;

  notesTitle: string;
  notes?: string | null;

  termsTitle: string;
  terms?: string | null;

  tableDescLabel: string;
  tableQtyLabel: string;
  tableRateLabel: string;
  tableTaxLabel: string;
  tableAmountLabel: string;

  createdAt: string | Date;
  updatedAt: string | Date;

  items: InvoiceItem[];

  // relations (optional if you don’t always include them)
  user?: User;
  client?: Client | null;
};

export type InvoiceItem = {
  id: string;
  invoiceId: string;

  description: string;
  quantity: number;
  rate: number;
  taxRate: number;

  amount: number;

  hsn?: string | null;
};