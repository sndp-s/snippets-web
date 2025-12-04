import React from "react";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { TagPicker } from "~/tag-picker";
import { useSnippetForm } from "~/lib/useSnippetForm";

export function SnippetInput({
  form,
  onSaved,
}: {
  form: ReturnType<typeof useSnippetForm>;
  onSaved?: () => void;
}) {
  const {
    text,
    setText,
    tags,
    setTags,
    confirmNoTags,
    setConfirmNoTags,
    textareaRef,
    handleSubmit,
    handleKeyDown,
    isEdit,
  } = form;

  const submitAndNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    const didSave = await handleSubmit();
    if (didSave) {
      onSaved?.();
    }
  };

  const confirmSaveWithoutTags = async () => {
    const didSave = await handleSubmit();
    if (didSave) {
      onSaved?.();
    }
  };

  return (
    <form onSubmit={submitAndNotify} className="flex flex-col gap-2">
      <Textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isEdit ? "Edit snippet..." : "Type your snippet..."}
        className="text-sm min-h-72"
      />

      <TagPicker value={tags} onChange={setTags} />

      {confirmNoTags ? (
        <div className="flex gap-2 ml-auto">
          <Button type="button" onClick={confirmSaveWithoutTags}>
            {isEdit ? "Update without tags" : "Save without tags"}
          </Button>
          <Button variant="outline" onClick={() => setConfirmNoTags(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex justify-between">
          <Button type="submit">{isEdit ? "Update" : "Save"}</Button>

          <div className="flex gap-2">
            {!isEdit && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setText("")}
              >
                Clear text
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => setTags([])}>
              Clear tags
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
