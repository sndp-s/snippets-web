import React from "react";
import { toast } from "sonner";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge"; // ✅ using shadcn badge
import { GET_TAGS_ENDPOINT, HOST, SNIPPETS_ENDPOINT } from "~/lib/consts";

async function saveSnippet(snippetText: string, tags: string[], parentId?: string | null) {
  try {
    const response = await fetch(`${HOST}${SNIPPETS_ENDPOINT}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: snippetText,
        tags,
        parent: parentId ?? null,
      }),
    });

    if (!response.ok) throw new Error("Failed to save snippet");
    toast.success("Snippet saved!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to save snippet");
  }
}

export function SnippetInput({
  onSnippetSaved,
  parentId = null,
}: {
  onSnippetSaved: () => void;
  parentId?: string | null;
}) {
  const [snippet, setSnippet] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const tagInputRef = React.useRef<HTMLInputElement>(null);

  // ✅ fetch tag suggestions as user types (search 200ms debounce)
  React.useEffect(() => {
    if (!tagInput.trim()) {
      setSuggestions([]);
      return;
    }

    const c = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`${HOST}${GET_TAGS_ENDPOINT(tagInput)}`, { signal: c.signal });
        // debugger
        const data = await res.json();
        setSuggestions(data.map((t: any) => t.name));
      } catch (e) {
        console.log(e)
      }
    }, 200);

    return () => {
      c.abort();
      clearTimeout(t);
    };
  }, [tagInput]);

  const addTag = (tag: string) => {
    tag = tag.trim();
    if (!tag || tags.includes(tag)) return;
    setTags([...tags, tag]);
    setTagInput("");
    setSuggestions([]);
  };

  const removeTag = (tag: string) =>
    setTags(tags.filter((t) => t !== tag));

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    }
    if (e.key === "Backspace" && !tagInput && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
    if (e.key === "Escape") {
      setTagInput("");
      setSuggestions([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!snippet.trim()) {
      toast.warning("Enter snippet text");
      return;
    }

    setIsSubmitting(true);
    await saveSnippet(snippet, tags, parentId);
    setIsSubmitting(false);

    setSnippet("");
    setTagInput("");
    setTags([]);
    onSnippetSaved();
    textareaRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {/* TEXT INPUT */}
      <Textarea
        ref={textareaRef}
        value={snippet}
        onChange={(e) => setSnippet(e.target.value)}
        placeholder="Type your snippet..."
        rows={6}
        className="text-sm"
      />

      {/* TAGS INLINE */}
      <div className="flex flex-wrap items-center gap-1 border rounded-md px-2 py-1">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => removeTag(tag)}
          >
            {tag}
            <span className="text-xs">×</span>
          </Badge>
        ))}

        <input
          ref={tagInputRef}
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          placeholder="add tag"
          className="flex-1 bg-transparent outline-none text-sm py-1"
        />
      </div>

      {/* Tag suggestions */}
      {suggestions.length > 0 && (
        <div className="border rounded-md shadow p-2 text-sm flex flex-wrap gap-1">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={(e) => {
                e.preventDefault();
                addTag(s);
              }}
              className="px-2 py-1 border rounded hover:bg-gray-100"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSnippet("");
              textareaRef.current?.focus();
            }}
          >
            Clear text
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setTags([])}
          >
            Clear tags
          </Button>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
