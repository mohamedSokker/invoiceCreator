import Header from "@/components/header/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ViewCard from "@/components/view-card";
import { db } from "@/lib/db";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function Home() {
  const invoices = await db.invoice.findMany();

  return (
    <div className="w-full p-4">
      <Header />
      <div className="p-6 w-full h-full grid md:grid-cols-3 lg:grid-cols-3 sm:grid-cols-1 gap-6">
        {invoices.map((invoice) => (
          <Card key={invoice.id}>
            <CardHeader>
              <CardTitle>{invoice.name}</CardTitle>
              <CardDescription>{`Invoice Date: ${format(
                invoice.invoiceDate,
                "yyyy-MM-dd"
              )}`}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 w-full">
                <p className="w-full">{`Customer: ${invoice.Kundennummer}`}</p>
                <p className="w-full">{`Invoice No: ${invoice.invoiceNo}`}</p>
                <p className="w-full">{`Invoice Ref: ${invoice.invoiceRef}`}</p>
              </div>
            </CardContent>
            <CardFooter>
              <ViewCard id={invoice.id} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
