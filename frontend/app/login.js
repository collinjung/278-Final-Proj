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
  KeyboardAvoidingView,
  Button,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { styles } from "../assets/Themes/styles";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "../userContext";

const supabaseUrl = "http://10.30.65.121:3000";
// const supabaseUrl = "http://localhost:3000";

const handleLogin = async (
  username,
  password,
  setHostStatus,
  setLoggedInUserId
) => {
  const params = { username: username, password: password };
  try {
    const response = await fetch(supabaseUrl + "/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    const data = await response.json();

    setLoggedInUserId(username);
    setHostStatus(data.user.hostStatus);
    if (response.status == 200) {
      router.push("/tabs");
    }
  } catch (e) {
    console.log(e);
  }
};

export default function Page() {
  //   const supabaseUrl = "https://otmxnxmybzkluvkwuphs.supabase.co";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setLoggedInUserId, setHostStatus } = useUser();

  return (
    <ImageBackground
      source={require("../assets/background_img.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            margin: 10,
          }}
        >
          <Text style={styles.initialLoginTitle}>log in</Text>
          <View style={[styles.commentInputBar, { marginBottom: 10 }]}>
            <TextInput
              style={styles.textBody}
              placeholder={"username or email"}
              placeholderTextColor={"gray"}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
              }}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.commentInputBar}>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.textBody}
                placeholder={"password"}
                placeholderTextColor={"gray"}
                value={password}
                secureTextEntry={true}
                onChangeText={(text) => {
                  setPassword(text);
                }}
                autoCapitalize="none"
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.initialLoginButton}
            onPress={() =>
              handleLogin(username, password, setHostStatus, setLoggedInUserId)
            }
          >
            <LinearGradient
              colors={["#261372", "#7C2FCA"]}
              style={[styles.profileEditButton, { width: 115 }]}
            >
              <Text style={styles.textBody}>let's go!</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
