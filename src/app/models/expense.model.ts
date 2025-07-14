export interface Expense {
    id?: string;
    date: string;
    employeeName: string;
    position: string;
    expenseType: string;
    amount: number;
    paymentMethod: string;
    description?: string;
    receiptUrl?: string;
    companyId?: string; // Added CompanyId
    honeyCombId?: string; // Added HoneyCombId
  }
  