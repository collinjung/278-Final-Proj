import {
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
  Touchable,
} from "react-native";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { styles } from "../../../assets/Themes/styles";
import { colors } from "../../../assets/Themes/colors";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useSegments } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import CommunityGuidelines from "../../../components/CommunityGuidelines";

export default function Page() {
  const [image, setImage] = useState(null);
  const [type, setType] = useState(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [reqs, setReqs] = useState("");
  const [description, setDescription] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = { hour: "2-digit", minute: "2-digit", hour12: true };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });
    if (!result.canceled) {
      const response = result.assets[0];
      setImage(response.uri);
      setType(response.type);
    }
  };
  let shown = null;
  if (!image) {
    shown = (
      <Text style={{ color: "gray", fontSize: 20, fontFamily: "gill sans" }}>
        ⇧ upload image
      </Text>
    );
  }

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setTime(currentTime);
  };

  return (
    <ImageBackground
      source={require("../../../assets/background_img.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          contentContainerStyle={{
            paddingBottom: 45,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              alignItems: "center",
              paddingBottom: 50,
            }}
          >
            <TouchableOpacity
              onPress={pickImage}
              style={[
                styles.postImage,
                { backgroundColor: colors.container, opacity: 0.7 },
              ]}
            >
              {image && (
                <Image source={{ uri: image }} style={styles.postImage} />
              )}
              {shown}
            </TouchableOpacity>
            <View style={styles.newPostInfoContainer}>
              <View style={styles.newPostInfoLabel}>
                <Ionicons
                  name="balloon"
                  size={18}
                  color="white"
                  style={{ marginRight: 5 }}
                />
                <Text style={styles.textBody}>event name</Text>
              </View>
              <TextInput
                style={styles.newPostInfoText}
                placeholder="name..."
                placeholderTextColor={"gray"}
                value={name}
                multiline={true}
                onChangeText={(text) => {
                  setName(text);
                }}
                color="white"
                autoCapitalize="none"
              ></TextInput>
            </View>
            <View style={styles.newPostInfoContainer}>
              <View style={styles.newPostInfoLabel}>
                <Ionicons
                  name="location"
                  size={18}
                  color="white"
                  style={{ marginRight: 5 }}
                />
                <Text style={styles.textBody}>location</Text>
              </View>
              <TextInput
                style={styles.newPostInfoText}
                placeholder="location..."
                placeholderTextColor={"gray"}
                value={location}
                multiline={true}
                onChangeText={(text) => {
                  setLocation(text);
                }}
                color="white"
                autoCapitalize="none"
              ></TextInput>
            </View>
            <View style={styles.newPostInfoContainer}>
              <View style={styles.newPostInfoLabel}>
                <Ionicons
                  name="calendar-number"
                  size={18}
                  color="white"
                  style={{ marginRight: 5 }}
                />
                <Text style={styles.textBody}>date</Text>
              </View>

              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
                style={{
                  width: 130,
                }}
                themeVariant="dark"
              />
            </View>
            <View style={styles.newPostInfoContainer}>
              <View style={styles.newPostInfoLabel}>
                <FontAwesome
                  name="clock-o"
                  size={18}
                  color="white"
                  style={{ marginRight: 5 }}
                />
                <Text style={styles.textBody}>time</Text>
              </View>
              <DateTimePicker
                value={time}
                mode="time"
                display="default"
                onChange={handleTimeChange}
                themeVariant="dark"
                style={{
                  width: 90,
                }}
              />
            </View>
            <View style={styles.newPostInfoContainer}>
              <View style={styles.newPostInfoLabel}>
                <Ionicons
                  name="people"
                  size={18}
                  color="white"
                  style={{ marginRight: 5 }}
                />
                <Text style={styles.textBody}>attendee restrictions</Text>
              </View>
              <TextInput
                style={styles.newPostInfoText}
                placeholder="e.g. age range, ID required..."
                placeholderTextColor={"gray"}
                value={reqs}
                multiline={true}
                onChangeText={(text) => {
                  setReqs(text);
                }}
                color="white"
                autoCapitalize="none"
              ></TextInput>
            </View>
            <View style={styles.newPostInfoContainer}>
              <View style={styles.newPostInfoLabel}>
                <Ionicons
                  name="information-circle"
                  size={18}
                  color="white"
                  style={{ marginRight: 5 }}
                />
                <Text style={styles.textBody}>description</Text>
              </View>
              <Text
                style={{
                  fontSize: 15,
                  color: "#cacccb",
                  marginLeft: 5,
                  marginBottom: 5,
                }}
              >
                describe your event and add a prompt for users to answer in the
                comments! &#40;e.g. song requests, snack requests, etc. &#41;
              </Text>
              <TextInput
                style={styles.newPostInfoText}
                placeholder="description..."
                placeholderTextColor={"gray"}
                value={description}
                multiline={true}
                onChangeText={(text) => {
                  setDescription(text);
                }}
                color="white"
                autoCapitalize="none"
              ></TextInput>
            </View>
            <View style={styles.newPostInfoContainer}>
              <Text style={[styles.textTitle, { margin: 5 }]}>
                make sure your post follows our
                <Text
                  style={{
                    color: "rgba(124, 47, 202, 0.8)",
                    fontWeight: "bold",
                    fontSize: 16,
                    marginTop: 5,
                    textDecorationLine: "underline",
                    fontFamily: "gill sans",
                  }}
                  onPress={() => setModalVisible(true)}
                >
                  community guidelines
                </Text>
              </Text>
              <CommunityGuidelines
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
              ></CommunityGuidelines>
            </View>
            <TouchableOpacity
              style={styles.newPostButton}
              onPress={async () => {
                router.replace("tabs/events/post");
                router.push({
                  pathname: "/tabs/events",
                });
              }}
            >
              <LinearGradient
                colors={["#261372", "#7C2FCA"]}
                style={styles.newPostButton}
              >
                <Text
                  style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                >
                  post
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
