// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCM-edYKqmH3ZJVYGbD0uEColY9d4LmTIo",
  authDomain: "integradora-d5795.firebaseapp.com",
  projectId: "integradora-d5795",
  storageBucket: "integradora-d5795.firebasestorage.app",
  messagingSenderId: "654552369448",
  appId: "1:654552369448:web:4cd98c0e772753993ee81d",
  measurementId: "G-1XZG50BE57"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);