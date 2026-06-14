"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon, RotateCcwIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  placeholder?: string;
  onBulkDelete?: (ids: string[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  placeholder = "Search...",
  onBulkDelete,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pageSize, setPageSize] = React.useState(10);
  const [pageIndex, setPageIndex] = React.useState(0);

  const filteredData = React.useMemo(() => {
    if (!globalFilter) return data;
    const q = globalFilter.toLowerCase();
    return data.filter((item) => {
      const value = (item as Record<string, unknown>)[searchKey];
      return String(value ?? "")
        .toLowerCase()
        .includes(q);
    });
  }, [data, globalFilter, searchKey]);

  const pageCount = Math.ceil(filteredData.length / pageSize);

  const safePageIndex = Math.min(pageIndex, Math.max(0, pageCount - 1));

  const paginatedData = React.useMemo(() => {
    const start = safePageIndex * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, safePageIndex, pageSize]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: pageCount,
    rowCount: filteredData.length,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
      pagination: { pageIndex: safePageIndex, pageSize },
    },
    enableRowSelection: true,
    enableMultiRowSelection: true,
    getRowId: (row) => (row as any).id,
  });

  const getSelectedIds = () => {
    const selectedRows = table.getSelectedRowModel().flatRows;
    return selectedRows
      .map((row) => row.original as any)
      .map((item) => item.id);
  };

  const handleBulkDelete = () => {
    if (onBulkDelete) {
      const selectedIds = getSelectedIds();
      if (selectedIds.length > 0) {
        onBulkDelete(selectedIds);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholder={placeholder}
            value={globalFilter ?? ""}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
            }}
            className="h-9 w-full md:w-80 lg:w-80"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1"
              onClick={() => {
                setGlobalFilter("");
                setPageIndex(0);
              }}
            >
              <RotateCcwIcon className="h-3.5 w-3.5" />
              <span className="sr-only">Reset</span>
            </Button>
            {onBulkDelete &&
              table.getSelectedRowModel().flatRows.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-9"
                  onClick={handleBulkDelete}
                >
                  Delete Selected
                </Button>
              )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPageIndex(0);
            }}
          >
            <SelectTrigger className="h-9 w-20">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 15, 20, 25, 30].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {filteredData.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              disabled={safePageIndex <= 0}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex((p) => p + 1)}
              disabled={safePageIndex >= pageCount - 1}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center text-sm font-medium">
            Page {safePageIndex + 1} of {pageCount || 1}
          </div>
        </div>
      </div>
    </div>
  );
}
