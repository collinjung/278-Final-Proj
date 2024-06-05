import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://otmxnxmybzkluvkwuphs.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90bXhueG15YnprbHV2a3d1cGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcxNzgyMjQsImV4cCI6MjAzMjc1NDIyNH0.8qRg8kaknj0QM5srX2sPGRzjD8GIXhWaMx4mNhuX3Yo";
const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadImage = async (filename, username) => {
  const base64 = await FileSystem.readAsStringAsync(filename, {
    encoding: "base64",
  });
  const filePath = `${username}_${Date.now()}.png`;
  const contentType = "image/png";
  const { data, error } = await supabase.storage
    .from("profile-pictures")
    .upload(filePath, decode(base64), {
      contentType,
    });
  if (error) {
    console.error("Error uploading image:", error.message);
    return null;
  }
  return filePath;
};
