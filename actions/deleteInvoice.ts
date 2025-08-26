"use server";
import { db } from "@/lib/db";

export const deleteInvoice = async (id: string) => {
  await db.invoice.deleteMany({ where: { id: id } });
};
