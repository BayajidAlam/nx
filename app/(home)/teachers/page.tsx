/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import PageContainer from "@/components/shared/page-container/page-container";
import { DataTableSkeleton } from "@/components/shared/skeletons/data-table-skeleton";
import { dataTablePaginationDefaultState } from "@/constants/data-table";
import { getMockTeachers } from "@/mocks/teachers";
import { ITeacher } from "@/types/api-response";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { columns } from "./_components/data-table/columns";
import { DataTable } from "./_components/data-table/data-table";

export default function TeachersPage() {
  return (
    <Suspense fallback={<DataTableSkeleton showToolbar={true} />}>
      <TeachersPageContent />
    </Suspense>
  );
}

function TeachersPageContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;

  const [pagination, setPagination] = useState(dataTablePaginationDefaultState);
  const [sorting, setSorting] = useState<SortingState>([]);

  const [teachers, setTeachers] = useState<ITeacher[]>([] as ITeacher[]);

  const sort =
    sorting.length > 0
      ? sorting
          .map((sort) => {
            return `${sort.desc ? "-" : ""}${sort.id}`;
          })
          .join(",")
      : "-createdAt";

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const filterObj: Record<string, string> = {};

  if (columnFilters.length > 0) {
    columnFilters.forEach((filter) => {
      filterObj[filter.id as string] = filter.value as string;
    });
  }

  //** TESTING CODE BEFORE INTEGRATING THE API
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setIsFetching(true);
    setIsLoading(true);

    const timer = setTimeout(() => {
      const { data, total } = getMockTeachers({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search,
        sort,
        filters: filterObj,
      });

      setTeachers(data);
      setTotal(total);
      setIsFetching(false);
      setIsLoading(false);
    }, 400); // simulate network delay

    return () => clearTimeout(timer);
  }, [pagination, sorting, search, columnFilters]);

  return (
    <PageContainer>
      <DataTable
        columns={columns}
        data={teachers}
        pagination={pagination}
        setPagination={setPagination}
        totalDocumentCount={total || 0}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        isLoading={isLoading}
        isFetching={isFetching}
      />
    </PageContainer>
  );
}
