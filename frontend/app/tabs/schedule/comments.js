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
import { useUser } from "../../../userContext";
import Comment from "../../../components/Comment";

const supabaseUrl = "https://cs278finalproject-64458b0d2a75.herokuapp.com";

export default function Page() {
  const params = useLocalSearchParams();
  const postId = params.postId;
  const [commentText, setCommentText] = useState("");
  const { loggedInUserId, addPost, setAddPost } = useUser();
  const [comments, setComments] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(supabaseUrl + "/api/comments/" + postId, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data);
        setComments(data.comments);
      } catch (e) {}
    }

    fetchData();
  }, [addPost]);

  const handleComment = async () => {
    try {
      const myBody = { comment_text: commentText, username: loggedInUserId };
      const response = await fetch(supabaseUrl + "/api/comments/" + postId, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(myBody),
      });
    } catch (e) {}
    setCommentText("");
    setAddPost((prevA) => prevA + 1);
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
          {comments &&
            comments.map((item) => (
              <Comment
                key={item.id}
                username={item.username}
                text={item.comment_text}
                date={item.date}
              />
            ))}
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
