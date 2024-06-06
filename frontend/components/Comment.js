import { View, Text, Image, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import { styles } from "../assets/Themes/styles";

const formatDate = (dateString) => {
  const options = { month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatTime = (dateString) => {
  const options = { hour: "2-digit", minute: "2-digit", hour12: true };
  return new Date(dateString).toLocaleTimeString(undefined, options);
};

const windowWidth = Dimensions.get("window").width;
const supabaseUrl = "https://cs278project-a77e4f6a4dc9.herokuapp.com";

const Comment = ({ username, date, text }) => {
  const formatted_date = formatDate(date) + ", " + formatTime(date);
  const [profile_pic, setProfilePic] = useState("");
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(supabaseUrl + "/api/users/" + username, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data.user.profile_pic);
        setProfilePic(data.user.profile_pic);
      } catch (e) {}
    }

    fetchData();
  }, []);

  return (
    <View style={styles.commentContainer}>
      {profile_pic == "" ? (
        <Image
          source={require("../assets/stanford.png")}
          style={styles.postProfilePic}
        />
      ) : (
        <Image source={{ uri: profile_pic }} style={styles.postProfilePic} />
      )}
      <View style={{ flexDirection: "column" }}>
        <View style={styles.commentHeader}>
          <Text style={styles.usernameComments}>@{username}</Text>
          <Text style={styles.usernameComments}>{formatted_date}</Text>
        </View>
        <Text style={styles.textBody}>{text}</Text>
      </View>
    </View>
  );
};

export default Comment;
