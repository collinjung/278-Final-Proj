import { View, Text, Image, Dimensions } from "react-native";

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

const Comment = ({ text }) => {
  const date =
    formatDate("2021-03-19T12:00:00Z") +
    ", " +
    formatTime("2021-03-19T12:00:00Z");

  return (
    <View style={styles.commentContainer}>
      <Image
        source={require("../assets/stanford.png")}
        style={styles.postProfilePic}
      />
      <View style={{ flexDirection: "column" }}>
        <View style={styles.commentHeader}>
          <Text style={styles.usernameComments}>@sophiejin</Text>
          <Text style={styles.usernameComments}>{date}</Text>
        </View>
        <Text style={styles.textBody}>{text}</Text>
      </View>
    </View>
  );
};

export default Comment;
