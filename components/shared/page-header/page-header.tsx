interface IPageHeaderProps {
  name: string;
  children: React.ReactNode;
}

export default function PageHeader({
  name = "Header",
  children,
}: IPageHeaderProps) {
  return (
    <div className="flex justify-between items-center w-full h-full">
      <div className="text-2xl font-semibold capitalize">{name}</div>
      <div className="">{children}</div>
    </div>
  );
}
