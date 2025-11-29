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
  const { isOpen, close }: SnippetModalStore = useSnippetModalStore();
  return (
    < Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new snippet</DialogTitle>
        </DialogHeader>
        <SnippetInput onSnippetSaved={() => close()} />
      </DialogContent>
    </Dialog >
  )
}
