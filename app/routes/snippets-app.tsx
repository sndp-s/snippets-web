import React from "react";
import { Toaster } from "~/components/ui/sonner";
import { toast } from "sonner";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";

const HOST = "http://localhost:8000";
const SNIPPETS_ENDPOINT = "/api/snippets/";

interface SnippetType {
  text: string;
  title: string | null;
  tag: string[];
  created_dt: string;
  updated_dt: string;
  id: string;
}

export default function SnippetsApp() {
  const [snippets, setSnippets] = React.useState<SnippetType[] | null>(null);
  const [selectedSnippetId, setSelectedSnippetId] = React.useState<SnippetType["id"] | null>(null);

  const fetchSnippets = () => {
    fetch(`${HOST}${SNIPPETS_ENDPOINT}`)
      .then((res) => res.json())
      .then((data) => setSnippets(data))
      .catch((err) => {
        console.error("Something went wrong trying to fetch all snippets!");
        console.error(err);
        toast.error("Failed to fetch snippets");
      });
  };

  React.useEffect(() => {
    fetchSnippets();
  }, []);

  return (
    <div className="h-screen max-w-[1600px] mx-auto flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border bg-muted/30">
        <h1 className="text-xl font-semibold tracking-tight">Snippets</h1>
      </header>

      {/* Main two-column area */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left: main snippets section */}
        <section className="flex flex-col w-[50%] min-w-[400px] border-r border-border bg-background">
          {/* scrollable list */}
          <div className="flex-1 overflow-y-auto p-3">
            <SnippetsList snippets={snippets} onSnippetSelect={(id) => { setSelectedSnippetId(id) }} />
          </div>

          {/* sticky input at bottom */}
          <div className="sticky bottom-0 bg-background border-t border-border p-3">
            <SnippetInput onSnippetSaved={fetchSnippets} />
          </div>
        </section>

        {/* Right: children snippets section */}
        <section className="flex-1 bg-muted/10 p-4 text-sm text-muted-foreground">
          <p>selected snippet id {selectedSnippetId}</p>
        </section>
      </main>

      {/* Toaster */}
      <Toaster position="top-right" richColors closeButton />
    </div>
  );

}


function SnippetsList({ snippets, onSnippetSelect }: { snippets: SnippetType[] | null, onSnippetSelect: Function }) {
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
        {snippets.map((snippet, idx) => (
          <li
            key={`${snippet.updated_dt}-${idx}`}
            className="rounded-md border border-border/40 bg-muted/20 hover:bg-muted/30 transition-colors"
            onClick={() => { onSnippetSelect(snippet.id) }}
          >
            <div className="p-2">
              {snippet.title && (
                <p className="text-[13px] font-medium leading-tight mb-[2px]">
                  {snippet.title}
                </p>
              )}
              <p className="text-[13px] leading-snug whitespace-pre-wrap text-foreground">
                {snippet.text}
              </p>
              <p className="text-[11px] text-muted-foreground text-right mt-[3px]">
                {new Date(snippet.updated_dt).toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}


// Save snippet to backend
async function saveSnippet(snippetText: string) {
  try {
    const response = await fetch(`${HOST}${SNIPPETS_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // TODO: add CSRF token if needed
      },
      body: JSON.stringify({
        text: snippetText,
        // title: null,
        // tag_names: [],
      }),
      // credentials: "include", // in case CSRF cookies are needed
    });

    if (!response.ok) {
      throw new Error("Failed to save snippet");
    }

    toast.success("Snippet saved!");
  } catch (err) {
    console.error("Failed to save snippet:", err);
    toast.error("Failed to save snippet");
  }
}


function SnippetInput({ onSnippetSaved }: { onSnippetSaved: () => void }) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const snippetText = textareaRef.current?.value.trim();
    if (!snippetText) {
      toast.warning("Please enter some text.");
      return;
    }

    setIsSubmitting(true);
    await saveSnippet(snippetText);
    setIsSubmitting(false);

    if (textareaRef.current) textareaRef.current.value = "";
    onSnippetSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Textarea
        ref={textareaRef}
        placeholder="Type your snippet here..."
        className="text-sm"
        rows={4}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
