import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import DashLayout from "~/components/layouts/dashlayout";
import AllProjects from "~/components/projects/allProjects";
import NewProjectDialog from "~/components/projects/newProject";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

const App = () => {
  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <div className="text-2xl">All Projects</div>

        <div className="text-2xl"></div>

        <div className="flex gap-2">
          <Button asChild variant="outline" className="space-x-2">
            <Link href="/app/visual-chat">
              <ChatBubbleIcon />
              <div> Visual Chat</div>
            </Link>
          </Button>
          <NewProjectDialog />
        </div>
      </div>
      <Separator className="my-2" />
      <AllProjects />
    </div>
  );
};

App.title = "Project - Rumin AI";
App.layout = DashLayout;

export default App;
