import { IShift } from "@/types";

// Mock data generation function
function generateMockShifts(): IShift[] {
  const shifts = [
    { name: "Morning Shift" },
    { name: "Evening Shift" },
    { name: "Night Shift" },
    { name: "Weekend Shift" },
    { name: "Holiday Shift" },
  ];

  return shifts.map((shift, index) => ({
    _id: `shift_${index + 1}`,
    name: shift.name,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 5000000000).toISOString(),
    institute_id: `institute_${Math.floor(Math.random() * 3) + 1}`,
  }));
}

export default generateMockShifts;
