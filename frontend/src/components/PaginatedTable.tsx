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
}

export function PaginatedTable({
  headers,
  data,
  renderActions,
  isLoading = false,
}: PaginatedTableProps) {
  return (
    <div className="w-full space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
            {renderActions && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={headers.length + (renderActions ? 1 : 0)}
                className="text-center py-6 text-sm text-muted-foreground"
              >
                Loading...
              </TableCell>
            </TableRow>
          ) : data.length > 0 ? (
            data.map((row, idx) => (
              <TableRow key={idx}>
                {headers.map((header) => (
                  <TableCell key={header}>{row[header]}</TableCell>
                ))}
                {renderActions && <TableCell>{renderActions(row)}</TableCell>}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={headers.length + (renderActions ? 1 : 0)}
                className="text-center py-6 text-sm text-muted-foreground"
              >
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
