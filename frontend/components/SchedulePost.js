import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import { styles } from "../assets/Themes/styles";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";

const windowWidth = Dimensions.get("window").width;

const SchedulePost = ({ postID }) => {
  const router = useRouter();

  return (
    <View style={styles.schedulePostContainer}>
      <Image
        style={styles.schedulePostImage}
        source={require("../assets/crochella.png")}
      />
      <View style={styles.schedulePostInfo}>
        <Text style={styles.textTitle}>Crochella</Text>
        <Text style={styles.textBody}>Crothers Court</Text>
        <Text style={styles.textBody}>6:00pm</Text>
      </View>
      <View style={styles.scheduleSeePost}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/tabs/schedule/seePost",
            })
          }
        >
          <FontAwesome name="arrow-circle-right" size={25} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SchedulePost;
