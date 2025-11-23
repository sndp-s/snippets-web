import { create } from "zustand";

type SnippetFiltersStore = {
  searchQuery: string;
  selectedTags: string[];
  tagMode: "any" | "all";

  setSearchQuery: (q: string) => void;
  setSelectedTags: (tags: string[]) => void;
  setTagMode: (mode: "any" | "all") => void;
  toggleTagMode: () => void;
};

export const useSnippetFiltersStore = create<SnippetFiltersStore>(
  (set, get) => ({
    searchQuery: "",
    selectedTags: [],
    tagMode: "any",

    setSearchQuery: (q) => set({ searchQuery: q }),

    setSelectedTags: (tags) => set({ selectedTags: tags }),

    setTagMode: (mode) => set({ tagMode: mode }),

    toggleTagMode: () => {
      const next = get().tagMode === "any" ? "all" : "any";
      set({ tagMode: next });
    },
  })
);
