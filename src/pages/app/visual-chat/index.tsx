// render mermaid chart
import React from "react";
import { useChat } from "ai/react";
import MermaidChart from "~/components/common/mermaidChart";

import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Icons } from "~/components/ui/icons";
import DashLayout from "~/components/layouts/dashlayout";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useToast } from "~/components/ui/use-toast";

const Chart = () => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    reload,
  } = useChat({});

  const { toast } = useToast();

  const submitChat = (e: React.KeyboardEvent<HTMLFormElement>) => {
    e.preventDefault();
    // check input should be less than 500 characters
    if (input.length > 500) {
      toast({
        description: "Input should be less than 500 characters",
        duration: 3000,
      });

      return;
    }
    handleSubmit(e);
  };

  const chartCode = messages[messages.length - 1]?.content;
  let mermaidCode = "";

  // extract the mermaid code from markdown ```mermaid ... ``` and then extract the text outside it
  if (chartCode) {
    mermaidCode = chartCode.match(/```mermaid([\s\S]*)```/)?.[1] ?? "";
  }

  // if mermaid code is null try to get text after ```mermaid
  if (!mermaidCode) {
    mermaidCode = chartCode?.match(/```mermaid([\s\S]*)/)?.[1] ?? "";
  }

  // get the text which is not markdown
  const otherText = chartCode?.replace(/```mermaid([\s\S]*)```/, "") ?? "";

  return (
    <ScrollArea>
      <div className="h-[100%] px-2 md:mx-8">
        <div className="flex h-[89vh] flex-col sm:h-[89vh] lg:h-[90vh] 2xl:h-[95vh]">
          <div className="relative my-2 flex-1 justify-end overflow-auto rounded-sm border-2 py-4">
            <MermaidChart code={mermaidCode ?? ""} />
            {messages.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold">Visualize your ideas.</div>
                <div className="text-sm text-gray-500">
                  Send a message to get started
                </div>
              </div>
            )}
          </div>
          {!isLoading && otherText && (
            <ScrollArea className="my-2 max-h-28 overflow-y-auto whitespace-break-spaces rounded-md bg-muted p-2 text-left text-sm">
              <>{otherText.trim()}</>
            </ScrollArea>
          )}

          <form
            onSubmit={submitChat}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.metaKey) {
                submitChat(e);
              }
            }}
            className="flex items-end space-x-3"
            // className="fixed bottom-2 left-2 right-2 flex items-end space-x-3 md:left-10 md:right-10"
          >
            <Textarea
              minLength={1}
              placeholder="Create gantt chart..."
              onChange={handleInputChange}
              value={input}
              className="flex-1 resize-none rounded-md border bg-muted"
            />
            <div className="flex flex-col gap-1">
              <div>
                <Button
                  onClick={() => reload()}
                  className="w-full"
                  variant="outline"
                  disabled={isLoading || messages.length === 0}
                >
                  Retry
                </Button>
              </div>
              <div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Icons.spinner className="animate-spin" />}
                  {!isLoading && <div>Send</div>}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ScrollArea>
  );
};

Chart.title = "Focus Group - Rumin AI";
Chart.layout = DashLayout;

export default Chart;
