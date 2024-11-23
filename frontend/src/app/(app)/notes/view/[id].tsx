import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useRedux";
import { useTheme } from "@/shared/hooks/useTheme";
import { deleteNote } from "@/shared/store/slices/noteSlice";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import WebView from "react-native-webview";
import ImageViewer from "@/components/ImageViewer";

// HTML Styling template
const getHtmlContent = (content: string, isDark: boolean) => `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <style>
      body {
        font-family: -apple-system, system-ui;
        font-size: 16px;
        line-height: 1.5;
        color: ${isDark ? "#ffffff" : "#1a1a1a"};
        background-color: ${isDark ? "#1a1a1a" : "#f8f7f2"};
        padding: 12px;
        margin: 0;
      }
      img {
        max-width: 100%;
        height: auto;
      }
      a {
        color: #dfa46d;
      }
      h1, h2, h3, h4, h5, h6 {
        color: ${isDark ? "#ffffff" : "#1a1a1a"};
        line-height: 1.2;
      }
      ul, ol {
        padding-left: 20px;
      }
      blockquote {
        margin: 10px 0;
        padding: 10px 20px;
        background: ${isDark ? "#2a2a2a" : "#f0f0f0"};
        border-left: 4px solid #dfa46d;
      }
      pre {
        background: ${isDark ? "#2a2a2a" : "#f0f0f0"};
        padding: 10px;
        overflow-x: auto;
        border-radius: 4px;
      }
      code {
        font-family: monospace;
      }
    </style>
  </head>
  <body>
    ${content}
  </body>
</html>
`;

export default function NoteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { isDark } = useTheme();

  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [webViewHeight, setWebViewHeight] = useState(0);

  // Fetching note
  const note = useAppSelector((state) =>
    state.notes.notes.find((note) => note._id === id)
  );

  // Handle Image click
  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
    setImageViewerVisible(true);
  };

  // Formatting date
  const formattedDate = useMemo(() => {
    if (!note) return "";

    const date = new Date(note.updatedAt);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",

        hour12: true,
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  }, [note?.updatedAt]);

  // Handling Deletion
  const handleDelete = useCallback(async () => {
    if (!note) return;

    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await dispatch(deleteNote(note._id)).unwrap();
            Alert.alert("Success", "Note deleted successfully", [
              {
                text: "OK",
                onPress: () => router.back(),
              },
            ]);
          } catch (error: any) {
            Alert.alert("Error", "Failed to delete note");
          }
        },
      },
    ]);
  }, [note, dispatch]);

  // Handling Editing
  const handleEdit = useCallback(() => {
    if (!note) return;
    router.push(`/notes/edit/${note._id}`);
  }, [note]);

  const handleWebViewMessage = (event: any) => {
    setWebViewHeight(parseInt(event.nativeEvent.data, 10));
  };

  const renderImageGallery = () => {
    if (!note?.images?.length) return null;

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row p-4"
      >
        {note.images.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleImagePress(index)}
            className="mr-2"
          >
            <Image
              source={{
                uri: `${process.env.EXPO_PUBLIC_API_URL}/${image.thumbnail}`,
              }}
              className="w-24 h-24 rounded-lg"
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  if (!note) {
    return <Loading />;
  }

  return (
    <KeyboardAvoidingView className="flex-1 bg-background dark:bg-background-dark">
      <Header
        showBack
        title={note.title}
        onBackPress={() => router.push("/(app)/dashboard")}
        rightElement={
          <View className="flex-row items-center">
            <TouchableOpacity className="p-2" onPress={handleEdit}>
              <Ionicons
                name="create-outline"
                size={22}
                color={isDark ? "#ffffff" : "#1a1a1a"}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} className="p-2">
              <Ionicons name="trash-outline" size={22} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView className="flex-1 p-4">
        <View className="py-4 border-b border-border dark:border-border-dark">
          <Text className="text-2xl font-bold text-primary dark:text-primary-dark">
            {note.title}
          </Text>
          <Text className="text-text-secondary dark:text-text-dark-secondary text-sm mt-1">
            Last Updated: {formattedDate}
          </Text>
        </View>

        {renderImageGallery()}

        <View className="py-4">
          <WebView
            source={{ html: getHtmlContent(note.content, isDark) }}
            className="bg-transparent"
            scrollEnabled={false}
            onMessage={handleWebViewMessage}
            injectedJavaScript={`
                window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight);
                true;
              `}
            style={{ height: webViewHeight }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            containerStyle={{ flex: 0 }}
          />
        </View>
      </ScrollView>

      <ImageViewer
        images={note.images || []}
        initialIndex={selectedImageIndex}
        visible={imageViewerVisible}
        onClose={() => setImageViewerVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}
