export interface LawDetail {
  title: string;
  content: string;
}

export interface LawNodeData {
  id: string;
  article: string;
  name: string;
  x: string;
  y: string;
  details: LawDetail[];
}