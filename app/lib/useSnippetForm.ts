import { useEffect, useRef, useState } from "react";
import { useCreateSnippet, useUpdateSnippet } from "~/lib/queries";
import type { SnippetModalMode } from "~/store/useSnippetModalStore";
import { toast } from "sonner";

export function useSnippetForm(mode: SnippetModalMode) {
  const isEdit = mode.type === "edit";
  const snippet = isEdit ? mode.snippet : null;

  const [text, setText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [confirmNoTags, setConfirmNoTags] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const selectionRef = useRef<{ start: number; end: number } | null>(null);

  const createMutation = useCreateSnippet();
  const updateMutation = useUpdateSnippet();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Initialize form when editing
  useEffect(() => {
    if (isEdit && snippet) {
      setText(snippet.text);
      setTags(snippet.tags.map((t) => t.name));
    }
  }, [isEdit, snippet]);

  // If user adds tags after being asked to confirm a tag-less save,
  // automatically hide the "save without tags" confirmation.
  useEffect(() => {
    if (confirmNoTags && tags.length > 0) {
      setConfirmNoTags(false);
    }
  }, [tags, confirmNoTags]);

  const reset = () => {
    if (isEdit && snippet) {
      // restore original snippet content when editing
      setText(snippet.text);
      setTags(snippet.tags.map((t) => t.name));
    } else {
      // clear form in create mode
      setText("");
      setTags([]);
    }
    setConfirmNoTags(false);
  };

  /**
   * Submit the form.
   * Returns true if a snippet was actually saved/updated,
   * and false if submission was blocked (validation, confirm flow, etc).
   */
  const handleSubmit = async (): Promise<boolean> => {
    // require snippet text
    const trimmed = text.trim();
    if (!trimmed) {
      toast.warning("Enter snippet text");
      return false;
    }

    // ensure user wants to proceed without any tags
    if (tags.length === 0 && !confirmNoTags) {
      if (textareaRef.current) {
        selectionRef.current = {
          start: textareaRef.current.selectionStart,
          end: textareaRef.current.selectionEnd,
        };
      }
      setConfirmNoTags(true);
      return false;
    }

    // perform form action
    if (isEdit && snippet) {
      updateMutation.mutate({ id: snippet.id, text: trimmed, tags });
    } else {
      createMutation.mutate({ text: trimmed, tags });
    }

    // Reset form
    if (!isEdit) {
      setText("");
      setTags([]);
    }
    setConfirmNoTags(false);

    textareaRef.current?.focus();

    return true;
  };

  return {
    // state
    text,
    setText,
    tags,
    setTags,
    confirmNoTags,
    setConfirmNoTags,

    // refs
    textareaRef,
    selectionRef,

    // actions
    handleSubmit,
    reset,

    // meta
    isEdit,
    isSubmitting,
  };
}
