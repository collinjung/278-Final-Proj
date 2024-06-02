import { Stack } from "expo-router";

export default function EventsLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitleVisible: false,
        headerBackTitleStyle: {
          backgroundColorolor: "white",
        },
        headerBackVisible: true,
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
          headerTitle: "what's bubble?",
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="signUpInfo"
        options={{
          headerTitle: "sign up",
        }}
      />
    </Stack>
  );
}
