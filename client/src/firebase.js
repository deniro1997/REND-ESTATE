

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-981b3.firebaseapp.com",
  projectId: "mern-estate-981b3",
  storageBucket: "mern-estate-981b3.appspot.com",
  messagingSenderId: "950948281603",
  appId: "1:950948281603:web:0dd8e1a1c90860ff3fbd36"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);