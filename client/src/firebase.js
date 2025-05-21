// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-83d7d.firebaseapp.com",
  projectId: "mern-blog-83d7d",
  storageBucket: "mern-blog-83d7d.firebasestorage.app",
  messagingSenderId: "167567806900",
  appId: "1:167567806900:web:b31d0b93418b3b86c0e2e1",
  measurementId: "G-MNR6QTXGCS"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);