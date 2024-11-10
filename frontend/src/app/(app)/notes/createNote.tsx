import Button from "@/components/Button";
import Input from "@/components/Input";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useRedux";
import { createNote } from "@/shared/store/slices/noteSlice";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, View } from "react-native";

export default function CreateNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const dispatch = useAppDispatch();

  const handleSave = useCallback(async () => {
    if (!title.trim() && !content.trim()) {
      router.back();
      return;
    }

    try {
      setIsSaving(true);
      await dispatch(
        createNote({
          title: title.trim() || "Untitled Note",
          content,
        })
      ).unwrap();
      router.back();
    } catch (error: any) {
      Alert.alert("Error", "Failed to save note");
    } finally {
      setIsSaving(false);
    }
  }, [title, content, dispatch]);

  return (
    <ScrollView className="flex-1 bg-background">
      <View></View>
    </ScrollView>
  );
}
