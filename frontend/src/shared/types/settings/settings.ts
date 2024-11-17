export type ThemeType = "light" | "dark" | "system";

export interface SettingsState {
  theme: ThemeType;
  systemTheme: "light" | "dark";
}
