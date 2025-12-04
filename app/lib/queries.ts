import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSnippetsFn, createSnippetFn, updateSnippetFn } from "~/lib/api";
import { toast } from "sonner";

export function useSnippetsQuery(
  query: string,
  tags: string[],
  tagMode: "any" | "all"
) {
  return useQuery({
    queryKey: ["snippets", { query, tags, tagMode }],
    queryFn: () => fetchSnippetsFn({ query, tags, tagMode }),
    staleTime: 1000 * 10, // 10 seconds
    placeholderData: (previous) => previous,
  });
}

export function useCreateSnippet() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createSnippetFn,
    onSuccess: () => {
      toast.success("Snippet saved!");
      qc.invalidateQueries({ queryKey: ["snippets"] });
    },
    onError: () => {
      toast.error("Failed to save snippet");
    },
  });
}

export function useUpdateSnippet() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateSnippetFn,
    onSuccess: () => {
      toast.success("Snippet updated!");
      qc.invalidateQueries({ queryKey: ["snippets"] });
    },
    onError: () => {
      toast.error("Failed to update snippet");
    },
  });
}
