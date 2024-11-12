import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  return (
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

      <View className="flex-1 px-4">
        <TextInput
          className="text-xl font-semibold text-primary py-4"
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#999"
          autoFocus
        />

        <TextInput
          className="flex-1 text-base text-primary mx-4"
          placeholder="Start writing here"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          placeholderTextColor="#999"
        />
      </View>
      <SafeAreaView
        edges={["bottom"]}
        className="bg-background border-t border-border"
      >
        <View className="flex-row items-center justify-around py-2 px-4 border-t border-border bg-background">
          <TouchableOpacity className="p-2">
            <Ionicons name="text" size={22} color="#1a1a1a" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <Ionicons name="list" size={22} color="#1a1a1a" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <Ionicons name="checkbox-outline" size={22} color="#1a1a1a" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <Ionicons name="camera-outline" size={22} color="#1a1a1a" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <Ionicons name="share-outline" size={22} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
