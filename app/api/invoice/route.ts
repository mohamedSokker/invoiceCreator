import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();

    const {
      den,
      address,
      recievedCompany,
      recievedAdress,
      recievedZipCode,
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

    if (!session?.user?.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const stringItems = JSON.stringify(items);

    const invoice = await db.invoice.create({
      data: {
        userId: session?.user.id,
        den,
        address,
        recievedCompany,
        recievedAdress,
        recievedZipCode,
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

export async function GET(req: Request) {
  try {
    const invoices = await db.invoice.findMany();

    return NextResponse.json(invoices);
  } catch (error) {
    console.log("[INVOICES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
