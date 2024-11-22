import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { debounce } from "lodash";
import { router, useLocalSearchParams } from "expo-router";

import Header from "@/components/Header";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useRedux";
import { editNote } from "@/shared/store/slices/noteSlice";
import { useTheme } from "@/shared/hooks/useTheme";
import RichTextEditor from "@/components/RichEditor";
import { NoteImage } from "@/shared/types/note/note";
import ImageSection from "@/components/ImageSection";

export default function EditNote() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { isDark } = useTheme();

  // Fetching current note
  const note = useAppSelector((state) =>
    state.notes.notes.find((note) => note._id === id)
  );

  // Resetting Editor
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setLastSaved(new Date(note.updatedAt));
      lastSavedContent.current = {
        title: note.title,
        content: note.content,
        images: note.images || [],
      };
    }
  }, [note]);

  useEffect(() => {
    setEditorKey((prev) => prev + 1);
    return () => {
      setContent("");
    };
  }, []);

  // ref for tracking last saved note
  const lastSavedContent = useRef({
    title: note?.title || "",
    content: note?.content || "",
    images: note?.images || [],
  });

  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [images, setImages] = useState<NoteImage[]>(note?.images || []);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(
    note ? new Date(note.updatedAt) : null
  );
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  // Callback functions
  // Checking changes
  const checkChanges = useCallback(() => {
    const currentTitle = title.trim();
    const currentContent = content.trim();
    const savedTitle = lastSavedContent.current.title.trim();
    const savedContent = lastSavedContent.current.content.trim();

    const imagesChanged =
      images.length !== lastSavedContent.current.images.length ||
      images.some((img) => img._id.startsWith("temp_"));

    const hasChanges =
      currentTitle !== savedTitle ||
      currentContent !== savedContent ||
      imagesChanged;

    setHasUnsaved(hasChanges);
    return hasChanges;
  }, [title, content, images]);

  // Rendering Editor
  const renderEditor = () => {
    if (!note || !content) return null;

    return (
      <View style={{ flex: 1 }}>
        <RichTextEditor
          key={editorKey}
          initialContent={content}
          onChangeContent={handleContentChange}
          editorHeight={Platform.OS === "ios" ? 300 : 250}
        />
      </View>
    );
  };

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

  // Debounced Saving
  const debouncedSave = useCallback(
    debounce(async (currentTitle: string, currentContent: string) => {
      if (!id || !currentContent.trim()) return; // Check if content is empty

      try {
        if (!checkChanges()) return;
        setIsSaving(true);

        await dispatch(
          editNote({
            id,
            data: {
              title: currentTitle || "Untitled Note",
              content: currentContent,
            },
          })
        ).unwrap();

        lastSavedContent.current = {
          title: currentTitle || "Untitled Note",
          content: currentContent,
          images: [...images],
        };
        setLastSaved(new Date());
        setHasUnsaved(false);
      } catch (error) {
        Alert.alert(
          "Auto-save Failed",
          "Changes will be saved when you press Done"
        );
      } finally {
        setIsSaving(false);
      }
    }, 3000),
    [dispatch, id, checkChanges, images]
  );

  // Handling Done button
  const handlingDone = useCallback(
    async (isDonePressed: boolean = false) => {
      const trimmedTitle = title.trim();
      const trimmedContent = content.trim();

      if (
        isDonePressed &&
        !trimmedContent &&
        !trimmedTitle &&
        images.length === 0
      ) {
        Alert.alert("Empty Note", "Please write something before saving.", [
          { text: "OK" },
        ]);
        return;
      }

      try {
        setIsSaving(true);
        debouncedSave.cancel();

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
          images: [...images],
        };
        setLastSaved(new Date());
        setHasUnsaved(false);

        if (isDonePressed) {
          setTimeout(() => {
            router.push(`/notes/view/${id}`);
          }, 100);
        }
      } catch (error) {
        if (isDonePressed) {
          Alert.alert("Error", "Failed to save note");
        }
      } finally {
        setIsSaving(false);
      }
    },
    [id, title, content, images, dispatch, debouncedSave]
  );

  // Handling Back Button
  const handleBack = useCallback(() => {
    if (hasUnsaved) {
      Alert.alert("Save Changes?", "Do you want to save your changes?", [
        {
          text: "Don't Save",
          style: "destructive",
          onPress: () => {
            setTimeout(() => {
              router.push("/(app)/dashboard");
            }, 100);
          },
        },
        {
          text: "Save",
          onPress: async () => {
            await handlingDone(true);
            setTimeout(() => {
              router.push("/(app)/dashboard");
            }, 100);
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]);
    } else {
      setTimeout(() => {
        router.push("/(app)/dashboard");
      }, 100);
    }
  }, [hasUnsaved, handlingDone]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  // When a note loaded update states
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setLastSaved(new Date(note.updatedAt));
      lastSavedContent.current = {
        title: note.title,
        content: note.content,
        images: note.images || [],
      };
    }
  }, [note]);

  // Component Cleanup
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
      setContent("");
      setTitle("");
      setIsSaving(false);
      setHasUnsaved(false);
    };
  }, [debouncedSave]);

  // Checking if there are changes
  useEffect(() => {
    checkChanges();
  }, [title, content, checkChanges]);

  // Auto Saving
  useEffect(() => {
    if (hasUnsaved) {
      debouncedSave(title.trim(), content.trim());
    }

    return () => {
      debouncedSave.cancel();
    };
  }, [title, content, images, hasUnsaved, debouncedSave]);

  // Closing Keyboard
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 bg-background dark:bg-background-dark"
      >
        <Header
          showBack
          onBackPress={handleBack}
          rightElement={
            <TouchableOpacity
              onPress={() => handlingDone(true)}
              className="px-4 py-2"
            >
              <Text
                className={`text-base text-right font-medium ${
                  hasUnsaved
                    ? "text-primary dark:text-primary-dark"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              >
                {isSaving ? "Saving..." : "Done"}
              </Text>
            </TouchableOpacity>
          }
        />

        <ScrollView>
          <View className="px-4 py-2">
            <TextInput
              className="text-xl font-semibold text-primary dark:text-primary-dark py-4"
              placeholder="Title"
              value={title === "Untitled Note" ? "" : title}
              onChangeText={setTitle}
              placeholderTextColor={isDark ? "#666666" : "#999999"}
            />
          </View>

          {lastSaved && (
            <View className="flex-row justify-end items-center px-4 mb-2">
              <Text className="text-text-secondary dark:text-text-dark-secondary text-sm mr-1">
                Last saved:
              </Text>
              <Text className="text-text-secondary dark:text-text-dark-secondary text-sm">
                {formatLastSaved(lastSaved)}
              </Text>
              {hasUnsaved && (
                <Text className="text-accent text-sm ml-2">
                  (Unsaved changes)
                </Text>
              )}
            </View>
          )}

          <View className="px-4">
            <ImageSection
              noteId={id}
              images={images}
              onImagesChange={setImages}
            />
          </View>

          {renderEditor()}
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
