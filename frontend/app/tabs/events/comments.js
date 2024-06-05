import {
  View,
  ImageBackground,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { styles } from "../../../assets/Themes/styles";
import { Ionicons } from "@expo/vector-icons";

import Comment from "../../../components/Comment";

export default function Page() {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(null);
  const handleComment = async () => {
    setCommentText("");
  };

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
          contentContainerStyle={styles.commentScrollView}
          automaticallyAdjustKeyboardInsets={true}
        >
          <Comment text={commentText} />
          <View style={styles.commentListContainer}>
            <View style={styles.commentInputBar}>
              <View style={styles.commentInput}>
                <TextInput
                  style={styles.textBody}
                  placeholder="Your comment here..."
                  placeholderTextColor={"gray"}
                  value={commentText}
                  multiline={true}
                  onChangeText={(text) => {
                    setCommentText(text);
                  }}
                  autoCapitalize="none"
                />
              </View>
              <TouchableOpacity onPress={handleComment}>
                <Ionicons name="arrow-up-circle" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
