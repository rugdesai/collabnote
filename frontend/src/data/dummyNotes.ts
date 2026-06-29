import type { Note } from "../types/note";

export const dummyNotes: Note[] = [
  {
    id: 1,
    title: "CollabNote Roadmap",
    content: "Finish dashboard, CRUD and Socket.IO.",
    collaborators: ["Alice", "Bob"],
    updatedAt: "2 mins ago",
  },
  {
    id: 2,
    title: "Hackathon Ideas",
    content: "AI powered collaborative whiteboard.",
    collaborators: ["Charlie"],
    updatedAt: "Yesterday",
  },
  {
    id: 3,
    title: "Research Paper",
    content: "Complete literature review and finalize references.",
    collaborators: ["Alice", "Bob", "Charlie"],
    updatedAt: "Last Week",
  },
  {
    id: 4,
    title: "Meeting Notes",
    content: "Discuss project milestones and assign tasks.",
    collaborators: ["Bob"],
    updatedAt: "Today",
  },
];