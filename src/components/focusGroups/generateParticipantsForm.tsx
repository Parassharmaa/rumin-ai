/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { Icons } from "../ui/icons";
import {
  ChatCompletionAction,
  type AIParticipantResponse,
} from "~/utils/interface";
import YAML from "yaml";
import { MagicWandIcon } from "@radix-ui/react-icons";
import { useChat } from "ai/react";
import React from "react";

interface Props {
  onData: (data: AIParticipantResponse | undefined) => void;
}

const GenerateParticipantsForm = ({ onData }: Props) => {
  const router = useRouter();

  const { messages, isLoading, append, setMessages } = useChat({
    body: {
      projectId: router.query.id as string,
      action: ChatCompletionAction.GenerateFGParticipants,
    },
  });

  React.useEffect(() => {
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage?.role == "assistant") {
        // parse yaml to json
        try {
          const data = YAML.parse(lastMessage.content);

          const validatedData = data
            .filter((item: any) => item !== null)
            .map((item: any) => {
              return {
                ...item,
                name: item.name || "",
                age: item.age.toString(),
                id: item.id.toString(),
                background: item.background || "",
                bio: item.bio || "",
                gender:
                  item.gender != "Male" || item.gender !== "Female"
                    ? "Other"
                    : item.gender,
              };
            });

          if (validatedData.length > 0) onData(validatedData);
        } catch (e) {
          // pass
        }
      }
    }
  }, [messages]);

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
              onClick={async () => {
                setMessages([]);
                await append({ role: "user", content: (idx + 1).toString() });
              }}
              key={idx}
            >
              <span>{idx + 1} Personas</span>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GenerateParticipantsForm;
