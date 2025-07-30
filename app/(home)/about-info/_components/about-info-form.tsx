"use client";

import { Button, Checkbox, Input, Label } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Collaborator, InstitutionInfo, Shift } from "../_types";

export default function AboutForm({ id }: { id?: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<InstitutionInfo>({
    eiin: 0,
    nameBn: "",
    nameEn: "",
    address: {
      road: "",
      wardNo: "",
      union: "",
      postOffice: "",
      postCode: 0,
      upazila: "",
      district: "",
      division: "",
    },
    telephone: "",
    email: "",
    website: "",
    totalStudents: 0,
    totalTeachers: 0,
    totalShift: "",
    institutionType: "",
    headTeacherName: "",
    headTeacherPhotoURL: "",
    collaborator: {
      name: "",
      url: "",
    },
    shifts: [],
    totalAcre: 0,
    totalBuildings: 0,
    totalClassrooms: 0,
    multimediaClassrooms: "",
    ictLab: false,
    ictLabCount: 0,
    scienceLab: false,
    scienceLabCount: 0,
  });

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/about-institution/${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setFormData(data);
      toast.success("Data loaded successfully");
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value) || 0,
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address!,
        [name]: name === "postCode" ? Number(value) || 0 : value,
      },
    }));
  };

  const handleCollaboratorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name.replace("collaborator.", "") as keyof Collaborator;
    setFormData((prev) => ({
      ...prev,
      collaborator: {
        ...prev.collaborator!,
        [field]: value,
      },
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleShiftChange = (
    index: number,
    field: keyof Shift,
    value: string
  ) => {
    const updatedShifts = [...(formData.shifts || [])];
    updatedShifts[index] = {
      ...updatedShifts[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      shifts: updatedShifts,
    }));
  };

  const addShift = () => {
    setFormData((prev) => ({
      ...prev,
      shifts: [
        ...(prev.shifts || []),
        {
          shiftName: "",
          shiftDetails: "",
        },
      ],
    }));
  };

  const removeShift = (index: number) => {
    const updatedShifts = [...(formData.shifts || [])];
    updatedShifts.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      shifts: updatedShifts,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = id
        ? `${process.env.NEXT_PUBLIC_BASE_API}/about-institution/${id}`
        : `${process.env.NEXT_PUBLIC_BASE_API}/about-institution`;

      const method = id ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Operation failed");

      const result = await response.json();
      toast.success(
        id ? "Data updated successfully" : "Data created successfully"
      );
      if (!id) {
        router.push(`/about-institution/${result.id}`);
      }
    } catch (error) {
      toast.error("Operation failed. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {id ? "Edit Institution Information" : "Add Institution Information"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="eiin">EIIN *</Label>
              <Input
                id="eiin"
                name="eiin"
                type="number"
                value={formData.eiin}
                onChange={handleNumberChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="institutionType">Institution Type</Label>
              <Input
                id="institutionType"
                name="institutionType"
                value={formData.institutionType}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="nameBn">Name (Bangla)</Label>
              <Input
                id="nameBn"
                name="nameBn"
                value={formData.nameBn}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="nameEn">Name (English)</Label>
              <Input
                id="nameEn"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Address Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="road">Road</Label>
              <Input
                id="road"
                name="road"
                value={formData.address?.road}
                onChange={handleAddressChange}
              />
            </div>
            <div>
              <Label htmlFor="wardNo">Ward No</Label>
              <Input
                id="wardNo"
                name="wardNo"
                value={formData.address?.wardNo}
                onChange={handleAddressChange}
              />
            </div>
            <div>
              <Label htmlFor="union">Union</Label>
              <Input
                id="union"
                name="union"
                value={formData.address?.union}
                onChange={handleAddressChange}
              />
            </div>
            <div>
              <Label htmlFor="postOffice">Post Office</Label>
              <Input
                id="postOffice"
                name="postOffice"
                value={formData.address?.postOffice}
                onChange={handleAddressChange}
              />
            </div>
            <div>
              <Label htmlFor="postCode">Post Code</Label>
              <Input
                id="postCode"
                name="postCode"
                type="number"
                value={formData.address?.postCode}
                onChange={handleAddressChange}
              />
            </div>
            <div>
              <Label htmlFor="upazila">Upazila</Label>
              <Input
                id="upazila"
                name="upazila"
                value={formData.address?.upazila}
                onChange={handleAddressChange}
              />
            </div>
            <div>
              <Label htmlFor="district">District</Label>
              <Input
                id="district"
                name="district"
                value={formData.address?.district}
                onChange={handleAddressChange}
              />
            </div>
            <div>
              <Label htmlFor="division">Division</Label>
              <Input
                id="division"
                name="division"
                value={formData.address?.division}
                onChange={handleAddressChange}
              />
            </div>
          </div>
        </div>

        {/* Contact & Head Teacher */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4 space-y-4">
            <h2 className="text-lg font-semibold">Contact Information</h2>
            <div>
              <Label htmlFor="telephone">Telephone</Label>
              <Input
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="border rounded-lg p-4 space-y-4">
            <h2 className="text-lg font-semibold">Head Teacher</h2>
            <div>
              <Label htmlFor="headTeacherName">Name</Label>
              <Input
                id="headTeacherName"
                name="headTeacherName"
                value={formData.headTeacherName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="headTeacherPhotoURL">Photo URL</Label>
              <Input
                id="headTeacherPhotoURL"
                name="headTeacherPhotoURL"
                value={formData.headTeacherPhotoURL}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="totalStudents">Total Students</Label>
              <Input
                id="totalStudents"
                name="totalStudents"
                type="number"
                value={formData.totalStudents}
                onChange={handleNumberChange}
              />
            </div>
            <div>
              <Label htmlFor="totalTeachers">Total Teachers</Label>
              <Input
                id="totalTeachers"
                name="totalTeachers"
                type="number"
                value={formData.totalTeachers}
                onChange={handleNumberChange}
              />
            </div>
            <div>
              <Label htmlFor="totalShift">Total Shift</Label>
              <Input
                id="totalShift"
                name="totalShift"
                value={formData.totalShift}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="totalAcre">Total Acre</Label>
              <Input
                id="totalAcre"
                name="totalAcre"
                type="number"
                step="0.01"
                value={formData.totalAcre}
                onChange={handleNumberChange}
              />
            </div>
            <div>
              <Label htmlFor="totalBuildings">Total Buildings</Label>
              <Input
                id="totalBuildings"
                name="totalBuildings"
                type="number"
                value={formData.totalBuildings}
                onChange={handleNumberChange}
              />
            </div>
            <div>
              <Label htmlFor="totalClassrooms">Total Classrooms</Label>
              <Input
                id="totalClassrooms"
                name="totalClassrooms"
                type="number"
                value={formData.totalClassrooms}
                onChange={handleNumberChange}
              />
            </div>
            <div>
              <Label htmlFor="multimediaClassrooms">
                Multimedia Classrooms
              </Label>
              <Input
                id="multimediaClassrooms"
                name="multimediaClassrooms"
                value={formData.multimediaClassrooms}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Shifts */}
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Shifts Information</h2>
            <Button type="button" onClick={addShift}>
              Add Shift
            </Button>
          </div>

          {formData.shifts?.map((shift, index) => (
            <div key={index} className="border p-3 rounded space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Shift {index + 1}</h3>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeShift(index)}
                >
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Shift Name</Label>
                  <Input
                    value={shift.shiftName || ""}
                    onChange={(e) =>
                      handleShiftChange(index, "shiftName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Shift Details</Label>
                  <Input
                    value={shift.shiftDetails || ""}
                    onChange={(e) =>
                      handleShiftChange(index, "shiftDetails", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Labs */}
        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Laboratory Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ictLab"
                checked={formData.ictLab}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("ictLab", checked as boolean)
                }
              />
              <Label htmlFor="ictLab">ICT Lab</Label>
            </div>
            <div>
              <Label htmlFor="ictLabCount">ICT Lab Count</Label>
              <Input
                id="ictLabCount"
                name="ictLabCount"
                type="number"
                value={formData.ictLabCount}
                onChange={handleNumberChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="scienceLab"
                checked={formData.scienceLab}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("scienceLab", checked as boolean)
                }
              />
              <Label htmlFor="scienceLab">Science Lab</Label>
            </div>
            <div>
              <Label htmlFor="scienceLabCount">Science Lab Count</Label>
              <Input
                id="scienceLabCount"
                name="scienceLabCount"
                type="number"
                value={formData.scienceLabCount}
                onChange={handleNumberChange}
              />
            </div>
          </div>
        </div>
        {/* Collaborator */}
        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Collaborator Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="collaborator.name">Collaborator Name</Label>
              <Input
                id="collaborator.name"
                name="collaborator.name"
                value={formData.collaborator?.name}
                onChange={handleCollaboratorChange}
              />
            </div>
            <div>
              <Label htmlFor="collaborator.url">Collaborator URL</Label>
              <Input
                id="collaborator.url"
                name="collaborator.url"
                value={formData.collaborator?.url}
                onChange={handleCollaboratorChange}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Information"}
          </Button>
        </div>
      </form>
    </div>
  );
}
