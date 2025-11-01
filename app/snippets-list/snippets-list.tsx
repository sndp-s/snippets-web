import type { SnippetType } from "~/lib/types";
import { ScrollArea } from "~/components/ui/scroll-area";

export function SnippetsList({
  snippets,
  onSnippetSelect,
  selectedSnippetId,
}: {
  snippets: SnippetType[] | null;
  onSnippetSelect: (id: string) => void;
  selectedSnippetId?: string | null;
}) {
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

  return (
    <ScrollArea className="h-full">
      <ul className="flex flex-col gap-[2px] pr-1">
        {snippets.map((snippet, idx) => {
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
              key={`${snippet.updated_dt}-${idx}`}
              onClick={() => onSnippetSelect(snippet.id)}
              className={[
                "rounded border border-border/40 transition-colors cursor-pointer",
                isSelected
                  ? "bg-accent/40 border-accent"
                  : "bg-muted/20 hover:bg-muted/30",
              ].join(" ")}
            >
              <div className="p-2">
                {(snippet.title || updatedAt) && (
                  <div className="flex justify-between items-baseline mb-[2px]">
                    {snippet.title ? (
                      <p className="text-[13px] font-medium leading-tight truncate">
                        {snippet.title}
                      </p>
                    ) : (
                      <span className="text-[13px] text-muted-foreground">
                        untitled
                      </span>
                    )}
                    <p className="text-[11px] text-muted-foreground ml-2 shrink-0">
                      {updatedAt}
                    </p>
                  </div>
                )}
                <p className="text-[13px] leading-snug whitespace-pre-wrap text-foreground">
                  {snippet.text}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </ScrollArea>
  );
}