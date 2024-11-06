import { Stack } from "expo-router";

export default function NotesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="create"
        options={{
          title: "New Note",
          presentation: "modal",
          headerLeft: () => null,
        }}
      />

      <Stack.Screen
        name="view/[id]"
        options={{
          title: "Note Details",
        }}
      />

      <Stack.Screen
        name="edit/[id]"
        options={{
          title: "Edit Note",
        }}
      />
    </Stack>
  );
}
