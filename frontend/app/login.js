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

export default function Page() {
  const supabaseUrl = "https://otmxnxmybzkluvkwuphs.supabase.co";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loggedInUserId, setLoggedInUserId, hostStatus, setHostStatus } =
    useUser();
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
            />
          </View>
          <View style={styles.commentInputBar}>
            <View style={styles.commentInput}>
              <TextInput
                style={styles.textBody}
                placeholder={"password"}
                placeholderTextColor={"gray"}
                value={password}
                secureTextEntry={true}
                onChangeText={(text) => {
                  setPassword(text);
                }}
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.initialLoginButton}
            onPress={async () => {
              const params = { username: username, password: password };
              console.log(params);
              console.log(`${supabaseUrl}/api/login`);
              const response = await fetch(`${supabaseUrl}/api/login`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(params),
              });
              console.log("test");
              setLoggedInUserId(username);
              setHostStatus(response.user.hostStatus);
              console.log(response.status);
              if (response.status == 201) {
                router.push("/tabs");
              }
            }}
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
