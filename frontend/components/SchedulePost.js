import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import { styles } from "../assets/Themes/styles";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";

const SchedulePost = ({
  date,
  event_name,
  location,
  time,
  image_url,
  attendee_restrictions,
  description,
  postId,
  react_count,
  poster_username,
}) => {
  const router = useRouter();
  return (
    <View style={styles.schedulePostContainer}>
      <Image style={styles.schedulePostImage} source={{ uri: image_url }} />
      <View style={styles.schedulePostInfo}>
        <Text style={styles.textTitle}>{event_name}</Text>
        <Text style={styles.textBody}>{location}</Text>
        <Text style={styles.textBody}>
          {date} {time}
        </Text>
      </View>
      <View style={styles.scheduleSeePost}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/tabs/schedule/seePost",
              params: {
                date,
                event_name,
                location,
                time,
                image_url,
                attendee_restrictions,
                description,
                postId,
                react_count,
                poster_username,
              },
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
