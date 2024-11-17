import { useTheme } from "@/shared/hooks/useTheme";
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
  onBackPress?: () => void;
}

export default function Header({
  showBack = false,
  showSearch = false,
  title = "Notes",
  onSearchPress,
  rightElement,
  onBackPress,
}: HeaderProps) {
  const { isDark } = useTheme();

  return (
    <SafeAreaView
      edges={["top"]}
      className="bg-background dark:bg-background-dark"
    >
      <View className="flex-row justify-between items-center px-4 py-2 border-b border-border dark:border-border-dark">
        <View className="flex-row items-center">
          {showBack && (
            <TouchableOpacity
              onPress={onBackPress ?? (() => router.back())}
              className="mr-2 p-2 -ml-2"
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={isDark ? "#ffffff" : "#1a1a1a"}
              />
            </TouchableOpacity>
          )}
          <Text className="text-xl font-semibold text-primary dark:text-primary-dark">
            {title}
          </Text>
        </View>

        <View className="flex-row items-center">
          {rightElement}
          {showSearch && (
            <TouchableOpacity onPress={onSearchPress} className="p-2 ml-2">
              <Ionicons
                name="search-outline"
                size={22}
                color={isDark ? "#ffffff" : "#1a1a1a"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
