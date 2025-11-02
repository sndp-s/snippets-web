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
// import StashpadClone from "~/stashpadclone/stashpadclone";
import { PlusIcon } from "lucide-react";

export default function SnippetsApp() {
  return (
    <div className="h-screen max-w-[1600px] mx-auto flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border bg-muted/30 flex justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Snippets</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"outline"} size={"sm"}>
              <PlusIcon /> Snippet
            </Button>
          </DialogTrigger>
          <DialogContent className="w-2xl">
            <DialogHeader>
              <DialogTitle>
                Create a new snippet
              </DialogTitle>
            </DialogHeader>
            <SnippetInput onSnippetSaved={() => { }} />
          </DialogContent>
        </Dialog>
      </header>

      {/* <StashpadClone /> */}

      {/* Toaster */}
      <Toaster position="top-right" richColors closeButton />
    </div >
  );
}
