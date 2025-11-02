export const HOST = "http://localhost:8000";
export const SNIPPETS_ENDPOINT = "/api/snippets/";
export const CHILDREN_SNIPPETS_ENDPOINT = (snippetId: string) =>
  `/api/snippets/${snippetId}/children/`;
export const GET_TAGS_ENDPOINT = (query: string) => `/api/tags/?q=${query}`;
