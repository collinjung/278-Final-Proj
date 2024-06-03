import { Stack } from "expo-router";

export default function ScheduleLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitleStyle: {
          backgroundColorolor: "white",
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: "black",
        },
        headerTitleStyle: {
          color: "white",
          fontWeight: "bold",
          fontFamily: "gill sans",
        },
        headerTintColor: "#bfbdbd",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerBackVisible: false,
          headerTitle: "profile",
        }}
      />
      <Stack.Screen
        name="editProfile"
        options={{
          headerBackTitleVisible: true,
          headerTitle: "edit profile",
        }}
      />
    </Stack>
  );
}
