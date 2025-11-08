import React from "react";
import { Badge } from "~/components/ui/badge";
import { HOST, GET_TAGS_ENDPOINT } from "~/lib/consts";
import { Button } from "~/components/ui/button";

type TagPickerProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  allowNewTags?: boolean; // false for search, true for creation
  placeholder?: string;
  debounceMs?: number;
};

export function TagPicker({
  value,
  onChange,
  allowNewTags = true,
  placeholder = "Add tag",
  debounceMs = 200,
}: TagPickerProps) {
  const [input, setInput] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);

  // --- fetch tag suggestions with debounce ---
  React.useEffect(() => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    const c = new AbortController();
    const t = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`${HOST}${GET_TAGS_ENDPOINT(input)}`, {
          signal: c.signal,
        });
        const data = await res.json();
        setSuggestions(data.map((t: any) => t.name));
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      clearTimeout(t);
      c.abort();
    };
  }, [input]);

  // --- tag manipulation ---
  const addTag = (tag: string) => {
    const clean = tag.trim();
    if (!clean || value.includes(clean)) return;
    onChange([...value, clean]);
    setInput("");
    setSuggestions([]);
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const val = input.trim();

    if (e.key === "Enter" && val) {
      e.preventDefault();
      if (allowNewTags || suggestions.includes(val)) addTag(val);
    }

    if ((e.key === " " || e.key === ",") && val) {
      e.preventDefault();
      if (allowNewTags) addTag(val);
    }

    if (e.key === "Backspace" && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }

    if (e.key === "Escape") {
      setInput("");
      setSuggestions([]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    const parts = text.split(/[\s,]+/);
    parts.forEach((p) => {
      if (allowNewTags) addTag(p);
    });
    e.preventDefault();
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-1 border rounded-md px-2 py-1">
        {value.map((tag) => (
          <Badge
            key={tag}
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => removeTag(tag)}
          >
            {tag}
            <span className="text-xs">×</span>
          </Badge>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm py-1"
        />
      </div>

      {(suggestions.length > 0 || loading) && (
        <div className="absolute left-0 right-0 top-full mt-1 border rounded-md bg-background shadow p-2 text-sm z-10">
          {/* TODO: make 'searching' to 'results' transition slower and natural */}
          {loading && <p>searching tags...</p>}
          {suggestions.map((s) => (
            <Badge
              key={s}
              onClick={(e) => {
                e.preventDefault();
                addTag(s);
              }}
              asChild
              className="px-2 py-1 border rounded hover:bg-muted mr-1 mb-1"
            >
              <Button size={"sm"}>
                {s}
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
