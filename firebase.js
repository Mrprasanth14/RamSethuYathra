import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD9ev3wtqRPVY_KfSPVHuN20ASRIH0oJ78",
  authDomain: "ramsethuyatra.firebaseapp.com",
  projectId: "ramsethuyatra",
  storageBucket: "ramsethuyatra.firebasestorage.app",
  messagingSenderId: "495885901955",
  appId: "1:495885901955:web:80ccbe8db4251a6f74fbb6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };