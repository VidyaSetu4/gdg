import express from "express";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
const app = express();
const PORT = 5173;

// 🔹 Load OAuth Credentials
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

console.log("CLIENT_ID", CLIENT_ID);
console.log("CLIENT_SECRET", CLIENT_SECRET);  
// 🔹 Initialize OAuth2 Client
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({
  access_token: ACCESS_TOKEN,
  refresh_token: REFRESH_TOKEN,
});

// 🔹 Create Google Meet Link
app.get("/create-meet", async (req, res) => {
  try {
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Define event details
    const event = {
      summary: "Google Meet Meeting",
      description: "Discussing project updates",
      start: { dateTime: new Date().toISOString(), timeZone: "Asia/Kolkata" },
      end: { dateTime: new Date(Date.now() + 3600000).toISOString(), timeZone: "Asia/Kolkata" },
      conferenceData: {
        createRequest: { requestId: `meet-${Date.now()}` },
      },
    };

    // Insert event into Google Calendar
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
    });

    console.log("📅 Meet Link:", response.data.hangoutLink);
    res.json({ meetLink: response.data.hangoutLink });
  } catch (error) {
    console.error("❌ Error creating Meet link:", error);
    res.status(500).send("Failed to create Meet link.");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
