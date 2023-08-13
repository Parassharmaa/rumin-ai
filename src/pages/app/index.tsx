import DashLayout from "~/components/layouts/dashlayout";
import AllProjects from "~/components/projects/allProjects";
import NewProjectDialog from "~/components/projects/newProject";
import { Separator } from "~/components/ui/separator";

const App = () => {
  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <div className="text-2xl">All Projects</div>
        <NewProjectDialog />
      </div>
      <Separator className="my-2" />

      <AllProjects />
    </div>
  );
};

App.title = "Project - Rumin AI";
App.layout = DashLayout;

export default App;
