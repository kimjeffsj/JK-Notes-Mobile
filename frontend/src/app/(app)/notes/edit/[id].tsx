import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import Header from "@/components/Header";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useRedux";
import { editNote } from "@/shared/store/slices/noteSlice";

export default function EditNote() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const note = useAppSelector((state) =>
    state.notes.notes.find((note) => note._id === id)
  );

  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (!note) {
      Alert.alert("Error", "Note not found");
      router.back();
    }
  }, [note]);

  const autoSave = useCallback(async () => {
    if (!id || (!title.trim() && !content.trim())) return;

    try {
      setIsSaving(true);
      await dispatch(
        editNote({
          id,
          data: {
            title: title.trim() || "Untitled Note",
            content: content.trim(),
          },
        })
      ).unwrap();
      setLastSaved(new Date());
    } catch (error) {
      Alert.alert("Error", "Auto-save Failed");
    } finally {
      setIsSaving(false);
    }
  }, [id, title, content, dispatch]);

  useEffect(() => {
    const timer = setTimeout(autoSave, 30000);
    return () => clearTimeout(timer);
  }, [title, content, autoSave]);

  const handleDone = useCallback(async () => {
    if (!title.trim() && !content.trim()) {
      router.back();
      return;
    }

    try {
      await autoSave();
      router.back();
    } catch (error: any) {
      Alert.alert("Error", "Failed to save note");
    }
  }, [autoSave]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView className="flex-1 bg-background">
        <Header
          showBack
          rightElement={
            <TouchableOpacity onPress={handleDone} className="px-4 py-2">
              <Text className="text-primary text-base text-right font-medium">
                {isSaving ? "Saving..." : "Done"}
              </Text>
            </TouchableOpacity>
          }
        />

        <ScrollView
          className="flex-1"
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-4">
            {lastSaved && (
              <Text className="text-text-secondary text-sm text-right mb-2">
                Last saved: {lastSaved.toLocaleString()}
              </Text>
            )}

            <TextInput
              className="text-xl font-semibold text-primary py-4 border-b border-border"
              placeholder="Title"
              value={title === "Untitled Note" ? "" : title}
              onChangeText={setTitle}
              placeholderTextColor="#999"
            />

            <TextInput
              className="flex-1 text-base text-primary py-4"
              placeholder="Start writing here"
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              placeholderTextColor="#999"
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
