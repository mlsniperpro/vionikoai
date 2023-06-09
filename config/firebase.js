// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAklW0QbRsqGdOh8iRHuy1XIePCTg2Eawk",
  authDomain: "vioniko-82fcb.firebaseapp.com",
  projectId: "vioniko-82fcb",
  storageBucket: "vioniko-82fcb.appspot.com",
  messagingSenderId: "777898562060",
  appId: "1:777898562060:web:358b5dfaa3a86738a51429",
  measurementId: "G-HH5QEKXXKC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;