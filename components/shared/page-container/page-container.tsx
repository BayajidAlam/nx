import { cn } from "@/lib/utils";

interface IPageContainerProps {
  className?: string;
  children: React.ReactNode;
}

export default function PageContainer({
  children,
  className,
}: IPageContainerProps) {
  return (
    <section className={cn("w-full h-full p-4 space-y-4", className)}>
      {children}
    </section>
  );
}
