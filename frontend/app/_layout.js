import { Stack } from "expo-router/";
import "react-native-reanimated";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="signUp"
        options={{
          headerShown: false,
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="tabs"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
