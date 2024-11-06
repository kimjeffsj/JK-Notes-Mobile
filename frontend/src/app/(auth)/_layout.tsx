import { useAppSelector } from "@/shared/hooks/useRedux";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { user } = useAppSelector((state) => state.auth);

  if (user) {
    return <Redirect href="/(app)/dashboard" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
