"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Selection,
  Inject,
  Edit,
  Toolbar,
  Sort,
  Filter,
  Search,
  Resize,
  ContextMenu,
  ExcelExport,
  PdfExport,
  type GridComponent as GridInstance,
  type RowSelectEventArgs,
} from "@syncfusion/ej2-react-grids";
import type { ClickEventArgs as ToolbarClickEventArgs } from "@syncfusion/ej2-react-navigations";

import Spinner from "@/components/spinner";
import { getInvoices } from "@/actions/getInvoices";

import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-calendars/styles/material.css";
import "@syncfusion/ej2-dropdowns/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-splitbuttons/styles/material.css";
import "@syncfusion/ej2-react-grids/styles/material.css";

// import "@syncfusion/ej2/tailwind.css";

// import "./style.css";

const EditTables = () => {
  // ✅ keep grid ref stable using useRef
  const gridRef = useRef<GridInstance | null>(null);

  interface TableData {
    [key: string]: any;
  }

  interface TableGridColumn {
    field: string;
    headerText: string;
    width: string;
    textAlign: string;
  }

  const [tableData, setTableData] = useState<TableData[]>([]);
  const [tableGrid, setTableGrid] = useState<TableGridColumn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRow, setSelectedRow] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number[]>([]);

  // ✅ toolbar click handler with proper typing & stable reference
  const toolbarClick = useCallback((args: ToolbarClickEventArgs): void => {
    const grid = gridRef.current;
    if (grid) {
      if (args.item.text === "PDF Export") {
        grid.pdfExport();
      } else if (args.item.text === "Excel Export") {
        grid.excelExport();
      }
    }
  }, []);

  // ✅ row select handler with correct args type
  const rowsSelected = useCallback((args: RowSelectEventArgs): void => {
    const grid = gridRef.current;
    if (grid) {
      const selectedrowindex = grid.getSelectedRowIndexes();
      const selectedrecords = grid.getSelectedRecords();
      setSelectedIndex(selectedrowindex);
      setSelectedRow(JSON.stringify(selectedrecords));
    }
  }, []);

  // ✅ fetch invoices data
  const getData = async () => {
    try {
      setLoading(true);
      const data = await getInvoices();
      console.log(data);
      setTableData(data);

      // auto-generate columns
      if (data && data[0]) {
        const cols: TableGridColumn[] = Object.keys(data[0]).map((item) => ({
          field: item,
          headerText: item,
          width: "200",
          minWidth: "150",
          textAlign: "Center",
        }));
        setTableGrid(cols);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const filterOptions = { ignoreAccent: true, type: "Menu" as const };

  if (loading) return <Spinner message={`Loading Invoices Data`} />;

  return (
    <div className="w-full p-2 md:p-10 bg-white rounded-xl h-full">
      <div className="flex flex-row items-center justify-between Header mb-10">
        <div className="dark:text-white">
          {/* <p className="text-gray-400">Table</p> */}
          <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Invoices
          </p>
        </div>
      </div>

      {tableData.length > 0 && tableGrid.length > 0 && (
        <GridComponent
          dataSource={tableData}
          allowPaging
          allowSorting
          allowFiltering
          filterSettings={filterOptions}
          allowResizing
          pageSettings={{ pageSize: 7 }}
          //   rowSelected={rowsSelected}
          enableAutoFill
          ref={gridRef}
          toolbar={["ExcelExport", "PdfExport", "Search"]}
          //   toolbarClick={toolbarClick}
          allowExcelExport
          allowPdfExport
        >
          <ColumnsDirective>
            {tableGrid.map((item, index) => (
              <ColumnDirective key={index} {...item} />
            ))}
          </ColumnsDirective>
          <Inject
            services={[
              Page,
              Toolbar,
              Selection,
              Edit,
              Sort,
              Filter,
              Search,
              Resize,
              ContextMenu,
              ExcelExport,
              PdfExport,
            ]}
          />
        </GridComponent>
      )}
    </div>
  );
};

export default EditTables;
