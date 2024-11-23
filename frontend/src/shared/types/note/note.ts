export interface Note {
  _id: string;
  title: string;
  content: string;
  plainContent?: string;
  creator: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotesState {
  notes: Note[];
  currentNote: Note | null;
  isLoading: boolean;
  error: string | null;
}
