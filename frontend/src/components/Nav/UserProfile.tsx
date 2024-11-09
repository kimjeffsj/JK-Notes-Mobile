import { useAppSelector } from "@/shared/hooks/useRedux";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface UserProfileProps {
  onProfilePress?: () => void;
}

export default function UserProfile({ onProfilePress }: UserProfileProps) {
  const { user } = useAppSelector((state) => state.auth);

  const handleProfilePress = () => {
    router.push("/(app)/profile");
    onProfilePress?.();
  };

  const userInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) return null;

  return (
    <TouchableOpacity
      className="p-4 border-b border-gray-200 bg-white"
      onPress={handleProfilePress}
    >
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center mr-3">
          <Text className="text-lg font-semibold text-white">
            {userInitials(user.name)}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-gray-900">{user.name}</Text>
          <Text className="text-sm text-gray-500">{user.email}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
