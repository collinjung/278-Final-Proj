const express = require("express");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();

const app = express();
const port = 3000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// middleware
app.use(express.json());

// user reg endpt
app.post("/api/register", async (req, res) => {
  const { email, username, password, hostStatus, image } = req.body;
  //   const profilePicture = req.file;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  if (!hostStatus) {
    return res.status(400).json({ error: "Host status is required" });
  }

  // Stanford email check
  if (!email.endsWith("@stanford.edu")) {
    return res
      .status(400)
      .json({ error: "Invalid email. Must use a Stanford email." });
  }

  // unique email check
  const { data: existingEmail, error: emailError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (emailError && emailError.code !== "PGRST116") {
    console.error("Error checking email:", emailError);
    return res.status(500).json({ error: "Internal server error" });
  }

  if (existingEmail) {
    return res.status(400).json({ error: "Email already in use" });
  }

  // unique username check
  const { data: existingUser, error } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error checking username:", error);
    return res.status(500).json({ error: "Internal server error" });
  }

  if (existingUser) {
    return res.status(400).json({ error: "Username already taken" });
  }

  // (ISN'T WORKING) upload profile picture to Supa storage / keep track of it
  let profilePictureUrl = null;
  if (image) {
    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: "base64",
    });
    const filePath = `profile-pictures/${username}_${Date.now()}.png`;
    const contentType = "image/png";
    console.log(filePath);
    const { data, error } = await supabase.storage
      .from("profile-pictures")
      .upload(filePath, decode(base64), {
        contentType,
      });

    if (uploadError) {
      console.error("Error uploading profile picture:", uploadError.message);
      return res.status(500).json({ error: "Internal server error" });
    }
    profilePictureUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/profile-pictures/${data.path}`;
    console.log(profilePictureUrl);
  }

  // new user creation
  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert({ email, username, password, hostStatus, profilePictureUrl })
    .single();

  if (insertError) {
    console.error("Error creating user:", insertError);
    return res.status(500).json({ error: "Internal server error" });
  }

  return res
    .status(201)
    .json({ message: "User registered successfully", user: newUser });
});

// user login endpt
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  // find user by username
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    console.error("Error finding user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // password is correct, user is authenticated
  return res.status(200).json({ message: "Login successful", user: user });
});

// profile retrieval endpt
app.get("/api/users/:userId", async (req, res) => {
  const userId = req.params.userId;

  // retrieve user profile from the database
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error retrieving user profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // (ISN'T WORKING) retrieve profile picture from Supabase storage
  if (user.profilePictureUrl) {
    const { publicURL, error: publicUrlError } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(
        user.profilePictureUrl.replace(
          `${process.env.SUPABASE_URL}/storage/v1/object/public/`,
          ""
        )
      );

    if (publicUrlError) {
      console.error("Error retrieving public URL:", publicUrlError.message);
      return res.status(500).json({ error: "Internal server error" });
    }

    user.profilePictureUrl = publicURL;
  }

  return res.status(200).json({ user: user });
});

// profile update endpt
app.put("/api/users/:userId/update", async (req, res) => {
  const userId = req.params.userId;
  const { username, email, password, hostStatus, profilePicture } = req.body;

  // Stanford email check
  if (email && !email.endsWith("@stanford.edu")) {
    return res
      .status(400)
      .json({ error: "Invalid email. Must use a Stanford email." });
  }

  // unique email check
  if (email) {
    const { data: existingEmail, error: emailError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .neq("id", userId)
      .single();

    if (emailError && emailError.code !== "PGRST116") {
      console.error("Error checking email:", emailError);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (existingEmail) {
      return res.status(400).json({ error: "Email already in use" });
    }
  }

  // unique username check
  if (username) {
    const { data: existingUser, error } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .neq("id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error checking username:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }
  }

  // validate host status
  if (
    hostStatus &&
    !["attendee", "pending host", "host"].includes(hostStatus)
  ) {
    return res.status(400).json({ error: "Invalid host status" });
  }

  // (ISN'T WORKING) update profile picture in Supabase storage
  if (profilePicture) {
    const filePath = `profile-pictures/${username}_${Date.now()}.jpg`;
    const contentType = "image/jpeg";
    const base64Image = profilePicture.split(",")[1];
    const imageBuffer = Buffer.from(base64Image, "base64");

    const { data, error: uploadError } = await supabase.storage
      .from("profile-pictures")
      .upload(filePath, imageBuffer, {
        contentType,
      });

    if (uploadError) {
      console.error("Error uploading profile picture:", uploadError.message);
      return res.status(500).json({ error: "Internal server error" });
    }

    const profilePictureUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/profile-pictures/${data.path}`;

    // (ISN'T WORKING) update user profile with new profile picture URL
    const { data: updatedUserWithPicture, error: updateError } = await supabase
      .from("users")
      .update({ username, email, password, hostStatus, profilePictureUrl })
      .eq("id", userId)
      .single();

    if (updateError) {
      console.error("Error updating user profile with picture:", updateError);
      return res.status(500).json({ error: "Internal server error" });
    }

    return res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUserWithPicture,
    });
  }

  // update user profile in the database
  const { data: updatedUser, error } = await supabase
    .from("users")
    .update({ username, email, password, hostStatus })
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }

  return res
    .status(200)
    .json({ message: "User profile updated successfully", user: updatedUser });
});

