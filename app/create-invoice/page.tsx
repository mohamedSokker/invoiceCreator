import React from "react";
import { InvoiceForm } from "./components/invoice-form";

const CreateInvoice = () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <InvoiceForm />
      </div>
    </div>
  );
};

export default CreateInvoice;
