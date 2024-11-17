import "../global.css";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { Slot, SplashScreen } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { store } from "@/shared/store";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useRedux";
import { checkAuth } from "@/shared/store/slices/authSlice";

import { Appearance, View } from "react-native";
import { setSystemTheme } from "@/shared/store/slices/settingSlice";
import { storage } from "@/utils/storage";
import { ThemeProvider } from "@/provider/ThemeProvider";

SplashScreen.preventAutoHideAsync();

function RootNav() {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const themeListener = Appearance.addChangeListener(({ colorScheme }) => {
      dispatch(setSystemTheme(colorScheme === "dark" ? "dark" : "light"));
    });

    dispatch(
      setSystemTheme(Appearance.getColorScheme() === "dark" ? "dark" : "light")
    );

    dispatch(checkAuth());

    return () => {
      themeListener.remove();
    };
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) return null;

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <Slot />
    </View>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemeProvider>
            <RootNav />
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
