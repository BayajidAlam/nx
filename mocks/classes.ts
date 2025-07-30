/* eslint-disable @typescript-eslint/no-unused-vars */
import { IClass, IShift } from "@/types";

function generateMockClasses(shifts: IShift[]): IClass[] {
  const classes = [
    { name: "Class 1A", shiftId: "shift_1" },
    { name: "Class 1B", shiftId: "shift_1" },
    { name: "Class 2A", shiftId: "shift_2" },
    { name: "Class 2B", shiftId: "shift_2" },
    { name: "Class 3A", shiftId: "shift_3" },
    { name: "Advanced Class", shiftId: "shift_4" },
  ];

  return classes.map((classItem, index) => ({
    _id: `class_${index + 1}`,
    name: classItem.name,
    shiftId: classItem.shiftId,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 5000000000).toISOString(),
    institute_id: `institute_${Math.floor(Math.random() * 3) + 1}`,
  }));
}

export default generateMockClasses;
