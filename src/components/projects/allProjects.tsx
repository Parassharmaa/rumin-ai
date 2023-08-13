import { api } from "~/utils/api";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import moment from "moment";
import { Calendar } from "lucide-react";
import Link from "next/link";
import Loading from "../common/loading";

const AllProjects = () => {
  const { data, isLoading } = api.project.userProjects.useQuery();

  if (isLoading) {
    return <Loading />;
  }

  if (data?.length === 0) {
    return (
      <div className="my-12 flex justify-center">
        <div>
          <Image
            className="my-4"
            src="/images/collab.svg"
            alt="empty-state"
            width="200"
            height="200"
          />
          <div className="my-8 text-center text-sm">
            No projects created yet!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="my-8 grid gap-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
        {data?.map((item) => (
          <Link key={item.id} href={`app/focus-groups/${item.id}`}>
            <Card className="cursor-pointer">
              <CardContent>
                <div className="my-2 text-lg font-semibold">{item.title}</div>
                <div className="h-8 overflow-hidden text-ellipsis font-sans text-xs">
                  {item.description}
                </div>
                <div className="mt-4 flex items-center space-x-1 text-xs font-light">
                  <Calendar size="14px" />
                  <div>{moment(item.createdAt).format("MMMM Do YYYY")}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllProjects;
