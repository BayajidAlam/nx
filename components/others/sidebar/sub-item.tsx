"use client";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

interface ISubItem {
  name: string;
  path: string;
}

const SubMenuItem = ({ item }: { item: ISubItem }) => {
  const { name, path } = item;
  const router = useRouter();
  const pathname = usePathname();

  const onClick = () => {
    router.push(path);
  };

  const isActive = useMemo(() => pathname.startsWith(path), [path, pathname]);

  return (
    <div
      className={`text-sm hover:text-primary hover:font-semibold cursor-pointer transition-all  duration-150 ease-in-out py-1 w-fit px-3 rounded-md font-outfit  ${
        isActive ? "text-primary font-semibold bg-primary/10" : ""
      }`}
      onClick={onClick}
    >
      {name}
    </div>
  );
};

export default SubMenuItem;
