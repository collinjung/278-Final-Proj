const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage})
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const port = 3000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// middleware
app.use(express.json());

// user reg endpt
app.post('/api/register', async (req, res) => {
  const { email, username, password, hostStatus } = req.body;
  const profilePicture = req.file;

  // Stanford email check
  if (!email.endsWith('@stanford.edu')) {
    return res.status(400).json({ error: 'Invalid email. Must use a Stanford email.' });
  }

  // unique email check
  const { data: existingEmail, error: emailError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  // unique username check
  const { data: existingUser, error } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking username:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }

  if (existingUser) {
    return res.status(400).json({ error: 'Username already taken' });
  }

  // upload profile picture to Supa storage / keep track of it 
  let profilePictureUrl = null; 
  if (profilePicture) {
    const { data, error: uploadError } = await supabase
      .storage
      .from('profile-pictures')
      .upload(`${username}_${Date.now()}.jpg`, profilePicture.buffer, {
        contentType: profilePicture.mimetype,
      });

    if (uploadError) {
      console.error('Error uploading profile picture:', uploadError);
      return res.status(500).json({ error: 'Internal server error' });
    }

    profilePictureUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/profile-pictures/${data.path}`;
  }

  // new user creation
  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert({ email, username, password, hostStatus, profilePictureUrl })
    .single();

  if (insertError) {
    console.error('Error creating user:', insertError);
    return res.status(500).json({ error: 'Internal server error' });
  }

  return res.status(201).json({ message: 'User registered successfully', user: newUser });
});

// user login endpt
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // find user by username
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error) {
    console.error('Error finding user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // password is correct, user is authenticated
  return res.status(200).json({ message: 'Login successful', user });
});

// profile retrieval endpt
app.get('/api/users/:userId', async (req, res) => {
  const userId = req.params.userId;

  // retrieve user profile from the database
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error retrieving user profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.status(200).json({ user });
});

// update to "host" status 
app.put('/api/users/:userId/host', async (req, res) => {
  const userId = req.params.userId;
  const { isAdmin } = req.body;

  // check if the requester is authorized admin
  if (!isAdmin) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  // update user's host status to "host"
  const { data: updatedUser, error } = await supabase
    .from('users')
    .update({ hostStatus: 'host' })
    .eq('hostStatus', 'pending host')
    .single();

  if (error) {
    console.error('Error updating user host status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }

  if (!updatedUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.status(200).json({ message: 'User host status updated successfully', user: updatedUser });
});

app.put('/api/users/:userId/profile', upload.single('profilePicture'), async (req, res) => {
  const userId = req.params.userId;
  const { username } = req.body;
  const profilePicture = req.file;

  try {
    // check if the username is already taken by another user
    const { data: existingUser, error: usernameError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .neq('id', userId)
      .single();

    if (usernameError && usernameError.code !== 'PGRST116') {
      console.error('Error checking username:', usernameError);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // update the user's profile picture if a new one is provided
    let profilePictureUrl = null;
    if (profilePicture) {
      const { data, error: uploadError } = await supabase
        .storage
        .from('profile-pictures')
        .upload(`${userId}_${Date.now()}.jpg`, profilePicture.buffer, {
          contentType: profilePicture.mimetype,
        });

      if (uploadError) {
        console.error('Error uploading profile picture:', uploadError);
        return res.status(500).json({ error: 'Internal server error' });
      }

      profilePictureUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/profile-pictures/${data.path}`;
    }

    // update user's username and profile picture URL in the database
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ username, profilePictureUrl })
      .eq('id', userId)
      .single();

    if (updateError) {
      console.error('Error updating user profile:', updateError);
      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.status(200).json({ message: 'User profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error in /api/users/:userId/profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// create event post endpt
app.post('/api/events', async (req, res) => {
  try {
    const { eventName, location, date, time, attendeeRestrictions, description, imageUrl, userId } = req.body;

    // check if user is a host
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('hostStatus')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error retrieving user host status:', userError);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (user.hostStatus !== 'host') {
      return res.status(403).json({ error: 'Only hosts can create event posts' });
    }

    // insert new event post into the events table
    const { data: newEvent, error: insertError } = await supabase
      .from('events')
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
      console.error('Error creating event post:', insertError);
      return res.status(500).json({ error: 'Failed to create event post' });
    }

    res.status(201).json({ message: 'Event post created successfully', event: newEvent });
  } catch (error) {
    console.error('Error in /api/events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// add event to user's schedule
app.post('/api/users/:userId/schedule', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { eventId } = req.body;

    // check if the event exists
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, event_name, location, date, time')
      .eq('id', eventId)
      .single();

    if (eventError) {
      console.error('Error retrieving event:', eventError);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // check if the event is already in the user's schedule
    const { data: existingScheduleItem, error: scheduleError } = await supabase
      .from('user_schedule')
      .select('id')
      .eq('user_id', userId)
      .eq('event_id', eventId)
      .single();

    if (scheduleError && scheduleError.code !== 'PGRST116') {
      console.error('Error checking schedule item:', scheduleError);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (existingScheduleItem) {
      // if the event is already in the user's schedule, remove it
      const { data: removedScheduleItem, error: deleteError } = await supabase
        .from('user_schedule')
        .delete()
        .eq('id', existingScheduleItem.id)
        .single();

      if (deleteError) {
        console.error('Error removing schedule item:', deleteError);
        return res.status(500).json({ error: 'Internal server error' });
      }

      return res.status(200).json({ message: 'Event removed from schedule' });
    } else {
      // if the event is not in the user's schedule, add it
      const { data: newScheduleItem, error: insertError } = await supabase
        .from('user_schedule')
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
        console.error('Error adding schedule item:', insertError);
        return res.status(500).json({ error: 'Internal server error' });
      }

      return res.status(201).json({ message: 'Event added to schedule', scheduleItem: newScheduleItem });
    }
  } catch (error) {
    console.error('Error in /api/users/:userId/schedule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// server start
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});