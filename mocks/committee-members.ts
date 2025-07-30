import { ICommittee } from "@/types";

export function getMockCommittees({
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
}): { data: ICommittee[]; total: number } {
  const allCommittees: ICommittee[] = Array.from({ length: 30 }, (_, i) => ({
    _id: `${i + 1}`,
    name: `Committee Member ${i + 1}`,
    photoUrl: `https://placehold.co/48x48?text=C${i + 1}`,
    designation: ["Chairman", "Secretary", "Treasurer", "Member"][i % 4],
    mobile: `0180000${i.toString().padStart(4, "0")}`,
    email: i % 5 === 0 ? null : `member${i + 1}@committee.com`,
    session: i % 4 === 0 ? null : `20${20 + (i % 5)}-20${21 + (i % 5)}`,
  }));

  let filtered = allCommittees;

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.mobile.includes(s) ||
        (c.email?.toLowerCase().includes(s) ?? false)
    );
  }

  Object.entries(filters).forEach(([key, value]) => {
    filtered = filtered.filter(
      (c) => String(c[key as keyof ICommittee]) === value
    );
  });

  const sortField = sort.replace(/^-/, "");
  const isDesc = sort.startsWith("-");
  filtered = filtered.sort((a, b) => {
    const aVal = a[sortField as keyof ICommittee];
    const bVal = b[sortField as keyof ICommittee];

    if (typeof aVal === "string" && typeof bVal === "string") {
      return isDesc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
    }

    return 0;
  });

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return { data: paginated, total };
}
