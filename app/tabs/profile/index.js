import {
  View,
  ImageBackground,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { styles } from "../../../assets/Themes/styles";
import ProfileContent from "../../../components/ProfileContent";
import { useRouter } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Page(userID, username, userType, image) {
  const router = useRouter();
  return (
    <ImageBackground
      source={require("../../../assets/background_img.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <ProfileContent />
    </ImageBackground>
  );
}
