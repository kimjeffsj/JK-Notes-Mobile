import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/shared/store/slices/authSlice";
import noteReducer from "@/shared/store/slices/noteSlice";
import settingsReducer from "@/shared/store/slices/settingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: noteReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
