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
import { SnippetInput } from "~/snippet-input/snippet-input";
import StashpadClone from "~/stashpadclone/stashpadclone";
import { PlusIcon } from "lucide-react";
import type { SnippetType } from "~/lib/types";
import { HOST, SNIPPETS_ENDPOINT } from "~/lib/consts";
import { toast } from "sonner";


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

  React.useEffect(() => {
    fetchSnippets();
  }, []);

  // CMD+SHIFT+S to open snippet input (adjust as you want)
  React.useEffect(() => {
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
    <div className="h-screen max-w-[1600px] mx-auto flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border bg-muted/30 flex justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Snippets</h1>

        <div className="flex flex-col gap-2">

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <PlusIcon /> Snippet
              </Button>
            </DialogTrigger>
            <DialogContent className="w-2xl">
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
          <span className="self-center text-xs text-muted-foreground mr-2 hidden sm:inline">
            ⌘+shift+⏎ / Ctrl+shift+⏎ to save
          </span>
        </div>
      </header>

      <StashpadClone snippets={snippets} />

      {/* Toaster */}
      <Toaster position="top-right" richColors closeButton />
    </div >
  );
}
