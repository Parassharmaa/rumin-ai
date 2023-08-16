import { UserIcon } from "lucide-react";
import { useRouter } from "next/router";
import Loading from "~/components/common/loading";
import AllParticipants from "~/components/focusGroups/allParticipants";
import NewParticipants from "~/components/focusGroups/newParticipants";
import DashLayout from "~/components/layouts/dashlayout";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/utils/api";

const FocusGroup = () => {
  const router = useRouter();

  const { data, error, isLoading } = api.project.userProjectById.useQuery(
    {
      id: router.query.id as string,
    },
    {
      retry: false,
    }
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div>
      <div className="grid gap-4">
        <div className="text-2xl font-bold">Focus Group Playground</div>
        <div className="text-md font-light">
          Simulate focus group discussion, analyze results and much more
        </div>
      </div>
      <div className="my-8">
        <Tabs defaultValue="overview">
          <div className="w-full rounded-md bg-muted">
            <TabsList className="grid h-auto sm:grid-cols-2 md:max-w-[400px] md:grid-cols-4">
              <TabsTrigger value="overview" className="w-[100%]">
                Overview
              </TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
              <TabsTrigger value="agenda">Agenda</TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="w-full">
            <Card>
              <CardHeader className="grid gap-2">
                <CardTitle>{data.title}</CardTitle>
                <CardDescription>{data.description}</CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="space-y-2">
                <div className="my-4 flex items-center gap-2 font-light text-muted-foreground">
                  <UserIcon size="16px" />
                  <div className="text-sm">
                    {data._count.FocusGroupParticipants} Participants
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participants">
            <Card>
              <CardContent className="space-y-2">
                <AllParticipants />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="agenda"></TabsContent>
          <TabsContent value="transcript"></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

FocusGroup.title = "Focus Group - Rumin AI";
FocusGroup.layout = DashLayout;

export default FocusGroup;
