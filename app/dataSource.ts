// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyCM-edYKqmH3ZJVYGbD0uEColY9d4LmTIo",
//   authDomain: "integradora-d5795.firebaseapp.com",
//   projectId: "integradora-d5795",
//   storageBucket: "integradora-d5795.appspot.com",
//   messagingSenderId: "654552369448",
//   appId: "1:654552369448:web:4cd98c0e772753993ee81d",
//   measurementId: "G-1XZG50BE57"
// };

// // Inicializar Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app); // Inicializa Firestore

// export { auth, db }; 

import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCM-edYKqmH3ZJVYGbD0uEColY9d4LmTIo",
  authDomain: "integradora-d5795.firebaseapp.com",
  projectId: "integradora-d5795",
  storageBucket: "integradora-d5795.appspot.com",
  messagingSenderId: "654552369448",
  appId: "1:654552369448:web:4cd98c0e772753993ee81d",
  measurementId: "G-1XZG50BE57"
};

// Inicializar Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app); // Inicializa Firestore

export { auth, db };