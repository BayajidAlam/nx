"use client";

import { ChevronDown, LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import SubMenuItem from "./sub-item";
interface ISidebarItem {
  name: string;
  path: string;
  icon?: LucideIcon;
  items?: ISubItem[];
}

interface ISubItem {
  name: string;
  path: string;
}

export default function SidebarItem({ item }: { item: ISidebarItem }) {
  const { name, icon: Icon, items, path } = item;

  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const onClick = () => {
    if (items && items.length > 0) {
      return setExpanded(!expanded);
    }

    return router.push(path);
  };

  const normalizePath = (path: string) => path.replace(/\/+$/, "");

  const isActive = useMemo(() => {
    if (!items || items.length === 0) {
      // For items without sub-items, special case for root path
      if (normalizePath(path) === "" && pathname === "/") {
        return true;
      }
      return pathname.startsWith(normalizePath(path)) && path !== "/";
    } else {
      // For items with sub-items
      if (
        items.find((subItem) =>
          pathname.startsWith(normalizePath(subItem.path))
        )
      ) {
        setExpanded(true);
        return true;
      }
    }

    return normalizePath(path) === normalizePath(pathname);
  }, [items, path, pathname]);

  return (
    <>
      <div
        className={`flex items-center px-4 py-2 rounded-lg hover:bg-primary/10 cursor-pointer ${
          !isActive && "text-primary/60"
        } hover:text-primary justify-between ${
          item.name === "Settings" &&
          "border-t rounded-none border-primary/10 pt-4"
        }
 ${isActive && "text-primary bg-white dark:bg-white/20 font-semibold"}
`}
        onClick={onClick}
      >
        <div className="flex items-center space-x-2">
          {Icon && <Icon size={16} />}
          <p className="text-sm">{name} </p>
        </div>
        {items && items.length > 0 && <ChevronDown size={18} />}
      </div>
      {expanded && items && items.length > 0 && (
        <div className="flex flex-col space-1 font-medium ml-8">
          {items.map((item) => (
            <SubMenuItem key={item.path} item={item} />
          ))}
        </div>
      )}
    </>
  );
}
