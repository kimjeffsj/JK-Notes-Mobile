import { AuthState } from "./auth/auth";
import { NotesState } from "./note/note";

export interface RootState {
  auth: AuthState;
  notes: NotesState;
}
