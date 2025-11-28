"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  RotateCcwIcon,
} from "lucide-react";

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

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    onPaginationChange: setPagination,
    state: {
      rowSelection,
      globalFilter,
      pagination,
    },
    enableRowSelection: true,
    enableMultiRowSelection: true,
    getRowId: (row) => (row as any).id,
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
    autoResetPageIndex: false,
  });

  // Function to get selected row IDs
  const getSelectedIds = () => {
    const selectedRows = table.getSelectedRowModel().flatRows;
    return selectedRows.map(row => row.original as any).map(item => item.id);
  };

  const handleBulkDelete = () => {
    if (onBulkDelete) {
      const selectedIds = getSelectedIds();
      if (selectedIds.length > 0) {
        onBulkDelete(selectedIds);
        // Don't reset selections automatically - let user decide
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
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-9 w-full md:w-80 lg:w-80"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1"
              onClick={() => {
                setGlobalFilter("");
                table.setPageIndex(0);
              }}
            >
              <RotateCcwIcon className="h-3.5 w-3.5" />
              <span className="sr-only">Reset</span>
            </Button>
            {onBulkDelete && table.getSelectedRowModel().flatRows.length > 0 && (
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
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-9 w-20">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 15, 20, 25, 30].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
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
                            header.getContext()
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
                        cell.getContext()
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
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
        </div>
      </div>
    </div>
  );
}