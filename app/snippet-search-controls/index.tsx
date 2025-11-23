import React from "react";
import { Input } from "~/components/ui/input";
import { useSnippetFiltersStore } from "~/store/useSnippetFiltersStore";
import { TagPicker } from "~/tag-picker";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";

export function SnippetSearchControls() {
  const {
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    tagMode,
    setTagMode,
  } = useSnippetFiltersStore();

  return (
    <div className="flex items-center gap-2">
      {/* Text search */}
      <Input
        placeholder="Search snippets..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-xs"
      />

      {/* Tag selection */}
      <TagPicker
        value={selectedTags}
        onChange={(tags) => setSelectedTags(tags)}
        allowNewTags={false}
        placeholder="Filter by tags..."
      />

      {/* Match mode toggle */}
      <div className="flex items-center gap-1">
        <span className="text-sm text-muted-foreground">Match</span>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={tagMode}
          onValueChange={(val) => {
            if (val === "any" || val === "all") setTagMode(val);
          }}
        >
          <ToggleGroupItem value="any">Any</ToggleGroupItem>
          <ToggleGroupItem value="all">All</ToggleGroupItem>
        </ToggleGroup>
        <span className="text-sm text-muted-foreground">tags</span>
      </div>
    </div>
  );
}
