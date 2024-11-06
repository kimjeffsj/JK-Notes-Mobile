import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import { Note } from "@/shared/types/note";

interface NoteCardProps {
  note: Note;
  onDelete?: (id: string) => void;
}

const NoteCard = ({ note, onDelete }: NoteCardProps) => {
  const createdDate = new Date(note.updatedAt).toLocaleDateString();

  return (
    <TouchableOpacity
      className="bg-white p-4 rounded-lg shadow-sm mb-3"
      onPress={() => router.push(`/notes/${note._id}`)}
    >
      <Text className="text-xl font-bold mb-2">{note.title}</Text>

      <Text className="text-gray-600 mb-2" numberOfLines={2}>
        {note.content}
      </Text>

      <View className="flex-row justify-between items-center">
        <Text className="text-gray-400 text-sm">{createdDate}</Text>

        {onDelete && (
          <TouchableOpacity>
            <Text className="text-red-500">Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default NoteCard;
