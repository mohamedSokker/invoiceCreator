import React from "react";
import { InvoiceForm } from "./components/invoice-form";
import { db } from "@/lib/db";

const EditInvoice = async ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const invoice = await db.invoice.findUnique({ where: { id: id } });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <InvoiceForm initialData={invoice} />
      </div>
    </div>
  );
};

export default EditInvoice;
