import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

// import { UserProvider } from "../../contexts/UserContext";

export default function Layout() {
  return (
    // <UserProvider>
    <Tabs
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        headerShadowVisible: false,
        tabBarActiveTintColor: "white",
        tabBarStyle: {
          backgroundColor: "black",
          overflow: "hidden",
          position: "absolute",
          borderTopColor: "black",
        },
        tabBarTitleStyle: {
          color: "white",
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
        headerStyle: {
          backgroundColor: "black",
        },
        headerTitleStyle: {
          color: "white",
        },
      }}
    >
      <Tabs.Screen
        name="events"
        options={{
          title: "events",
          tabBarLabel: "events",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="party-popper"
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "schedule",
          tabBarLabel: "schedule",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="calendar" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "profile",
          tabBarLabel: "profile",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="user-circle-o" size={30} color={color} />
          ),
        }}
      />
    </Tabs>
    // </UserProvider>
  );
}
