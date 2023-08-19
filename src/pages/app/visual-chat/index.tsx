// render mermaid chart
import React from "react";
import { useChat } from "ai/react";
import MermaidChart from "~/components/common/mermaidChart";

import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Icons } from "~/components/ui/icons";
import DashLayout from "~/components/layouts/dashlayout";
import { ScrollArea } from "~/components/ui/scroll-area";

const Chart = () => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    reload,
  } = useChat({});

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
    <div className="px-1">
      <div className="flex h-[94vh] flex-col">
        <div className="relative my-2 flex-1 justify-end overflow-auto rounded-sm border-2 py-4">
          <MermaidChart code={mermaidCode ?? ""} />
        </div>
        {!isLoading && otherText && (
          <ScrollArea className="my-2 max-h-[100px] flex-1 overflow-y-auto whitespace-break-spaces rounded-md bg-muted p-2 text-left text-sm">
            <>{otherText.trim()}</>
          </ScrollArea>
        )}
        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.metaKey) {
              handleSubmit(e);
            }
          }}
          className="flex w-full items-end space-x-3 pb-4"
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
  );
};

Chart.title = "Focus Group - Rumin AI";
Chart.layout = DashLayout;

export default Chart;
