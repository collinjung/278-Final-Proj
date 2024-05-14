import { Stack } from "expo-router";

export default function ScheduleLayout() {
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
          headerTitle: "schedule",
        }}
      />
      <Stack.Screen
        name="seePost"
        options={{
          headerTitle: "view event",
        }}
      />
    </Stack>
  );
}
