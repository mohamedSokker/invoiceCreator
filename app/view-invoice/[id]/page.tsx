import Image from "next/image";
import { db } from "@/lib/db";
import { format } from "date-fns";

import m2a from "../../../public/m2a.png";
import "./style.css";

interface Items {
  id: number;
  name: string;
  date: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const ViewInvoice = async ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const invoice = await db.invoice.findFirst({ where: { id: id } });
  const items: Items[] = JSON.parse(invoice?.items as string);
  const totalNet = items.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const totalTax = totalNet * ((invoice?.taxes as number) / 100);
  const finalAmount = totalNet * ((invoice?.taxes as number) / 100) + totalNet;
  return (
    <div className="w-full p-4 flex flex-col">
      <div className="w-full flex flex-row justify-end items-center">
        <Image src={m2a} alt="m2a" width={150} height={150} />
      </div>
      <div className="flex flex-col items-start justify-center mb-16">
        <p className="font-bold">M2A Bürgermeister-Smidt-Straße 116, 28195</p>
        <p className="font-bold">Bremen, </p>
        <p>{invoice?.address}</p>
      </div>
      <div className="w-full flex flex-row pr-32 justify-end items-center mb-8">
        <p className="font-bold">
          {`Bremen, den `}
          <span className="font-medium">
            {format(invoice?.den as Date, "dd.MM.yyyy")}
          </span>
        </p>
      </div>
      <div className="w-full flex flex-row items-start justify-start gap-8">
        <div className="w-full flex flex-col items-start justify-start gap-8">
          <div className="w-full flex flex-row items-start justify-start gap-8">
            <div className="flex flex-col gap-2">
              <p className="font-bold">
                {`Invoice Date `}
                <span className="font-medium">
                  {format(invoice?.invoiceDate as Date, "dd/MM/yyyy")}
                </span>
              </p>

              <p className="font-bold">
                {`Due Date `}
                <span className="font-medium">
                  {format(invoice?.dueDate as Date, "dd/MM/yyyy")}
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-bold">
                {`Kundennummer `}
                <span className="font-medium">{invoice?.Kundennummer}</span>
              </p>
              <p className="font-bold">
                {`Invoice Ref. PO `}
                <span className="font-medium">{invoice?.invoiceRef}</span>
              </p>
            </div>
          </div>
          <div className="w-full">
            <p className="font-bold">
              {`Invoice Nr.`}
              <span className="font-medium">{invoice?.invoiceNo}</span>
            </p>
          </div>
        </div>
        <div className="min-w-[250px] flex flex-col">
          <p>Bankverbindung</p>
          <p>Qonto</p>
          <p>BIC QNTODEB2XXX</p>
          <p>IBAN</p>
          <p>DE29 1001 0123 0013 3724 42</p>
        </div>
      </div>
      <div className="w-full">
        <table aria-describedby="tbl-caption">
          <caption id="tbl-caption">Positionsübersicht</caption>
          <thead>
            <tr>
              <th scope="col">Bezeichnung</th>
              <th scope="col"></th>
              <th scope="col" className="num">
                Menge
              </th>
              <th scope="col">ME</th>
              <th scope="col" className="num">
                Preis (EUR)
              </th>
              <th scope="col" className="num">
                Wert (EUR)
              </th>
              <th scope="col" className="num"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Zeitraum:</td>
              <td className="num">{invoice?.zeitraum}</td>
              <td className="num"></td>
              <td></td>
              <td className="num"></td>
              <td className="num"></td>
              <td className="num"></td>
            </tr>
            <tr>
              <td>Objekt:</td>
              <td className="num">{invoice?.objekt}</td>
              <td className="num"></td>
              <td></td>
              <td className="num"></td>
              <td className="num"></td>
              <td className="num">
                <div className="flex flex-col">
                  <p>Ihr Gesprächspartner</p>
                  <p>{invoice?.name}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td></td>
              <td className="num"></td>
              <td className="num"></td>
              <td></td>
              <td className="num"></td>
              <td className="num"></td>
              <td className="num">
                <div className="flex flex-col">
                  <p>Bürgermeister-Smidt-Straße 116</p>
                </div>
              </td>
            </tr>
            <tr>
              <td></td>
              <td className="num"></td>
              <td className="num"></td>
              <td></td>
              <td className="num"></td>
              <td className="num"></td>
              <td className="num">
                <div className="flex flex-col">
                  <p>28195 Bremen</p>
                </div>
              </td>
            </tr>
            <tr>
              <td className="num" colSpan={2}>
                We charge you according to the service contract as follows:
              </td>
              <td></td>
              <td></td>
              <td className="num"></td>
              <td className="num"></td>
              <td className="num">{invoice?.email}</td>
            </tr>
            <tr>
              <td className="num"></td>
              <td className="num"></td>
              <td></td>
              <td></td>
              <td className="num"></td>
              <td className="num"></td>
              <td className="num">Tel : +49 (0)421 989 660 24</td>
            </tr>
            {items.map((item) => (
              <tr key={item?.id}>
                <td className="num">{item.name}</td>
                <td className="num">{item.date}</td>
                <td>{item.quantity}</td>
                <td></td>
                <td className="num">{item.unitPrice}</td>
                <td className="num">{item.totalPrice}</td>
                <td className="num"></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th className="num"></th>
              <th className="num"></th>
              <th className="num muted"></th>
              <th className="muted"></th>
              <th className="num muted"></th>
              <th className="num"></th>
              <th className="num">Gesellschafterin</th>
            </tr>
            <tr>
              <th className="num">Total net positions</th>
              <th className="num"></th>
              <th className="num muted"></th>
              <th className="muted"></th>
              <th className="num muted"></th>
              <th className="num">{totalNet}</th>
              <th className="num">M2A Facility Management GmbH</th>
            </tr>
            <tr>
              <th className="num">MwSt:</th>
              <th className="num">{`${invoice?.taxes}%`}</th>
              <th className="num muted"></th>
              <th className="muted"></th>
              <th className="num muted"></th>
              <th className="num">{totalTax}</th>
              <th className="num">
                <div className="flex flex-col">
                  <p>HRB 40419</p>
                  <p>Ust-ID DE369257816</p>
                </div>
              </th>
            </tr>
            <tr>
              <th className="num">final amount</th>
              <th className="num">{``}</th>
              <th className="num muted"></th>
              <th className="muted"></th>
              <th className="num muted"></th>
              <th className="num">{finalAmount}</th>
              <th className="num"></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ViewInvoice;
