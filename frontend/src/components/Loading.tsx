import { ActivityIndicator, View } from "react-native";
import { useTheme } from "@/shared/hooks/useTheme";

const Loading = () => {
  const { isDark } = useTheme();

  return (
    <View className="flex-1 justify-center items-center bg-background dark:bg-background-dark">
      <ActivityIndicator size="large" color={isDark ? "#ffffff" : "#1a1a1a"} />
    </View>
  );
};

export default Loading;
