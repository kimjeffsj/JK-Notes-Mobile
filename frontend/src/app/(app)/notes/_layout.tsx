import { Stack } from "expo-router";

export default function NotesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="createNote" />
      <Stack.Screen name="edit/[id]" />
      <Stack.Screen name="view/[id]" />
    </Stack>
  );
}
