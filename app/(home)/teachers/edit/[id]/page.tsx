/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Breadcrumb } from "@/components/shared/bread-crumb/Breadcrumb";
import PageContainer from "@/components/shared/page-container/page-container";
import { use } from "react";

const breadcrumbs = [
  { name: "Teachers", href: "/teachers" },
  { name: "Update teachers" },
];

export default function UpdateTeacherPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <PageContainer>
      <Breadcrumb items={breadcrumbs} />
    </PageContainer>
  );
}
