import React from "react";
import { Toaster } from "~/components/ui/sonner";
import StashpadClone from "~/stashpadclone/stashpadclone";

export default function SnippetsApp() {
  return (
    <div className="h-screen max-w-[1600px] mx-auto flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border bg-muted/30">
        <h1 className="text-xl font-semibold tracking-tight">Snippets</h1>
      </header>

      <StashpadClone />

      {/* Toaster */}
      <Toaster position="top-right" richColors closeButton />
    </div >
  );
}
