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

  const handleSnippetKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd+Enter (Mac) or Ctrl+Enter (Win/Linux)
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      const text = snippet.trim();
      if (!text) {
        toast.warning("Enter snippet text");
        return;
      }
      handleSubmit(e as any);
    }
  };


  const addTag = (tag: string) => {
    tag = tag.trim();
    if (!tag || tags.includes(tag)) return;
    setTags([...tags, tag]);
    setTagInput("");
    setSuggestions([]);
  };

  const removeTag = (tag: string) =>
    setTags(tags.filter((t) => t !== tag));

  const commitTag = (raw: string) => {
    const clean = raw.trim();
    if (!clean || tags.includes(clean)) return;
    setTags([...tags, clean]);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const val = tagInput;

    // ENTER = add tag
    if (e.key === "Enter" && val.trim()) {
      e.preventDefault();
      commitTag(val);
      setTagInput("");
      return;
    }

    // SPACE or COMMA = auto-tag
    if ((e.key === " " || e.key === ",") && val.trim()) {
      e.preventDefault();
      commitTag(val);
      setTagInput("");
      return;
    }

    // BACKSPACE deletes last tag if empty
    if (e.key === "Backspace" && !val && tags.length) {
      setTags(tags.slice(0, -1));
    }

    // ESC clears input
    if (e.key === "Escape") {
      setTagInput("");
      setSuggestions([]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    const parts = text.split(/[\s,]+/); // split by space OR comma
    parts.forEach(commitTag);
    e.preventDefault();
    setTagInput("");
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
        onKeyDown={handleSnippetKeyDown}
        placeholder="Type your snippet..."
        className="text-sm min-h-72"
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
          onPaste={handlePaste}
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
