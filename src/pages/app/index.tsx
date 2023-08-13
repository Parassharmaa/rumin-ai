import DashLayout from "~/components/layouts/dashlayout";
import NewProjectDialog from "~/components/projects/newProject";

const App = () => {
  return <NewProjectDialog />;
};

App.title = "Project - Rumin AI";
App.layout = DashLayout;

export default App;
