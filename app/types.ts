export type Job = {
  id: string;
  // user        User?
  // userId      string
  // board       Board
  // boardId     Int
  company: string;
  title: string;
  url?: string | null;
  description: string;
  status?: string | null;
  createdAt: Date;
  updatedAt: Date;
};
