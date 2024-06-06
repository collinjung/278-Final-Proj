import { SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { styles } from "../../../assets/Themes/styles";
import Post from "../../../components/Post";

export default function Page() {
  return (
    <ImageBackground
      source={require("../../../assets/background_img.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <SafeAreaView>
        <ScrollView>
          <Post source="schedule" />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
