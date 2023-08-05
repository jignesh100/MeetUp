// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { collection,getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNNmhB0XF57Eo3ckSTwhw7dHmtA15G0wU",
  authDomain: "new-4fd86.firebaseapp.com",
  projectId: "new-4fd86",
  storageBucket: "new-4fd86.appspot.com",
  messagingSenderId: "219303415705",
  appId: "1:219303415705:web:a31dbfcde0e55f385b4d08",
  measurementId: "G-ZLXZ81654J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth =getAuth(app);
export const firebaseDB =getFirestore(app);
export const userRef =collection(firebaseDB,"users")
export const meetingsRef =collection(firebaseDB,"meetings")
