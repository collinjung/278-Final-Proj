import {
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { styles } from "../assets/Themes/styles";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";
import { useUser } from "../userContext";
const supabaseUrl = "https://cs278proj-23ce60decf86.herokuapp.com";

const Post = ({
  attendee_restrictions,
  date,
  description,
  event_name,
  postId,
  poster_username,
  image_url,
  location,
  react_count,
  time,
  source,
  isAttending,
}) => {
  const router = useRouter();
  const [_, path] = useSegments();
  const [eventAdded, setEventAdded] = useState(false);
  const [profile_pic, setProfilePic] = useState("");
  const [reacted, setReacted] = useState(false);
  const [reactCount, setReactCount] = useState(0);
  const { loggedInUserId, setAddPost } = useUser();
  const username = loggedInUserId;
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          supabaseUrl + "/api/users/" + poster_username,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setProfilePic(data.user.profile_pic);
        setReactCount(react_count);
      } catch (e) {}
    }

    fetchData();
    setEventAdded(isAttending);
  }, [date]);

  const toggleEvent = async () => {
    if (eventAdded == false) {
      try {
        const response = await fetch(
          supabaseUrl + "/api/events/" + username + "/" + postId,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (e) {
        console.log(e);
      }
      setEventAdded(!eventAdded);
    } else {
      try {
        const response = await fetch(
          supabaseUrl + "/api/events/" + username + "/" + postId,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (e) {
        console.log(e);
      }
    }
    setEventAdded(!eventAdded);
    setAddPost((prevA) => prevA + 1);
    // }
  };

  const handleReact = async () => {
    if (reacted) {
      try {
        const response = await fetch(supabaseUrl + "/api/events/" + postId, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ react_count: reactCount - 1 }),
        });
      } catch (e) {
        console.log(e);
      }
      setReactCount(reactCount - 1);
    } else {
      try {
        const response = await fetch(supabaseUrl + "/api/events/" + postId, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ react_count: reactCount + 1 }),
        });
      } catch (e) {
        console.log(e);
      }
      setReactCount(reactCount + 1);
    }
    setReacted(!reacted);
  };

  const navigateToComments = () => {
    let path;
    if (source === "events") {
      path = "/tabs/events/comments";
    } else if (source === "schedule") {
      path = "/tabs/schedule/comments";
    } else if (source === "profile") {
      path = "/tabs/profile/comments";
    }
    router.push({
      pathname: path,
      params: { postId: postId },
    });
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.postUserContainer}>
        {profile_pic == "" ? (
          <Image
            style={styles.postProfilePic}
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/3ldryji87dr-5%3A26?alt=media&token=6d6684b0-927a-4ca3-81f2-0b6af133defe",
            }}
          />
        ) : (
          <Image
            style={styles.postProfilePic}
            source={{
              uri: profile_pic,
            }}
          />
        )}
        <Text style={styles.postUsername}>@{poster_username}</Text>
      </View>
      {image_url == "" ? (
        <Image
          source={require("../assets/crochella.png")}
          style={styles.postImage}
        />
      ) : (
        <Image source={{ uri: image_url }} style={styles.postImage} />
      )}

      <View style={styles.postReactBar}>
        <TouchableOpacity
          style={styles.postReactContainer}
          onPress={handleReact}
        >
          <FontAwesome
            name="heart"
            size={18}
            color={reacted ? "red" : "white"}
          />
          <Text style={styles.textBody}>{reactCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.seeComments}
          onPress={navigateToComments}
        >
          <FontAwesome name="comment" size={18} color="white" />
          <Text style={styles.textBody}> Comments</Text>
        </TouchableOpacity>
        {source == "events" && (
          <TouchableOpacity
            style={eventAdded ? styles.postAddedEvent : styles.postAddEvent}
            onPress={toggleEvent}
          >
            <Ionicons
              name={
                eventAdded ? "checkmark-circle-outline" : "add-circle-outline"
              }
              size={18}
              color="white"
              style={{ marginRight: 5 }}
            />
            <Text style={styles.textBody}>
              {eventAdded ? "added!" : "add to schedule"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.postContentContainer}>
        <View style={styles.postContentComponents}>
          <Ionicons
            name="balloon"
            size={18}
            color="white"
            style={{ marginRight: 5 }}
          />
          <Text style={styles.textTitle}>{event_name}</Text>
        </View>
        <View style={styles.postContentComponents}>
          <Ionicons
            name="location"
            size={18}
            color="white"
            style={{ marginRight: 5 }}
          />
          <Text style={styles.textBody}>{location}</Text>
        </View>
        <View style={styles.postContentComponents}>
          <Ionicons
            name="calendar-number"
            size={18}
            color="white"
            style={{ marginRight: 5 }}
          />
          <Text style={styles.textBody}>{date}</Text>
        </View>
        <View style={styles.postContentComponents}>
          <FontAwesome
            name="clock-o"
            size={18}
            color="white"
            style={{ marginRight: 5 }}
          />
          <Text style={styles.textBody}>{time}</Text>
        </View>
        <View style={styles.postContentComponents}>
          <Ionicons
            name="people"
            size={18}
            color="white"
            style={{ marginRight: 5 }}
          />
          <Text style={styles.textBody}>{attendee_restrictions}</Text>
        </View>
        <View
          style={[styles.postContentComponents, { alignItems: "flex-start" }]}
        >
          <Ionicons
            name="information-circle"
            size={18}
            color="white"
            style={{ marginRight: 5 }}
          />
          <Text style={[styles.textBody, { marginRight: 15 }]}>
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
};
export default Post;
