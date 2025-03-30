import pickle
import os.path
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# Define the necessary scopes
SCOPES = ["https://www.googleapis.com/auth/calendar.events"]

# Load or create credentials
def get_credentials():
    creds = None
    # Check if token.pickle exists (stores user's access and refresh tokens)
    if os.path.exists("token.pickle"):
        with open("token.pickle", "rb") as token:
            creds = pickle.load(token)

    # Refresh or request new credentials
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "client_secret.json", SCOPES
            )
            creds = flow.run_local_server(port=5173)  # Ensure port matches redirect_uri

        # Save the credentials for future use
        with open("token.pickle", "wb") as token:
            pickle.dump(creds, token)

    return creds

# Function to create Google Meet event
def create_google_meet():
    creds = get_credentials()
    service = build("calendar", "v3", credentials=creds)

    event = {
        "summary": "Google Meet Meeting",
        "start": {
            "dateTime": "2025-03-26T10:00:00",
            "timeZone": "Asia/Kolkata",
        },
        "end": {
            "dateTime": "2025-03-26T11:00:00",
            "timeZone": "Asia/Kolkata",
        },
        "conferenceData": {
            "createRequest": {
                "requestId": "meet-request-123",
                "conferenceSolutionKey": {"type": "hangoutsMeet"},
            }
        },
    }

    event_result = service.events().insert(
        calendarId="primary",
        body=event,
        conferenceDataVersion=1,
    ).execute()

    meet_link = event_result.get("hangoutLink")
    print(f"✅ Google Meet Link: {meet_link}")

# Run the function
create_google_meet()
