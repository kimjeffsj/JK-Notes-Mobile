export interface NoteImage {
  _id: string;
  url: string;
  caption?: string;
  createdAt: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  plainContent?: string;
  images: NoteImage[];
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
