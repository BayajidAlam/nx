import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

type BreadcrumbItem = {
  name: string;
  href?: string; // Optional because the current page doesn't require a link
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  borderBottom?: boolean;
  className?: string; // Optional for custom styling
};

export function Breadcrumb({
  items,

  borderBottom = false,

  className,
}: BreadcrumbProps) {
  return (
    <nav
      className={cn(

        "flex items-center flex-wrap space-x-1 text-lg font-medium text-muted-foreground ",

        borderBottom ? "border-b border-border pb-2.5" : "",
        className
      )}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => (
        <span key={index} className="flex items-center">
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-foreground transition-colors duration-200"
            >
              {item.name}
            </Link>
          ) : (
            <span className="text-foreground">{item.name}</span>
          )}
          {index < items.length - 1 && (
            <ChevronRight className="h-4 w-4 mx-1" aria-hidden="true" />
          )}
        </span>
      ))}
    </nav>
  );
}
