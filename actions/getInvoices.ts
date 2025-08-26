"use server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getInvoices = async () => {
  const session = await auth();
  const invoices = await db.invoice.findMany({
    where: { userId: session?.user.id },
  });
  return invoices;
};
