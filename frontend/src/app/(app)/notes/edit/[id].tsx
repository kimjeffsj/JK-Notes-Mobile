import { useCallback, useEffect, useRef, useState } from "react";
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
  const [lastSaved, setLastSaved] = useState<Date | null>(
    note ? new Date(note.updatedAt) : null
  );
  const [hasUnsaved, setHasUnsaved] = useState(false);

  // ref for tracking last saved note
  const lastSavedContent = useRef({
    title: note?.title || "",
    content: note?.content || "",
  });

  const checkChanges = useCallback(() => {
    const currentTitle = title.trim();
    const currentContent = content.trim();
    const savedTitle = lastSavedContent.current.title.trim();
    const savedContent = lastSavedContent.current.content.trim();

    const hasChanges =
      currentTitle !== savedTitle || currentContent !== savedContent;
    setHasUnsaved(hasChanges);
    return hasChanges;
  }, [title, content]);

  useEffect(() => {
    checkChanges();
  }, [title, content, checkChanges]);

  useEffect(() => {
    if (!note) {
      Alert.alert("Error", "Note not found");
      router.replace("/(app)/dashboard");
    }
  }, [note]);

  // User Friendly formatted date
  const formatLastSaved = useCallback((date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    }
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }
    return date.toLocaleString();
  }, []);

  // Saving note combined autoSave and done
  const saveNote = useCallback(
    async (shouldNavigate: boolean = false) => {
      if (!id || (!title.trim() && !content.trim())) {
        if (shouldNavigate) {
          router.replace("/(app)/dashboard");
        }
        return;
      }

      if (!checkChanges() && !shouldNavigate) {
        return;
      }

      try {
        setIsSaving(true);
        const trimmedTitle = title.trim();
        const trimmedContent = title.trim();

        await dispatch(
          editNote({
            id,
            data: {
              title: trimmedTitle || "Untitled Note",
              content: trimmedContent,
            },
          })
        ).unwrap();

        lastSavedContent.current = {
          title: trimmedTitle || "Untitled Note",
          content: trimmedContent,
        };
        setLastSaved(new Date());
        setHasUnsaved(false);

        if (shouldNavigate) {
          router.push(`/notes/view/${id}`);
        }
      } catch (error) {
        Alert.alert(
          "Error",
          shouldNavigate ? "Failed to save note" : "Auto-save Failed"
        );
      } finally {
        setIsSaving(false);
      }
    },
    [id, title, content, dispatch, checkChanges]
  );

  // Auto Saving, works only if there are changes
  useEffect(() => {
    if (hasUnsaved) {
      const timer = setTimeout(() => saveNote(false), 30000);
      return () => clearTimeout(timer);
    }
  }, [title, content, saveNote, hasUnsaved]);

  const handleDone = useCallback(() => {
    saveNote(true);
  }, [saveNote]);

  const handleTextChange = (text: string, isTitle: boolean) => {
    if (isTitle) {
      setTitle(text);
    } else {
      setContent(text);
    }
  };

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
              <Text
                className={`text-base text-right font-medium ${
                  hasUnsaved ? "text-primary" : "text-gray-300"
                }`}
              >
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
              <View className="flex-row justify-end items-center mt-2 mb-2">
                <Text className="text-text-secondary text-sm mr-1">
                  Last saved:
                </Text>
                <Text className="text-text-secondary text-sm">
                  {formatLastSaved(lastSaved)}
                </Text>
                {hasUnsaved && (
                  <Text className="text-accent text-sm ml-2">
                    (Unsaved changes)
                  </Text>
                )}
              </View>
            )}

            <TextInput
              className="text-xl font-semibold text-primary py-4 border-b border-border"
              placeholder="Title"
              value={title === "Untitled Note" ? "" : title}
              onChangeText={(text) => handleTextChange(text, true)}
              placeholderTextColor="#999"
            />

            <TextInput
              className="flex-1 text-base text-primary py-4"
              placeholder="Start writing here"
              value={content}
              onChangeText={(text) => handleTextChange(text, false)}
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
