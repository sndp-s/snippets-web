import React from "react";
import { toast } from "sonner";
import { SnippetsList } from "~/snippets-list/snippets-list";
import type { SnippetType } from "~/lib/types";
import { SnippetInput } from "~/snippet-input/snippet-input";
import { HOST, SNIPPETS_ENDPOINT, CHILDREN_SNIPPETS_ENDPOINT } from "~/lib/consts";

export default function StashpadClone({ snippets }: { snippets: SnippetType[] | null }) {
  // const [snippets, setSnippets] = React.useState<SnippetType[] | null>(null);
  const [childrenSnippets, setChildrenSnippets] = React.useState<SnippetType[] | null>(null);
  const [selectedSnippetId, setSelectedSnippetId] = React.useState<SnippetType["id"] | null>(null);


  // const fetchSnippets = () => {
  //   fetch(`${HOST}${SNIPPETS_ENDPOINT}`)
  //     .then((res) => res.json())
  //     .then((data) => setSnippets(data))
  //     .catch((err) => {
  //       console.error("Something went wrong trying to fetch all snippets!");
  //       console.error(err);
  //       toast.error("Failed to fetch snippets");
  //     });
  // };

  const fetchChildrenSnippets = (parentSnippetId: string) => {
    fetch(`${HOST}${CHILDREN_SNIPPETS_ENDPOINT(parentSnippetId)}`)
      .then((res) => res.json())
      .then((data) => setChildrenSnippets(data))
      .catch((err) => {
        console.error("Something went wrong trying to fetch children snippets!");
        console.error(err);
        toast.error("Failed to fetch children snippets");
      });
  };

  // React.useEffect(() => {
  //   fetchSnippets();
  // }, []);

  React.useEffect(() => {
    if (!selectedSnippetId) return;
    fetchChildrenSnippets(selectedSnippetId);
  }, [selectedSnippetId]);

  return (
    <main className="flex flex-1 overflow-hidden">
      {/* Left: main snippets section */}
      <section className="flex flex-col w-[50%] min-w-[400px] border-r border-border bg-background">
        {/* scrollable list */}
        <div className="flex-1 overflow-y-auto p-3">
          <SnippetsList
            snippets={snippets}
            onSnippetSelect={(id: string) => setSelectedSnippetId(id)}
            selectedSnippetId={selectedSnippetId}
          />
        </div>

        {/* sticky input at bottom */}
        {/* <div className="sticky bottom-0 bg-background border-t border-border p-3">
          <SnippetInput onSnippetSaved={fetchSnippets} />
        </div> */}
      </section>

      {/* Right: children snippets section */}
      <section className="flex-1 bg-muted/10 p-4 text-sm text-muted-foreground">
        {selectedSnippetId ? (
          <div
            key={selectedSnippetId}
            className="flex-1 overflow-y-auto p-3 gap-2 flex flex-col"
          >
            <SnippetsList snippets={childrenSnippets} onSnippetSelect={() => { }} />
            <SnippetInput
              parentId={selectedSnippetId}
              onSnippetSaved={() => {
                if (!selectedSnippetId) return;
                fetchChildrenSnippets(selectedSnippetId);
              }}
            />
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground/70 p-6 italic">
            Click on a snippet to view its children.
          </div>
        )}
      </section>

    </main>
  );

}