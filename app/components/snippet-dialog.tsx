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
import { useSnippetForm } from "~/lib/useSnippetForm";

export function SnippetDialog() {
  const { isOpen, close, mode }: SnippetModalStore = useSnippetModalStore();
  const form = useSnippetForm(mode);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      close();
    }
  };

  return (
    < Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{(mode.type === 'create') ? 'Create snippet' : 'Edit snippet'}</DialogTitle>
        </DialogHeader>
        <SnippetInput form={form} onSaved={() => close()} />
      </DialogContent>
    </Dialog >
  )
}
