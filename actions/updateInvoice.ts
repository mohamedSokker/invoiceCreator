"use server";

import { db } from "@/lib/db";

interface Invoice {
  den: Date;
  address: string;
  recievedCompany: string;
  recievedAdress: string;
  recievedZipCode: string;
  invoiceDate: Date;
  dueDate: Date;
  Kundennummer: string;
  invoiceRef: string;
  invoiceNo: string;
  zeitraum: string;
  objekt: string;
  taxes: number;
  name: string;
  email: string;
  items: {
    id: number;
    name: string;
    date: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

export const updateInvoice = async (data: Invoice, id: string) => {
  await db.invoice.updateMany({
    where: { id },
    data: {
      ...data,
      items: JSON.stringify(data.items),
    },
  });
};
