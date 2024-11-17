import { Note } from "@/shared/types/note/note";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface NoteListItemProps {
  note: Note;
  isPinned?: boolean;
}

const NoteListItem = ({ note, isPinned }: NoteListItemProps) => {
  const formattedDate = new Date(note.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year:
      new Date(note.updatedAt).getFullYear() !== new Date().getFullYear()
        ? "numeric"
        : undefined,
  });

  return (
    <TouchableOpacity
      className="px-4 py-3 bg-background dark:bg-background-dark 
        active:bg-background-secondary dark:active:bg-background-dark-secondary"
      onPress={() => router.push(`/notes/view/${note._id}`)}
    >
      <View className="flex-row items-center">
        {isPinned && (
          <Ionicons
            name="pin"
            size={16}
            color="#dfa46d"
            style={{ transform: [{ rotate: "45deg" }] }}
            className="mr-2"
          />
        )}

        <View className="flex-1">
          <Text
            className="text-primary dark:text-primary-dark font-medium text-lg mb-1"
            numberOfLines={1}
          >
            {note.title}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-text-secondary dark:text-text-dark-secondary mr-2">
              {formattedDate}
            </Text>
            <Text
              className="text-text-secondary dark:text-text-dark-secondary flex-1"
              numberOfLines={1}
            >
              {note.content}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NoteListItem;
