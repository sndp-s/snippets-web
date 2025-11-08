import { create } from "zustand";

type SnippetStore = {
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
};

export const useSnippetStore = create<SnippetStore>((set, get) => ({
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),

  selectedTags: [],
  setSelectedTags: (tags) => set({ selectedTags: tags }),
}));
