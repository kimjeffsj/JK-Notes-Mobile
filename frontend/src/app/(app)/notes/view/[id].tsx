import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useRedux";
import { deleteNote } from "@/shared/store/slices/noteSlice";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function NoteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const note = useAppSelector((state) =>
    state.notes.notes.find((note) => note._id === id)
  );

  const formattedDate = useMemo(() => {
    if (!note) return "";

    const date = new Date(note.updatedAt);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",

        hour12: true,
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  }, [note?.updatedAt]);

  const handleDelete = useCallback(async () => {
    if (!note) return;

    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await dispatch(deleteNote(note._id)).unwrap();
            Alert.alert("Success", "Note deleted successfully", [
              {
                text: "OK",
                onPress: () => router.back(),
              },
            ]);
          } catch (error: any) {
            Alert.alert("Error", "Failed to delete note");
          }
        },
      },
    ]);
  }, [note, dispatch]);

  const handleEdit = useCallback(() => {
    if (!note) return;
    router.push(`/notes/edit/${note._id}`);
  }, [note]);

  if (!note) {
    return <Loading />;
  }

  return (
    <KeyboardAvoidingView className="flex-1 bg-background">
      <Header
        showBack
        title={note.title}
        rightElement={
          <View className="flex-row items-center">
            <TouchableOpacity className="p-2" onPress={handleEdit}>
              <Ionicons name="create-outline" size={22} color="#1a1a1a" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} className="p-2">
              <Ionicons name="trash-outline" size={22} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView className="flex-1 p-4">
        <View className="py-4 border-b border-border">
          <Text className="text-2xl font-bold text-primary">{note.title}</Text>
          <Text className="text-text-secondary text-sm mt-1">
            Last Updated: {formattedDate}
          </Text>
        </View>
        <View className="py-4">
          <Text className="text-primary text-base leading-6">
            {note.content}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
