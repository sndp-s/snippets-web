import React from "react";
import { Button } from "~/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/ui/tooltip";
import StashpadClone from "~/stashpadclone/stashpadclone";
import { PlusIcon } from "lucide-react";
import type { SnippetType } from "~/lib/types";
import { HOST, SNIPPETS_ENDPOINT } from "~/lib/consts";
import { toast } from "sonner";
import { SnippetSearchControls } from "~/snippet-search-controls";
import { Kbd, KbdGroup } from "~/components/ui/kbd";
import { useSnippetStore } from "~/store/useSnippetStore";
import { useSnippetModalStore } from "~/store/useSnippetModalStore";

export default function SnippetsApp() {
  // const [snippets, setSnippets] = React.useState<SnippetType[] | null>(null);
  const { setOpen: setSnippetDialogOpen } = useSnippetModalStore();
  const { searchQuery, selectedTags, tagMode } = useSnippetStore();

  // const fetchSnippets = (searchQuery: string, tags: string[], tagMode: "any" | "all") => {
  //   fetch(`${HOST}${SNIPPETS_ENDPOINT}?q=${searchQuery}&tags=${tags.join(",")}&tag_mode=${tagMode}`)
  //     .then((res) => res.json())
  //     .then((data) => setSnippets(data))
  //     .catch((err) => {
  //       console.error("Something went wrong trying to fetch all snippets!");
  //       console.error(err);
  //       toast.error("Failed to fetch snippets");
  //     });
  // };

  React.useEffect(() => {
    // // fetch existing snippets
    // fetchSnippets(searchQuery, selectedTags, tagMode);

    // add global event handler for shortcuts
    const handler = (e: KeyboardEvent) => {
      // ⌘⇧S (Mac) or Ctrl+Shift+S (Windows/Linux) to open snippet input
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        setSnippetDialogOpen(true);
      }
    };
    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, []);

  // React.useEffect(() => {
  //   fetchSnippets(searchQuery, selectedTags, tagMode);
  // }, [searchQuery, selectedTags, tagMode]);

  return (
    <div className="h-screen max-w-[1600px] mx-auto flex flex-col">
      {/* Header */}
      <header className="p-2 border-b border-border bg-muted/30 flex gap-2 justify-between">
        <SnippetSearchControls />
        <Button variant="outline" size="sm" onClick={() => setSnippetDialogOpen(true)}>
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
      {/* <StashpadClone snippets={snippets} /> */}
    </div >
  );
}
