// Import the functions you need from the SDKs you need
// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEYpDB-R5ZGeQlqHUbx6Kp0NI60IB8HO4",
  authDomain: "home-wishlist-4d53f.firebaseapp.com",
  projectId: "home-wishlist-4d53f",
  storageBucket: "home-wishlist-4d53f.appspot.com",
  messagingSenderId: "132890281699",
  appId: "1:132890281699:web:9754fb95372c4ba82a67d6",
  measurementId: "G-H7XRVK1FCG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const provider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
