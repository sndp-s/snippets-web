import { HOST, SNIPPETS_ENDPOINT } from "~/lib/consts";
import type { SnippetType } from "~/lib/types";

export async function fetchSnippetsFn({
  query,
  tags,
  tagMode,
}: {
  query: string;
  tags: string[];
  tagMode: "any" | "all";
}): Promise<SnippetType[]> {
  const params = new URLSearchParams({
    q: query,
    tags: tags.join(","),
    tag_mode: tagMode,
  });

  const res = await fetch(`${HOST}${SNIPPETS_ENDPOINT}?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch snippets");
  return res.json();
}

export async function createSnippetFn({
  text,
  tags,
  parentId,
}: {
  text: string;
  tags: string[];
  parentId?: string | null;
}) {
  const res = await fetch(`${HOST}${SNIPPETS_ENDPOINT}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      tags,
      parent: parentId ?? null,
    }),
  });

  if (!res.ok) throw new Error("Failed to save snippet");
  return res.json();
}
