import { SettingsState, ThemeType } from "@/shared/types/settings/settings";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { storage } from "@/utils/storage";

const initialState: SettingsState = {
  theme: "system",
  systemTheme: "light",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeType>) => {
      const newTheme = action.payload;
      if (newTheme && ["light", "dark", "system"].includes(newTheme)) {
        console.log("Setting theme in reducer:", newTheme);
        state.theme = newTheme;

        storage.setSettings({ theme: newTheme });
      } else {
        console.warn("Invalid theme value:", newTheme);
        state.theme = "system";
      }
    },
    setSystemTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.systemTheme = action.payload;

      if (state.theme === "system") {
        storage.setSettings({ theme: "system" });
      }
    },
  },
});

export const { setTheme, setSystemTheme } = settingsSlice.actions;
export default settingsSlice.reducer;
