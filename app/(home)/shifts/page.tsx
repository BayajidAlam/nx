"use client";

import PageContainer from "@/components/shared/page-container/page-container";
import PageHeader from "@/components/shared/page-header/page-header";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/";
import { DeleteAlert } from "@/components/ui/alert-dialog/delete-alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import generateMockShifts from "@/mocks/shifts";
import { IShift } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import CreateShiftModal from "./_components/create-shift-modal/create-shift-modal";
import EditShiftModal from "./_components/edit-shift-modal/edit-shift-modal";
import { ShiftFormValues, ShiftSchema } from "./schema/shift-schema";

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<IShift[]>(generateMockShifts());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<IShift | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ShiftFormValues>({
    resolver: zodResolver(ShiftSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleCreateShift = (data: ShiftFormValues) => {
    setIsLoading(true);
    try {
      const newShift: IShift = {
        _id: `shift_${Date.now()}`,
        name: data.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        institute_id: "institute_1",
      };
      setShifts([...shifts, newShift]);

      setIsCreateModalOpen(false);
      form.reset();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditShift = (data: ShiftFormValues) => {
    if (!editingShift) return;

    setIsLoading(true);
    try {
      const updatedShifts = shifts.map((shift) =>
        shift._id === editingShift._id
          ? { ...shift, name: data.name, updatedAt: new Date().toISOString() }
          : shift
      );
      setShifts(updatedShifts);
      setIsEditModalOpen(false);
      setEditingShift(null);
      form.reset();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteShift = (shiftId: string) => {
    setIsLoading(true);
    try {
      setShifts(shifts.filter((shift) => shift._id !== shiftId));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (shift: IShift) => {
    setEditingShift(shift);
    form.setValue("name", shift.name);
    setIsEditModalOpen(true);
  };

  return (
    <PageContainer className="">
      <div className="flex justify-between items-center">
        <PageHeader name="Shifts Management">
          <CreateShiftModal
            form={form}
            isModalOpen={isCreateModalOpen}
            setIsModalOpen={setIsCreateModalOpen}
            handleSubmit={handleCreateShift}
            isLoading={isLoading}
          >
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Shift
            </Button>
          </CreateShiftModal>
        </PageHeader>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground p-4">Name</TableHead>
              <TableHead className="text-muted-foreground p-4">
                Created At
              </TableHead>
              <TableHead className="text-muted-foreground p-4">
                Updated At
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts.map((shift) => (
              <TableRow key={shift._id} className="p-4">
                <TableCell className="font-medium p-4">{shift.name}</TableCell>
                <TableCell className="p-4">
                  {formatDate(shift.createdAt)}
                </TableCell>
                <TableCell className="p-4">
                  {formatDate(shift.updatedAt)}
                </TableCell>
                <TableCell className="text-center p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 !cursor-pointer"
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditModal(shift)}>
                        View & Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DeleteAlert
                        onConfirm={() => handleDeleteShift(shift._id!)}
                      >
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DeleteAlert>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditShiftModal
        form={form}
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
        handleSubmit={handleEditShift}
        isLoading={isLoading}
      />
    </PageContainer>
  );
}
