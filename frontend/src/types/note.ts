export interface Note {
  id: string;
  title: string;
  content: string;
  collaborators?: string[];
  createdAt: string;
  updatedAt: string;
}
