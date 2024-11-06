import "../global.css";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { Slot, SplashScreen } from "expo-router";

import { store } from "@/shared/store";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useRedux";
import { checkAuth } from "@/shared/store/slices/authSlice";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

function RootNav() {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

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
      <SafeAreaProvider>
        <RootNav />
      </SafeAreaProvider>
    </Provider>
  );
}
