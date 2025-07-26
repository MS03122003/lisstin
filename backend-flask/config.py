# config.py

import os
from dotenv import load_dotenv

load_dotenv()  # Load .env file variables into environment

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "your-default-secret-key")
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "your-google-client-id")
    LIVEKIT_URL = os.getenv("LIVEKIT_URL", "http://localhost:7880")
    AGENT_NAME = os.getenv("AGENT_NAME", "YourAgent")
