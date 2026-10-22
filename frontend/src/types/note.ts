export interface Note {
  id: string;
  version: number;
  isOwner: boolean;
  title: string;
  content: string;
  collaborators?: string[];
  createdAt: string;
  updatedAt: string;
}
