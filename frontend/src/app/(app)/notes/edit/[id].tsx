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
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import Header from "@/components/Header";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useRedux";
import { editNote } from "@/shared/store/slices/noteSlice";
import { useTheme } from "@/shared/hooks/useTheme";
import RichTextEditor from "@/components/RichEditor";
import { UploadedImage } from "@/shared/types/note/note";
import ImageUpload from "@/components/ImageUpload";
import Loading from "@/components/Loading";

export default function EditNote() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { isDark } = useTheme();

  // Fetching current note
  const note = useAppSelector((state) =>
    state.notes.notes.find((note) => note._id === id)
  );

  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [images, setImages] = useState<UploadedImage[]>(note?.images || []);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(
    note ? new Date(note.updatedAt) : null
  );
  const [hasChanges, setHasChanges] = useState(false);

  const [editorKey, setEditorKey] = useState(0);

  // ref for tracking last saved note
  const lastSavedContent = useRef({
    title: note?.title || "",
    content: note?.content || "",
    images: note?.images || [],
  });

  const savedNoteId = useRef<string | null>(null);

  // initial note data
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setImages(note.images);
      setLastSaved(new Date(note.updatedAt));
      lastSavedContent.current = {
        title: note.title,
        content: note.content,
        images: note.images,
      };
    }
  }, [note]);

  // Checking changes
  const checkChanges = useCallback(() => {
    if (isSaving) return;

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    const savedTitle = lastSavedContent.current.title.trim();
    const savedContent = lastSavedContent.current.content.trim();
    const hasImageChanges =
      images.length !== lastSavedContent.current.images.length;

    if (
      !trimmedTitle &&
      !trimmedContent &&
      !images.length &&
      !savedTitle &&
      !savedContent &&
      !lastSavedContent.current.images.length
    ) {
      setHasChanges(false);
      return false;
    }

    const hasNewChanges =
      trimmedTitle !== savedTitle ||
      trimmedContent !== savedContent ||
      hasImageChanges;

    setHasChanges(hasNewChanges);
    return hasNewChanges;
  }, [title, content, images]);

  useEffect(() => {
    setEditorKey((prev) => prev + 1);
    return () => {
      setContent("");
    };
  }, []);

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
    debounce(
      async (
        currentTitle: string,
        currentContent: string,
        currentImages: UploadedImage[]
      ) => {
        if (!currentContent.trim()) {
          console.log("Skipping auto-save: Content is empty");
          return;
        }

        try {
          setIsSaving(true);
          let result;

          if (savedNoteId.current) {
            result = await dispatch(
              editNote({
                id,
                data: {
                  title: currentTitle || "Untitled Note",
                  content: currentContent,
                  images: currentImages,
                },
              })
            ).unwrap();
          } else {
            result = await dispatch(
              editNote({
                id,
                data: {
                  title: currentTitle || "Untitled Note",
                  content: currentContent,
                  images: currentImages,
                },
              })
            ).unwrap();

            if (result?._id) {
              savedNoteId.current = result._id;
            }
          }

          lastSavedContent.current = {
            title: currentTitle || "Untitled Note",
            content: currentContent,
            images: currentImages,
          };

          const now = new Date();
          setLastSaved(now);
          setHasChanges(false);
        } catch (error) {
          console.error("Auto-Save failed:", error);
        } finally {
          setIsSaving(false);
        }
      },
      3000
    ),
    [dispatch]
  );

  // Checking if there are changes
  useEffect(() => {
    checkChanges();
  }, [title, content, images, checkChanges]);

  // Auto Saving
  useEffect(() => {
    if (hasChanges) {
      debouncedSave(title.trim(), content.trim(), images);
    }
  }, [title, content, hasChanges, debouncedSave]);

  // Handle Images uploaded
  const handleImagesUploaded = (newImages: UploadedImage[]) => {
    setImages(newImages);
    setHasChanges(true);
  };

  // Handling Done button
  const handleDone = useCallback(async () => {
    if (isSaving) return;

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      Alert.alert("Error", "Please write some content before saving");
      return;
    }

    try {
      setIsSaving(true);
      debouncedSave.cancel();

      const result = await dispatch(
        editNote({
          id,
          data: {
            title: trimmedTitle || "Untitled Note",
            content: trimmedContent,
            images: images,
          },
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
  }, [title, content, images, dispatch, debouncedSave]);

  // Handling Back Button
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

              if (!trimmedContent && !trimmedTitle && !images.length) {
                setIsSaving(false);
                router.push("/(app)/dashboard");
                return;
              }

              await dispatch(
                editNote({
                  id,
                  data: {
                    title: trimmedTitle || "Untitled Note",
                    content: trimmedContent,
                    images: images,
                  },
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
  }, [hasChanges, title, content, images, dispatch, debouncedSave, id]);

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
      setTitle("");
      setContent("");
      setImages([]);
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
        initialContent={content}
        onChangeContent={(text) => setContent(text)}
        editorHeight={Platform.OS === "ios" ? 300 : 250}
      />
    </View>
  );

  if (!note) {
    return <Loading />;
  }

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
            value={title === "Untitled Note" ? "" : title}
            onChangeText={setTitle}
            placeholderTextColor={isDark ? "#666666" : "#999999"}
          />
        </View>

        <ImageUpload
          onImagesUploaded={handleImagesUploaded}
          existingImages={images}
          noteId={id}
        />

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
