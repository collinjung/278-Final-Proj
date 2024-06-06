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
import { styles } from "../../assets/Themes/styles";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Page() {
  return (
    <ImageBackground
      source={require("../../assets/background_img.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <View
        style={{
          marginTop: 80,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.signUpPitchContainer}>
          <MaterialCommunityIcons
            name="party-popper"
            size={50}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text style={[styles.textLabel, { flex: 1, flexWrap: "wrap" }]}>
            see what fun events are happening on campus!
          </Text>
        </View>
        <View style={styles.signUpPitchContainer}>
          <FontAwesome5
            name="glass-cheers"
            size={45}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.textLabel, { flex: 1, flexWrap: "wrap" }]}>
            hosts can make posts advertising kickbacks or parties happening on
            campus
          </Text>
        </View>
        <View style={styles.signUpPitchContainer}>
          <FontAwesome
            name="users"
            size={50}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text style={[styles.textLabel, { flex: 1, flexWrap: "wrap" }]}>
            users can view upcoming events and save them to their schedule
          </Text>
        </View>
        <View style={styles.signUpPitchContainer}>
          <FontAwesome
            name="comment"
            size={50}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text style={[styles.textLabel, { flex: 1, flexWrap: "wrap" }]}>
            chat with your peers in the comments about events you're excited
            about
          </Text>
        </View>
        <View style={styles.signUpPitchContainer}>
          <MaterialCommunityIcons
            name="file-document-edit"
            size={50}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text style={[styles.textLabel, { flex: 1, flexWrap: "wrap" }]}>
            apply to be an individual host or represent an organization
          </Text>
        </View>
        <TouchableOpacity
          style={styles.newPostButton}
          onPress={async () => {
            router.push({
              pathname: "/signUp/signUpInfo",
            });
          }}
        >
          <LinearGradient
            colors={["#261372", "#7C2FCA"]}
            style={styles.newPostButton}
          >
            <Text style={styles.textLabel}>get started</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
