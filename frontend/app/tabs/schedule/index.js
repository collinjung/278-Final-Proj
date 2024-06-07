import {
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
  ScrollView,
  ImageBackground,
} from "react-native";
import React, { useState, useEffect } from "react";
import { styles } from "../../../assets/Themes/styles";
import SchedulePost from "../../../components/SchedulePost";
import { useUser } from "../../../userContext";

const supabaseUrl = "https://cs278project-a77e4f6a4dc9.herokuapp.com";

export default function Page() {
  const [data, setData] = useState([]);
  const { loggedInUserId, addPost } = useUser();
  const username = loggedInUserId;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(supabaseUrl + "/api/events/" + username, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const stuff = await response.json();
        setData(stuff);
      } catch (e) {
        setData([]); // Fixed typo from setUserData to setData
      }
    }

    fetchData();
  }, [addPost]);

  return (
    <ImageBackground
      source={require("../../../assets/background_img.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <SafeAreaView style={localStyles.safeArea}>
        <ScrollView contentContainerStyle={styles.commentScrollView}>
          {data.map((item) => (
            <SchedulePost
              key={item.id}
              date={item.date}
              event_name={item.event_name}
              location={item.location}
              time={item.time}
              image_url={item.image_url}
              attendee_restrictions={item.attendee_restrictions}
              description={item.description}
              postId={item.n_id}
              react_count={item.react_count}
              poster_username={item.poster_username}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const localStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingBottom: 60,
  },
});
