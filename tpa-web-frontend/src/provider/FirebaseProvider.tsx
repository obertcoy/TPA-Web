import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCTb3wYwdbwfX6-0mmKZs8VZAGxwYWGdY",
  authDomain: "tpa-web-bbb53.firebaseapp.com",
  projectId: "tpa-web-bbb53",
  storageBucket: "tpa-web-bbb53.appspot.com",
  messagingSenderId: "928768925801",
  appId: "1:928768925801:web:fad5ca3fab2e594f7242f8",
  measurementId: "G-8NBCE25JV5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firebaseStorage = getStorage(app)

// const analytics = getAnalytics(app);