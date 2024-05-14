import {
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Text,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { styles } from "../../../assets/Themes/styles";
import Post from "../../../components/Post";
import PostButton from "../../../components/PostButton";

const data = [
  { id: "1", title: "first" },
  { id: "2", title: "second" },
  { id: "3", title: "third" },
];

export default function Page() {
  return (
    <ImageBackground
      source={require("../../../assets/background_img.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <SafeAreaView>
        <PostButton />
        <FlatList
          data={data}
          renderItem={({ item }) => <Post id={item.id} source="events" />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 60 }}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}
