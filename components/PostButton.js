import { TouchableOpacity, Text } from "react-native";
import { styles } from "../assets/Themes/styles";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useSegments } from "expo-router";

const PostButton = () => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.eventsAddPost}
      onPress={() =>
        router.push({
          pathname: "/tabs/events/post",
        })
      }
    >
      <LinearGradient
        colors={["#261372", "#7C2FCA"]}
        style={styles.eventsAddPostButton}
      >
        <FontAwesome5
          name="glass-cheers"
          size={22}
          color="white"
          style={{ marginRight: 2 }}
        />
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
          +
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default PostButton;
