import { api } from "~/utils/api";
import NewParticipants from "./newParticipants";
import { useRouter } from "next/router";
import { Card, CardContent } from "../ui/card";
import { useDisclosure } from "react-use-disclosure";
import { Separator } from "../ui/separator";
import {
  BsGenderAmbiguous,
  BsGenderFemale,
  BsGenderMale,
} from "react-icons/bs";
import { Skeleton } from "../ui/skeleton";

const AllParticipants = () => {
  const router = useRouter();

  const { open, toggle, close, isOpen } = useDisclosure();

  const { data, isLoading } = api.focusGroup.allParticipants.useQuery({
    projectId: router.query.id as string,
  });

  const isParticipantLimit = data && data?.length > 5;

  return (
    <>
      <div className="my-4 grid gap-2 sm:grid-cols-1 md:grid-cols-4">
        {!isLoading && !isParticipantLimit && (
          <Card
            onClick={open}
            className="min-h-[100px] cursor-pointer hover:shadow-md"
          >
            <div className="flex h-[100%] items-center justify-center text-center text-sm text-muted-foreground">
              <div>+ Add Personas</div>
            </div>
          </Card>
        )}

        {/* show loading skeleton card */}
        {isLoading &&
          Array(4)
            .fill(0)
            .map((item, idx) => {
              return (
                <Card key={idx} className="min-h-[150px] p-2">
                  <div className="flex w-full items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="w-full space-y-2">
                      <Skeleton className="h-3 w-[100%]" />
                      <Skeleton className="h-3 w-[25%]" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-2 w-[100%]" />
                    <Skeleton className="h-2 w-[100%]" />
                    <Skeleton className="h-2 w-[70%]" />
                    <Skeleton className="h-2 w-[60%]" />
                  </div>
                </Card>
              );
            })}

        {data?.map((item) => (
          <Card key={item.id} className="flex h-[100%]">
            <CardContent className="p-2">
              <div className="flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div>
                    <div className="flex items-center justify-start gap-1">
                      <div className="text-md">{item.name}</div>
                      <div>
                        {item.gender === "Male" && (
                          <BsGenderMale className="text-sm text-muted-foreground" />
                        )}
                        {item.gender === "Female" && (
                          <BsGenderFemale className="text-sm text-muted-foreground" />
                        )}
                        {item.gender === "Other" && (
                          <BsGenderAmbiguous className="text-sm text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-start gap-1">
                      <div className="text-xs text-muted-foreground">
                        {item.age},
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.background}
                      </div>
                    </div>
                  </div>
                </div>
                <Separator className="my-2" />
                <div className="my-2 break-all text-xs text-muted-foreground">
                  {item.bio.substring(0, 400)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <NewParticipants close={close} isOpen={isOpen} toggle={toggle} />
    </>
  );
};

export default AllParticipants;
