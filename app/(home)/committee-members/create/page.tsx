import { Breadcrumb } from "@/components/shared/bread-crumb/Breadcrumb";
import PageContainer from "@/components/shared/page-container/page-container";
import { Metadata } from "next";
import CreateTeacherForm from "./_components/create-committee-form";

export const metadata: Metadata = {
  title: "Create Committee Members",
  description: "Create a new Committee Member with our easy-to-use form.",
};

const breadcrumbs = [
  { name: "Committee Members", href: "/committee-members" },
  { name: "Add Committee Member" }, // No `href` for the current page
];

export default function CreateTeacherPage() {
  return (
    <PageContainer>
      <Breadcrumb items={breadcrumbs} />
      <CreateTeacherForm />
    </PageContainer>
  );
}
