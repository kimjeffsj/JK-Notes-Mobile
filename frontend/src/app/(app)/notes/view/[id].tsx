import Button from "@/components/Button";
import Loading from "@/components/Loading";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useRedux";
import { deleteNote, detailNote } from "@/shared/store/slices/noteSlice";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NoteDetail() {
  const { id } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const note = useAppSelector((state) =>
    state.notes.notes.find((note) => note._id === id)
  );

  if (!note) {
    return <Loading />;
  }

  const handleDelete = async () => {
    try {
      await dispatch(deleteNote(note._id)).unwrap();
      Alert.alert("Success", "Note deleted successfully");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const confirmDelete = () => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: handleDelete, style: "destructive" },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold">{note.title}</Text>
          <View>
            <Button
              title="Edit"
              onPress={() => router.push(`/notes/edit/${note._id}`)}
              variant="secondary"
              className="px-4"
            />
            <Button
              title="Delete"
              onPress={confirmDelete}
              variant="danger"
              className="px-4"
            />
          </View>
        </View>

        <Text className="text-gray-600 text-base">{note.content}</Text>

        <Text className="text-gray-400 mt-4 text-sm">
          Last updated: {new Date(note.updatedAt).toLocaleString()}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
