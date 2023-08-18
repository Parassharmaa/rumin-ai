/* eslint-disable @typescript-eslint/no-floating-promises */
// render mermaid chart
import React, { useEffect } from "react";
import mermaid from "mermaid";
import { useTheme } from "next-themes";

const MermaidChart = ({
  code,
  id = "graphDiv",
}: {
  code: string | null;
  id?: string;
}) => {
  const { theme } = useTheme();

  const [content, setContent] = React.useState<string>("");

  useEffect(() => {
    if (code) {
      setContent(code);
    }
  }, [code]);

  mermaid.initialize({
    startOnLoad: false,
    theme,
    securityLevel: "loose",
  });

  useEffect(() => {
    const checkParse = async () => {
      try {
        await mermaid.parse(content);

        const element = document.querySelector(`.mermaid-div-${id}`);

        const graphDefinition = content;

        const data = await mermaid.render(id, graphDefinition);

        element!.innerHTML = data.svg;

        if (data.bindFunctions) {
          data.bindFunctions(element!);
        }
      } catch (e) {
        // pass
        // console.log(e);
      }
    };

    if (content) {
      checkParse();
    }
  }, [content, theme, id]);

  return <div className={`mermaid-div-${id}`} />;
};

export default MermaidChart;
