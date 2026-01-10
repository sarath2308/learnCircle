import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export interface Column<T> {
  header: string;                 // UI label
  accessor: keyof T;              // data key
  cell?: (value: T[keyof T], row: T) => React.ReactNode;
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
  const totalPages = Math.ceil(total / pageSize);

  const colSpan =
    columns.length + 1 + (renderActions ? 1 : 0); // +1 for SL No

  return (
    <div className="w-full rounded-lg border overflow-hidden dark:border-white">
      <Table className="min-w-full dark:text-white">
        {/* HEADER */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center">#</TableHead>

            {columns.map((col) => (
              <TableHead key={col.header}>{col.header}</TableHead>
            ))}

            {renderActions && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>

        {/* BODY */}
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={colSpan} className="h-24 text-center ">
                {loadingState ?? "Loading..."}
              </TableCell>
            </TableRow>
          )}

          {!isLoading && data.length === 0 && (
            <TableRow>
              <TableCell colSpan={colSpan} className="h-32 text-center">
                {emptyState ?? "No data found"}
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            data.map((row, rowIndex) => (
              <TableRow key={rowKey(row)}>
                {/* SL NO */}
                <TableCell className="text-center font-medium dark:text-white">
                  {startIndex + rowIndex + 1}
                </TableCell>

                {/* DATA CELLS */}
                {columns.map((col) => (
                  <TableCell key={String(col.accessor)} className="dark:text-white">
                    {col.cell
                      ? col.cell(row[col.accessor], row)
                      : (row[col.accessor] as React.ReactNode) ?? "-"}
                  </TableCell>    
                ))}

                {/* ACTIONS */}
                {renderActions && (
                  <TableCell>{renderActions(row)}</TableCell>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {/* PAGINATION */}
      <div className="flex items-center justify-between px-4 py-3 border-t dark:text-white">
        <span className="text-sm text-gray-600 dark:text-white">
          Page {page} of {totalPages}
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
