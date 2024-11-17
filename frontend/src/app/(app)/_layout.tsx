import { useTheme } from "@/shared/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function AppLayout() {
  const { isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: isDark ? "#1a1a1a" : "#f8f7f2",
          borderTopColor: isDark ? "#2a2a2a" : "#e2e2e2",
        },
        tabBarActiveTintColor: isDark ? "#ffffff" : "#1a1a1a",
        tabBarInactiveTintColor: isDark ? "#666666" : "#999999",
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Notes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="notes"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
