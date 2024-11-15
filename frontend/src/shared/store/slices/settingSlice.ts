import { SettingsState, ThemeType } from "@/shared/types/settings/settings";
import { storage } from "@/utils/storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: SettingsState = {
  theme: "system",
  systemTheme: "light",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeType>) => {
      state.theme = action.payload;
      storage.setSettings({ theme: action.payload });
    },
    setSystemTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.systemTheme = action.payload;
    },
  },
});

export const { setTheme, setSystemTheme } = settingsSlice.actions;
export default settingsSlice.reducer;
