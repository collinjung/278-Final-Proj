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
import { uploadImage } from "../../../util";
import { useUser } from "../../../userContext";

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
  const { loggedInUserId, setAddPost, loggedInUserUUID } = useUser();
  const [nameError, setNameError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [reqsError, setReqsError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [imageError, setImageError] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
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

  const validateForm = () => {
    let isValid = true;

    // Reset error messages
    setNameError("");
    setLocationError("");
    setReqsError("");
    setDescriptionError("");
    setImageError("");

    // Validate name
    if (!name) {
      setNameError("Please enter an event name.");
      isValid = false;
    }

    // Validate location
    if (!location) {
      setLocationError("Please enter a location.");
      isValid = false;
    }

    // Validate attendee restrictions
    if (!reqs) {
      setReqsError("Please enter attendee restrictions.");
      isValid = false;
    }

    // Validate description
    if (!description) {
      setDescriptionError("Please enter a description.");
      isValid = false;
    }

    // Validate image
    if (!image) {
      setImageError("Please select an image.");
      isValid = false;
    }

    return isValid;
  };

  const handlePost = async () => {
    if (validateForm()) {
      try {
        if (image) {
          const imageUrl = await uploadImage(image, loggedInUserId);
          const eventData = {
            eventName: name,
            location,
            date: formatDate(date),
            time: formatTime(time),
            attendeeRestrictions: reqs,
            description,
            imageUrl,
            userId: loggedInUserUUID,
            username: loggedInUserId,
          };

          const response = await fetch("https://cs278proj-23ce60decf86.herokuapp.com", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(eventData),
          });

          if (response.ok) {
            setAddPost((prevAddPost) => prevAddPost + 1);
            router.replace("tabs/events/post");
            router.push({
              pathname: "/tabs/events",
            });
          } else {
            console.error("Failed to create event post");
          }
        } else {
          console.error("No image selected");
        }
      } catch (error) {
        console.error("Error creating event post:", error);
      }
    }
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
            {imageError !== "" && <Text style={styles.imageErrorMessage}>{imageError}</Text>}
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
                  setNameError("");
                }}
                color="white"
                autoCapitalize="none"
              ></TextInput>
              {nameError !== "" && <Text style={styles.errorMessage}>{nameError}</Text>}
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
                  setLocationError("");
                }}
                color="white"
                autoCapitalize="none"
              ></TextInput>
              {locationError !== "" && <Text style={styles.errorMessage}>{locationError}</Text>}
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
                  setReqsError("");
                }}
                color="white"
                autoCapitalize="none"
              ></TextInput>
              {reqsError !== "" && <Text style={styles.errorMessage}>{reqsError}</Text>} 
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
                  setDescriptionError("");
                }}
                color="white"
                autoCapitalize="none"
              ></TextInput>
              {descriptionError !== "" && <Text style={styles.errorMessage}>{descriptionError}</Text>}
            </View>
            <View style={styles.newPostInfoContainer}>
              <Text style={[styles.textTitle, { margin: 5 }]}>
                make sure your post follows our{' '} 
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
              onPress={handlePost}
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
