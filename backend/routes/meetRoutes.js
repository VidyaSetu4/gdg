import express from "express";
import { google } from "googleapis";
import open from "open";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import Meeting from "../models/Meeting.js"; // Ensure correct import

dotenv.config();
const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN; // ✅ Load refresh token from .env

const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// ✅ Step 1: Redirect to Google's OAuth 2.0 Page
router.get("/auth", async (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
  await open(authUrl);
  res.send("✅ Opened Google OAuth. Check your browser.");
});

// ✅ Step 2: Handle OAuth Callback & Store Tokens in Environment Variables
router.get("/auth/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send("❌ Authorization code not found!");

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    console.log("✅ Authentication successful!");
    console.log("🔑 Access Token:", tokens.access_token);
    console.log("🔄 Refresh Token:", tokens.refresh_token || "No new refresh token issued");

    res.send("✅ Authentication successful! Add the refresh token to your .env file.");
  } catch (error) {
    console.error("❌ Error during authentication:", error);
    res.status(500).send("Authentication failed!");
  }
});

// ✅ Set Credentials & Refresh Token Automatically
async function setAuthCredentials() {
  if (!REFRESH_TOKEN) {
    throw new Error("❌ Refresh token not found! Add it to your .env file.");
  }
  
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);
    console.log("🔄 Access token refreshed successfully.");
  } catch (error) {
    console.error("❌ Error refreshing access token:", error);
  }
}

// ✅ Create a Google Meet Meeting & Store in MongoDB
router.post("/create-meet", async (req, res) => {
  try {
    const { token, summary, startTime, endTime } = req.body;

    if (!token) {
      return res.status(401).json({ message: "❌ Unauthorized: No token provided" });
    }

    // Verify JWT token
    let hostEmail, hostName;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      hostEmail = decoded.email;
      hostName = decoded.name;
    } catch (error) {
      return res.status(401).json({ message: "❌ Invalid token" });
    }

    // Ensure valid access token
    await setAuthCredentials();
    
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
      summary,
      start: { dateTime: startTime, timeZone: "Asia/Kolkata" },
      end: { dateTime: endTime, timeZone: "Asia/Kolkata" },
      attendees: [{ email: hostEmail }],
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

    // ✅ Save to MongoDB
    const newMeeting = new Meeting({
      summary,
      startTime,
      endTime,
      duration: (new Date(endTime) - new Date(startTime)) / 60000, // Convert to minutes
      hostName,
      meetLink,
    });

    await newMeeting.save();

    res.status(201).json({
      message: "✅ Meeting scheduled successfully!",
      meeting: newMeeting,
    });
  } catch (error) {
    console.error("❌ Error creating Google Meet link:", error);
    res.status(500).json({ message: "❌ Internal server error", error: error.message });
  }
});

// ✅ Retrieve all Meetings
router.get("/meetings", async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.status(200).json(meetings);
  } catch (error) {
    console.error("❌ Error fetching meetings:", error);
    res.status(500).json({ message: "❌ Internal server error", error: error.message });
  }
});

export default router;
