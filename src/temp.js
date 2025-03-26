import express from "express";
import { google } from "googleapis";
import open from "open";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const app = express();
const PORT = 5173;

const CLIENT_ID = "76579245756-mq5o7mlq87hpeg4prp72oe1uvb0gn4r2.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:5173/meet";

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// 🔹 Step 1: Redirect to Google's OAuth 2.0 Page
app.get("/auth", async (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.events"],
  });
  await open(authUrl);
  res.send("✅ Opened Google OAuth. Check your browser.");
});

// 🔹 Step 2: Handle OAuth Callback & Get Tokens
app.get("/auth/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send("Authorization code not found!");

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Save tokens for reuse
    fs.writeFileSync("tokens.json", JSON.stringify(tokens, null, 2));

    res.send("✅ Authentication successful! You can now generate a Google Meet link.");
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).send("Authentication failed!");
  }
});

// 🔹 Step 3: Generate Google Meet Link
app.get("/create-meet", async (req, res) => {
  try {
    const tokens = JSON.parse(fs.readFileSync("tokens.json", "utf8"));
    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const event = {
      summary: "Google Meet Meeting",
      start: { dateTime: new Date().toISOString() },
      end: { dateTime: new Date(Date.now() + 3600000).toISOString() }, // 1 hour later
      conferenceData: {
        createRequest: { requestId: "random-123" },
      },
    };

    const { data } = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
    });

    res.send(`✅ Google Meet Link: ${data.hangoutLink}`);
  } catch (error) {
    console.error("Error creating meeting:", error);
    res.status(500).send("Failed to create a meeting!");
  }
});

// Start the server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Opening authentication page...`);
  await open(`http://localhost:${PORT}/auth`);
});
