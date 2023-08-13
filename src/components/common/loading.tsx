import { Icons } from "../ui/icons";

const Loading = () => {
  return (
    <div className="my-24 flex justify-center">
      <Icons.spinner className="animate-spin" />
    </div>
  );
};

export default Loading;
