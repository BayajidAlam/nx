"use client";

import { Avatar, AvatarFallback, AvatarImage, Checkbox } from "@/components/ui";
import type { ColumnDef, Table } from "@tanstack/react-table";
import { useState } from "react";

import { formatDateToDayMonthYear } from "@/lib/utils";
import { ITeacher } from "@/types";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<ITeacher>[] = [
  {
    id: "select",
    header: ({ table }) => <SelectAllCheckbox table={table} />,
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      );
    },

    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <BasicInfo
          name={row.original.name || "N/A"}
          avatar={row.original.photoUrl || null}
        />
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "contact",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Details" />
    ),
    cell: ({ row }) => (
      <ContactInfo
        email={row.original.email || "N/A"}
        phone={row.original.mobile || "N/A"}
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "designation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Designation" />
    ),
    cell: ({ row }) => {
      return `${row.original?.designation} (${row.original?.mainDesignation})`;
    },
    enableSorting: false,
  },
  {
    accessorKey: "district",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="District" />
    ),

    enableSorting: false,
  },
  {
    accessorKey: "joining-date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joining Date" />
    ),
    cell: ({ row }) => {
      console.log(row.original.joiningDate);
      const isAvailable = Boolean(row.original.joiningDate);

      if (!isAvailable) return "N/A";

      if (isAvailable)
        return formatDateToDayMonthYear(row.original.joiningDate);
    },
    enableSorting: false,
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return <DataTableRowActions row={row} />;
    },
  },
];

export function SelectAllCheckbox({ table }: { table: Table<ITeacher> }) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handleChange = (value: boolean | "indeterminate") => {
    if (value === "indeterminate") return;
    const rows = table.getRowModel().rows;

    rows.forEach((row) => {
      row.toggleSelected(value);
      setSelectedRows((prev) =>
        value
          ? [...prev, row.original._id]
          : prev.filter((id) => id !== row.original._id)
      );
    });
  };

  return (
    <Checkbox
      checked={selectedRows.length > 0}
      onCheckedChange={handleChange}
      aria-label="Select all"
      className="translate-y-[2px]"
    />
  );
}

// TITLE
interface BasicInfoProps {
  name: string;
  avatar: string | null;
}

export const BasicInfo: React.FC<BasicInfoProps> = ({ name, avatar }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="flex items-center space-x-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatar || "/placeholder.svg"} />
        <AvatarFallback className="bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div>
        <div className="font-medium">{name}</div>
      </div>
    </div>
  );
};

// Contact
interface ContactInfoProps {
  email: string;
  phone: string;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ email, phone }) => {
  return (
    <div>
      <div>{email}</div>
      <div className="text-xs text-muted-foreground">{phone}</div>
    </div>
  );
};
