export interface TagType {
  id: string;
  name: string;
  created_dt: Date;
  updated_dt: Date;
}
export interface SnippetType {
  text: string;
  title: string | null;
  created_dt: string;
  updated_dt: string;
  id: string;
  tags: TagType[];
}
