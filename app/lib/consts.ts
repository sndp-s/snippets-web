export const HOST = "http://localhost:8000";
export const SNIPPETS_ENDPOINT = "/api/snippets/";
export const CHILDREN_SNIPPETS_ENDPOINT = (snippetId: string) =>
  `/api/snippets/${snippetId}/children/`;
