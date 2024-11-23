import { Note, NotesState, UploadedImage } from "@/shared/types/note/note";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/utils/api";

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
  async (
    data: {
      title: string;
      content: string;
      images: UploadedImage[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/notes/create", {
        title: data.title,
        content: data.content,
        images: data.images.map((img) => ({
          url: img.url,
          thumbnail: img.thumbnail,
          createdAt: img.createdAt || new Date().toISOString(),
        })),
      });

      return response.data.note;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create a note"
      );
    }
  }
);

export const detailNote = createAsyncThunk(
  "notes/detailNote",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/notes/${id}`);
      return response.data.note;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch note details"
      );
    }
  }
);

export const editNote = createAsyncThunk(
  "notes/edit",
  async (
    {
      id,
      data,
    }: {
      id: string;
      data: {
        title: string;
        content: string;
        images: UploadedImage[];
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/notes/edit/${id}`, {
        title: data.title,
        content: data.content,
        images: data.images.map((img) => ({
          url: img.url,
          thumbnail: img.thumbnail,
          createdAt: img.createdAt || new Date().toISOString(),
        })),
      });

      return {
        _id: id,
        ...data,
        ...response.data.updatedNote,
      };
    } catch (error: any) {
      console.error("Edit note error:", error);
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

export const deleteAllNotes = createAsyncThunk(
  "notes/deleteAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete("/notes/deleteAll");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete all notes"
      );
    }
  }
);

const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    updateNoteInState: (state, action) => {
      const { id, updates } = action.payload;
      const noteIndex = state.notes.findIndex((note) => note._id === id);
      if (noteIndex !== -1) {
        state.notes[noteIndex] = {
          ...state.notes[noteIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
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

      // Detail Note
      .addCase(detailNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(detailNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentNote = action.payload;

        const index = state.notes.findIndex(
          (note) => note._id === action.payload._id
        );
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      })
      .addCase(detailNote.rejected, (state, action) => {
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
        const noteIndex = state.notes.findIndex(
          (note) => note._id === action.payload._id
        );
        if (noteIndex !== -1) {
          state.notes[noteIndex] = {
            ...state.notes[noteIndex],
            ...action.payload,
            images: action.payload.images,
          };
          state.notes.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
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
      })

      // Delete All Notes
      .addCase(deleteAllNotes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAllNotes.fulfilled, (state) => {
        state.isLoading = false;
        state.notes = [];
        state.currentNote = null;
        state.error = null;
      })
      .addCase(deleteAllNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateNoteInState, clearError } = noteSlice.actions;
export default noteSlice.reducer;
