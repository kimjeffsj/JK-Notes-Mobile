import Header from "@/components/Header";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useRedux";
import { useTheme } from "@/shared/hooks/useTheme";
import { logout } from "@/shared/store/slices/authSlice";
import { deleteAllNotes } from "@/shared/store/slices/noteSlice";
import { setTheme } from "@/shared/store/slices/settingSlice";
import { ThemeType } from "@/shared/types/settings/settings";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback } from "react";
import {
  ActionSheetIOS,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  <View
    className={`bg-background-secondary dark:bg-background-dark-secondary mb-6 ${className}`}
  >
    {title && (
      <Text className="text-text-secondary dark:text-text-dark-secondary text-sm uppercase px-4 py-2">
        {title}
      </Text>
    )}
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
  subtitle?: string;
}

const SettingsItem = ({
  icon,
  title,
  onPress,
  showBorder = true,
  textColor = "text-primary",
  value,
  subtitle,
}: SettingsItemProps) => {
  const { isDark } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center px-4 py-3 ${
        showBorder ? "border-b border-border dark:border-border-dark" : ""
      }`}
    >
      <Ionicons
        name={icon}
        size={22}
        color={
          isDark
            ? "#ffffff"
            : textColor === "text-primary"
            ? "#1a1a1a"
            : "#FF3B30"
        }
      />
      <View className="flex-1 ml-3">
        <Text
          className={`text-base ${textColor} ${
            textColor === "text-primary" ? "dark:text-primary-dark" : ""
          }`}
        >
          {title}
        </Text>
        {subtitle && (
          <Text className="text-text-secondary dark:text-text-dark-secondary text-sm">
            {subtitle}
          </Text>
        )}
      </View>
      {value && (
        <Text className="text-text-secondary dark:text-text-dark-secondary mr-2">
          {value}
        </Text>
      )}
      <Ionicons
        name="chevron-forward"
        size={20}
        color={isDark ? "#666666" : "#999999"}
      />
    </TouchableOpacity>
  );
};

export default function Settings() {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.settings);
  const { user } = useAppSelector((state) => state.auth);
  const { notes } = useAppSelector((state) => state.notes);

  const handleThemeChange = useCallback(() => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Light", "Dark", "System"],
        cancelButtonIndex: 0,
        title: "Choose Theme",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) return;

        const themeOptions: ThemeType[] = ["light", "dark", "system"];
        const selectedTheme = themeOptions[buttonIndex - 1];

        dispatch(setTheme(selectedTheme));
      }
    );
  }, [dispatch]);

  const getThemeLabel = (theme: ThemeType) => {
    const { systemTheme } = useAppSelector((state) => state.settings);
    if (theme === "system") {
      return `System (${
        systemTheme.charAt(0).toUpperCase() + systemTheme.slice(1)
      })`;
    }
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  };

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

  const handleDeleteAllNotes = useCallback(() => {
    if (notes.length === 0) {
      Alert.alert("Info", "No notes to delete");
      return;
    }

    Alert.alert(
      "Delete All Notes",
      `${notes.length} notes will be deleted. This cannot be undone`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(deleteAllNotes()).unwrap();
              Alert.alert("Success", "All notes have been deleted");
            } catch (error) {
              Alert.alert("Error", "Failed to delete notes");
            }
          },
        },
      ]
    );
  }, [dispatch, notes.length]);

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <Header title="Settings" />

      <ScrollView>
        <View className="bg-background-secondary dark:bg-background-dark-secondary px-4 py-6 mb-6">
          <View className="w-20 h-20 bg-accent rounded-full items-center justify-center mb-3">
            <Text className="text-white text-2xl font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text className="text-xl font-semibold text-primary dark:text-primary-dark">
            {user?.name}
          </Text>
          <Text className="text-text-secondary dark:text-text-dark-secondary">
            {user?.email}
          </Text>
          <Text className="text-text-secondary dark:text-text-dark-secondary mt-2">
            Total {notes.length} {notes.length === 1 ? "Note" : "Notes"} written
          </Text>
        </View>

        <SettingsSection title="Account">
          <SettingsItem
            icon="person-outline"
            title="Edit Profile"
            onPress={() => router.push("../(auth)/profile/edit")}
          />
          <SettingsItem
            icon="key-outline"
            title="Change Password"
            onPress={() => router.push("../(auth)/profile/password")}
          />
        </SettingsSection>

        <SettingsSection title="Appearance">
          <SettingsItem
            icon="color-palette-outline"
            title="Theme"
            onPress={handleThemeChange}
            subtitle={`Current: ${getThemeLabel(theme)}`}
          />
        </SettingsSection>

        <SettingsSection title="Data Management">
          <SettingsItem
            icon="trash-outline"
            title="Delete All Notes"
            onPress={handleDeleteAllNotes}
            textColor="text-red-500"
            subtitle={notes.length > 0 ? `${notes.length} notes` : "No notes"}
          />
        </SettingsSection>

        <SettingsSection title="Security">
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
