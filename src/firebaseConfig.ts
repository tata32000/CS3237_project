import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB2AJFPLRmJVnmA-fn-c_Squ4INPKpWIOI",
  authDomain: "cs3237-fe475.firebaseapp.com",
  projectId: "cs3237-fe475",
  storageBucket: "cs3237-fe475.appspot.com",
  messagingSenderId: "941475983348",
  appId: "1:941475983348:web:a422b8eff0d7686a9453a1",
  measurementId: "G-XV3R9P1LL2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
