import { db, auth } from "./firebase.js";
import {
    collection,
    addDoc,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

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
    const bedType =
    document.getElementById("selectedBedType")?.value || "";

    const roomPrice =
    Number(
        document.getElementById("selectedRoomPrice")?.value || 0
    );

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
      bedType,
      roomPrice,

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
  text: "Your temple visit booking has been submitted successfully.",
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

    const persons =
        document.getElementById("poojaPersons").value.trim();

    const date =
        document.getElementById("poojaDate").value;

    const time =
        document.getElementById("poojaTime").value;

    const mobile =
        document.getElementById("poojaMobile").value.trim();

    const poojaType =
        document.getElementById("poojaType").value;


    // ==============================
    // VALIDATE FORM
    // ==============================

    if (!persons || !date || !time || !mobile || !poojaType) {

        Swal.fire({
            icon: "warning",
            title: "Incomplete Details",
            text: "Please fill all booking details.",
            confirmButtonColor: "#ff7a00"
        });

        return;
    }


    // ==============================
    // VALIDATE MOBILE
    // ==============================

    if (!/^[6-9][0-9]{9}$/.test(mobile)) {

        Swal.fire({
            icon: "warning",
            title: "Invalid Mobile Number",
            text: "Please enter a valid 10-digit mobile number.",
            confirmButtonColor: "#ff7a00"
        });

        return;
    }


    // ==============================
    // GET LOGGED-IN USER
    // ==============================

    const user = getCurrentUser();

    if (!user) {
        return;
    }


    // ==============================
    // SAVE TO FIRESTORE
    // ==============================

    try {

        await addDoc(
            collection(db, "poojaBookings"),
            {

                userId: user.uid,

                customerEmail:
                    user.email || "",

                persons:
                    Number(persons),

                date:
                    date,

                time:
                    time,

                mobile:
                    mobile,

                poojaType:
                    poojaType,

                service:
                    "Temple Poojai",

                status:
                    "pending",

                bookingTime:
                    new Date().toLocaleString(),

                createdAt:
                    serverTimestamp()
            }
        );


        // ==============================
        // SUCCESS
        // ==============================

        Swal.fire({
            icon: "success",
            title: "Booking Submitted!",
            text: "Your Pooja booking request has been submitted successfully.",
            confirmButtonText: "OK",
            confirmButtonColor: "#ff7a00"
        }).then(() => {

            closeDetails("PoojaDetails");

        });


    } catch (error) {

        console.error(
            "Pooja booking error:",
            error
        );

        Swal.fire({
            icon: "error",
            title: "Booking Failed",
            text: error.message,
            confirmButtonColor: "#ff7a00"
        });

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
// ==========================================
// ⭐ CUSTOMER REVIEW SYSTEM
// ==========================================

let selectedRating = 0;


// ==========================================
// ⭐ STAR RATING
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const stars = document.querySelectorAll("#starPicker button");
    const ratingInput = document.getElementById("reviewRating");

    stars.forEach(function (star) {

        star.addEventListener("click", function () {

            selectedRating = Number(this.dataset.rating);

            if (ratingInput) {
                ratingInput.value = selectedRating;
            }

            stars.forEach(function (item) {

                const rating =
                    Number(item.dataset.rating);

                item.style.color =
                    rating <= selectedRating
                        ? "#f77f00"
                        : "#ccc";

            });

        });

    });

});


// ==========================================
// ⭐ REVIEW LOGIN STATE
// ==========================================

onAuthStateChanged(auth, function (user) {

    const reviewForm =
        document.getElementById("reviewForm");

    const loginMessage =
        document.getElementById("reviewLoginMessage");


    if (reviewForm && loginMessage) {

        if (user) {

            reviewForm.style.display = "block";
            loginMessage.style.display = "none";

        } else {

            reviewForm.style.display = "none";
            loginMessage.style.display = "block";

        }

    }


    // ======================================
    // ⭐ LOAD APPROVED REVIEWS
    // ======================================

    loadApprovedReviews();

});

