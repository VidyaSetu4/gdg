import express from 'express';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import Meeting from '../models/Meeting';

dotenv.config();
const router = express.Router();
let name;
const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];
const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Set the refresh token from .env
oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

// Function to refresh the access token
async function refreshAccessToken() {
  try {
    const { credentials } = await oAuth2Client.refreshAccessToken();
    oAuth2Client.setCredentials(credentials);
    console.log("🔄 Access token refreshed successfully.");
  } catch (error) {
    console.error("❌ Error refreshing access token:", error);
  }
}


// ✅ Schedule a new meeting and save it in MongoDB
router.post("/create-meet", async (req, res) => {
  try {
    const { token, summary, startTime, endTime } = req.body;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify JWT token
    let host;
    let name;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      host = decoded.email; // Extract user email from token
      name = decoded.name;
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const duration = (new Date(endTime) - new Date(startTime)) / 60000; // Convert duration to minutes

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    const event = {
      summary,
      start: { dateTime: startTime, timeZone: "Asia/Kolkata" },
      end: { dateTime: endTime, timeZone: "Asia/Kolkata" },
      attendees: [{ email: host }], // Add host's email
      conferenceData: {
        createRequest: {
          requestId: uuidv4(),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
    });

    const meetLink = response.data.hangoutLink;
    
    // ✅ Save the meeting details in MongoDB
    const newMeeting = new Meeting({
      startTime,
      endTime,
      duration,
      hostName:name,
      meetLink,
    });

    await newMeeting.save();

    res.status(201).json({
      message: "Meeting scheduled successfully!",
      meeting: newMeeting,
    });
  } catch (error) {
    console.error("❌ Error creating Google Meet link:", error);

    // If the error is due to an expired token, refresh it and retry once
    if (error.response && error.response.status === 401) {
      await refreshAccessToken();
      return res.status(500).json({ message: "Access token expired. Retrying..." });
    }

    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


// ✅ Retrieve all meetings
router.get("/meetings", async (req, res) => {
  try {
    const meetings = await Meeting.find(); // Fetch all meetings from MongoDB
    res.status(200).json(meetings);
  } catch (error) {
    console.error("❌ Error fetching meetings:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});



export default router;
