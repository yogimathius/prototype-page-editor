export interface Block {
  id: string;
  type: string;
  content: string;
  order: number;
  pageId?: string;
}
