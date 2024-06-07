import { SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { styles } from "../../../assets/Themes/styles";
import Post from "../../../components/Post";

export default function Page() {
  const item = useLocalSearchParams();
  return (
    <ImageBackground
      source={require("../../../assets/background_img.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <SafeAreaView>
        <ScrollView>
          <Post
            attendee_restrictions={item.attendee_restrictions}
            date={item.date}
            description={item.description}
            event_name={item.event_name}
            postId={item.n_id}
            image_url={item.image_url}
            location={item.location}
            react_count={item.react_count}
            time={item.time}
            poster_username={item.poster_username}
            source="schedule"
          />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
