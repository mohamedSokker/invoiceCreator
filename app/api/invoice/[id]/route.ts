import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return new NextResponse("id is required", { status: 400 });
    }

    const invoice = await db.invoice.findUnique({
      where: {
        id: id,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.log("[INVOICE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const body = await req.json();

    const resolvedParams = await params;
    const { id } = resolvedParams;

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

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!id) {
      return new NextResponse("id is required", { status: 400 });
    }

    const invoice = await db.invoice.updateMany({
      where: {
        id: id,
      },
      data: {
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
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.log("[INVOICE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!session?.user?.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!id) {
      return new NextResponse("id is required", { status: 400 });
    }

    const invoice = await db.invoice.deleteMany({
      where: {
        id: id,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.log("INVOICE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
