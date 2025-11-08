import React from "react";
import { Toaster } from "~/components/ui/sonner";
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "~/components/ui/tooltip";
import { SnippetInput } from "~/snippet-input/snippet-input";
import StashpadClone from "~/stashpadclone/stashpadclone";
import { PlusIcon } from "lucide-react";
import type { SnippetType } from "~/lib/types";
import { HOST, SNIPPETS_ENDPOINT } from "~/lib/consts";
import { toast } from "sonner";
import { SnippetSearchControls } from "~/snippet-search-controls";
import { Kbd, KbdGroup } from "~/components/ui/kbd";

export default function SnippetsApp() {
  const [snippets, setSnippets] = React.useState<SnippetType[] | null>(null);
  const [open, setOpen] = React.useState(false);

  const fetchSnippets = () => {
    fetch(`${HOST}${SNIPPETS_ENDPOINT}`)
      .then((res) => res.json())
      .then((data) => setSnippets(data))
      .catch((err) => {
        console.error("Something went wrong trying to fetch all snippets!");
        console.error(err);
        toast.error("Failed to fetch snippets");
      });
  };

  // CMD+SHIFT+S to open snippet input (adjust as you want)
  React.useEffect(() => {
    // fetch existing snippets
    fetchSnippets();

    // add global event handler for shortcuts
    const handler = (e: KeyboardEvent) => {
      // ⌘⇧S (Mac) or Ctrl+Shift+S (Windows/Linux)
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <TooltipProvider>
      <div className="h-screen max-w-[1600px] mx-auto flex flex-col">
        {/* Header */}
        <header className="p-2 border-b border-border bg-muted/30 flex gap-2 justify-between">
          <SnippetSearchControls />
          <div className="flex flex-col gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
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
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a new snippet</DialogTitle>
                </DialogHeader>
                <SnippetInput
                  onSnippetSaved={() => {
                    fetchSnippets();
                    setOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </header >

        <StashpadClone snippets={snippets} />

      </div >
      {/* Toaster */}
      <Toaster position="top-right" richColors closeButton />
    </TooltipProvider>
  );
}
