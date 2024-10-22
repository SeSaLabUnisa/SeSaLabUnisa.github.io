// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAu1drAm4177P_Tq2BCldMKOyULYbnnXLo",
  authDomain: "bookmyslot-986a2.firebaseapp.com",
  projectId: "bookmyslot-986a2",
  storageBucket: "bookmyslot-986a2.appspot.com",
  messagingSenderId: "1084546496378",
  appId: "1:1084546496378:web:5c6c14645f60c8fbe7c8c3",
  measurementId: "G-NRL2W55JD3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);