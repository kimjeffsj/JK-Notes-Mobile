import { useAppSelector } from "./useRedux";
import { useMemo } from "react";
import type { ThemeType } from "@/shared/types/settings/settings";

export const useTheme = () => {
  const { theme, systemTheme } = useAppSelector((state) => state.settings);

  const currentTheme = useMemo((): ThemeType => {
    if (theme === "system") {
      return systemTheme;
    }
    return theme;
  }, [theme, systemTheme]);

  return {
    currentTheme,
    theme,
  };
};
