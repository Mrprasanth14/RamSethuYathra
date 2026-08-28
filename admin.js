import { db, auth } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";


// Check Firebase login
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Authenticated admin:", user.email);
    } else {
        console.log("No authenticated user");
        window.location.href = "admin-login.html";
    }

  console.log("Admin authenticated:", user.email);

  loadBookings("templeBookings", "templeData");
  loadBookings("wellBookings", "wellData");
  loadBookings("poojaBookings", "poojaData");
  loadBookings("roomBookings", "roomData");
  loadBookings("cabBookings", "cabData");
});


async function loadBookings(collectionName, divId) {

  const box = document.getElementById(divId);

  if (!box) return;

  box.innerHTML = "Loading...";

  try {

    const querySnapshot =
      await getDocs(collection(db, collectionName));

    if (querySnapshot.empty) {

      box.innerHTML =
        `<div class="empty-msg">No bookings found</div>`;

      return;
    }

    box.innerHTML = "";

    querySnapshot.forEach((doc) => {

      const data = doc.data();

      box.innerHTML += `
        <div class="admin-card">

          <p>
            <b>Service:</b>
            ${data.service || collectionName}
          </p>

          <p>
            <b>Persons:</b>
            ${data.persons || "-"}
          </p>

          <p>
            <b>Date:</b>
            ${data.date || "-"}
          </p>

          <p>
            <b>Time:</b>
            ${data.time || "-"}
          </p>

          <p>
            <b>Mobile:</b>
            ${data.mobile || "-"}
          </p>

        </div>
      `;
    });

  } catch (error) {

    console.error(
      `Error loading ${collectionName}:`,
      error
    );

    box.innerHTML =
      `<div class="empty-msg">
        Unable to load bookings
      </div>`;
  }
}


// Logout
async function logout() {

  try {

    await signOut(auth);

    window.location.href = "admin-login.html";

  } catch (error) {

    console.error("Logout error:", error);

  }
}

window.logout = logout;