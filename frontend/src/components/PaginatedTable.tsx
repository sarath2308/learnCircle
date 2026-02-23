import React from "react";
import { ChevronLeft, ChevronRight, Inbox, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";

export interface Column<T> {
  header: string;
  accessor: keyof T;
  cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  rowKey: (row: T) => string;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  loadingState?: React.ReactNode;
  renderActions?: (row: T) => React.ReactNode;
  onPageChange: (page: number) => void;
}

export default function DataTable<T>({
  columns,
  data,
  page,
  pageSize,
  total,
  rowKey,
  isLoading = false,
  emptyState,
  loadingState,
  renderActions,
  onPageChange,
}: DataTableProps<T>) {
  const startIndex = (page - 1) * pageSize;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const colSpan = columns.length + 1 + (renderActions ? 1 : 0);

  return (
    <div className="w-full bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          {/* HEADER */}
          <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-16 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                #
              </TableHead>

              {columns.map((col) => (
                <TableHead
                  key={col.header}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 py-4"
                >
                  {col.header}
                </TableHead>
              ))}

              {renderActions && (
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 text-right pr-6">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <p className="text-sm font-medium">{loadingState ?? "Fetching records..."}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-600">
                    <Inbox size={40} strokeWidth={1.5} className="mb-2 opacity-20" />
                    <p className="text-sm font-semibold">{emptyState ?? "No records found"}</p>
                    <p className="text-xs">Try adjusting your filters or search terms.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow
                  key={rowKey(row)}
                  className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors border-none"
                >
                  {/* SL NO */}
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 transition-colors">
                      {startIndex + rowIndex + 1}
                    </span>
                  </TableCell>

                  {/* DATA CELLS */}
                  {columns.map((col) => (
                    <TableCell key={String(col.accessor)} className="py-4">
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {col.cell
                          ? col.cell(row)
                          : ((row[col.accessor] as React.ReactNode) ?? (
                              <span className="text-slate-300 dark:text-slate-700">—</span>
                            ))}
                      </div>
                    </TableCell>
                  ))}

                  {/* ACTIONS */}
                  {renderActions && (
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        {renderActions(row)}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-50/30 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
            Page {page} of {totalPages}
          </p>
          <p className="text-[10px] text-slate-400">
            Showing {data.length} of {total} total results
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1 || isLoading}
            onClick={() => onPageChange(page - 1)}
            className="h-8 w-8 p-0 rounded-lg dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <ChevronLeft size={16} />
          </Button>

          {/* Simple Page Indicator for Mobile */}
          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => {
              // Show limited pages if totalPages is high (Logical optimization)
              if (totalPages > 5 && Math.abs(i + 1 - page) > 1 && i !== 0 && i !== totalPages - 1)
                return null;
              return (
                <button
                  key={i}
                  onClick={() => onPageChange(i + 1)}
                  className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                    page === i + 1
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none"
                      : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages || isLoading}
            onClick={() => onPageChange(page + 1)}
            className="h-8 w-8 p-0 rounded-lg dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
