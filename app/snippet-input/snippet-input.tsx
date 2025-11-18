import React from "react";
import { toast } from "sonner";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { HOST, SNIPPETS_ENDPOINT } from "~/lib/consts";
import { TagPicker } from "~/tag-picker";
import { Kbd, KbdGroup } from "~/components/ui/kbd";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/ui/tooltip";

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
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [confirmNoTags, setConfirmNoTags] = React.useState(false);
  const confirmButtonRef = React.useRef<HTMLButtonElement>(null);
  const textareaSelectionRef = React.useRef<{ start: number; end: number } | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (confirmNoTags) {
      confirmButtonRef.current?.focus();
    }
  }, [confirmNoTags]);

  const cancelNoTagConfirm = () => {
    setConfirmNoTags(false);

    // Restore cursor position
    if (textareaRef.current && textareaSelectionRef.current) {
      const { start, end } = textareaSelectionRef.current;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(start, end);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!snippet.trim()) {
      toast.warning("Enter snippet text");
      return;
    }

    if (tags.length === 0 && !confirmNoTags) {
      // Save cursor selection before showing confirm UI
      if (textareaRef.current) {
        textareaSelectionRef.current = {
          start: textareaRef.current.selectionStart,
          end: textareaRef.current.selectionEnd,
        };
      }

      setConfirmNoTags(true);
      return;
    }

    setIsSubmitting(true);
    await saveSnippet(snippet, tags, parentId);
    setIsSubmitting(false);

    setSnippet("");
    setTags([]);
    setConfirmNoTags(false);
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

      <TagPicker value={tags} onChange={setTags} allowNewTags={true} />

      {/* ACTION BUTTONS */}
      <div className="flex justify-between">
        {confirmNoTags ? (
          <div className="flex gap-2 ml-auto">
            <Button
              ref={confirmButtonRef}
              variant="destructive"
              onClick={handleSubmit}
            >
              Yes, save without tags
            </Button>
            <Button variant="outline" onClick={cancelNoTagConfirm}>
              Cancel
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={isSubmitting}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center gap-1">
                      {isSubmitting ? "Saving..." : "Save"}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <KbdGroup>
                      <Kbd>⌘</Kbd>/<Kbd>Ctrl</Kbd>
                      <Kbd>⏎</Kbd>
                    </KbdGroup>
                  </TooltipContent>
                </Tooltip>
              </Button>
            </div>

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
              <Button type="button" variant="outline" onClick={() => setTags([])}>
                Clear tags
              </Button>
            </div>
          </>
        )}
      </div>
    </form>
  );
}
