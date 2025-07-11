// src/app/models/invoice.model.ts
export interface Invoice {
    id: string;
    financeId: string;
    salesId?: string[];
    campalId?: string[];
    date: Date;
    orderDate: Date;
    shipmentDate: Date;
    city: string;
    status: string;
    amount: number;
  }
  