import {
  View,
  ImageBackground,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { styles } from "../../../assets/Themes/styles";
import { colors } from "../../../assets/Themes/colors";
import * as ImagePicker from "expo-image-picker";
import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Page() {
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("");
  const [type, setType] = useState(null);
  const router = useRouter();

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
      source={require("../../../assets/background_img.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset="-100"
      >
        <ScrollView
          contentContainerStyle={styles.profileEditView}
          automaticallyAdjustKeyboardInsets={true}
        >
          <View style={styles.profileCard}>
            <TouchableOpacity onPress={pickImage} style={styles.profilePicture}>
              {image && (
                <Image source={{ uri: image }} style={styles.profilePicture} />
              )}
              {shown}
            </TouchableOpacity>
            <TextInput
              style={styles.profileEditContainer}
              placeholder="set username..."
              placeholderTextColor={"gray"}
              value={username}
              multiline={true}
              onChangeText={(text) => {
                setUsername(text);
              }}
              color="white"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.profileEditButton}>
            <TouchableOpacity
              style={styles.profileEditButton}
              onPress={() => router.push("tabs/profile")}
            >
              <LinearGradient
                colors={["#261372", "#7C2FCA"]}
                style={styles.profileEditButton}
              >
                <Text style={styles.textBody}>finish</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
