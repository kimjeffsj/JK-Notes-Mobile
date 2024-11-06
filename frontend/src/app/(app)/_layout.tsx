import { useAppSelector } from "@/shared/hooks/useRedux";
import { Redirect, Stack } from "expo-router";

export default function AppLayout() {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="dashboard"
        options={{ title: "My Notes", headerShown: false }}
      />
      <Stack.Screen
        name="new-note"
        options={{
          title: "New Note",
          presentation: "modal",
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="Profile"
        options={{
          title: "Profile",
        }}
      />
    </Stack>
  );
}
