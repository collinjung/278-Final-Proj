import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  Linking,
} from "react-native";
import { useState, useEffect, useMemo } from "react";
import { styles } from "../../assets/Themes/styles";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useSegments } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Entypo } from "@expo/vector-icons";
import CommunityGuidelines from "../../components/CommunityGuidelines";
import RadioGroup from "react-native-radio-buttons-group";

export default function Page() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedId, setSelectedId] = useState();
  const [type, setType] = useState(null);
  const radioButtons = useMemo(
    () => [
      {
        id: "yes",
        label: "yes",
        value: "yes",
        color: "white",
        labelStyle: { color: "white", fontFamily: "gill sans", fontSize: 18 },
      },
      {
        id: "no",
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
    }
  };
  let shown = null;
  if (!image) {
    shown = <Entypo name="image" color="gray" size={60} />;
  }

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
          <Text style={[styles.textBody, { marginBottom: 20 }]}>
            profile picture
          </Text>

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
              }}
              color="white"
            ></TextInput>
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
              }}
              color="white"
            ></TextInput>
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
              }}
              secureTextEntry={true}
              color="white"
            ></TextInput>
          </View>
          <View style={styles.newPostInfoContainer}>
            <Text style={[styles.textBody, { marginLeft: 5 }]}>
              would you like to apply to be a host?
            </Text>
            <RadioGroup
              radioButtons={radioButtons}
              onPress={setSelectedId}
              selectedId={selectedId}
              containerStyle={{
                alignItems: "flex-start",
              }}
            />
            {selectedId == "yes" && (
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
            onPress={async () => {
              router.replace("tabs");
              router.push({
                pathname: "/tabs",
              });
            }}
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
