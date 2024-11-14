import Header from "@/components/Header";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useRedux";
import { logout } from "@/shared/store/slices/authSlice";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface SettingsSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const SettingsSection = ({
  title,
  children,
  className = "",
}: SettingsSectionProps) => (
  <View className={`bg-white mb-6 ${className}`}>
    <Text className="text-text-secondary text-sm uppercase px-4 py-2">
      {title}
    </Text>
    {children}
  </View>
);

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  showBorder?: boolean;
  textColor?: string;
  value?: string;
}

const SettingsItem = ({
  icon,
  title,
  onPress,
  showBorder = true,
  textColor = "text-primary",
  value,
}: SettingsItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-row items-center px-4 py-3 ${
      showBorder ? "border-b border-border" : ""
    }`}
  >
    <Ionicons
      name={icon}
      size={22}
      color={textColor === "text-primary" ? "1a1a1a" : "#FF3B30"}
    />
    <Text className={`flex-1 ml-3 text-base ${textColor}`}>{title}</Text>
    {value && <Text className="text-text-secondary mr-2">{value}</Text>}
    <Ionicons name="chevron-forward" size={20} color="#666666" />
  </TouchableOpacity>
);

export default function Settings() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { notes } = useAppSelector((state) => state.notes);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await dispatch(logout()).unwrap();

            router.replace("/(public)/welcome");
          } catch (error: any) {
            Alert.alert(
              "Error",
              "Failed to logout properly. THe app will restart.",
              [
                {
                  text: "OK",
                  onPress: () => {
                    router.replace("/(public)/welcome");
                  },
                },
              ]
            );
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-background">
      <Header title="Settings" />

      <ScrollView>
        <View className="bg-background-secondary px-4 py-6 mb-6">
          <View className="w-20 h-20 bg-accent rounded-full items-center justify-center mb-3">
            <Text className="text-white text-2xl font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text className="text-xl font-semibold text-primary">
            {user?.name}
          </Text>
          <Text className="text-text-secondary">{user?.email}</Text>
          <Text className="text-text-secondary mt-2">
            Total {notes.length} {notes.length === 1 ? "Note" : "Notes"} written
          </Text>
        </View>

        <SettingsSection title="Account">
          <SettingsItem
            icon="person-outline"
            title="Edit Profile"
            onPress={() => router.push("../(auth)/profile/edit")}
          />
          {/* <SettingsItem
            icon="key-outline"
            title="Change Password"
            onPress={() => router.push("profile/password")}
          /> */}

          {/* <SettingsItem
            icon="notifications-outline"
            title="Notifications"
            onPress={() => router.push("/settings/notifications")}
          /> */}
        </SettingsSection>

        <SettingsSection title="Security" className="mt-4">
          <SettingsItem
            icon="log-out-outline"
            title="Logout"
            onPress={handleLogout}
            showBorder={false}
            textColor="text-red-500"
          />
        </SettingsSection>
      </ScrollView>
    </View>
  );
}