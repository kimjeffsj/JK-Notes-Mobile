import { useEffect, useState } from "react";
import { router } from "expo-router";
import { RefreshControl, ScrollView, Text, View } from "react-native";

import { useAppDispatch, useAppSelector } from "@/shared/hooks/useRedux";
import { deleteNote, fetchNotes } from "@/shared/store/slices/noteSlice";
import Loading from "@/components/Loading";
import NoteCard from "@/components/NoteCard";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Dashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useAppDispatch();
  const { notes, isLoading } = useAppSelector((state) => state.notes);
  const { user } = useAppSelector((state) => state.auth);

  const loadNotes = async () => {
    try {
      await dispatch(fetchNotes()).unwrap();
    } catch (error) {}
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotes();
    setRefreshing(false);
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await dispatch(deleteNote(id)).unwrap();
    } catch (error) {}
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading && !refreshing) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 shadow-sm">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold">Welcome, {user?.name}</Text>
          <Button
            title="New Note"
            onPress={() => router.push("/notes/createNote")}
            className="w-auto px-4"
          />
        </View>
        <View>
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            containerClassName="mb-0"
            inputClassName="bg-gray-100"
          />
        </View>
      </View>

      {/* Notes List */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {filteredNotes.length === 0 ? (
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-gray-500 text-lg">
              {searchQuery
                ? "No notes found matching your search"
                : "No notes yet. Create your first note!"}
            </Text>
          </View>
        ) : (
          filteredNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onDelete={(id) => {
                handleDeleteNote(note._id);
              }}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
