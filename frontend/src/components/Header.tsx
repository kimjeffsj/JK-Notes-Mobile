import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface HeaderProps {
  showBack?: boolean;
  showSearch?: boolean;
  title?: string;
  onSearchPress?: () => void;
  rightElement?: React.ReactNode;
}

export default function Header({
  showBack = false,
  showSearch = false,
  title = "Notes",
  onSearchPress,
  rightElement,
}: HeaderProps) {
  return (
    <SafeAreaView className="bg-background">
      <View className="flex-row justify-between items-center px-4 py-2 border-b border-border">
        <View className="flex-row items-center">
          {showBack && (
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-2 p-2 -ml-2"
            >
              <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
            </TouchableOpacity>
          )}
          <Text className="text-xl font-semibold text-primary">{title}</Text>
        </View>

        {rightElement}
        {showSearch && (
          <TouchableOpacity onPress={onSearchPress} className="p-2 text-right">
            <Ionicons name="search-outline" size={22} color="#1a1a1a" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
