import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { debounce } from "lodash";

import Header from "@/components/Header";
import { useAppDispatch } from "@/shared/hooks/useRedux";
import { createNote } from "@/shared/store/slices/noteSlice";
import { useTheme } from "@/shared/hooks/useTheme";
import RichTextEditor from "@/components/RichEditor";

export default function CreateNote() {
  const { isDark } = useTheme();
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  // Tracking last saved
  const lastSavedContent = useRef({
    title: "",
    content: "",
  });

  const savedNoteId = useRef<string | null>(null);

  // Checking changes
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

  // Formatting Saved time
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

  // Auto-Save function
  const debouncedSave = useCallback(
    debounce(async (currentTitle: string, currentContent: string) => {
      if (!currentContent.trim() && !currentTitle.trim()) return;

      try {
        setIsSaving(true);
        let result;

        if (savedNoteId.current) {
          result = await dispatch(
            createNote({
              title: currentTitle || "Untitled Note",
              content: currentContent,
            })
          ).unwrap();
        } else {
          result = await dispatch(
            createNote({
              title: currentTitle || "Untitled Note",
              content: currentContent,
            })
          ).unwrap();

          if (result?._id) {
            savedNoteId.current = result._id;
          }
        }

        lastSavedContent.current = {
          title: currentTitle || "Untitled Note",
          content: currentContent,
        };

        const now = new Date();
        setLastSaved(now);
        setHasChanges(false);
      } catch (error) {
        Alert.alert(
          "Auto-save Failed",
          "Changes will be saved when you press Done"
        );
      } finally {
        setIsSaving(false);
      }
    }, 3000),
    [dispatch]
  );

  // Checking if content changed
  useEffect(() => {
    checkChanges();
  }, [title, content, checkChanges]);

  // Auto Saving
  useEffect(() => {
    if (hasChanges) {
      debouncedSave(title.trim(), content.trim());
    }
  }, [title, content, hasChanges, debouncedSave]);

  // Handling done button
  const handleDone = useCallback(async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedContent && !trimmedTitle) {
      router.push("/(app)/dashboard");
      return;
    }

    try {
      setIsSaving(true);
      debouncedSave.cancel();

      const result = await dispatch(
        createNote({
          title: trimmedTitle || "Untitled Note",
          content: trimmedContent,
        })
      ).unwrap();

      if (result?._id) {
        router.push(`/notes/view/${result._id}`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save note");
    } finally {
      setIsSaving(false);
    }
  }, [title, content, dispatch, debouncedSave]);

  // Handle back button
  const handleBack = useCallback(() => {
    if (hasChanges) {
      Alert.alert("Save Changes?", "Do you want to save your changes?", [
        {
          text: "Don't Save",
          style: "destructive",
          onPress: () => {
            debouncedSave.cancel();
            setTimeout(() => {
              router.push("/(app)/dashboard");
            }, 100);
          },
        },
        {
          text: "Save",
          onPress: async () => {
            try {
              debouncedSave.cancel();
              setIsSaving(true);

              const trimmedTitle = title.trim();
              const trimmedContent = content.trim();

              if (!trimmedContent && !trimmedTitle) {
                setIsSaving(false);
                router.push("/(app)/dashboard");
                return;
              }

              await dispatch(
                createNote({
                  title: trimmedTitle || "Untitled Note",
                  content: trimmedContent,
                })
              ).unwrap();

              setIsSaving(false);
              setTimeout(() => {
                router.push("/(app)/dashboard");
              }, 100);
            } catch (error) {
              setIsSaving(false);
              Alert.alert("Error", "Failed to save note", [
                {
                  text: "OK",
                  onPress: () => router.push("/(app)/dashboard"),
                },
              ]);
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]);
    } else {
      debouncedSave.cancel();
      router.push("/(app)/dashboard");
    }
  }, [hasChanges, title, content, dispatch, debouncedSave]);

  // Editor Reset
  useFocusEffect(
    useCallback(() => {
      setEditorKey((prev) => prev + 1);
      return () => {
        setContent("");
      };
    }, [])
  );

  // Cleaning up
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
      setContent("");
      setTitle("");
      setIsSaving(false);
      setHasChanges(false);
    };
  }, [debouncedSave]);

  // Closing Keyboard
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Rendering Editor
  const renderEditor = () => (
    <View style={{ flex: 1 }}>
      <RichTextEditor
        key={editorKey}
        initialContent=""
        onChangeContent={(text) => setContent(text)}
        editorHeight={Platform.OS === "ios" ? 300 : 250}
      />
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView className="flex-1 bg-background dark:bg-background-dark">
        <Header
          showBack
          title="New Note"
          onBackPress={handleBack}
          rightElement={
            <TouchableOpacity onPress={handleDone} className="px-4 py-2">
              <Text
                className={`text-base text-right font-medium ${
                  hasChanges
                    ? "text-primary dark:text-primary-dark"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              >
                {isSaving ? "Saving..." : "Done"}
              </Text>
            </TouchableOpacity>
          }
        />

        <View className="px-4 py-2">
          <TextInput
            className="text-xl font-semibold text-primary dark:text-primary-dark py-4"
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={isDark ? "#666666" : "#999999"}
            autoFocus
          />
        </View>

        {lastSaved && (
          <View className="flex-row justify-end items-center px-4 mb-2">
            <Text className="text-text-secondary dark:text-text-dark-secondary text-sm mr-1">
              {savedNoteId.current ? "Last saved:" : "Draft saved:"}
            </Text>
            <Text className="text-text-secondary dark:text-text-dark-secondary text-sm">
              {formatLastSaved(lastSaved)}
            </Text>
            {hasChanges && (
              <Text className="text-accent text-sm ml-2">
                (Unsaved changes)
              </Text>
            )}
          </View>
        )}

        {renderEditor()}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
