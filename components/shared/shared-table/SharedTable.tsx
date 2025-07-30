/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button, Checkbox } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";

interface ActionProps {
  path?: string;
  fieldName?: string;
  icon?: React.ReactNode;
  onClick?: (id: string) => void;
}

interface BulkActionProps {
  fieldName: string;
  onClick: (selectedIds: string[]) => void;
}

interface SharedTableProps {
  thData: string[];
  mainData: any[];
  dataFields: string[];
  viewAction?: ActionProps;
  editAction?: ActionProps;
  deleteAction?: ActionProps;
  bulkAction?: BulkActionProps;
  onBulkAction?: (selectedIds: string[]) => void;
  onDelete?: (id: string) => void;
}

export default function SharedTable({
  thData,
  mainData,
  dataFields,
  viewAction,
  editAction,
  deleteAction,
  bulkAction,
  onBulkAction,
  onDelete,
}: SharedTableProps) {
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);

  // Handle individual row selection
  const handleRowSelect = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Handle select all rows
  const handleSelectAll = () => {
    if (selectedRows.length === mainData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(
        mainData.map((item) => item[bulkAction?.fieldName || ""])
      );
    }
  };

  // Call bulk action function if provided
  React.useEffect(() => {
    if (bulkAction && onBulkAction) {
      onBulkAction(selectedRows);
    }
  }, [selectedRows, bulkAction, onBulkAction]);

  return (
    <div className="w-full p-2">
      <Table className="w-full bg-gray-50 dark:bg-zinc-900 rounded-xl overflow-hidden shadow-xl">
        <TableHeader>
          <TableRow>
            {/* Bulk action checkbox column */}
            {bulkAction && (
              <TableHead className="w-10">
                <Checkbox
                  checked={
                    selectedRows.length === mainData.length &&
                    mainData.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
            )}

            {/* Table headers */}
            {thData.map((header, index) => (
              <TableHead key={index}>{header}</TableHead>
            ))}

            {/* Action column header if any action is provided */}
            {(viewAction || editAction || deleteAction) && (
              <TableHead className="text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {mainData.length > 0 ? (
            mainData.map((item, rowIndex) => (
              <TableRow key={rowIndex}>
                {/* Bulk action checkbox for each row */}
                {bulkAction && (
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(
                        item[bulkAction.fieldName]
                      )}
                      onCheckedChange={() =>
                        handleRowSelect(item[bulkAction.fieldName])
                      }
                    />
                  </TableCell>
                )}

                {/* Data cells */}
                {dataFields.map((field, cellIndex) => (
                  <TableCell key={cellIndex}>{item[field] || "-"}</TableCell>
                ))}

                {/* Action cells */}
                {(viewAction || editAction || deleteAction) && (
                  <TableCell className="flex justify-end gap-2">
                    {viewAction && (
                      <Link
                        href={`${viewAction.path}${item[viewAction.fieldName || ""]}`}
                      >
                        <Button variant="ghost" size="sm">
                          {viewAction.icon || (
                            <ArrowRight className="h-4 w-4" />
                          )}
                        </Button>
                      </Link>
                    )}

                    {editAction && (
                      <Link
                        href={`${editAction.path}${item[editAction.fieldName || ""]}`}
                      >
                        <Button variant="ghost" size="sm">
                          {editAction.icon || (
                            <ArrowRight className="h-4 w-4" />
                          )}
                        </Button>
                      </Link>
                    )}

                    {deleteAction && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (deleteAction.onClick) {
                            deleteAction.onClick(
                              item[deleteAction.fieldName || ""]
                            );
                          } else if (onDelete) {
                            onDelete(item[deleteAction.fieldName || ""]);
                          }
                        }}
                      >
                        {deleteAction.icon || (
                          <Trash2 className="h-4 w-4 text-red-500" />
                        )}
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={
                  thData.length +
                  (bulkAction ? 1 : 0) +
                  (viewAction || editAction || deleteAction ? 1 : 0)
                }
                className="h-24 text-center"
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
