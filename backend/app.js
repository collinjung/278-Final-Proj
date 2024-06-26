const express = require("express");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const supabaseUrl = "https://otmxnxmybzkluvkwuphs.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90bXhueG15YnprbHV2a3d1cGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcxNzgyMjQsImV4cCI6MjAzMjc1NDIyNH0.8qRg8kaknj0QM5srX2sPGRzjD8GIXhWaMx4mNhuX3Yo";
const supabase = createClient(supabaseUrl, supabaseKey);

// middleware
app.use(express.json());

app.get("/", async (req, res) => {
  return res.status(200).json({ message: "hi" });
});

app.delete("/api/events/:username/:postId", async (req, res) => {
  const { username, postId } = req.params;

  try {
    // Retrieve the user record based on the username
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("events")
      .eq("username", username)
      .single();

    if (userError) {
      console.error("Error retrieving user data:", userError);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the postId exists in the events list
    if (!user.events.includes(postId)) {
      return res
        .status(404)
        .json({ error: "Event ID not found in user's list" });
    }

    // Remove the postId from the events list
    const updatedEvents = user.events.filter((event) => event !== postId);

    // Save the updated user record back to the database
    const { error: updateError } = await supabase
      .from("users")
      .update({ events: updatedEvents })
      .eq("username", username);

    if (updateError) {
      console.error("Error updating user data:", updateError);
      return res.status(500).json({ error: "Internal server error" });
    }

    return res
      .status(200)
      .json({ message: "Event ID removed from events list successfully" });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/events/:username/:postId", async (req, res) => {
  const { postId, username } = req.params;

  try {
    // Retrieve the user record based on the username
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (userError) {
      console.error("Error retrieving user data:", userError);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the events list with the new postId
    const updatedEvents = user.events ? [...user.events, postId] : [postId];

    // Save the updated user record back to the database
    const { error: updateError } = await supabase
      .from("users")
      .update({ events: updatedEvents })
      .eq("username", username);

    if (updateError) {
      console.error("Error updating user data:", updateError);
      return res.status(500).json({ error: "Internal server error" });
    }

    return res
      .status(200)
      .json({ message: "Post ID added to events list successfully" });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/events/user/:username", async (req, res) => {
  const { username } = req.params;

  try {
    // Fetch events from the database where poster_username matches
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .eq("poster_username", username);

    if (error) {
      console.error("Error fetching events:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    return res.status(200).json({ events });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/comments/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    // Fetch comments from the database where postId matches
    const { data: comments, error } = await supabase
      .from("comments")
      .select("*")
      .eq("postId", postId);

    if (error) {
      console.error("Error fetching comments:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    return res.status(200).json({ comments });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/comments/:postId", async (req, res) => {
  const { postId } = req.params;
  const { username, comment_text } = req.body;

  // Validate input
  if (typeof username !== "string" || typeof comment_text !== "string") {
    return res.status(400).json({
      error: "Invalid input. username and comment_text must be strings.",
    });
  }

  try {
    // Insert the new comment into the database
    const { data, error } = await supabase
      .from("comments")
      .insert([{ postId, username, comment_text }]);

    if (error) {
      console.error("Error inserting comment:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    return res
      .status(201)
      .json({ message: "Comment added successfully", data });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/events/:postId", async (req, res) => {
  const { postId } = req.params;
  const { react_count } = req.body;

  // Validate react_count
  if (typeof react_count !== "number") {
    return res
      .status(400)
      .json({ error: "Invalid react_count value. It must be a number." });
  }

  try {
    // Update react_count in the database
    const { data, error } = await supabase
      .from("events")
      .update({ react_count })
      .eq("id", postId)
      .single();

    if (error) {
      console.error("Error updating react_count:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    return res
      .status(200)
      .json({ message: "React count updated successfully", data });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/events/:username", async (req, res) => {
  const { username } = req.params;

  try {
    // Retrieve user data to get the list of event UUIDs
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("events")
      .eq("username", username)
      .single();

    if (userError) {
      console.error("Error retrieving user data:", userError);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Retrieve events based on the list of UUIDs
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .in("n_id", user.events);

    if (eventsError) {
      console.error("Error retrieving events:", eventsError);
      return res.status(500).json({ error: "Internal server error" });
    }

    return res.status(200).json(events);
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// user reg endpt
app.post("/api/register", async (req, res) => {
  const { email, username, password, hostStatus, image } = req.body;
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
  const profile_pic = `${process.env.SUPABASE_URL}/storage/v1/object/public/profile-pictures/${image}`;

  // new user creation
  const { data: user, error: insertError } = await supabase
    .from("users")
    .insert({
      email: email,
      username: username,
      password: password,
      hostStatus: hostStatus,
      profile_pic: profile_pic,
      events: [],
    })
    .single();

  if (insertError) {
    console.error("Error creating user:", insertError);
    return res.status(500).json({ error: "Internal server error" });
  }

  return res.status(201).json({ message: JSON.stringify(user), user: user });
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
app.get("/api/users/:username", async (req, res) => {
  const username = req.params.username;

  // retrieve user profile from the database
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
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
      return res.status(500).json({ error: "Internal server error hahaha" });
    }

    user.profilePictureUrl = publicURL;
  }

  return res.status(200).json({ user: user });
});

// profile update endpt
app.put("/api/users/:userId/update", async (req, res) => {
  const userId = req.params.userId;
  const { username, profilePicture } = req.body;

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

// app.get("/api/events", async (req, res) => {
//   try {
//     const { data: events, error } = await supabase.from("events").select("*");

//     if (error) {
//       console.error("Error retrieving events:", error);
//       return res.status(500).json({ error: "Internal server error" });
//     }

//     return res.status(200).json({ events });
//   } catch (err) {
//     console.error("Unexpected error:", err);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

app.get("/api/events", async (req, res) => {
  try {
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error retrieving events:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    return res.status(200).json({ events });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
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

    console.log("Received event data:", {
      eventName,
      location,
      date,
      time,
      attendeeRestrictions,
      description,
      imageUrl,
      userId,
    });

    // check if user is a host
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("hostStatus, username")
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

    const imageFilename = imageUrl;
    const imageFullUrl = `https://otmxnxmybzkluvkwuphs.supabase.co/storage/v1/object/public/profile-pictures/${imageFilename}`;

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
        image_url: imageFullUrl,
        poster_username: user.username,
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
