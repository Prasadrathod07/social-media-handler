import { Tabs } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useColorScheme } from "react-native";

export default function AppTabsLayout() {
  const isDark = useColorScheme() === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6a3bff",
        tabBarInactiveTintColor: isDark ? "#64748b" : "#94a3b8",
        tabBarStyle: {
          backgroundColor: isDark ? "#0f172a" : "#ffffff",
          borderTopColor: isDark ? "#1e293b" : "#f1f5f9",
          height: 64,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarIcon: ({ color, size }) => <FontAwesome6 name="house" size={size - 4} color={color} /> }}
      />
      <Tabs.Screen
        name="topics"
        options={{
          title: "Topics",
          tabBarIcon: ({ color, size }) => <FontAwesome6 name="lightbulb" size={size - 4} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => <FontAwesome6 name="comment-dots" size={size - 4} color={color} />,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Schedule",
          tabBarIcon: ({ color, size }) => <FontAwesome6 name="calendar-days" size={size - 4} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <FontAwesome6 name="user" size={size - 4} color={color} />,
        }}
      />
    </Tabs>
  );
}
