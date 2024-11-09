import Button from "@/components/Button";
import Input from "@/components/Input";
import Loading from "@/components/Loading";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useRedux";
import { editNote, detailNote } from "@/shared/store/slices/noteSlice";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditNote() {
  const { id } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const note = useAppSelector((state) =>
    state.notes.notes.find((note) => note._id === id)
  );

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  if (!note) {
    return <Loading />;
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await dispatch(
        editNote({ id: note._id, data: { title, content } })
      ).unwrap();
      Alert.alert("Success", "Note updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <Input
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter note title"
          inputClassName="mb-2"
        />
        <Input
          label="Content"
          value={content}
          onChangeText={setContent}
          placeholder="Enter note content"
          multiline
          numberOfLines={10}
          textAlignVertical="top"
          inputClassName="h-40 py-2"
        />

        <View className="flex-row space-x-2 mt-4">
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="secondary"
            className="flex-1"
          />
          <Button title="Save" onPress={handleSubmit} className="flex-1" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
