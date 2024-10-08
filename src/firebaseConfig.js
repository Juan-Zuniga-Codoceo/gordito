// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC1haLQw7IUtCMvFoi0acLWUqh3mp1RL-k",
  authDomain: "gorditoo-2af62.firebaseapp.com",
  projectId: "gorditoo-2af62",
  storageBucket: "gorditoo-2af62.appspot.com",
  messagingSenderId: "824140633961",
  appId: "1:824140633961:web:aadf5d3a4462610d9b4ff8",
  measurementId: "G-CJ9KJJSVPL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { app, db, storage, analytics };