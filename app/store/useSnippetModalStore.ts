import { create } from "zustand";
import type { SnippetType } from "~/lib/types";

export type SnippetModalMode =
  | { type: "create" }
  | { type: "edit"; snippet: SnippetType };

export type SnippetModalStore = {
  isOpen: boolean;
  mode: SnippetModalMode;

  openCreate: () => void;
  openEdit: (snippet: SnippetType) => void;
  setOpen: (open: boolean) => void;
  close: () => void;
};

export const useSnippetModalStore = create<SnippetModalStore>((set) => ({
  isOpen: false,
  mode: { type: "create" },

  openCreate: () => set({ isOpen: true, mode: { type: "create" } }),

  openEdit: (snippet) => set({ isOpen: true, mode: { type: "edit", snippet } }),

  setOpen: (open) => set({ isOpen: open }),

  close: () => set({ isOpen: false, mode: { type: "create" } }),
}));
