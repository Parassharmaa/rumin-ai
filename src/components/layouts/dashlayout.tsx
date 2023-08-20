import { PiIcon } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { ThemeToggle } from "../common/themeToggle";
import { ProfileOptions } from "../common/profileDropdown";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Link from "next/link";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export default function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, status } = useSession();

  useEffect(() => {
    if (!data && status != "loading") {
      window.location.href = "/";
    }
  }, [data, status]);

  return (
    <>
      <div className="width-[100%] bg-red fixed left-0 right-0 top-0 z-50 flex-col lg:flex">
        <div className="bg-primary-foreground">
          <div className="flex justify-between p-2 px-4">
            <div className="flex items-center space-x-1">
              <PiIcon size="20px" />
              <div className="z-20 flex items-center text-lg font-medium">
                <Link href="/app"> Rumin AI</Link>
              </div>
            </div>
            <div className="flex space-x-4">
              <ProfileOptions />
              <ThemeToggle />
            </div>
          </div>
          <Separator orientation="horizontal" />
        </div>
      </div>
      <main className="mt-16">
        <ScrollArea>{children}</ScrollArea>
      </main>
    </>
  );
}
