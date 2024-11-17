import { useAppSelector } from "@/shared/hooks/useRedux";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { theme, systemTheme } = useAppSelector((state) => state.settings);
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    const effectiveTheme = theme === "system" ? systemTheme : theme;
    setColorScheme(effectiveTheme);
  }, [theme, systemTheme, setColorScheme]);

  return <>{children}</>;
};
