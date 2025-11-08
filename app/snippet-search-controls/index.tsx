import React from "react";
import { Input } from "~/components/ui/input";
import { useSnippetStore } from "~/store/useSnippetStore";
import { TagPicker } from "~/tag-picker";

export function SnippetSearchControls() {
  const {
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
  } = useSnippetStore();

  return (
    <div className="flex items-center gap-2">
      {/* Text search */}
      <Input
        placeholder="Search snippets..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-xs"
      />
      <TagPicker
        value={selectedTags}
        onChange={(tags) => setSelectedTags(tags)}
        allowNewTags={false}
        placeholder="Filter by tags..."
      />
    </div>
  );
}
