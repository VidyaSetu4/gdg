// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAp7_CBkmDWsJCe3VZDKFbEvtd6RcHKmOg",
  authDomain: "vidyasetu-c7dc2.firebaseapp.com",
  projectId: "vidyasetu-c7dc2",
  storageBucket: "vidyasetu-c7dc2.firebasestorage.app", // corrected from .app to .com
  messagingSenderId: "185594398230",
  appId: "1:185594398230:web:ee2db7c8b2ae3fa38b9737",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
