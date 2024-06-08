import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  Linking,
} from "react-native";
import { useState, useMemo } from "react";
import { styles } from "../../assets/Themes/styles";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Entypo } from "@expo/vector-icons";
import CommunityGuidelines from "../../components/CommunityGuidelines";
import RadioGroup from "react-native-radio-buttons-group";
import { useUser } from "../../userContext";
import { uploadImage } from "../../util";

export default function Page() {
  //   const supabaseUrl = "https://otmxnxmybzkluvkwuphs.supabase.co";
  const supabaseUrl = "https://cs278proj-23ce60decf86.herokuapp.com";
  const { loggedInUserId, setLoggedInUserId } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedId, setSelectedId] = useState();
  const [type, setType] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [profilePictureError, setProfilePictureError] = useState("");
  const [hostStatusError, setHostStatusError] = useState("");
  const radioButtons = useMemo(
    () => [
      {
        id: "pending host",
        label: "yes",
        value: "yes",
        color: "white",
        labelStyle: { color: "white", fontFamily: "gill sans", fontSize: 18 },
      },
      {
        id: "attendee",
        label: "no",
        value: "no",
        color: "white",
        labelStyle: { color: "white", fontFamily: "gill sans", fontSize: 18 },
      },
    ],
    []
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });
    if (!result.canceled) {
      const response = result.assets[0];
      setImage(response.uri);
      setType(response.type);
      setProfilePictureError("");
    }
  };
  let shown = null;
  if (!image) {
    shown = <Entypo name="image" color="gray" size={60} />;
  }

  const validateForm = () => {
    let isValid = true;

    // Reset error messages
    setEmailError("");
    setUsernameError("");
    setPasswordError("");
    setHostStatusError("");
    setProfilePictureError("");

    // Validate email
    if (!email) {
      setEmailError("Please enter your Stanford email");
      isValid = false;
    }

    // Validate username
    if (!username) {
      setUsernameError("Please choose a username");
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError("Please enter a password");
      isValid = false;
    }

    // Validate host status
    if (!selectedId) {
      setHostStatusError("Please select whether you'd like to apply to be a host");
      isValid = false;
    }

    // Validate profile picture
    if (!image) {
      setProfilePictureError("Please select a profile picture");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const filepath = await uploadImage(image, username);
      const params = {
        email: email,
        username: username,
        password: password,
        hostStatus: selectedId,
        image: filepath,
      };
      const response = await fetch(`${supabaseUrl}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      if (response.status === 201) {
        setLoggedInUserId(username);
        router.replace("tabs");
        router.push({
          pathname: "/tabs",
        });
      } else {
        if (data.error === "Invalid email. Must use a Stanford email.") {
          setEmailError("This is not a Stanford email. Please try again.");
        } else if (data.error === "Username already taken") {
          setUsernameError("This username is taken. Please choose another one.");
        }
      }
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/background_img.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          <TouchableOpacity onPress={pickImage} style={styles.profilePicture}>
            {image && (
              <Image source={{ uri: image }} style={styles.profilePicture} />
            )}
            {shown}
          </TouchableOpacity>
          <Text style={[styles.textBody, { marginBottom: 8 }]}>
            profile picture
          </Text>
          {profilePictureError !== "" && (
            <Text style={styles.imageErrorMessage}>{profilePictureError}</Text>
          )}

          <View style={styles.newPostInfoContainer}>
            <View style={styles.newPostInfoLabel}>
              <Text style={[styles.textBody, { marginLeft: 5 }]}>
                Stanford email
              </Text>
            </View>
            <TextInput
              style={styles.newPostInfoText}
              placeholder="enter your Stanford email"
              placeholderTextColor={"gray"}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError("");
              }}
              color="white"
              autoCapitalize="none"
            />
            {emailError !== "" && <Text style={styles.errorMessage}>{emailError}</Text>}
          </View>
          <View style={styles.newPostInfoContainer}>
            <View style={styles.newPostInfoLabel}>
              <Text style={[styles.textBody, { marginLeft: 5 }]}>username</Text>
            </View>
            <TextInput
              style={styles.newPostInfoText}
              placeholder="choose a username"
              placeholderTextColor={"gray"}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setUsernameError("");
              }}
              color="white"
              autoCapitalize="none"
            />
            {usernameError !== "" && <Text style={styles.errorMessage}>{usernameError}</Text>}
          </View>
          <View style={styles.newPostInfoContainer}>
            <View style={styles.newPostInfoLabel}>
              <Text style={[styles.textBody, { marginLeft: 5 }]}>password</Text>
            </View>
            <TextInput
              style={styles.newPostInfoText}
              placeholder="enter a password"
              placeholderTextColor={"gray"}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError("");
              }}
              secureTextEntry={true}
              color="white"
              autoCapitalize="none"
            ></TextInput>
            {passwordError !== "" && <Text style={styles.errorMessage}>{passwordError}</Text>}
          </View>
          <View style={styles.newPostInfoContainer}>
            <Text style={[styles.textBody, { marginLeft: 5 }]}>
              would you like to apply to be a host?
            </Text>
            <RadioGroup
              radioButtons={radioButtons}
              onPress={(id) => {
                setSelectedId(id);
                setHostStatusError("");
              }}
              selectedId={selectedId}
              containerStyle={{
                alignItems: "flex-start",
              }}
            />
            {hostStatusError !== "" && <Text style={styles.errorMessage}>{hostStatusError}</Text>}
            {selectedId == "pending host" && (
              <Text style={[styles.textBody, { marginLeft: 5 }]}>
                please fill out our host application form{" "}
                <Text
                  style={{
                    color: "rgba(124, 47, 202, 0.8)",
                    fontFamily: "gill sans",
                    fontSize: 16,
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                  }}
                  onPress={() =>
                    Linking.openURL("https://forms.gle/ZHQL1BRg36PQcYgm7")
                  }
                >
                  here
                </Text>
              </Text>
            )}
          </View>
          <View style={styles.newPostInfoContainer}>
            <Text style={[styles.textBody, { margin: 5 }]}>
              please read our{" "}
              <Text
                style={{
                  color: "rgba(124, 47, 202, 0.8)",
                  fontWeight: "bold",
                  fontSize: 16,
                  fontFamily: "gill sans",
                  textDecorationLine: "underline",
                }}
                onPress={() => setModalVisible(true)}
              >
                community guidelines
              </Text>
            </Text>
          </View>
          <CommunityGuidelines
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
          ></CommunityGuidelines>
          <TouchableOpacity
            style={styles.newPostButton}
            onPress={handleSubmit}
          >
            <LinearGradient
              colors={["#261372", "#7C2FCA"]}
              style={styles.newPostButton}
            >
              <Text style={styles.textLabel}>make account</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}