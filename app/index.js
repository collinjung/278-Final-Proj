import {
  Pressable,
  Image,
  Text,
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Button,
} from "react-native";
import { router } from "expo-router";
import { useEffect } from "react";
import { Themes } from "../assets/Themes";

export default function Page() {
  return (
    <ImageBackground
      source={require("../assets/background_img.png")}
      resizeMode="cover"
      style={Themes.styles.background}
    >
      <View style={{ justifyContent: "center", flex: 1 }}>
        <Button
          title="Click to go to app"
          onPress={() => router.replace({ pathname: "/tabs" })}
          style={{ flexDirection: "column", alignContent: "center" }}
        ></Button>
      </View>
    </ImageBackground>
  );
}
