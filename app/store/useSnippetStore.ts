import { create } from "zustand";

type SnippetStore = {
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;

  tagMode: "all" | "any";
  setTagMode: (mode: "all" | "any") => void;
  toggleTagMode: () => void;
};

export const useSnippetStore = create<SnippetStore>((set, get) => ({
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),

  selectedTags: [],
  setSelectedTags: (tags) => set({ selectedTags: tags }),

  tagMode: "any",
  setTagMode: (mode) => set({ tagMode: mode }),
  toggleTagMode: () =>
    set({ tagMode: get().tagMode === "any" ? "all" : "any" }),
}));