// create event post endpt
app.post("/api/events", async (req, res) => {
  try {
    const {
      eventName,
      location,
      date,
      time,
      attendeeRestrictions,
      description,
      imageUrl,
      userId,
    } = req.body;

    // check if user is a host
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("hostStatus")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error("Error retrieving user host status:", userError);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (user.hostStatus !== "host") {
      return res
        .status(403)
        .json({ error: "Only hosts can create event posts" });
    }

    // insert new event post into the events table
    const { data: newEvent, error: insertError } = await supabase
      .from("events")
      .insert({
        user_id: userId,
        event_name: eventName,
        location,
        date,
        time,
        attendee_restrictions: attendeeRestrictions,
        description,
        image_url: imageUrl,
      })
      .single();

    if (insertError) {
      console.error("Error creating event post:", insertError);
      return res.status(500).json({ error: "Failed to create event post" });
    }

    return res
      .status(201)
      .json({ message: "Event post created successfully", event: newEvent });
  } catch (error) {
    console.error("Error in /api/events:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// add event to user's schedule
app.post("/api/users/:userId/schedule", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { eventId } = req.body;

    // check if the event exists
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, event_name, location, date, time")
      .eq("id", eventId)
      .single();

    if (eventError) {
      console.error("Error retrieving event:", eventError);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // check if the event is already in the user's schedule
    const { data: existingScheduleItem, error: scheduleError } = await supabase
      .from("user_schedule")
      .select("id")
      .eq("user_id", userId)
      .eq("event_id", eventId)
      .single();

    if (scheduleError && scheduleError.code !== "PGRST116") {
      console.error("Error checking schedule item:", scheduleError);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (existingScheduleItem) {
      // if the event is already in the user's schedule, REMOVE it
      const { data: removedScheduleItem, error: deleteError } = await supabase
        .from("user_schedule")
        .delete()
        .eq("id", existingScheduleItem.id)
        .single();

      if (deleteError) {
        console.error("Error removing schedule item:", deleteError);
        return res.status(500).json({ error: "Internal server error" });
      }

      return res.status(200).json({ message: "Event removed from schedule" });
    } else {
      // if the event is not in the user's schedule, add it
      const { data: newScheduleItem, error: insertError } = await supabase
        .from("user_schedule")
        .insert({
          user_id: userId,
          event_id: eventId,
          event_name: event.event_name,
          location: event.location,
          date: event.date,
          time: event.time,
        })
        .single();

      if (insertError) {
        console.error("Error adding schedule item:", insertError);
        return res.status(500).json({ error: "Internal server error" });
      }

      return res.status(201).json({
        message: "Event added to schedule",
        scheduleItem: newScheduleItem,
      });
    }
  } catch (error) {
    console.error("Error in /api/users/:userId/schedule:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// server start
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
