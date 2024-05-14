import {
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
  FlatList,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { styles } from "../../../assets/Themes/styles";
import SchedulePost from "../../../components/SchedulePost";

export default function Page() {
  return (
    <ImageBackground
      source={require("../../../assets/background_img.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.commentScrollView}>
        <SchedulePost></SchedulePost>
      </ScrollView>
    </ImageBackground>
  );
}
