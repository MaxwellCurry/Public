import { getFirestore, collection } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBMAPoHDy4fwPIMtApwteNqi2gUHaYbFsc",
  authDomain: "murmurwebsite.firebaseapp.com",
  databaseURL: "https://murmurwebsite-default-rtdb.firebaseio.com",
  projectId: "murmurwebsite",
  storageBucket: "murmurwebsite.firebasestorage.app",
  messagingSenderId: "499595493997",
  appId: "1:499595493997:web:7beb6af48b8621f9dd7564",
  measurementId: "G-R83FLJ2FN4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);