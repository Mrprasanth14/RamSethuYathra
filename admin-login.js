import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


document.getElementById("adminLoginForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;

    // Admin email
    const ADMIN_EMAIL = "ramsethuyatra2026@gmail.com";

    // Check email before Firebase login
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {

        alert("Access denied. Admin account only.");

        return;
    }

    try {

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        // console.log("Admin logged in:", user.email);

        // Double-check admin email
        if (user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {

            await auth.signOut();

            alert("Access denied. Admin account only.");

            return;
        }

        // Login successful
        window.location.href = "admin.html";

    } catch (error) {

        console.error("Login error:", error);

        if (error.code === "auth/invalid-credential") {

            alert("Incorrect email or password.");

        } else if (error.code === "auth/user-not-found") {

            alert("Admin account not found.");

        } else if (error.code === "auth/wrong-password") {

            alert("Incorrect password.");

        } else if (error.code === "auth/invalid-email") {

            alert("Invalid email address.");

        } else if (error.code === "auth/too-many-requests") {

            alert("Too many login attempts. Please try again later.");

        } else {

            alert("Login failed: " + error.message);
        }
    }

});