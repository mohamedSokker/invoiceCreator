import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      den,
      address,
      invoiceDate,
      dueDate,
      Kundennummer,
      invoiceRef,
      invoiceNo,
      zeitraum,
      objekt,
      taxes,
      name,
      email,
      items,
    } = body;

    const stringItems = JSON.stringify(items);

    const invoice = await db.invoice.create({
      data: {
        den,
        address,
        invoiceDate,
        dueDate,
        Kundennummer,
        invoiceRef,
        invoiceNo,
        zeitraum,
        objekt,
        taxes,
        name,
        email,
        items: stringItems,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.log("[INVOICE_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
