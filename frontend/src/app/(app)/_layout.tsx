import { useAppSelector } from "@/shared/hooks/useRedux";
import { Redirect, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppLayout() {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <SafeAreaView>
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
          name="notes"
          options={{
            title: "notes",
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            title: "Profile",
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
