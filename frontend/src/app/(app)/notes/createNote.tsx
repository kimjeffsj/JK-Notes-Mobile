import { router } from "expo-router";
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

import Header from "@/components/Header";
import { useAppDispatch } from "@/shared/hooks/useRedux";
import { createNote } from "@/shared/store/slices/noteSlice";

export default function CreateNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const dispatch = useAppDispatch();

  const autoSave = useCallback(async () => {
    if (!title.trim() && !content.trim()) return;

    try {
      setIsSaving(true);
      const result = await dispatch(
        createNote({
          title: title.trim() || "Untitled Note",
          content: content.trim(),
        })
      ).unwrap();
      setLastSaved(new Date());
      return result;
    } catch (error: any) {
      Alert.alert("Error", "Auto-save failed");
    } finally {
      setIsSaving(false);
    }
  }, [title, content, dispatch]);

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
    } catch (error) {
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
          title="New Note"
          rightElement={
            <TouchableOpacity className="px-4 py-2" onPress={handleDone}>
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
          <View className="flex-1 px-4">
            {lastSaved && (
              <Text className="text-text-secondary text-sm text-right mt-2">
                Last saved: {lastSaved.toLocaleString()}
              </Text>
            )}

            <TextInput
              className="text-xl font-semibold text-primary py-4 border-b border-border"
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#999"
              autoFocus
            />

            <TextInput
              className="flex-1 text-base text-primary py-4"
              placeholder="Start writing here"
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              placeholderTextColor="#999"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
