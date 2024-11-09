import Header from "@/components/Header";
import NavMenu from "@/components/Nav/NavMenu";
import { useAppSelector } from "@/shared/hooks/useRedux";
import { Redirect, Stack } from "expo-router";
import { useState } from "react";

export default function AppLayout() {
  const { user } = useAppSelector((state) => state.auth);
  const [isNavOpen, setIsNavOpen] = useState(false);

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <>
      <Header onMenuPress={() => setIsNavOpen(true)} />
      <NavMenu isVisible={isNavOpen} onClose={() => setIsNavOpen(false)} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen
          name="notes"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
