import { PiIcon } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { ThemeToggle } from "../common/themeToggle";
import { ProfileOptions } from "../common/profileDropdown";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Link from "next/link";

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
      <div className="h-full flex-col p-2 px-4 lg:flex">
        <div className="flex justify-between">
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
      </div>
      <Separator orientation="horizontal" />
      <main className="container">{children}</main>
    </>
  );
}
