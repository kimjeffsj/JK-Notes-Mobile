import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface HeaderProps {
  onMenuPress: () => void;
}

const MenuIcon = () => (
  <View className="w-6 h-6 justify-between">
    <View className="w-6 h-0.5 bg-gray-600 rounded-full" />
    <View className="w-5 h-0.5 bg-gray-600 rounded-full self-end" />
    <View className="w-6 h-0.5 bg-gray-600 rounded-full" />
  </View>
);

export default function Header({ onMenuPress }: HeaderProps) {
  return (
    <SafeAreaView className="bg-white">
      <View className="flex-row justify-between items-center px-4 py-2 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.push("/(app)/dashboard")}>
          <Text className="text-xl font-bold text-blue-500">JK Notes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onMenuPress}
          className="w-10 h-10 rounded-full items-center justify-center active:bg-gray-100"
        >
          <MenuIcon />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
