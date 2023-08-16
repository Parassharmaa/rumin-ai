import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { Icons } from "../ui/icons";
import { type AIParticipantResponse } from "~/utils/interface";
import { MagicWandIcon } from "@radix-ui/react-icons";

interface Props {
  onData: (data: AIParticipantResponse | undefined) => void;
}

const GenerateParticipantsForm = ({ onData }: Props) => {
  const router = useRouter();
  const { mutate, isLoading } = api.focusGroup.generateParticipants.useMutation(
    {
      onSuccess(data) {
        onData(data);
      },
    }
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={isLoading}
          size="sm"
          variant="outline"
          className="gap-2"
        >
          {isLoading && <Icons.spinner className="animate-spin" />}

          {!isLoading && <MagicWandIcon />}
          {!isLoading && <div>Auto Generate</div>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {Array(6)
          .fill(0)
          .map((item, idx) => (
            <DropdownMenuItem
              onClick={() =>
                mutate({
                  projectId: router.query.id as string,
                  participantCount: idx + 1,
                })
              }
              key={idx}
            >
              <span>{idx + 1} Participants</span>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GenerateParticipantsForm;
