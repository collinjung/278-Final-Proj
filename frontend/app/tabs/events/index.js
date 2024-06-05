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
import { useUser } from "../../../userContext";

const supabaseUrl = "http://10.30.65.121:3000";
export default function Page() {
  const { loggedInUserId, setLoggedInUserId, hostStatus, addPost } = useUser();
  const [data, setData] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [overlappingElements, setOE] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(supabaseUrl + "/api/events", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response2 = await fetch(
          supabaseUrl + "/api/events/" + loggedInUserId,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const res = await response.json();
        const res2 = await response2.json();

        setData(res.events);
        setUserPosts(res2);
        // console.log(res.events);
        // console.log(res2);
        const oe = getOverlappingElements(res.events, res2);
        // console.log(oe);
        setOE(oe);
      } catch (e) {
        setUserData([]);
        setUserPosts([]);
      }
    }

    fetchData();
  }, []);

  function areDictionariesEqual(dict1, dict2) {
    const keys1 = Object.keys(dict1);
    const keys2 = Object.keys(dict2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (dict1[key] !== dict2[key]) {
        return false;
      }
    }

    return true;
  }

  function getOverlappingElements(list1, list2) {
    return list1.filter((item1) =>
      list2.some((item2) => areDictionariesEqual(item1, item2))
    );
  }
  function isItemInOverlappingElements(item) {
    return overlappingElements.some((overlappingItem) =>
      areDictionariesEqual(item, overlappingItem)
    );
  }

  return (
    <ImageBackground
      source={require("../../../assets/background_img.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <SafeAreaView>
        {hostStatus == "host" && <PostButton />}
        <FlatList
          data={data}
          renderItem={({ item }) => {
            const isAttending = isItemInOverlappingElements(item);
            return (
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
                source="events"
                isAttending={isAttending}
              />
            );
          }}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 60 }}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}
