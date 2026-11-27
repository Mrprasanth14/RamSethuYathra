
import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

document.getElementById("adminLoginForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;

    const ADMIN_EMAIL = "ramsethuyatra2026@gmail.com";

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

        // Verify Firebase custom admin claim
        const tokenResult = await user.getIdTokenResult(true);

        if (
            !user.email ||
            user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() ||
            tokenResult.claims.admin !== true
        ) {

            await signOut(auth);

            alert("Access denied. Administrator permission not found.");

            return;
        }

        // Admin login successful
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
