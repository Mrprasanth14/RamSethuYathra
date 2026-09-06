import { db, auth } from "./firebase.js";

import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

function getCurrentUser() {
  const user = auth.currentUser;

  if (!user) {
    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "Please login before making a booking.",
      confirmButtonText: "Login",
      confirmButtonColor: "#ff7a00"
    }).then(() => {
      window.location.href =
        "login.html?redirect=" +
        encodeURIComponent(
          window.location.pathname + window.location.search
        );
    });

    return null;
  }

  return user;
}
function selectPackage(packageName) {
  document.getElementById("package").value = packageName;
  document.getElementById("booking").scrollIntoView({
    behavior: "smooth"
  });
}

const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
  bookingForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const mobile = document.getElementById("mobile").value;
    const persons = document.getElementById("persons").value;
    const date = document.getElementById("date").value;
    const packageName = document.getElementById("package").value;
    const message = document.getElementById("message").value;

    const ownerNumber = "918838170745";

    const whatsappMessage =
      `New Rameswaram Package Booking\n\n` +
      `Name: ${name}\n` +
      `Mobile: ${mobile}\n` +
      `Persons: ${persons}\n` +
      `Date: ${date}\n` +
      `Package: ${packageName}\n` +
      `Message: ${message}`;

    openWhatsAppWithSuccess(message);
  });
}
function openWhatsAppWithSuccess(message) {
  Swal.fire({
    icon: "success",
    title: "Booking Confirmed",
    text: "Redirecting to WhatsApp...",
    timer: 1500,
    showConfirmButton: false
  });

  setTimeout(() => {
    window.open(
      `https://wa.me/918838170745?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }, 1500);
}
window.onscroll = function () {
  const topBtn = document.getElementById("topBtn");

  if (!topBtn) return;

  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    topBtn.style.display = "block";
  } else {
    topBtn.style.display = "none";
  }
};

function showPersonBox(seats) {
  const personBox = document.getElementById("personBox");
  const persons = document.getElementById("persons");

  personBox.style.display = "block";
  persons.innerHTML = '<option value="">Select Persons</option>';

  for (let i = 1; i <= seats; i++) {
    persons.innerHTML += `<option value="${i}">${i} Person${i > 1 ? "s" : ""}</option>`;
  }
}

function continueBooking() {
  const persons = document.getElementById("persons").value;

  if (persons === "") {
    Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Please select persons!",
  confirmButtonColor: "#ff7a00"
});
    return;
  }

  document.getElementById("bookingForm").style.display = "block";

  document.getElementById("bookingForm")
    .scrollIntoView({ behavior: "smooth" });
}
async function sendWhatsApp() {

  const user = getCurrentUser();
  if (!user) return;

  const cab = document.querySelector('input[name="cab"]:checked')?.value;
  const persons = document.getElementById("persons").value;
  const name = document.getElementById("name").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const pickup = document.getElementById("pickup").value.trim();

  if (!cab) {
    Swal.fire("Cab Not Selected", "Please select a cab", "warning");
    return;
  }

  if (!persons || !name || !mobile || !date || !time || !pickup) {
    Swal.fire(
      "Incomplete Form",
      "Please fill all booking details",
      "warning"
    );
    return;
  }

  if (!/^[6-9][0-9]{9}$/.test(mobile)) {
    Swal.fire(
      "Invalid Mobile Number",
      "Please enter valid 10-digit mobile number",
      "error"
    );
    return;
  }

  try {

    await addDoc(collection(db, "cabBookings"), {

      // CUSTOMER INFORMATION
      userId: user.uid,
      customerEmail: user.email || "",

      // BOOKING INFORMATION
      cab,
      persons,
      name,
      mobile,
      pickup,
      date,
      time,

      service: "Cab Booking",
      status: "pending",

      bookingTime: new Date().toLocaleTimeString(),
      createdAt: new Date()
    });

    Swal.fire({
      icon: "success",
      title: "Booking Successful!",
      text: "Your cab booking has been submitted successfully.",
      confirmButtonText: "OK",
      confirmButtonColor: "#ff7a00"
    }).then(() => {
      location.reload();
    });

  } catch (error) {

    console.error("Cab Booking Error:", error);

    Swal.fire(
      "Error",
      error.message,
      "error"
    );
  }
}
async function sendRoomWhatsApp() {

  const user = getCurrentUser();
  if (!user) return;

  const room =
    document.querySelector('input[name="room"]:checked')?.value;

  const persons =
    document.getElementById("roomPersons").value;

  const checkin =
    document.getElementById("checkin").value;

  const checkout =
    document.getElementById("checkout").value;

  const mobile =
    document.getElementById("roomMobile").value.trim();

  const email =
    document.getElementById("roomEmail").value.trim();

  const request =
    document.getElementById("request").value.trim();

  if (!room) {
    Swal.fire(
      "Room Not Selected",
      "Please select a room",
      "warning"
    );
    return;
  }

  if (!persons || !checkin || !checkout || !mobile || !email) {
    Swal.fire(
      "Incomplete Form",
      "Please fill all booking details",
      "warning"
    );
    return;
  }

  if (!/^[6-9][0-9]{9}$/.test(mobile)) {
    Swal.fire(
      "Invalid Mobile Number",
      "Please enter valid 10-digit mobile number",
      "error"
    );
    return;
  }

  try {

    await addDoc(collection(db, "roomBookings"), {

      // CUSTOMER
      userId: user.uid,
      customerEmail: user.email || email,

      // BOOKING
      room,
      persons,
      checkin,
      checkout,
      mobile,
      email,
      request: request || "No Special Request",

      service: "Room Booking",
      status: "pending",

      createdAt: new Date()
    });

    Swal.fire({
      icon: "success",
      title: "Booking Successful!",
      text: "Your room booking has been submitted successfully.",
      confirmButtonText: "OK",
      confirmButtonColor: "#ff7a00"
    }).then(() => {
      location.reload();
    });

  } catch (error) {

    console.error("Room Booking Error:", error);

    Swal.fire(
      "Error",
      error.message,
      "error"
    );
  }
}
async function showTempleDetailsform() {
  const persons = document.getElementById("templePersons").value.trim();
  const date = document.getElementById("templeDate").value;
  const time = document.getElementById("templeTime").value;
  const mobile = document.getElementById("templeMobile").value.trim();

  if (!persons || !date || !time || !mobile) {
    Swal.fire({
      icon: "warning",
      title: "Incomplete Form",
      text: "Please fill all required fields first",
      confirmButtonColor: "#ff7a00"
    });
    return;
  }

  if (!/^[6-9][0-9]{9}$/.test(mobile)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Mobile Number",
      text: "Enter valid 10 digit mobile number",
      confirmButtonColor: "#ff7a00"
    });
    return;
  }

const user = getCurrentUser();
if (!user) return;

try {

  await addDoc(collection(db, "templeBookings"), {

    userId: user.uid,
    customerEmail: user.email || "",

    persons,
    date,
    time,
    mobile,

    service: "Temple Visit",
    status: "pending",

    bookingTime: new Date().toLocaleTimeString(),
    createdAt: new Date()
  });

 Swal.fire({
  icon: "success",
  title: "Booking Successful!",
  text: "Your room booking has been submitted successfully.",
  confirmButtonText: "OK",
  confirmButtonColor: "#ff7a00"
}).then(() => {
  window.location.href = "index.html";
});

} catch (error) {
  console.error("Firebase Error:", error);
  alert(error.message);
}
}
async function showWellDetailsform() {
  const persons = document.getElementById("wellPersons").value;
  const date = document.getElementById("wellDate").value;
  const time = document.getElementById("wellTime").value;
  const mobile = document.getElementById("wellMobile").value.trim();

  if (!persons || !date || !time || !mobile) {
    Swal.fire({
      icon: "warning",
      title: "Incomplete Form",
      text: "Please fill all required fields first",
      confirmButtonColor: "#ff7a00"
    });
    return;
  }

  if (!/^[6-9][0-9]{9}$/.test(mobile)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Mobile Number",
      text: "Enter valid 10 digit mobile number",
      confirmButtonColor: "#ff7a00"
    });
    return;
  }

  const message =
`🚿 22 Wells Booking Request

👥 Persons: ${persons}
📅 Date: ${date}
⏰ Time: ${time}
📞 Mobile: ${mobile}`;

  const user = getCurrentUser();
if (!user) return;

try {

  await addDoc(collection(db, "wellBookings"), {

    userId: user.uid,
    customerEmail: user.email || "",

    persons,
    date,
    time,
    mobile,

    service: "22 Holy Wells",
    status: "pending",

    createdAt: new Date()
  });

  Swal.fire({
    icon: "success",
    title: "Booking Successful!",
    text: "Your 22 Holy Wells booking has been submitted successfully.",
    confirmButtonText: "OK",
    confirmButtonColor: "#ff7a00"
  }).then(() => {
    window.location.href = "index.html";
  });

} catch (error) {

  console.error("Holy Wells Booking Error:", error);

  Swal.fire(
    "Error",
    error.message,
    "error"
  );
}
}
async function showPoojaDetailsform() {
  const persons = document.getElementById("poojaPersons").value;
  const date = document.getElementById("poojaDate").value;
  const time = document.getElementById("poojaTime").value;
  const mobile = document.getElementById("poojaMobile").value.trim();

  if (!persons || !date || !time || !mobile) {
    Swal.fire({
      icon: "warning",
      title: "Incomplete Form",
      text: "Please fill all required fields first",
      confirmButtonColor: "#ff7a00"
    });
    return;
  }

  if (!/^[6-9][0-9]{9}$/.test(mobile)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Mobile Number",
      text: "Enter valid 10 digit mobile number",
      confirmButtonColor: "#ff7a00"
    });
    return;
  }

  const message =
`🙏 Temple Poojai Booking Request

👥 Persons: ${persons}
📅 Date: ${date}
⏰ Time: ${time}
📞 Mobile: ${mobile}`;

  const user = getCurrentUser();
if (!user) return;

try {

  await addDoc(collection(db, "poojaBookings"), {

    userId: user.uid,
    customerEmail: user.email || "",

    persons,
    date,
    time,
    mobile,

    service: "Temple Poojai",
    status: "pending",

    createdAt: new Date()
  });

    Swal.fire({
  icon: "success",
  title: "Booking Successful!",
  text: "Your room booking has been submitted successfully.",
  confirmButtonText: "OK",
  confirmButtonColor: "#ff7a00"
}).then(() => {
  window.location.href = "index.html";
});
  } catch (error) {
    console.error(error);
    Swal.fire("Error", error.message, "error");
  }
}

// ==========================================
// LANGUAGE MENU
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const languageBtn = document.getElementById("languageBtn");
    const languageMenu = document.getElementById("languageMenu");

    if (!languageBtn || !languageMenu) {
        return;
    }

    // OPEN / CLOSE LANGUAGE MENU
    languageBtn.addEventListener("click", function (event) {

        event.stopPropagation();

        languageMenu.classList.toggle("open");

    });

    // LANGUAGE BUTTONS
    const languageButtons =
        languageMenu.querySelectorAll("button[data-lang]");

    languageButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.stopPropagation();

            const language =
                this.getAttribute("data-lang");

            changeGoogleLanguage(language);

            languageMenu.classList.remove("open");

        });

    });

    // CLOSE WHEN CLICKING OUTSIDE
    document.addEventListener("click", function (event) {

        if (
            !languageBtn.contains(event.target) &&
            !languageMenu.contains(event.target)
        ) {
            languageMenu.classList.remove("open");
        }

    });

});


// ==========================================
// GOOGLE TRANSLATE
// ==========================================

function changeGoogleLanguage(language) {

    const tryTranslate = setInterval(function () {

        const googleSelect =
            document.querySelector(".goog-te-combo");

        if (googleSelect) {

            googleSelect.value = language;

            googleSelect.dispatchEvent(
                new Event("change")
            );

            clearInterval(tryTranslate);
        }

    }, 100);

    // Stop checking after 5 seconds
    setTimeout(function () {
        clearInterval(tryTranslate);
    }, 5000);
}

/// ==========================================
// VIEW DETAILS
// ==========================================

function showDetails(id) {

    const box = document.getElementById(id);

    if (!box) {
        console.error("Details box not found:", id);
        return;
    }

    // Close all other boxes
    document.querySelectorAll(".details-box").forEach(item => {
        if (item.id !== id) {
            item.classList.remove("active");
        }
    });

    // Open selected box
    box.classList.add("active");

    // Scroll to the box
    setTimeout(() => {
        box.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }, 100);
}



function showTempleDetails() {
    showDetails("templeDetails");
}


function showWellDetails() {
    showDetails("WellDetails");
}


function showPoojaDetails() {
    showDetails("PoojaDetails");
}


function closeDetails(id) {

    const box = document.getElementById(id);

    if (box) {
        box.classList.remove("active");
    }
}


// // Make HTML onclick functions available
// window.showTempleDetails = showTempleDetails;
// window.showWellDetails = showWellDetails;
// window.showPoojaDetails = showPoojaDetails;
// window.closeDetails = closeDetails;   
// ==========================================
// CLOSE BUTTONS
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const closeTempleBtn = document.getElementById("closeTempleBtn");
    const closeWellBtn = document.getElementById("closeWellBtn");
    const closePoojaBtn = document.getElementById("closePoojaBtn");

    const templeBox = document.getElementById("templeDetails");
    const wellBox = document.getElementById("WellDetails");
    const poojaBox = document.getElementById("PoojaDetails");


    if (closeTempleBtn) {
        closeTempleBtn.addEventListener("click", function () {
            templeBox?.classList.remove("active");
        });
    }


    if (closeWellBtn) {
        closeWellBtn.addEventListener("click", function () {
            wellBox?.classList.remove("active");
        });
    }


    if (closePoojaBtn) {
        closePoojaBtn.addEventListener("click", function () {
            poojaBox?.classList.remove("active");
        });
    }

});
// ==========================================
// MAKE HTML FUNCTIONS AVAILABLE
// ==========================================

// View Details
window.showTempleDetails = showTempleDetails;
window.showWellDetails = showWellDetails;
window.showPoojaDetails = showPoojaDetails;

// Close Details
window.closeDetails = closeDetails;

// Continue Booking
window.showTempleDetailsform = showTempleDetailsform;
window.showWellDetailsform = showWellDetailsform;
window.showPoojaDetailsform = showPoojaDetailsform;

// Other functions
window.showPersonBox = showPersonBox;
window.continueBooking = continueBooking;

window.sendWhatsApp = sendWhatsApp;
window.sendRoomWhatsApp = sendRoomWhatsApp;

// ========================================
// HIDE GOOGLE TRANSLATE TOP BANNER
// ========================================

function hideGoogleTranslate() {

    // Hide Google Translate banner
    document.querySelectorAll(
        ".goog-te-banner-frame, iframe.goog-te-banner-frame"
    ).forEach(function (element) {
        element.style.display = "none";
        element.style.visibility = "hidden";
        element.style.height = "0";
        element.style.width = "0";
    });

    // Hide Google Translate wrapper
    document.querySelectorAll("body > .skiptranslate").forEach(function (element) {
        element.style.display = "none";
        element.style.visibility = "hidden";
        element.style.height = "0";
    });

    // Remove Google's page offset
    document.documentElement.style.marginTop = "0px";

    if (document.body) {
        document.body.style.top = "0px";
        document.body.style.marginTop = "0px";
    }
}

// Run immediately
hideGoogleTranslate();

// Run whenever Google adds/changes the banner
const translateObserver = new MutationObserver(function () {
    hideGoogleTranslate();
});

translateObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true
});