// ==========================================
// ⭐ SUBMIT REVIEW
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const reviewForm =
        document.getElementById("reviewForm");

    if (!reviewForm) {
        return;
    }


    reviewForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        // --------------------------------------
        // GET CURRENT FIREBASE USER
        // --------------------------------------

        const user = auth.currentUser;


        if (!user) {

            await Swal.fire({
                icon: "warning",
                title: "Login Required",
                text: "Please login before submitting a review.",
                confirmButtonColor: "#f77f00"
            });

            return;
        }


        // --------------------------------------
        // GET FORM VALUES
        // --------------------------------------

        const service =
            document.getElementById("reviewService")?.value.trim();

        const review =
            document.getElementById("reviewText")?.value.trim();

        const rating =
            Number(
                document.getElementById("reviewRating")?.value || 0
            );


        // --------------------------------------
        // VALIDATION
        // --------------------------------------

        if (!service) {

            await Swal.fire({
                icon: "warning",
                title: "Select Service",
                text: "Please select the service you used.",
                confirmButtonColor: "#f77f00"
            });

            return;
        }


        if (rating < 1 || rating > 5) {

            await Swal.fire({
                icon: "warning",
                title: "Select Rating",
                text: "Please select a rating from 1 to 5 stars.",
                confirmButtonColor: "#f77f00"
            });

            return;
        }


        if (!review || review.length < 5) {

            await Swal.fire({
                icon: "warning",
                title: "Write Your Review",
                text: "Please write at least 5 characters.",
                confirmButtonColor: "#f77f00"
            });

            return;
        }


        // --------------------------------------
        // LOADING
        // --------------------------------------

        Swal.fire({
            title: "Submitting Review...",
            text: "Please wait.",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: function () {
                Swal.showLoading();
            }
        });


        try {

            // ----------------------------------
            // REVIEW DOCUMENT
            // ----------------------------------

            const reviewRef =
                doc(
                    db,
                    "reviews",
                    user.uid
                );


            // ----------------------------------
            // CHECK EXISTING REVIEW
            // ----------------------------------

            const existingReview =
                await getDoc(reviewRef);


            if (existingReview.exists()) {

                Swal.close();

                await Swal.fire({
                    icon: "info",
                    title: "Already Submitted",
                    text: "You have already submitted a review.",
                    confirmButtonColor: "#f77f00"
                });

                return;
            }


            // ----------------------------------
            // SAVE REVIEW
            // ----------------------------------

            await setDoc(
                reviewRef,
                {

                    userId: user.uid,

                    name:
                        user.displayName ||
                        user.email?.split("@")[0] ||
                        "Customer",

                    email:
                        user.email || "",

                    service:
                        service,

                    rating:
                        rating,

                    review:
                        review,

                    approved:
                        false,

                    createdAt:
                        serverTimestamp()

                }
            );


            // ----------------------------------
            // SUCCESS
            // ----------------------------------

            Swal.close();

            await Swal.fire({
                icon: "success",
                title: "Review Submitted! ⭐",
                text: "Your review is waiting for admin approval.",
                confirmButtonColor: "#f77f00"
            });


            // ----------------------------------
            // RESET FORM
            // ----------------------------------

            reviewForm.reset();

            selectedRating = 0;


            const ratingInput =
                document.getElementById("reviewRating");

            if (ratingInput) {
                ratingInput.value = "0";
            }


            document
                .querySelectorAll("#starPicker button")
                .forEach(function (star) {

                    star.style.color = "#ccc";

                });


        } catch (error) {

            console.error(
                "Review submission failed:",
                error
            );

            Swal.close();

            await Swal.fire({
                icon: "error",
                title: "Review Submission Failed",
                text:
                    error.message ||
                    "Unable to submit your review.",
                confirmButtonColor: "#d33"
            });

        }

    });

});
// ==========================================
// ⭐ LOAD APPROVED REVIEWS
// ==========================================

async function loadApprovedReviews() {

    const reviewGrid =
        document.getElementById("reviewGrid");

    if (!reviewGrid) return;

    reviewGrid.innerHTML =
        "<p>Loading reviews...</p>";

    try {

        const reviewsQuery = query(
    collection(db, "reviews"),
    where("approved", "==", true),
    limit(12)
);

        const snapshot =
            await getDocs(reviewsQuery);

        reviewGrid.innerHTML = "";

        if (snapshot.empty) {

            reviewGrid.innerHTML = `
                <p class="review-note">
                    No customer reviews yet.
                    Be the first to share your experience!
                </p>
            `;

            return;
        }

        snapshot.forEach((reviewDoc) => {

            const data = reviewDoc.data();

            const name =
                data.name || "Customer";

            const rating =
                Number(data.rating) || 0;

            const service =
                data.service || "Service";

            const review =
                data.review || "";

            const stars =
                "★".repeat(rating) +
                "☆".repeat(5 - rating);

            const firstLetter =
                name.charAt(0).toUpperCase();

            const card =
                document.createElement("div");

            card.className = "review-card";

            card.innerHTML = `
                <div class="review-person">

                    <div class="review-avatar">
                        ${firstLetter}
                    </div>

                    <div>
                        <strong>
                            ${escapeReviewHtml(name)}
                        </strong>
                    </div>

                </div>

                <div class="stars">
                    ${stars}
                </div>

                <span class="review-service">
                    ${escapeReviewHtml(service)}
                </span>

                <p>
                    ${escapeReviewHtml(review)}
                </p>
            `;

            reviewGrid.appendChild(card);

        });

    } catch (error) {

        console.error(
            "Load Reviews Error:",
            error
        );

        reviewGrid.innerHTML = `
            <p class="review-note">
                Reviews could not be loaded.
            </p>
        `;
    }
}
// ==========================================
// 🔐 PROTECT REVIEW TEXT
// ==========================================

function escapeReviewHtml(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}