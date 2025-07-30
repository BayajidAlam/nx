/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MoreHorizontal } from "lucide-react";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { DeleteAlert } from "@/components/ui/alert-dialog/delete-alert";

import Link from "next/link";
import { toast } from "sonner";

interface DataTableRowActionsProps {
  row: any; // Replace 'any' with the actual type of your row data
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const handleDelete = async () => {
    // console.log(row.original);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 !cursor-pointer">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={async () => {
            await navigator.clipboard.writeText(
              row.original.email ?? "Email not found"
            );
            toast.success("Email copied to clipboard");
          }}
        >
          Copy email
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={`/committee-members/edit/${row.original.id}`}>
            View & Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DeleteAlert onConfirm={handleDelete}>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="text-destructive"
          >
            Delete
          </DropdownMenuItem>
        </DeleteAlert>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
