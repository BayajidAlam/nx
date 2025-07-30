/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import PageContainer from "@/components/shared/page-container/page-container";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
import { MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export interface ISection {
  _id?: string;
  name: string;
  classId: string;
  createdAt?: string;
  updatedAt?: string;
  institute_id?: string;
}

interface IClass {
  _id: string;
  name: string;
}

interface SectionFormData {
  name: string;
  classId: string;
}

// Mock classes data for dropdown
function generateMockClasses(): IClass[] {
  return [
    { _id: "class_1", name: "Class 1A" },
    { _id: "class_2", name: "Class 1B" },
    { _id: "class_3", name: "Class 2A" },
    { _id: "class_4", name: "Class 2B" },
    { _id: "class_5", name: "Class 3A" },
    { _id: "class_6", name: "Advanced Class" },
  ];
}

// Mock data generation function
function generateMockSections(classes: IClass[]): ISection[] {
  const sections = [
    { name: "Section A", classId: "class_1" },
    { name: "Section B", classId: "class_1" },
    { name: "Section C", classId: "class_2" },
    { name: "Advanced Section", classId: "class_3" },
    { name: "Beginner Section", classId: "class_4" },
    { name: "Special Section", classId: "class_5" },
  ];

  return sections.map((section, index) => ({
    _id: `section_${index + 1}`,
    name: section.name,
    classId: section.classId,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 5000000000).toISOString(),
    institute_id: `institute_${Math.floor(Math.random() * 3) + 1}`,
  }));
}

export default function SectionsPage() {
  const [classes] = useState<IClass[]>(generateMockClasses());
  const [sections, setSections] = useState<ISection[]>(
    generateMockSections(classes)
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<ISection | null>(null);

  const createForm = useForm<SectionFormData>({
    defaultValues: {
      name: "",
      classId: "",
    },
  });

  const editForm = useForm<SectionFormData>({
    defaultValues: {
      name: "",
      classId: "",
    },
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getClassName = (classId: string) => {
    const classItem = classes.find((c) => c._id === classId);
    return classItem ? classItem.name : "Unknown Class";
  };

  const handleCreateSection = (data: SectionFormData) => {
    const newSection: ISection = {
      _id: `section_${Date.now()}`,
      name: data.name,
      classId: data.classId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      institute_id: "institute_1",
    };
    setSections([...sections, newSection]);
    setIsCreateModalOpen(false);
    createForm.reset();
  };

  const handleEditSection = (data: SectionFormData) => {
    if (!editingSection) return;

    const updatedSections = sections.map((section) =>
      section._id === editingSection._id
        ? {
            ...section,
            name: data.name,
            classId: data.classId,
            updatedAt: new Date().toISOString(),
          }
        : section
    );
    setSections(updatedSections);
    setIsEditModalOpen(false);
    setEditingSection(null);
    editForm.reset();
  };

  const handleDeleteSection = (sectionId: string) => {
    setSections(sections.filter((section) => section._id !== sectionId));
  };

  const openEditModal = (section: ISection) => {
    setEditingSection(section);
    editForm.setValue("name", section.name);
    editForm.setValue("classId", section.classId);
    setIsEditModalOpen(true);
  };

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-semibold capitalize">
          Sections Management
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Section
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Section</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={createForm.handleSubmit(handleCreateSection)}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="create-name">Section Name</Label>
                <Input
                  id="create-name"
                  {...createForm.register("name", {
                    required: "Section name is required",
                  })}
                  placeholder="Enter section name"
                />
                {createForm.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {createForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="create-class">Class</Label>
                <Select
                  onValueChange={(value) =>
                    createForm.setValue("classId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classItem) => (
                      <SelectItem key={classItem._id} value={classItem._id}>
                        {classItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {createForm.formState.errors.classId && (
                  <p className="text-sm text-red-500 mt-1">
                    {createForm.formState.errors.classId.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Section</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground p-4">Name</TableHead>
              <TableHead className="text-muted-foreground p-4">Class</TableHead>
              <TableHead className="text-muted-foreground p-4">
                Created At
              </TableHead>
              <TableHead className="text-muted-foreground p-4">
                Updated At
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sections.map((section) => (
              <TableRow key={section._id}>
                <TableCell className="font-medium p-4">
                  {section.name}
                </TableCell>
                <TableCell className="p-4">
                  {getClassName(section.classId)}
                </TableCell>
                <TableCell className="p-4">
                  {formatDate(section.createdAt)}
                </TableCell>
                <TableCell className="p-4">
                  {formatDate(section.updatedAt)}
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
                      <DropdownMenuItem onClick={() => openEditModal(section)}>
                        View & Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DeleteAlert
                        onConfirm={() => handleDeleteSection(section._id!)}
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

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={editForm.handleSubmit(handleEditSection)}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="edit-name">Section Name</Label>
              <Input
                id="edit-name"
                {...editForm.register("name", {
                  required: "Section name is required",
                })}
                placeholder="Enter section name"
              />
              {editForm.formState.errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {editForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="edit-class">Class</Label>
              <Select
                value={editForm.watch("classId")}
                onValueChange={(value) => editForm.setValue("classId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classItem) => (
                    <SelectItem key={classItem._id} value={classItem._id}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {editForm.formState.errors.classId && (
                <p className="text-sm text-red-500 mt-1">
                  {editForm.formState.errors.classId.message}
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update Section</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
