import { useAppDispatch, useAppSelector } from "@/shared/hooks/useRedux";
import { logout } from "@/shared/store/slices/authSlice";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";
import { Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Entypo } from "@expo/vector-icons";

interface NavMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function NavMenu({ isVisible, onClose }: NavMenuProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const slideAnimation = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: isVisible ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await dispatch(logout()).unwrap();
            router.replace("/(auth)/login");
          } catch (error: any) {
            Alert.alert("Error", "Logout failed, try again");
          }
        },
      },
    ]);
  };

  if (!isVisible) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1 flex-row">
        <Animated.View
          className="w-72 h-full bg-white shadow-lg"
          style={{ transform: [{ translateX: slideAnimation }] }}
        >
          <SafeAreaView className="flex-1">
            <View className="p-6 border-b border-gray-100">
              <View className="w-16 h-16 bg-blue-500 rounded-full items-center justify-center mb-4">
                <Text className="text-2xl font-bold text-white">
                  {user?.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text className="text-xl font-bold text-gray-900">
                {user?.name}
              </Text>
              <Text className="text-gray-500">{user?.email}</Text>
            </View>

            <View className="flex-1 p-4">
              <TouchableOpacity
                className="flex-row items-center py-3"
                onPress={() => {
                  router.push("/(app)/settings");
                  onClose();
                }}
              >
                <AntDesign name="user" size={24} color="black" />
                <Text className="ml-3 text-gray-700">Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center py-3"
                onPress={() => {
                  handleLogout();
                  onClose();
                }}
              >
                <Entypo name="log-out" size={24} color="red" />
                <Text className="ml-3 text-red-500">Logout</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>

        <TouchableOpacity
          className="flex-1 bg-black/50"
          onPress={onClose}
          activeOpacity={1}
        />
      </View>
    </Modal>
  );
}
