import express from 'express';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
const router = express.Router();

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

router.post('/create-meet', async (req, res) => {
  try {
    const { summary, startTime, endTime } = req.body;

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const event = {
      summary,
      start: { dateTime: startTime, timeZone: 'Asia/Kolkata' },
      end: { dateTime: endTime, timeZone: 'Asia/Kolkata' },
      conferenceData: {
        createRequest: {
          requestId: uuidv4(),
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    });

    res.status(200).json({ meetLink: response.data.hangoutLink });
  } catch (error) {
    console.error('❌ Error creating Google Meet link:', error);

    // If the error is due to an expired token, refresh it and retry once
    if (error.response && error.response.status === 401) {
      await refreshAccessToken();
      return res.status(500).json({ message: 'Access token expired. Retrying...' });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
