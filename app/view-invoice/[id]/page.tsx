import Image from "next/image";
import { db } from "@/lib/db";
import { format } from "date-fns";

import m2a from "../../../public/m2a.png";
import "./style.css";
import { formatter } from "@/lib/utils";

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
    <div className="w-full min-h-[100dvh] p-4 flex flex-col text-[18px] relative">
      <div className="w-full flex flex-row justify-end items-center">
        <div className="w-full flex flex-row items-start justify-start">
          <div className="w-full flex flex-col items-start">
            <div className="flex flex-row items-start justify-start mb-4">
              <p className="text-[14px]">{`M2A Bürgermeister-Smidt-Straße 116, 28195 Bermen`}</p>
            </div>
            <div className="w-full flex flex-col items-start justify-center mb-16 text-[20px] pl-3">
              <p className="">{invoice?.recievedCompany}</p>
              <p className="">{invoice?.recievedAdress}</p>
              <p className="">{`${invoice?.recievedZipCode}`}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <Image src={m2a} alt="m2a" width={250} height={250} />
          <p>Facility Management</p>
          <p>Qualitätscontrolling</p>
          <p>Outsourcing</p>
          <p>Gebäudetechnik</p>
          <p>Gebäudereinigung</p>
          <p>Garten- & Landschaftspflege</p>
          <p>Consulting & Management</p>
        </div>
      </div>

      {/* <div className="flex flex-col items-start justify-center mb-16">
        <p className="font-bold">M2A Bürgermeister-Smidt-Straße 116, 28195</p>
        <p className="font-bold">Bremen, </p>
        <p>{invoice?.address}</p>
      </div> */}
      <div className="w-full flex flex-row justify-end pr-[270px] items-center mb-8 text-[18px]">
        <p className="">
          {`Bremen, den `}
          <span className="">{format(invoice?.den as Date, "dd.MM.yyyy")}</span>
        </p>
      </div>
      <div className="w-full flex flex-row items-start justify-start gap-8">
        <div className="w-full flex flex-col items-start justify-start gap-8 pl-3">
          <div className="w-[75%] flex flex-row items-start justify-start gap-8 bg-gray-100 pl-2 py-2">
            <div className="flex flex-col gap-2 ">
              <p className="font-bold">
                {`Invoice Date `}
                <span className="font-normal">
                  {format(invoice?.invoiceDate as Date, "dd/MM/yyyy")}
                </span>
              </p>

              <p className="font-bold">
                {`Due Date `}
                <span className="font-normal">
                  {format(invoice?.dueDate as Date, "dd/MM/yyyy")}
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-2 ">
              <p className="font-bold">
                {`Kundennummer `}
                <span className="font-normal">{invoice?.Kundennummer}</span>
              </p>
              <p className="font-bold">
                {`Invoice Ref. PO `}
                <span className="font-normal">{invoice?.invoiceRef}</span>
              </p>
            </div>
          </div>
          <div className="w-full">
            <p className="font-bold">
              {`Invoice Nr. `}
              <span className="font-bold">{invoice?.invoiceNo}</span>
            </p>
          </div>
        </div>

        <div className="pt-12">
          <div className="min-w-[270px] flex flex-col bg-gray-100 p-2 pt-12 border border-gray-400">
            <p className="font-bold">Bankverbindung</p>
            <p>Qonto</p>
            <p className="font-bold">
              BIC <span className="font-normal">QNTODEB2XXX</span>
            </p>
            <p className="font-bold">IBAN</p>
            <p>DE29 1001 0123 0013 3724 42</p>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-1">
        <table aria-describedby="tbl-caption">
          {/* <caption id="tbl-caption">Positionsübersicht</caption> */}
          <thead>
            <tr>
              <th className="border-b-2 border-black w-[100px]" scope="col">
                Bezeichnung
              </th>
              <th className="border-b-2 border-black" scope="col"></th>
              <th className="border-b-2 border-black" scope="col">
                ME
              </th>
              <th className="num border-b-2 border-black" scope="col">
                Preis (EUR)
              </th>
              <th className="num border-b-2 border-black" scope="col">
                Wert (EUR)
              </th>
              <th scope="col" className="num"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Zeitraum:</td>
              <td className="num">{invoice?.zeitraum}</td>
              <td></td>
              <td className="num"></td>
              <td className="num"></td>
              <td className="num"></td>
            </tr>
            <tr>
              <td>Objekt:</td>
              <td className="num">{invoice?.objekt}</td>
              <td></td>
              <td className="num"></td>
              <td className="num"></td>
              <td className="num ">
                {/* <div className="flex flex-col px-2 pt-2">
                  <p>Ihr Gesprächspartner</p>
                  <p>{invoice?.name}</p>
                  <p>Bürgermeister-Smidt-Straße 116</p>
                  <p>28195 Bremen</p>
                  <p className="">{`${invoice?.email}`}</p>
                  <p className="">Tel : +49 (0)421 989 660 24</p>
                </div> */}
              </td>
            </tr>
            <tr>
              <td className="num" colSpan={2}>
                We charge you according to the service contract as follows:
              </td>
              <td className="num"></td>
              <td className="num"></td>
              <td className="num"></td>
              <td className="num  ">
                <div className="flex flex-col px-2 pt-2">
                  <p>Ihr Gesprächspartner</p>
                  <p>{invoice?.name}</p>
                  <p>Bürgermeister-Smidt-Straße 116</p>
                  <p>28195 Bremen</p>
                  <p className="">{`${invoice?.email}`}</p>
                  <p className="">Tel : +49 (0)421 989 660 24</p>
                </div>
                {/* <div className="flex flex-col px-2">
                  <p>Bürgermeister-Smidt-Straße 116</p>
                </div> */}
              </td>
            </tr>
            <tr>
              <td></td>
              <td className="num"></td>
              <td></td>
              <td className="num"></td>
              <td className="num"></td>
              <td className="num ">
                {/* <div className="flex flex-col px-2">
                  <p>28195 Bremen</p>
                </div> */}
              </td>
            </tr>
            <tr>
              <td className="num" colSpan={2}></td>
              <td></td>
              <td className="num"></td>
              <td className="num"></td>
              <td className="num  px-2">
                {/* <p className="pl-2">{`${invoice?.email}`}</p> */}
              </td>
            </tr>
            <tr>
              <td className="num"></td>
              <td className="num"></td>
              <td></td>
              <td className="num"></td>
              <td className="num"></td>
              <td className="num px-2 pb-2">
                {/* <p className="pl-2">Tel : +49 (0)421 989 660 24</p> */}
              </td>
            </tr>
            {items.map((item) => (
              <tr key={item?.id}>
                <td className="num" colSpan={2}>
                  {item.name}
                </td>
                <td>{formatter.format(item.quantity)}</td>
                <td className="num">{formatter.format(item.unitPrice)}</td>
                <td className="num">{formatter.format(item.totalPrice)}</td>
                <td className="num">
                  {/* {item.id === items[items.length - 1].id && (
                    <div className="flex flex-col px-2 pt-2">
                      <p>Ihr Gesprächspartner</p>
                      <p>{invoice?.name}</p>
                      <p>Bürgermeister-Smidt-Straße 116</p>
                      <p>28195 Bremen</p>
                      <p className="">{`${invoice?.email}`}</p>
                      <p className="">Tel : +49 (0)421 989 660 24</p>
                    </div>
                  )} */}
                </td>
              </tr>
            ))}
            <tr>
              <td className="num"></td>
              <td className="num"></td>
              <td></td>
              <td className="num"></td>
              <td className="num"></td>
              <td className="num bg-gray-100 px-2 pt-2 font-bold">
                Gesellschafterin4
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th className="num border-t-2 border-black">
                Total net positions
              </th>
              <th className="num border-t-2 border-black"></th>
              <th className="muted border-t-2 border-black"></th>
              <th className="num muted border-t-2 border-black"></th>
              <th className="num border-t-2 border-black">
                {formatter.format(totalNet)}
              </th>
              <th className="num bg-gray-100 px-2 font-normal">
                <p className="font-normal">M2A Facility Management GmbH</p>
              </th>
            </tr>
            <tr>
              <th className="num">{`MwSt: ${invoice?.taxes}%`}</th>
              <th className="num">{}</th>
              <th className="muted"></th>
              <th className="num muted"></th>
              <th className="num">{formatter.format(totalTax)}</th>
              <th className="num bg-gray-100">
                <div className="flex flex-col pb-2 w-full">
                  <p className="bg-gray-100 w-full font-normal">HRB 40419</p>
                  <p className="bg-gray-100 w-full font-normal">
                    Ust-ID DE369257816
                  </p>
                </div>
              </th>
            </tr>
            <tr>
              <th className="num">final amount</th>
              <th className="num">{``}</th>
              <th className="muted"></th>
              <th className="num muted"></th>
              <th className="num">{formatter.format(finalAmount)}</th>
              <th className="num"></th>
            </tr>
            <tr>
              <th className="num pt-6" colSpan={3}>
                Zahlbar innerhalb von 60 Tagen ohne Skontoabzug
              </th>
              {/* <th className="num"></th> */}
              {/* <th className="muted"></th> */}
              <th className="num muted"></th>
              <th className="num"></th>
              <th className="num"></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ViewInvoice;
