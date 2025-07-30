import { Skeleton } from "@/components/ui";
import { ChevronDown } from "lucide-react";

export function SidebarItemSkeleton({ hasSubItems = false }) {
  return (
    <>
      <div className="flex items-center  rounded-lg justify-between ">
        <div className="flex items-center space-x-2 animate-pulse rounded-md bg-muted/30 p-4 w-full">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-4 w-24" />
        </div>
        {hasSubItems && (
          <ChevronDown size={18} className="text-muted-foreground" />
        )}
      </div>
      {hasSubItems && (
        <div className="flex flex-col space-y-1 ml-8 mt-1 animate-pulse rounded-md bg-muted/30 ">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-2 p-2 w-full">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
