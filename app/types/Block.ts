export interface Block {
  id: string;
  type: "text" | "heading" | "list" | "image";
  content: any;
}
