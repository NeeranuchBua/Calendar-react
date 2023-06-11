// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDQUnU_Ri6rhbvGk62a51awesSz1cxV7Hk",
    authDomain: "my-calendar-38975.firebaseapp.com",
    projectId: "my-calendar-38975",
    storageBucket: "my-calendar-38975.appspot.com",
    messagingSenderId: "797937203983",
    appId: "1:797937203983:web:185be9a13d671ac86c1c7a",
    measurementId: "G-Y6W8E0X4LV"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);