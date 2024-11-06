import { Note, NotesState } from "@/shared/types/note/note";
import api from "@/utils/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: NotesState = {
  notes: [],
  currentNote: null,
  isLoading: false,
  error: null,
};

export const fetchNotes = createAsyncThunk(
  "notes/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/notes");
      return response.data.notes;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notes"
      );
    }
  }
);

export const createNote = createAsyncThunk(
  "notes/create",
  async (data: { title: string; content: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/create", data);
      return response.data.note;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create a note"
      );
    }
  }
);

export const editNote = createAsyncThunk(
  "notes/edit",
  async (
    { id, data }: { id: string; data: { title: string; content: string } },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/notes/edit/${id}`, data);
      return response.data.editNote;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to edit note"
      );
    }
  }
);

export const deleteNote = createAsyncThunk(
  "notes/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/notes/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete note"
      );
    }
  }
);

const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setCurrentNote: (state, action) => {
      state.currentNote = action.payload;
    },
    clearCurrentNote: (state) => {
      state.currentNote = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetching Notes
      .addCase(fetchNotes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create Note
      .addCase(createNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes.unshift(action.payload);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Edit Note
      .addCase(editNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editNote.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.notes.findIndex(
          (note) => note._id === action.payload._id
        );
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      })
      .addCase(editNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Delete Note
      .addCase(deleteNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes = state.notes.filter((note) => note._id !== action.payload);
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentNote, clearCurrentNote, clearError } =
  noteSlice.actions;
export default noteSlice.reducer;
