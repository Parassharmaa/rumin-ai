import { PiIcon } from "lucide-react";
import { Separator } from "~/components/ui/separator";

export default function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="h-full flex-col p-2 dark:border-r lg:flex">
        <div className="flex items-center space-x-1">
          <PiIcon size="20px" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            Rumin AI
          </div>
        </div>
      </div>
      <Separator orientation="horizontal" />
      <main className="p-8">{children}</main>
    </>
  );
}
