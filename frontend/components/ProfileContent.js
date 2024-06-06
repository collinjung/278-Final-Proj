import {
  View,
  ImageBackground,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { styles } from "../assets/Themes/styles";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import CommunityGuidelines from "./CommunityGuidelines";
import Post from "./Post";
import { useUser } from "../userContext";

const supabaseUrl = "https://cs278project-a77e4f6a4dc9.herokuapp.com";

const ProfileContent = ({ userID, username, userType, image }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { loggedInUserId } = useUser();
  const [userData, setUserData] = useState({
    username: "",
    hostStatus: "",
    profile_pic: "",
    hostStatus: "attendee",
  });
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          supabaseUrl + "/api/users/" + loggedInUserId,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setUserData(data.user);
      } catch (e) {
        setUserData({
          username: "",
          hostStatus: "",
          profile_pic: "",
          hostStatus: "attendee",
        });
      }
    }

    fetchData();
  }, []);

  const router = useRouter();
  return (
    <ImageBackground
      source={require("../assets/background_img.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.profileScrollView}>
        <View style={styles.profileCard}>
          {userData.profile_pic != "" ? (
            <Image
              style={styles.profilePicture}
              source={{ uri: userData.profile_pic }}
            />
          ) : (
            <Image
              style={styles.profilePicture}
              source={require("../assets/stanford.png")}
            />
          )}

          <Text style={styles.profileUsername}>@{userData.username}</Text>
          <Text style={styles.textSecondary}>{userData.hostStatus}</Text>
          {/* <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/tabs/profile/editProfile")}
          >
            <LinearGradient
              colors={["#261372", "#7C2FCA"]}
              style={[styles.profileButton, { marginBottom: -8 }]}
            >
              <Text style={styles.textBody}>edit profile</Text>
            </LinearGradient>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => setModalVisible(true)}
          >
            <LinearGradient
              colors={["#261372", "#7C2FCA"]}
              style={styles.profileButton}
            >
              <Text style={styles.textBody}>review community guidelines</Text>
            </LinearGradient>
          </TouchableOpacity>
          <CommunityGuidelines
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
          ></CommunityGuidelines>
        </View>
        {/* if host, view posts */}
        {userData.hostStatus == "host" && (
          <View style={styles.profilePostsView}>
            <View style={styles.profilePostsHeader}>
              <Ionicons
                name="balloon"
                size={22}
                color="white"
                style={{ marginRight: 5, marginLeft: 10 }}
              />
              <Text
                style={{
                  fontSize: 20,
                  color: "white",
                  fontWeight: "bold",
                  fontFamily: "gill sans",
                }}
              >
                my posts
              </Text>
            </View>
            <Post source="profile" />
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

export default ProfileContent;
