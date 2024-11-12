// src/app/(app)/notes/_layout.tsx
import { Stack } from "expo-router";

export default function NotesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="createNote"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="view/[id]"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
