import { ArrowRightIcon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { ThemeToggle } from "~/components/common/themeToggle";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/ui/icons";

const Home = () => {
  const { data: session } = useSession();
  return (
    <div>
      <div className="m-4 flex justify-end">
        <ThemeToggle />
      </div>
      <div className="flex min-h-[90vh] flex-col justify-center px-2">
        <h1 className="mx-auto max-w-2xl pb-4 text-center text-6xl font-semibold tracking-tight text-primary transition-colors">
          RuminAI
        </h1>
        <h2 className="mx-auto max-w-2xl  border-b pb-4 text-center text-4xl font-extralight tracking-tight transition-colors">
          Simulate Focus Groups with AI
        </h2>
        <div className="mx-auto my-6 max-w-lg text-center">
          Streamline your focus group research with AI. Rumin AI let{"'"}s you
          define agenda and generate focus group transcripts in just few clicks.
        </div>
        <div className="flex flex-col items-center justify-center">
          <div>
            {!session && (
              <Button onClick={() => signIn("google")} variant="outline">
                <Icons.google className="mr-2 h-4 w-4" />
                Sign in with Google
              </Button>
            )}
          </div>
          <div>
            {session && (
              <Button
                asChild
                variant="outline"
                className="space-x-2 hover:space-x-4"
              >
                <Link href="/app" className="transition-all">
                  <div> Go to Dashboard</div>
                  <ArrowRightIcon className="transition-all" size="18px" />
                </Link>
              </Button>
            )}
          </div>
          <div>
            {session && (
              <Button onClick={() => signOut()} variant="link">
                Sign out
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Home.title = "Rumin AI";

export default Home;
