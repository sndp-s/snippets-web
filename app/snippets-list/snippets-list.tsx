import * as React from "react";
import type { SnippetType } from "~/lib/types";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Badge } from "~/components/ui/badge";

export function SnippetsList({
  snippets,
  onSnippetSelect,
  selectedSnippetId,
}: {
  snippets: SnippetType[] | null;
  onSnippetSelect: (id: string) => void;
  selectedSnippetId?: string | null;
}) {
  const listRef = React.useRef<HTMLUListElement>(null);

  // -----------------------------
  // Keyboard navigation
  // -----------------------------
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!snippets || snippets.length === 0) return;

    const currentIndex = snippets.findIndex((s) => s.id === selectedSnippetId);
    let nextIndex = currentIndex;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % snippets.length;
        break;
      case "ArrowUp":
        e.preventDefault();
        nextIndex =
          currentIndex === -1
            ? snippets.length - 1
            : (currentIndex - 1 + snippets.length) % snippets.length;
        break;
      case "Enter":
        e.preventDefault();
        if (currentIndex >= 0) onSnippetSelect(snippets[currentIndex].id);
        return;
      default:
        return;
    }

    if (nextIndex !== currentIndex && nextIndex >= 0) {
      onSnippetSelect(snippets[nextIndex].id);

      // Auto-scroll selected snippet into view
      const el = listRef.current?.children[nextIndex] as HTMLElement | null;
      el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  };

  // -----------------------------
  // Empty states
  // -----------------------------
  if (!snippets) {
    return (
      <p className="text-xs text-muted-foreground italic px-1">
        Loading snippets...
      </p>
    );
  }

  if (snippets.length === 0) {
    return (
      <p className="text-xs text-muted-foreground italic px-1">
        No snippets yet. Add one below!
      </p>
    );
  }

  // -----------------------------
  // Main list
  // -----------------------------
  return (
    <ScrollArea className="h-full">
      <ul
        ref={listRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="flex flex-col gap-[2px] pr-1 outline-none focus-visible:ring-1 focus-visible:ring-ring/30 rounded-md"
      >
        {snippets.map((snippet) => {
          const updatedAt = new Date(snippet.updated_dt)
            .toLocaleString([], {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
            .replace(",", "");

          const isSelected = snippet.id === selectedSnippetId;

          return (
            <li
              key={snippet.id}
              onClick={() => onSnippetSelect(snippet.id)}
              className={[
                "rounded border border-border/40 transition-colors cursor-pointer flex flex-col focus-visible:ring-1 focus-visible:ring-ring/40",
                isSelected
                  ? "bg-accent/40 border-accent"
                  : "bg-muted/20 hover:bg-muted/30",
              ].join(" ")}
            >
              {/* Text + timestamp */}
              <div className="p-2 flex gap-2 items-start">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] leading-snug whitespace-pre-wrap break-words text-foreground">
                    {snippet.text}
                  </p>
                </div>
                <div className="ml-2 flex-shrink-0 text-right text-[11px] text-muted-foreground">
                  {updatedAt}
                </div>
              </div>

              {/* Tags */}
              {snippet.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap px-2 pb-2">
                  {snippet.tags.map((t) => (
                    <Badge key={t.name}>
                      {t.name}
                    </Badge>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </ScrollArea>
  );
}
