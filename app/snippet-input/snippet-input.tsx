import React from "react";
import { toast } from "sonner";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { HOST, SNIPPETS_ENDPOINT } from "~/lib/consts";

// Save snippet to backend
async function saveSnippet(snippetText: string, parentId?: string | null) {
  try {
    const response = await fetch(`${HOST}${SNIPPETS_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: snippetText,
        parent: parentId ?? null, // ✅ include parent if provided
      }),
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


export function SnippetInput({
  onSnippetSaved,
  parentId = null,
}: {
  onSnippetSaved: () => void;
  parentId?: string | null;
}) {
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
    await saveSnippet(snippetText, parentId); // ✅ send parentId
    setIsSubmitting(false);

    if (textareaRef.current) textareaRef.current.value = "";
    onSnippetSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Textarea
        ref={textareaRef}
        placeholder={
          parentId
            ? "Add a child snippet..."
            : "Type your snippet here..."
        }
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
