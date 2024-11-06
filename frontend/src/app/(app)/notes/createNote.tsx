import Button from "@/components/Button";
import Input from "@/components/Input";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useRedux";
import { createNote } from "@/shared/store/slices/noteSlice";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";

export default function CreateNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.notes);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await dispatch(createNote({ title, content })).unwrap();
      Alert.alert("Success", "Note created successfully", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create note");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Input
        label="Title"
        value={title}
        onChangeText={setTitle}
        placeholder="Enter your note title"
      />

      <Input
        label="Content"
        value={content}
        onChangeText={setContent}
        placeholder="Enter note content"
        multiline
        numberOfLines={10}
        inputClassName="h-40 py-2"
        textAlignVertical="top"
      />

      <View>
        <Button
          title="Cancel"
          variant="secondary"
          onPress={() => router.back()}
          className="flex-1"
        />
        <Button
          title="Create"
          onPress={handleSubmit}
          isLoading={isLoading}
          className="flex-1"
        />
      </View>
    </ScrollView>
  );
}
