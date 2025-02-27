export default function ExpandableWindow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full h-full p-2">
      {children}
    </div>
  );
}