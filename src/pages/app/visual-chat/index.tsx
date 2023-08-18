// render mermaid chart
import React from "react";
import { useChat } from "ai/react";
import MermaidChart from "~/components/common/mermaidChart";
import { ThemeToggle } from "~/components/common/themeToggle";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Icons } from "~/components/ui/icons";
import DashLayout from "~/components/layouts/dashlayout";

const Chart = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();

  const chartCode = messages[messages.length - 1]?.content;
  let mermaidCode = "";

  // extract the mermaid code from markdown ```mermaid ... ``` and then extract the text outside it
  if (chartCode) {
    mermaidCode = chartCode.match(/```mermaid([\s\S]*)```/)?.[1] ?? "";
  }

  // get the text which is not markdown
  const otherText = chartCode?.replace(/```mermaid([\s\S]*)```/, "") ?? "";

  return (
    <div>
      <div className="flex h-[82vh] flex-col">
        <div className="flex-1 justify-end overflow-y-auto p-4">
          <div className="text-center">
            <MermaidChart code={mermaidCode ?? ""} />

            {!isLoading && (
              <div className="my-2 whitespace-break-spaces text-justify text-sm">
                {otherText}
              </div>
            )}
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          // submit on cmd + enter
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.metaKey) {
              handleSubmit(e);
            }
          }}
          className="flex w-full items-end space-x-3  p-4"
        >
          <Textarea
            minLength={1}
            placeholder="Visualize Solar System..."
            onChange={handleInputChange}
            value={input}
            className="flex-1 resize-none rounded-md border bg-muted"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Icons.spinner className="animate-spin" />}
            {!isLoading && <div>Send</div>}
          </Button>
        </form>
      </div>
    </div>
  );
};

Chart.title = "Focus Group - Rumin AI";
Chart.layout = DashLayout;

export default Chart;
