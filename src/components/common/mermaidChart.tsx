/* eslint-disable @typescript-eslint/no-floating-promises */
// render mermaid chart
import React, { useEffect } from "react";
import mermaid from "mermaid";
import { useTheme } from "next-themes";
import { saveAs } from "file-saver";
import { Button } from "../ui/button";
import { CopyIcon, DownloadIcon, FileImageIcon, ImageIcon } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import html2canvas from "html2canvas";

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
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
    },
  });

  const copySvg = () => {
    const element = document.querySelector(`.mermaid-div-${id}`);
    const svg = element!.innerHTML;
    navigator.clipboard.writeText(svg);
  };

  const downloadSvg = () => {
    const element = document.querySelector(`.mermaid-div-${id}`);
    const svg = element!.innerHTML;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    saveAs(blob, "file.svg");
  };

  const downloadImage = (extension = "png") => {
    let mime = "image/png";

    if (extension === "jpg") {
      mime = "image/jpg";
    }
    const svgElement = document.querySelector(`.mermaid-div-${id}`);

    if (svgElement) {
      html2canvas(svgElement as HTMLElement, {
        scale: 4,
      }).then((canvas) => {
        const dataUrl = canvas.toDataURL(mime);
        const downloadLink = document.createElement("a");
        downloadLink.href = dataUrl;
        downloadLink.download = `image.${extension}`;
        downloadLink.click();
      });
    }
  };

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
      }
    };

    if (content) {
      checkParse();
    }
  }, [content, theme, id]);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          {content && <div className={`mermaid-div-${id} `} />}
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={copySvg} className="gap-2">
            <CopyIcon size="14px" />
            <div>Copy SVG</div>
          </ContextMenuItem>
          <ContextMenuItem onClick={downloadSvg} className="gap-2">
            <DownloadIcon size="14px" />
            <div>Save as SVG</div>
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => downloadImage("png")}
            className="gap-2"
          >
            <FileImageIcon size="14px" />
            <div>Save as PNG</div>
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => downloadImage("jpg")}
            className="gap-2"
          >
            <ImageIcon size="14px" />
            <div>Save as JPG</div>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};

export default MermaidChart;
