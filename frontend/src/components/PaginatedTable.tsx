"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface PaginatedTableProps {
  headers: string[];
  data: Record<string, any>[];
  rowsPerPage?: number;
  renderActions?: (row: Record<string, any>) => React.ReactNode;
}

export function PaginatedTable({
  headers,
  data,
  rowsPerPage = 5,
  renderActions,
}: PaginatedTableProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const start = (page - 1) * rowsPerPage;
  const currentData = data.slice(start, start + rowsPerPage);

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
          {currentData.map((row, idx) => (
            <TableRow key={idx}>
              {headers.map((header) => (
                <TableCell key={header}>{row[header]}</TableCell>
              ))}

              {renderActions && <TableCell>{renderActions(row)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-2">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </Button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
