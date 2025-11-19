"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PaginatedTableProps {
  headers: string[];
  data: Record<string, any>[];
  renderActions?: (row: Record<string, any>) => React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export function PaginatedTable({
  headers,
  data,
  renderActions,
  isLoading = false,
  className,
}: PaginatedTableProps) {
  return (
    <div className={`w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 ${className || ""}`}>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
            {headers.map((header) => (
              <TableHead
                key={header}
                className="text-gray-900 dark:text-gray-100 font-semibold text-sm"
              >
                {header}
              </TableHead>
            ))}
            {renderActions && (
              <TableHead className="text-gray-900 dark:text-gray-100 font-semibold text-sm">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={headers.length + (renderActions ? 1 : 0)}
                className="h-24 text-center"
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 dark:border-blue-400"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Loading...
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : data.length > 0 ? (
            data.map((row, idx) => (
              <TableRow
                key={row.id || idx}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
              >
                {headers.map((header) => (
                  <TableCell
                    key={header}
                    className="text-gray-800 dark:text-gray-200"
                  >
                    {row[header] ?? "-"}
                  </TableCell>
                ))}
                {renderActions && (
                  <TableCell className="text-gray-800 dark:text-gray-200">
                    {renderActions(row)}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={headers.length + (renderActions ? 1 : 0)}
                className="h-32 text-center"
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl w-16 h-16" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    No data available
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}