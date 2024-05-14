import { Stack } from "expo-router";

export default function EventsLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitleVisible: true,
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
        },
        headerTintColor: "#bfbdbd",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "events",
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="post"
        options={{
          headerTitle: "post event",
        }}
      />
    </Stack>
  );
}
