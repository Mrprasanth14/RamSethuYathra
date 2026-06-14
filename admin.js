import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

if (localStorage.getItem("adminLogin") !== "true") {
  window.location.href = "admin-login.html";
}

async function loadBookings(collectionName, divId) {
  const box = document.getElementById(divId);
  box.innerHTML = "Loading...";

  const querySnapshot = await getDocs(collection(db, collectionName));

  if (querySnapshot.empty) {
    box.innerHTML = `<div class="empty-msg">No bookings found</div>`;
    return;
  }

  box.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const data = doc.data();
        box.innerHTML += `
  <div class="admin-card">
    <p><b>Service:</b> ${data.service || collectionName}</p>
    <p><b>Persons:</b> ${data.persons || "-"}</p>
    <p><b>Date:</b> ${data.date || "-"}</p>
    <p><b>Time:</b> ${data.time || "-"}</p>
    <p><b>Mobile:</b> ${data.mobile || "-"}</p>
  </div>
`;
  });
}

function logout() {
  localStorage.removeItem("adminLogin");
  window.location.href = "admin-login.html";
}

window.logout = logout;

loadBookings("templeBookings", "templeData");
loadBookings("wellBookings", "wellData");
loadBookings("poojaBookings", "poojaData");
loadBookings("roomBookings", "roomData");
loadBookings("cabBookings", "cabData");