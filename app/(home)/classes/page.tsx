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
import generateMockClasses from "@/mocks/classes";
import generateMockShifts from "@/mocks/shifts";
import { IClass, IShift } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import CreateClassModal from "./_components/create-class-modal/create-class-modal";
import EditClassModal from "./_components/edit-class-modal/edit-class-modal";
import { ClassFormValues, ClassSchema } from "./schema/class-schema";

interface ClassFormData {
  name: string;
  shiftId: string;
}

export default function ClassesPage() {
  const [shifts] = useState<IShift[]>(generateMockShifts());
  const [classes, setClasses] = useState<IClass[]>(generateMockClasses(shifts));
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<IClass | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(ClassSchema),
    defaultValues: {
      name: "",
      shiftId: "",
    },
  });

  const getShiftName = (shiftId: string) => {
    const shift = shifts.find((s) => s._id === shiftId);
    return shift ? shift.name : "Unknown Shift";
  };

  const handleCreateClass = (data: ClassFormData) => {
    setIsLoading(true);
    try {
      const newClass: IClass = {
        _id: `class_${Date.now()}`,
        name: data.name,
        shiftId: data.shiftId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        institute_id: "institute_1",
      };
      setClasses([...classes, newClass]);
      setIsCreateModalOpen(false);
      form.reset();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClass = (data: ClassFormData) => {
    if (!editingClass) return;

    setIsLoading(true);

    try {
      const updatedClasses = classes.map((classItem) =>
        classItem._id === editingClass._id
          ? {
              ...classItem,
              name: data.name,
              shiftId: data.shiftId,
              updatedAt: new Date().toISOString(),
            }
          : classItem
      );
      setClasses(updatedClasses);
      setIsEditModalOpen(false);
      setEditingClass(null);
      form.reset();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClass = (classId: string) => {
    setIsLoading(true);

    try {
      setClasses(classes.filter((classItem) => classItem._id !== classId));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (classItem: IClass) => {
    setEditingClass(classItem);
    form.setValue("name", classItem.name);
    form.setValue("shiftId", classItem.shiftId);
    setIsEditModalOpen(true);
  };

  return (
    <PageContainer className="">
      <PageHeader name="Classes Management">
        <CreateClassModal
          form={form}
          isModalOpen={isCreateModalOpen}
          setIsModalOpen={setIsCreateModalOpen}
          handleSubmit={handleCreateClass}
          isLoading={isLoading}
          shifts={shifts}
        >
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Shift
          </Button>
        </CreateClassModal>
      </PageHeader>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground p-4">Name</TableHead>
              <TableHead className="text-muted-foreground p-4">Shift</TableHead>
              <TableHead className="text-muted-foreground p-4">
                Created At
              </TableHead>
              <TableHead className="text-muted-foreground p-4">
                Updated At
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map((classItem) => (
              <TableRow key={classItem._id} className="p-4">
                <TableCell className="font-medium p-4">
                  {classItem.name}
                </TableCell>
                <TableCell className="p-4">
                  {getShiftName(classItem.shiftId)}
                </TableCell>
                <TableCell className="p-4">
                  {formatDate(classItem.createdAt)}
                </TableCell>
                <TableCell className="p-4">
                  {formatDate(classItem.updatedAt)}
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
                      <DropdownMenuItem
                        onClick={() => openEditModal(classItem)}
                      >
                        View & Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DeleteAlert
                        onConfirm={() => handleDeleteClass(classItem._id!)}
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

      <EditClassModal
        form={form}
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
        handleSubmit={handleEditClass}
        isLoading={isLoading}
        shifts={shifts}
      />
    </PageContainer>
  );
}
