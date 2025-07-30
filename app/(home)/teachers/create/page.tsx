import { Breadcrumb } from "@/components/shared/bread-crumb/Breadcrumb";
import PageContainer from "@/components/shared/page-container/page-container";
import { Metadata } from "next";
import CreateTeacherForm from "./_components/create-teacher-form";

export const metadata: Metadata = {
  title: "Create Teacher",
  description: "Create a new teacher with our easy-to-use form.",
};

const breadcrumbs = [
  { name: "Teachers", href: "/teachers" },
  { name: "Add Teacher" }, // No `href` for the current page
];

export default function CreateTeacherPage() {
  return (
    <PageContainer>
      <Breadcrumb items={breadcrumbs} />
      <CreateTeacherForm />
    </PageContainer>
  );
}
