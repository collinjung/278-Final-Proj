import {
  Pressable,
  Image,
  Text,
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  Button,
} from "react-native";
import { router } from "expo-router";
import { useEffect } from "react";
import { styles } from "../assets/Themes/styles";
import { LinearGradient } from "expo-linear-gradient";

export default function Page() {
  return (
    <ImageBackground
      source={require("../assets/background_img.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={{ justifyContent: "center", flex: 1, alignItems: "center" }}>
        <Text style={styles.initialLoginTitle}>welcome to bubble!</Text>
        <TouchableOpacity
          style={styles.initialLoginButton}
          onPress={() => router.push("/signUp")}
        >
          <LinearGradient
            colors={["#261372", "#7C2FCA"]}
            style={[styles.initialLoginButton, { marginBottom: -8 }]}
          >
            <Text style={styles.textBody}>sign up</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.initialLoginButton}
          onPress={() => router.push("/login")}
        >
          <LinearGradient
            colors={["#261372", "#7C2FCA"]}
            style={[styles.initialLoginButton, { marginBottom: -8 }]}
          >
            <Text style={styles.textBody}>log in</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
