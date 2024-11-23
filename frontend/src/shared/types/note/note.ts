export interface UploadedImage {
  _id?: string;
  url: string;
  thumbnail: string;
  createdAt?: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  plainContent?: string;
  images: UploadedImage[];
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

export interface CreateNoteData {
  title: string;
  content: string;
  images: UploadedImage[];
}

export interface UpdateNoteData extends CreateNoteData {
  id: string;
}
