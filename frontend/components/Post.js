import {
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { styles } from "../assets/Themes/styles";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";

const windowWidth = Dimensions.get("window").width;

const Post = ({ postID, source }) => {
  const router = useRouter();
  const [_, path] = useSegments();
  const [eventAdded, setEventAdded] = useState(false);
  const [reacted, setReacted] = useState(false);
  const [reactCount, setReactCount] = useState(0);

  const toggleEvent = () => {
    setEventAdded(!eventAdded);
  };

  const handleReact = () => {
    if (reacted) {
      setReactCount(reactCount - 1);
    } else {
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
    });
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.postUserContainer}>
        <Image
          style={styles.postProfilePic}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/3ldryji87dr-5%3A26?alt=media&token=6d6684b0-927a-4ca3-81f2-0b6af133defe",
          }}
        />
        <Text style={styles.postUsername}>@crotherscourt</Text>
      </View>
      <Image
        source={require("../assets/crochella.png")}
        style={styles.postImage}
      />
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
          style={styles.postReactContainer}
          onPress={navigateToComments}
        >
          <FontAwesome name="comment" size={18} color="white" />
          <Text style={styles.textBody}>1</Text>
        </TouchableOpacity>
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
      </View>
      <View style={styles.postContentContainer}>
        <View style={styles.postContentComponents}>
          <Ionicons
            name="balloon"
            size={18}
            color="white"
            style={{ marginRight: 5 }}
          />
          <Text style={styles.textTitle}>Crochella</Text>
        </View>
        <View style={styles.postContentComponents}>
          <Ionicons
            name="location"
            size={18}
            color="white"
            style={{ marginRight: 5 }}
          />
          <Text style={styles.textBody}>Crothers Courtyard</Text>
        </View>
        <View style={styles.postContentComponents}>
          <Ionicons
            name="calendar-number"
            size={18}
            color="white"
            style={{ marginRight: 5 }}
          />
          <Text style={styles.textBody}>April 25th</Text>
        </View>
        <View style={styles.postContentComponents}>
          <FontAwesome
            name="clock-o"
            size={18}
            color="white"
            style={{ marginRight: 5 }}
          />
          <Text style={styles.textBody}>6:00pm</Text>
        </View>
        <View style={styles.postContentComponents}>
          <Ionicons
            name="people"
            size={18}
            color="white"
            style={{ marginRight: 5 }}
          />
          <Text style={styles.textBody}>
            18+, valid Stanford student ID required
          </Text>
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
            Share your favorite student band in the comments!
          </Text>
        </View>
      </View>
    </View>
  );
};
export default Post;
