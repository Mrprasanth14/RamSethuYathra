import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

async function adminLogin() {

  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value;

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {

    await signInWithEmailAndPassword(auth, email, password);

    console.log("Admin login successful");

    window.location.href = "admin.html";

  } catch (error) {

    console.error("Firebase Login Error:", error);

    alert(error.message);
  }
}

window.adminLogin = adminLogin;