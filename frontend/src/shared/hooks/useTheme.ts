import { useAppSelector } from "./useRedux";
import { useMemo } from "react";
import type { ThemeType } from "@/shared/types/settings/settings";

export const useTheme = () => {
  const { theme, systemTheme } = useAppSelector((state) => state.settings);

  const isDark = useMemo(() => {
    return theme === "dark" || (theme === "system" && systemTheme === "dark");
  }, [theme, systemTheme]);

  const currentTheme = useMemo((): ThemeType => {
    console.log("Current theme state:", { theme, systemTheme });
    return theme === "system" ? systemTheme : theme;
  }, [theme, systemTheme]);

  return { isDark, currentTheme, theme, systemTheme };
};
