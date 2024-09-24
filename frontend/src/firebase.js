// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-b0c64.firebaseapp.com",
  projectId: "mern-blog-b0c64",
  storageBucket: "mern-blog-b0c64.appspot.com",
  messagingSenderId: "1971146237",
  appId: "1:1971146237:web:a2ae71312277db3ca69d94",
  measurementId: "G-13ZNBS7WVY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);