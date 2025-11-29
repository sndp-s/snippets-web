import React from "react";
import { Button } from "~/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/ui/tooltip";
import StashpadClone from "~/stashpadclone/stashpadclone";
import { PlusIcon } from "lucide-react";
import { SnippetSearchControls } from "~/snippet-search-controls";
import { Kbd, KbdGroup } from "~/components/ui/kbd";
import { useSnippetModalStore } from "~/store/useSnippetModalStore";

export default function SnippetsApp() {
  const { openCreate } = useSnippetModalStore();

  React.useEffect(() => {
    // add global event handler for shortcuts
    const handler = (e: KeyboardEvent) => {
      // ⌘⇧S (Mac) or Ctrl+Shift+S (Windows/Linux) to open snippet input
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        openCreate();
      }
    };
    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="h-screen max-w-[1600px] mx-auto flex flex-col">
      {/* Header */}
      <header className="p-2 border-b border-border bg-muted/30 flex gap-2 justify-between">
        <SnippetSearchControls />
        <Button variant="outline" size="sm" onClick={() => openCreate()}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center gap-1">
                <PlusIcon /> Snippet
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <KbdGroup>
                <Kbd>⌘</Kbd>/<Kbd>Ctrl</Kbd>
                <Kbd>Shift</Kbd>
                <Kbd>S</Kbd>
              </KbdGroup>
            </TooltipContent>
          </Tooltip>
        </Button>
      </header >
      <StashpadClone />
    </div >
  );
}
