import { useCallback, useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import {
  Alert,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import { ActionSheetIOS } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import { useAppDispatch, useAppSelector } from "@/shared/hooks/useRedux";
import { deleteNote, fetchNotes } from "@/shared/store/slices/noteSlice";
import Loading from "@/components/Loading";
import Input from "@/components/Input";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import NoteListItem from "@/components/NoteListItem";

type SortOption = "updated" | "created" | "title";

export default function Dashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVis, setIsSearchVis] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("updated");
  const [pinnedNotes, setPinnedNotes] = useState<string[]>([]);

  const dispatch = useAppDispatch();
  const { notes, isLoading } = useAppSelector((state) => state.notes);

  const loadNotes = useCallback(async () => {
    try {
      await dispatch(fetchNotes()).unwrap();
    } catch (error: any) {
      Alert.alert("Error", "Failed to load notes");
    }
  }, [dispatch]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotes();
    setRefreshing(false);
  };

  const togglePin = useCallback((noteId: string) => {
    setPinnedNotes((prev) =>
      prev.includes(noteId)
        ? prev.filter((id) => id !== noteId)
        : [...prev, noteId]
    );
  }, []);

  const renderSwipeable = useCallback((direction: "left" | "right") => {
    return (
      <View
        className={`w-20 justify-center items-center ${
          direction === "left" ? "bg-red-500" : "bg-accent"
        }`}
      >
        <Ionicons
          name={direction === "left" ? "trash-outline" : "pin-outline"}
          size={24}
          color="white"
        />
      </View>
    );
  }, []);

  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});

  const handleSwipeOpen = useCallback(
    (noteId: string, direction: "left" | "right") => {
      if (direction === "left") {
        // Delete action
        Alert.alert(
          "Delete Note",
          "Are you sure you want to delete this note?",
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => {
                swipeableRefs.current[noteId]?.close();
              },
            },
            {
              text: "Delete",
              style: "destructive",
              onPress: async () => {
                try {
                  await dispatch(deleteNote(noteId)).unwrap();
                } catch (error) {
                  Alert.alert("Error", "Failed to delete note");
                  swipeableRefs.current[noteId]?.close();
                }
              },
            },
          ]
        );
      } else {
        // Pin action
        togglePin(noteId);
        setTimeout(() => {
          swipeableRefs.current[noteId]?.close();
        }, 100);
      }
    },
    [dispatch, togglePin]
  );

  const handleSort = useCallback(() => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Date Updated", "Date Created", "Title"],
        cancelButtonIndex: 0,
        title: "Sort Notes By",
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 1:
            setSortBy("updated");
            break;
          case 2:
            setSortBy("created");
            break;
          case 3:
            setSortBy("title");
            break;
        }
      }
    );
  }, []);

  const filteredAndSortedNotes = notes
    .filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Pinned Notes on top
      if (pinnedNotes.includes(a._id) && !pinnedNotes.includes(b._id))
        return -1;
      if (!pinnedNotes.includes(a._id) && pinnedNotes.includes(b._id)) return 1;

      //
      switch (sortBy) {
        case "updated":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case "created":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  if (isLoading && !refreshing) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background">
      <Header
        title="Notes"
        showSearch
        onSearchPress={() => setIsSearchVis(!isSearchVis)}
        rightElement={
          <TouchableOpacity onPress={handleSort} className="p-2">
            <Ionicons name="filter-outline" size={22} color="#1a1a1a" />
          </TouchableOpacity>
        }
      />

      {isSearchVis && (
        <View>
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            containerClassName="mb-0"
            inputClassName="bg-background-secondary"
            autoFocus
          />
        </View>
      )}

      <FlatList
        data={filteredAndSortedNotes}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ItemSeparatorComponent={() => (
          <View className="h-[1px] bg-border ml-4" />
        )}
        renderItem={({ item }) => (
          <Swipeable
            ref={(ref) => {
              swipeableRefs.current[item._id] = ref;
            }}
            renderLeftActions={() => renderSwipeable("right")}
            renderRightActions={() => renderSwipeable("left")}
            onSwipeableOpen={(direction) =>
              handleSwipeOpen(item._id, direction === "left" ? "right" : "left")
            }
            overshootLeft={false}
            overshootRight={false}
            friction={2}
          >
            <NoteListItem
              note={item}
              isPinned={pinnedNotes.includes(item._id)}
            />
          </Swipeable>
        )}
      />

      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-accent rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push("/notes/createNote")}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}
