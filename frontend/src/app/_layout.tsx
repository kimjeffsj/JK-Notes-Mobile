import "../global.css";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { Slot, SplashScreen } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { store } from "@/shared/store";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useRedux";
import { checkAuth } from "@/shared/store/slices/authSlice";
import { useTheme } from "@/shared/hooks/useTheme";
import { Appearance, View } from "react-native";
import { setSystemTheme } from "@/shared/store/slices/settingSlice";

SplashScreen.preventAutoHideAsync();

function RootNav() {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const { currentTheme } = useTheme();

  useEffect(() => {
    const themeListener = Appearance.addChangeListener(({ colorScheme }) => {
      dispatch(setSystemTheme(colorScheme === "dark" ? "dark" : "light"));
    });

    dispatch(
      setSystemTheme(Appearance.getColorScheme() === "dark" ? "dark" : "light")
    );

    return () => {
      themeListener.remove();
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <RootNav />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
