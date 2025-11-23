import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { SnippetInput } from "~/snippet-input/snippet-input";
import type { SnippetModalStore } from "~/store/useSnippetModalStore";
import { useSnippetModalStore } from "~/store/useSnippetModalStore";

export function SnippetDialog() {
  const { isOpen, setOpen }: SnippetModalStore = useSnippetModalStore();
  return (
    < Dialog open={isOpen} onOpenChange={setOpen} >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new snippet</DialogTitle>
        </DialogHeader>
        <SnippetInput
          onSnippetSaved={() => {
            // fetchSnippets(searchQuery, selectedTags, tagMode);
            // setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog >
  )
}