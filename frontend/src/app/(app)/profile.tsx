import Button from "@/components/Button";
import Input from "@/components/Input";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useRedux";
import { logout, updateProfile } from "@/shared/store/slices/authSlice";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { notes } = useAppSelector((state) => state.notes);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleUpdate = async () => {
    if (!currentPassword) {
      Alert.alert("Error", "Current password is required");
      return;
    }

    if (newPassword && newPassword !== confirmNewPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }
    try {
      const updateData = {
        name: name !== user?.name ? name : undefined,
        currentPassword,
        ...(newPassword
          ? {
              newPassword,
              confirmNewPassword,
            }
          : {}),
      };
      await dispatch(updateProfile(updateData)).unwrap();
      Alert.alert("Success", "Profile updated successfully");
      setIsEditing(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      router.replace("/(auth)/login");
    } catch (error: any) {
      Alert.alert("Error", "Failed to logout");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="bg-white px-6 pt-8 pb-12 shadow-sm">
          <View className="items-center">
            <View className="w-24 h-24 bg-blue-500 rounded-full mb-4 items-center justify-center">
              <Text className="text-white text-3xl font-bold">
                {user?.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text className="text-2xl font-bold mb-1">{user?.name}</Text>
            <Text className="text-gray-500 mb-4">{user?.email}</Text>
            <View className="bg-blue-50 px-4 py-2 rounded-full">
              <Text className="text-blue-600 font-medium">
                {notes.length} {notes.length === 1 ? "Note" : "Notes"} Created
              </Text>
            </View>
          </View>
        </View>

        <View className="px-6 pt-6">
          {!isEditing ? (
            <View className="space-y-4">
              <TouchableOpacity
                className="bg-white p-4 rounded-lg shadow-sm flex-row justify-between items-center"
                onPress={() => setIsEditing(true)}
              >
                <Text className="text-base font-medium">Edit Profile</Text>
                <Text className="text-blue-500">→</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-white p-4 rounded-lg shadow-sm flex-row justify-between items-center"
                onPress={handleLogout}
              >
                <Text className="text-base font-medium text-red-500">
                  Logout
                </Text>
                <Text className="text-red-500">→</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="bg-white p-6 rounded-lg shadow-sm">
              <Text className="text-xl font-bold mb-6">Edit Profile</Text>

              <Input
                label="Name"
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                containerClassName="mb-4"
              />
              <Input
                label="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                secureTextEntry
                containerClassName="mb-4"
              />

              <Input
                label="New Password (optional)"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                secureTextEntry
                containerClassName="mb-4"
              />

              {newPassword ? (
                <Input
                  label="Confirm New Password"
                  value={confirmNewPassword}
                  onChangeText={setConfirmNewPassword}
                  placeholder="Confirm new password"
                  secureTextEntry
                  containerClassName="mb-6"
                />
              ) : null}
              <View className="flex-row space-x-3">
                <Button
                  title="Cancel"
                  onPress={() => {
                    setIsEditing(false);
                    setName(user?.name || "");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmNewPassword("");
                  }}
                  variant="secondary"
                  className="flex-1"
                />
                <Button
                  title="Save Changes"
                  onPress={handleUpdate}
                  className="flex-1"
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
