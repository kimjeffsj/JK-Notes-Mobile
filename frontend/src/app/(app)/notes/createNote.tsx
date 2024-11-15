import { router } from "expo-router";
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

import Header from "@/components/Header";
import { useAppDispatch } from "@/shared/hooks/useRedux";
import { createNote, editNote } from "@/shared/store/slices/noteSlice";

export default function CreateNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const dispatch = useAppDispatch();

  const lastSavedContent = useRef({
    title: "",
    content: "",
  });
  const savedNoteId = useRef<string | null>(null);

  const checkChanges = useCallback(() => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    const savedTitle = lastSavedContent.current.title.trim();
    const savedContent = lastSavedContent.current.content.trim();

    if (!trimmedTitle && !trimmedContent && !savedTitle && !savedContent) {
      setHasChanges(false);
      return false;
    }

    const hasNewChanges =
      trimmedTitle !== savedTitle || trimmedContent !== savedContent;
    setHasChanges(hasNewChanges);
    return hasNewChanges;
  }, [title, content]);

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

  useEffect(() => {
    checkChanges();
  }, [title, content, checkChanges]);

  const saveNote = useCallback(
    async (shouldNavigate: boolean = false) => {
      if (!title.trim() && !content.trim()) {
        if (shouldNavigate) {
          router.back();
        }
        return;
      }

      if (!checkChanges() && !shouldNavigate) {
        return;
      }

      try {
        setIsSaving(true);
        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        let result;
        if (savedNoteId.current) {
          result = await dispatch(
            editNote({
              id: savedNoteId.current,
              data: {
                title: trimmedTitle || "Untitled Note",
                content: trimmedContent,
              },
            })
          ).unwrap();
        } else {
          result = await dispatch(
            createNote({
              title: trimmedTitle || "Untitled Note",
              content: trimmedContent,
            })
          ).unwrap();
          if (result?._id) {
            savedNoteId.current = result._id;
          }
        }

        lastSavedContent.current = {
          title: trimmedTitle || "Untitled Note",
          content: trimmedContent,
        };

        const now = new Date();
        setLastSaved(now);
        setHasChanges(false);

        if (shouldNavigate && savedNoteId.current) {
          router.push(`/notes/view/${savedNoteId.current}`);
        }
      } catch (error) {
        if (shouldNavigate) {
          Alert.alert("Error", "Failed to save note");
        }
      } finally {
        setIsSaving(false);
      }
    },
    [title, content, dispatch, checkChanges]
  );

  useEffect(() => {
    if (hasChanges) {
      const timer = setTimeout(() => saveNote(false), 30000);
      return () => clearTimeout(timer);
    }
  }, [title, content, saveNote, hasChanges]);

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
          title="New Note"
          onBackPress={() => router.push("/(app)/dashboard")}
          rightElement={
            <TouchableOpacity onPress={handleDone} className="px-4 py-2">
              <Text
                className={`text-base text-right font-medium ${
                  hasChanges ? "text-primary" : "text-gray-300"
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
                  {savedNoteId.current ? "Last saved:" : "Draft saved:"}
                </Text>
                <Text className="text-text-secondary text-sm">
                  {formatLastSaved(lastSaved)}
                </Text>
                {hasChanges && (
                  <Text className="text-accent text-sm ml-2">
                    (Unsaved changes)
                  </Text>
                )}
              </View>
            )}

            <TextInput
              className="text-xl font-semibold text-primary py-4 border-b border-border"
              placeholder="Title"
              value={title}
              onChangeText={(text) => handleTextChange(text, true)}
              placeholderTextColor="#999"
              autoFocus
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
