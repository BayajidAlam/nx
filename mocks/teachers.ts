import { ITeacher } from "@/types";

export function getMockTeachers({
  page = 1,
  limit = 10,
  search = "",
  sort = "-createdAt",
  filters = {},
}: {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  filters?: Record<string, string>;
}): { data: ITeacher[]; total: number } {
  const allTeachers: ITeacher[] = Array.from({ length: 50 }, (_, i) => ({
    _id: `${i + 1}`,
    name: `Teacher ${i + 1}`,
    pdsId: `PDS-${1000 + i}`,
    mobile: `0170000${i.toString().padStart(4, "0")}`,
    photoUrl: `https://placehold.co/48x48?text=${i + 1}`,
    mainDesignation: i % 2 === 0 ? "Senior Teacher" : "Assistant Teacher",
    designation: "Science",
    joiningDate: new Date(2020, i % 12, (i % 28) + 1).toISOString(),
    district: ["Dhaka", "Chittagong", "Khulna", "Barisal"][i % 4],
    email: `teacher${i + 1}@school.com`,
  }));

  let filtered = allTeachers;

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(s) ||
        t.pdsId.toLowerCase().includes(s) ||
        t.mobile.includes(s)
    );
  }

  Object.entries(filters).forEach(([key, value]) => {
    filtered = filtered.filter(
      (t) => String(t[key as keyof ITeacher]) === value
    );
  });

  const sortField = sort.replace(/^-/, "");
  const isDesc = sort.startsWith("-");
  filtered = filtered.sort((a, b) => {
    const aVal = a[sortField as keyof ITeacher];
    const bVal = b[sortField as keyof ITeacher];

    if (typeof aVal === "string" && typeof bVal === "string") {
      return isDesc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
    }

    return 0;
  });

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return { data: paginated, total };
}
