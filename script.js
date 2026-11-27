// ==========================================
// RAMSETHUYATRA - MAIN SCRIPT.JS
// Firebase 11.9.1
// ==========================================

import { db, auth } from "./firebase.js";

import {
    collection,
    addDoc,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    limit,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";


// ==========================================
// 1. COMMON VALIDATION FUNCTIONS
// ==========================================

function validMobile(value) {
    return /^[6-9][0-9]{9}$/.test(String(value));
}

function validName(value) {
    return typeof value === "string"
        && value.trim().length >= 2
        && value.trim().length <= 100;
}

function validDate(value) {

    if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value)) {
        return false;
    }

    const [year, month, day] = value.split("-").map(Number);

    const date = new Date(Date.UTC(year, month - 1, day));

    return date.getUTCFullYear() === year
        && date.getUTCMonth() === month - 1
        && date.getUTCDate() === day;
}

function validTime(value) {
    return /^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(value);
}

function validPersons(value, min = 1, max = 20) {
    return Number.isInteger(value)
        && value >= min
        && value <= max;
}


// ==========================================
// 2. GET VERIFIED FIREBASE USER
// ==========================================

async function getCurrentUser() {

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


// ==========================================
// 3. PACKAGE SELECTION
// ==========================================

function selectPackage(packageName) {

    const packageInput = document.getElementById("package");
    const bookingSection = document.getElementById("booking");

    if (packageInput) {
        packageInput.value = packageName;
    }

    bookingSection?.scrollIntoView({
        behavior: "smooth"
    });
}



// ==========================================
// RAMSETHUYATRA - PROFESSIONAL WHATSAPP
// ==========================================

function generateBookingID(prefix = "RSY") {
    const date = new Date();
    const datePart = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
    ].join("");

    const randomPart = Math.random()
        .toString(36)
        .substring(2, 7)
        .toUpperCase();

    return `${prefix}-${datePart}-${randomPart}`;
}


// ==========================================
// WHATSAPP MESSAGE GENERATOR
// ==========================================

function openWhatsAppWithSuccess(message, ownerNumber) {

    const whatsappURL =
        `https://wa.me/${ownerNumber}?text=${encodeURIComponent(message)}`;

    Swal.fire({
        icon: "success",
        title: "Booking Enquiry Ready!",
        html: `
            <p>Your booking details are ready.</p>
            <p><b>RamSethuYatra</b> will receive your enquiry through WhatsApp.</p>
            <p>Please press <b>Send</b> in WhatsApp to submit it.</p>
        `,
        confirmButtonText: "Continue to WhatsApp",
        confirmButtonColor: "#ff7a00"
    }).then((result) => {
        if (result.isConfirmed) {
            window.open(whatsappURL, "_blank");
        }
    });
}


// ==========================================
// PACKAGE BOOKING WHATSAPP
// ==========================================

const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {

    bookingForm.addEventListener("submit", function(e) {

        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const mobile = document.getElementById("mobile").value.trim();
        const persons = document.getElementById("persons").value;
        const date = document.getElementById("date").value;
        const packageName = document.getElementById("package").value;
        const message = document.getElementById("message").value.trim();

        if (!name || !mobile || !persons || !date || !packageName) {
            Swal.fire("Incomplete Details",
                "Please fill all required booking details.", "warning");
            return;
        }

        if (!validName(name) || !validMobile(mobile)) {
            Swal.fire("Invalid Details",
                "Please enter a valid name and 10-digit mobile number.", "warning");
            return;
        }

        if (!validPersons(Number(persons), 1, 20) ||
            !validDate(date)) {
            Swal.fire("Invalid Booking",
                "Please check your persons and travel date.", "warning");
            return;
        }

        if (message.length > 1000) {
            Swal.fire("Message Too Long",
                "Please keep your message under 1000 characters.", "warning");
            return;
        }

        const bookingID = generateBookingID("RSY-PKG");
        const ownerNumber = "918838170745";

        const whatsappMessage = `
🙏 *RAMSETHUYATRA*
Your Trusted Rameswaram Yatra Partner

━━━━━━━━━━━━━━━━━━━━
📋 *NEW PACKAGE BOOKING ENQUIRY*
━━━━━━━━━━━━━━━━━━━━

🆔 Booking Reference: ${bookingID}

👤 *CUSTOMER DETAILS*
Name: ${name}
Mobile: ${mobile}

🧳 *TRAVEL DETAILS*
Package: ${packageName}
Total Persons: ${persons}
Travel Date: ${date}

📝 *SPECIAL REQUEST*
${message || "No additional request"}

━━━━━━━━━━━━━━━━━━━━
📌 *BOOKING STATUS:*
🟡 Confirmated

Our team will verify the package availability and contact the customer with the final price and booking confirmation.

━━━━━━━━━━━━━━━━━━━━
✨ Thank you for choosing RamSethuYatra!

📍 Rameswaram, Tamil Nadu
📞 Contact: +91 88381 70745

🙏 Have a blessed and memorable journey!
        `.trim();

        openWhatsAppWithSuccess(
            whatsappMessage,
            ownerNumber
        );

    });
}


// ==========================================
// 6. SCROLL TO TOP BUTTON
// ==========================================

window.onscroll = function() {

    const topBtn = document.getElementById("topBtn");

    if (!topBtn) return;

    if (
        document.body.scrollTop > 200 ||
        document.documentElement.scrollTop > 200
    ) {

        topBtn.style.display = "block";

    } else {

        topBtn.style.display = "none";

    }
};


// ==========================================
// 7. SHOW PERSON BOX
// ==========================================

function showPersonBox(seats) {

    const personBox = document.getElementById("personBox");
    const persons = document.getElementById("persons");

    if (!personBox || !persons) return;

    personBox.style.display = "block";

    persons.innerHTML =
        '<option value="">Select Persons</option>';

    for (let i = 1; i <= seats; i++) {

        const option = document.createElement("option");

        option.value = i;

        option.textContent =
            `${i} Person${i > 1 ? "s" : ""}`;

        persons.appendChild(option);

    }
}


// ==========================================
// 8. CONTINUE BOOKING
// ==========================================

function continueBooking() {

    const personsValue =
        document.getElementById("persons")?.value;

    if (!personsValue) {

        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please select persons!",
            confirmButtonColor: "#ff7a00"
        });

        return;
    }

    const persons = Number(personsValue);

    if (!Number.isInteger(persons) || persons < 1) {

        Swal.fire({
            icon: "error",
            title: "Invalid Persons",
            text: "Please select a valid number of persons.",
            confirmButtonColor: "#ff7a00"
        });

        return;
    }

    const form = document.getElementById("bookingForm");

    if (!form) return;

    form.style.display = "block";

    form.scrollIntoView({
        behavior: "smooth"
    });
}


// ==========================================
// 9. CAB BOOKING
// ==========================================

async function sendWhatsApp() {

    const user = await getCurrentUser();

    if (!user) return;


    const cab =
        document.querySelector(
            'input[name="cab"]:checked'
        )?.value;


    const persons =
        Number(
            document.getElementById("persons").value
        );


    const name =
        document.getElementById("name").value.trim();


    const mobile =
        document.getElementById("mobile").value.trim();


    const date =
        document.getElementById("date").value;


    const time =
        document.getElementById("time").value;


    const pickup =
        document.getElementById("pickup").value.trim();


    // CAB VALIDATION

    if (!cab) {

        Swal.fire(
            "Cab Not Selected",
            "Please select a cab.",
            "warning"
        );

        return;
    }


    const maxPersons = {
        Sedan: 4,
        SUV: 6,
        Traveller: 12
    };

    if (
        !maxPersons[cab] ||
        !validPersons(persons, 1, maxPersons[cab])
    ) {

        Swal.fire(
            "Invalid Persons",
            "Please select a valid number of persons for your cab.",
            "warning"
        );

        return;
    }


    // CUSTOMER VALIDATION

    if (
        !validName(name) ||
        !mobile ||
        !date ||
        !time ||
        !pickup
    ) {

        Swal.fire(
            "Incomplete Form",
            "Please fill all booking details.",
            "warning"
        );

        return;
    }


    if (!validMobile(mobile)) {

        Swal.fire(
            "Invalid Mobile Number",
            "Please enter a valid 10-digit mobile number.",
            "error"
        );

        return;
    }


    if (pickup.length < 2 || pickup.length > 250) {

        Swal.fire(
            "Invalid Pickup Location",
            "Pickup location must contain 2 to 250 characters.",
            "warning"
        );

        return;
    }


    if (!validDate(date) || !validTime(time)) {

        Swal.fire(
            "Invalid Date or Time",
            "Please enter a valid date and time.",
            "warning"
        );

        return;
    }


    // SAVE CAB BOOKING

    try {

        await addDoc(
            collection(db, "cabBookings"),
            {

                userId: user.uid,

                customerEmail: user.email,

                cab: cab,

                persons: persons,

                name: name,

                mobile: mobile,

                pickup: pickup,

                date: date,

                time: time,

                service: "Cab Booking",

                status: "pending",

                bookingTime:
                    new Date().toLocaleTimeString(),

                createdAt: serverTimestamp()

            }
        );


        Swal.fire({

            icon: "success",

            title: "Booking Successful!",

            text:
                "Your cab booking has been submitted successfully.",

            confirmButtonText: "OK",

            confirmButtonColor: "#ff7a00"

        }).then(() => {

            location.reload();

        });


    } catch (error) {

        console.error("Cab Booking Error:", error);

        Swal.fire(
            "Booking Failed",
            error.message,
            "error"
        );

    }
}


// ==========================================
// 10. ROOM BOOKING
// ==========================================

async function sendRoomWhatsApp() {

    const user = await getCurrentUser();

    if (!user) return;


    const room =
        document.querySelector(
            'input[name="room"]:checked'
        )?.value;


    const bedType =
        document.getElementById("selectedBedType")?.value || "";


    const persons =
        Number(
            document.getElementById("roomPersons").value
        );


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


    // REQUIRED VALIDATION

    if (
        !room ||
        !bedType ||
        !checkin ||
        !checkout ||
        !mobile ||
        !email
    ) {

        Swal.fire(
            "Incomplete Form",
            "Please fill all booking details.",
            "warning"
        );

        return;
    }


    // PERSON VALIDATION

    if (!validPersons(persons, 1, 20)) {

        Swal.fire(
            "Invalid Persons",
            "Select between 1 and 20 persons.",
            "warning"
        );

        return;
    }


    // MOBILE VALIDATION

    if (!validMobile(mobile)) {

        Swal.fire(
            "Invalid Mobile Number",
            "Please enter a valid 10-digit mobile number.",
            "error"
        );

        return;
    }


    // CONTACT EMAIL VALIDATION

    if (
        email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {

        Swal.fire(
            "Invalid Email",
            "Please enter a valid contact email address.",
            "warning"
        );

        return;
    }


    // DATE VALIDATION

    if (
        !validDate(checkin) ||
        !validDate(checkout) ||
        checkout <= checkin
    ) {

        Swal.fire(
            "Invalid Dates",
            "Check-out must be after check-in.",
            "warning"
        );

        return;
    }


    // BED / ROOM VALIDATION

    if (
        room.length > 100 ||
        bedType.length > 50 ||
        request.length > 1000
    ) {

        Swal.fire(
            "Invalid Details",
            "Please check your room and special request details.",
            "warning"
        );

        return;
    }


    // SAVE ROOM BOOKING

    try {

        await addDoc(
            collection(db, "roomBookings"),
            {

                userId: user.uid,

                customerEmail: user.email,

                room: room,

                bedType: bedType,

                persons: persons,

                checkin: checkin,

                checkout: checkout,

                mobile: mobile,

                email: email,

                request:
                    request || "No Special Request",

                // Owner will confirm the actual price.
                // Do not treat this as a final payment amount.
                roomPrice: 0,

                service: "Room Booking",

                status: "pending",

                createdAt: serverTimestamp()

            }
        );


        Swal.fire({

            icon: "success",

            title: "Booking Request Submitted!",

            html: `
                <p>Your room booking request has been submitted successfully.</p>
                <p>Our team will contact you to confirm the room price.</p>
            `,

            confirmButtonText: "OK",

            confirmButtonColor: "#ff7a00"

        }).then(() => {

            location.reload();

        });


    } catch (error) {

        console.error("Room Booking Error:", error);

        Swal.fire(
            "Booking Failed",
            error.message,
            "error"
        );

    }
}


// ==========================================
// 11. TEMPLE VISIT BOOKING
// ==========================================

async function showTempleDetailsform() {

    const persons =
        Number(
            document.getElementById("templePersons").value
        );


    const date =
        document.getElementById("templeDate").value;


    const time =
        document.getElementById("templeTime").value;


    const mobile =
        document.getElementById("templeMobile").value.trim();


    // REQUIRED VALIDATION

    if (!date || !time || !mobile) {

        Swal.fire({
            icon: "warning",
            title: "Incomplete Form",
            text: "Please fill all required fields first.",
            confirmButtonColor: "#ff7a00"
        });

        return;
    }


    // PERSON VALIDATION

    if (!validPersons(persons, 1, 20)) {

        Swal.fire(
            "Invalid Persons",
            "Please select between 1 and 20 persons.",
            "warning"
        );

        return;
    }


    // MOBILE VALIDATION

    if (!validMobile(mobile)) {

        Swal.fire({
            icon: "error",
            title: "Invalid Mobile Number",
            text: "Enter a valid 10-digit mobile number.",
            confirmButtonColor: "#ff7a00"
        });

        return;
    }


    if (!validDate(date) || !validTime(time)) {

        Swal.fire(
            "Invalid Date or Time",
            "Please enter valid date and time.",
            "warning"
        );

        return;
    }


    const user = await getCurrentUser();

    if (!user) return;


    try {

        await addDoc(
            collection(db, "templeBookings"),
            {

                userId: user.uid,

                customerEmail: user.email,

                persons: persons,

                date: date,

                time: time,

                mobile: mobile,

                service: "Temple Visit",

                status: "pending",

                bookingTime:
                    new Date().toLocaleTimeString(),

                createdAt: serverTimestamp()

            }
        );


        Swal.fire({

            icon: "success",

            title: "Booking Successful!",

            text:
                "Your temple visit booking has been submitted successfully.",

            confirmButtonText: "OK",

            confirmButtonColor: "#ff7a00"

        }).then(() => {

            window.location.href = "index.html";

        });


    } catch (error) {

        console.error("Temple Booking Error:", error);

        Swal.fire(
            "Booking Failed",
            error.message,
            "error"
        );

    }
}


// ==========================================
// 12. 22 HOLY WELLS BOOKING
// ==========================================

async function showWellDetailsform() {

    const persons =
        Number(
            document.getElementById("wellPersons").value
        );


    const date =
        document.getElementById("wellDate").value;


    const time =
        document.getElementById("wellTime").value;


    const mobile =
        document.getElementById("wellMobile").value.trim();


    // REQUIRED VALIDATION

    if (!date || !time || !mobile) {

        Swal.fire({
            icon: "warning",
            title: "Incomplete Form",
            text: "Please fill all required fields first.",
            confirmButtonColor: "#ff7a00"
        });

        return;
    }


    // PERSON VALIDATION

    if (!validPersons(persons, 1, 20)) {

        Swal.fire(
            "Invalid Persons",
            "Please select between 1 and 20 persons.",
            "warning"
        );

        return;
    }


    // MOBILE VALIDATION

    if (!validMobile(mobile)) {

        Swal.fire({
            icon: "error",
            title: "Invalid Mobile Number",
            text: "Enter a valid 10-digit mobile number.",
            confirmButtonColor: "#ff7a00"
        });

        return;
    }


    if (!validDate(date) || !validTime(time)) {

        Swal.fire(
            "Invalid Date or Time",
            "Please enter a valid date and time.",
            "warning"
        );

        return;
    }


    const user = await getCurrentUser();

    if (!user) return;


    try {

        await addDoc(
            collection(db, "wellBookings"),
            {

                userId: user.uid,

                customerEmail: user.email,

                persons: persons,

                date: date,

                time: time,

                mobile: mobile,

                service: "22 Holy Wells",

                status: "pending",

                createdAt: serverTimestamp()

            }
        );


        Swal.fire({

            icon: "success",

            title: "Booking Successful!",

            text:
                "Your 22 Holy Wells booking has been submitted successfully.",

            confirmButtonText: "OK",

            confirmButtonColor: "#ff7a00"

        }).then(() => {

            window.location.href = "index.html";

        });


    } catch (error) {

        console.error("Holy Wells Booking Error:", error);

        Swal.fire(
            "Booking Failed",
            error.message,
            "error"
        );

    }
}


// ==========================================
// 13. POOJA BOOKING
// ==========================================

async function showPoojaDetailsform() {

    const persons =
        Number(
            document.getElementById("poojaPersons").value
        );


    const date =
        document.getElementById("poojaDate").value;


    const time =
        document.getElementById("poojaTime").value;


    const mobile =
        document.getElementById("poojaMobile").value.trim();


    const poojaType =
        document.getElementById("poojaType").value.trim();


    // REQUIRED VALIDATION

    if (!date || !time || !mobile || !poojaType) {

        Swal.fire({
            icon: "warning",
            title: "Incomplete Details",
            text: "Please fill all booking details.",
            confirmButtonColor: "#ff7a00"
        });

        return;
    }


    // PERSON VALIDATION

    if (!validPersons(persons, 1, 20)) {

        Swal.fire(
            "Invalid Persons",
            "Please select between 1 and 20 persons.",
            "warning"
        );

        return;
    }


    // MOBILE VALIDATION

    if (!validMobile(mobile)) {

        Swal.fire({
            icon: "warning",
            title: "Invalid Mobile Number",
            text: "Please enter a valid 10-digit mobile number.",
            confirmButtonColor: "#ff7a00"
        });

        return;
    }


    if (!validDate(date) || !validTime(time)) {

        Swal.fire(
            "Invalid Date or Time",
            "Please enter valid date and time.",
            "warning"
        );

        return;
    }


    if (poojaType.length > 100) {

        Swal.fire(
            "Invalid Pooja Type",
            "Please select a valid pooja type.",
            "warning"
        );

        return;
    }


    const user = await getCurrentUser();

    if (!user) return;


    // SAVE POOJA BOOKING

    try {

        await addDoc(
            collection(db, "poojaBookings"),
            {

                userId: user.uid,

                customerEmail: user.email,

                persons: persons,

                date: date,

                time: time,

                mobile: mobile,

                poojaType: poojaType,

                service: "Temple Poojai",

                status: "pending",

                bookingTime:
                    new Date().toLocaleString(),

                createdAt: serverTimestamp()

            }
        );


        Swal.fire({

            icon: "success",

            title: "Booking Submitted!",

            text:
                "Your Pooja booking request has been submitted successfully.",

            confirmButtonText: "OK",

            confirmButtonColor: "#ff7a00"

        }).then(() => {

            closeDetails("PoojaDetails");

        });


    } catch (error) {

        console.error("Pooja Booking Error:", error);

        Swal.fire({
            icon: "error",
            title: "Booking Failed",
            text: error.message,
            confirmButtonColor: "#ff7a00"
        });

    }
}


// ==========================================
// 14. VIEW DETAILS
// ==========================================

function showDetails(id) {

    const box = document.getElementById(id);

    if (!box) {

        console.error("Details box not found:", id);

        return;
    }


    // CLOSE OTHER DETAILS BOXES

    document.querySelectorAll(".details-box").forEach(item => {

        if (item.id !== id) {

            item.classList.remove("active");

        }

    });


    // OPEN SELECTED DETAILS BOX

    box.classList.add("active");


    // SCROLL TO DETAILS BOX

    setTimeout(() => {

        box.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }, 100);
}


// ==========================================
// 15. OPEN DETAILS
// ==========================================

function showTempleDetails() {

    showDetails("templeDetails");

}


function showWellDetails() {

    showDetails("WellDetails");

}


function showPoojaDetails() {

    showDetails("PoojaDetails");

}


// ==========================================
// 16. CLOSE DETAILS
// ==========================================

function closeDetails(id) {

    const box = document.getElementById(id);

    if (box) {

        box.classList.remove("active");

    }
}


// ==========================================
// 17. CLOSE BUTTONS
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    const closeTempleBtn =
        document.getElementById("closeTempleBtn");

    const closeWellBtn =
        document.getElementById("closeWellBtn");

    const closePoojaBtn =
        document.getElementById("closePoojaBtn");


    const templeBox =
        document.getElementById("templeDetails");

    const wellBox =
        document.getElementById("WellDetails");

    const poojaBox =
        document.getElementById("PoojaDetails");


    if (closeTempleBtn) {

        closeTempleBtn.addEventListener("click", function() {

            templeBox?.classList.remove("active");

        });

    }


    if (closeWellBtn) {

        closeWellBtn.addEventListener("click", function() {

            wellBox?.classList.remove("active");

        });

    }


    if (closePoojaBtn) {

        closePoojaBtn.addEventListener("click", function() {

            poojaBox?.classList.remove("active");

        });

    }

});


// ==========================================
// 18. GOOGLE TRANSLATE BANNER FIX
// ==========================================

function hideGoogleTranslate() {

    document.querySelectorAll(
        ".goog-te-banner-frame, iframe.goog-te-banner-frame"
    ).forEach(function(element) {

        element.style.display = "none";
        element.style.visibility = "hidden";
        element.style.height = "0";
        element.style.width = "0";

    });


    document.querySelectorAll(
        "body > .skiptranslate"
    ).forEach(function(element) {

        element.style.display = "none";
        element.style.visibility = "hidden";
        element.style.height = "0";

    });


    document.documentElement.style.marginTop = "0px";


    if (document.body) {

        document.body.style.top = "0px";
        document.body.style.marginTop = "0px";

    }

}


// RUN IMMEDIATELY

hideGoogleTranslate();


// OBSERVE GOOGLE TRANSLATE CHANGES

const translateObserver = new MutationObserver(function() {

    hideGoogleTranslate();

});

translateObserver.observe(document.documentElement, {

    childList: true,

    subtree: true,

    attributes: true

});


// ==========================================
// 19. CUSTOMER REVIEW SYSTEM
// ==========================================

let selectedRating = 0;


// ==========================================
// 20. STAR RATING
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    const stars =
        document.querySelectorAll("#starPicker button");

    const ratingInput =
        document.getElementById("reviewRating");


    stars.forEach(function(star) {

        star.addEventListener("click", function() {

            selectedRating =
                Number(this.dataset.rating);


            if (
                !Number.isInteger(selectedRating) ||
                selectedRating < 1 ||
                selectedRating > 5
            ) {

                selectedRating = 0;

                return;
            }


            if (ratingInput) {

                ratingInput.value = selectedRating;

            }


            stars.forEach(function(item) {

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
// 21. REVIEW LOGIN STATE
// ==========================================

onAuthStateChanged(auth, function(user) {

    const reviewForm =
        document.getElementById("reviewForm");

    const loginMessage =
        document.getElementById("reviewLoginMessage");

    if (reviewForm) {
        reviewForm.style.display = user ? "block" : "none";
    }

    if (loginMessage) {
        loginMessage.style.display = user ? "none" : "block";

        if (!user) {
            loginMessage.innerHTML = `
                Please login to write a review.
                <a href="login.html?redirect=index.html%23reviews">
                    Login to Write a Review
                </a>
            `;
        }
    }

    loadApprovedReviews();

});


// ==========================================
// 22. SUBMIT CUSTOMER REVIEW
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    const reviewForm =
        document.getElementById("reviewForm");


    if (!reviewForm) return;


    reviewForm.addEventListener("submit", async function(event) {

        event.preventDefault();


        // GET VERIFIED USER

        const user = await getCurrentUser();

        if (!user) return;


        // GET FORM VALUES

        const service =
            document.getElementById("reviewService")?.value.trim();


        const review =
            document.getElementById("reviewText")?.value.trim();


        const rating =
            Number(
                document.getElementById("reviewRating")?.value || 0
            );


        // SERVICE VALIDATION

        if (!service) {

            await Swal.fire({
                icon: "warning",
                title: "Select Service",
                text: "Please select the service you used.",
                confirmButtonColor: "#f77f00"
            });

            return;
        }


        if (service.length > 100) {

            await Swal.fire({
                icon: "warning",
                title: "Invalid Service",
                text: "Please select a valid service.",
                confirmButtonColor: "#f77f00"
            });

            return;
        }


        // RATING VALIDATION

        if (
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5
        ) {

            await Swal.fire({
                icon: "warning",
                title: "Select Rating",
                text: "Please select a rating from 1 to 5 stars.",
                confirmButtonColor: "#f77f00"
            });

            return;
        }


        // REVIEW VALIDATION

        if (!review || review.length < 5 || review.length > 1000) {

            await Swal.fire({
                icon: "warning",
                title: "Write Your Review",
                text: "Please write between 5 and 1000 characters.",
                confirmButtonColor: "#f77f00"
            });

            return;
        }


        // LOADING

        Swal.fire({
            title: "Submitting Review...",
            text: "Please wait.",
            allowOutsideClick: false,
            allowEscapeKey: false,

            didOpen: function() {

                Swal.showLoading();

            }

        });


        try {

            // REVIEW DOCUMENT

            const reviewRef =
                doc(
                    db,
                    "reviews",
                    user.uid
                );


            // CHECK EXISTING REVIEW

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


            // SAFE CUSTOMER NAME

            const customerName =
                String(
                    user.displayName ||
                    user.email?.split("@")[0] ||
                    "Customer"
                )
                .trim()
                .slice(0, 100);


            // SAVE REVIEW

            await setDoc(
                reviewRef,
                {

                    userId: user.uid,

                    name: customerName,

                    // Do not store customer email
                    // in public review documents.

                    service: service,

                    rating: rating,

                    review: review,

                    approved: false,

                    createdAt: serverTimestamp()

                }
            );


            // SUCCESS

            Swal.close();

            await Swal.fire({

                icon: "success",

                title: "Review Submitted! ⭐",

                text:
                    "Your review is waiting for admin approval.",

                confirmButtonColor: "#f77f00"

            });


            // RESET FORM

            reviewForm.reset();

            selectedRating = 0;


            const ratingInput =
                document.getElementById("reviewRating");

            if (ratingInput) {

                ratingInput.value = "0";

            }


            document
                .querySelectorAll("#starPicker button")
                .forEach(function(star) {

                    star.style.color = "#ccc";

                });


        } catch (error) {

            console.error(
                "Review Submission Error:",
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
// 23. LOAD APPROVED REVIEWS
// ==========================================

async function loadApprovedReviews() {

    const reviewGrid =
        document.getElementById("reviewGrid");


    if (!reviewGrid) return;


    reviewGrid.innerHTML =
        "<p>Loading reviews...</p>";


    try {

        // ONLY APPROVED REVIEWS

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
                typeof data.name === "string"
                    ? data.name.slice(0, 100)
                    : "Customer";


            const ratingValue =
                Number(data.rating);


            const rating =
                Number.isInteger(ratingValue)
                    ? Math.max(0, Math.min(5, ratingValue))
                    : 0;


            const service =
                typeof data.service === "string"
                    ? data.service
                    : "Service";


            const review =
                typeof data.review === "string"
                    ? data.review
                    : "";


            const stars =
                "★".repeat(rating) +
                "☆".repeat(5 - rating);


            const firstLetter =
                name.charAt(0).toUpperCase();


            // CREATE REVIEW CARD

            const card =
                document.createElement("div");


            card.className = "review-card";


            card.innerHTML = `

                <div class="review-person">

                    <div class="review-avatar">

                        ${escapeReviewHtml(firstLetter)}

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
// 24. PROTECT REVIEW HTML
// ==========================================

function escapeReviewHtml(value) {

    const div =
        document.createElement("div");


    div.textContent =
        String(value ?? "");


    return div.innerHTML;

}


// ==========================================
// 25. MAKE HTML FUNCTIONS AVAILABLE
// ==========================================

// Package selection
window.selectPackage = selectPackage;

// Details
window.showTempleDetails = showTempleDetails;
window.showWellDetails = showWellDetails;
window.showPoojaDetails = showPoojaDetails;

// Close Details
window.closeDetails = closeDetails;

// Booking forms
window.showTempleDetailsform = showTempleDetailsform;
window.showWellDetailsform = showWellDetailsform;
window.showPoojaDetailsform = showPoojaDetailsform;

// Person selection
window.showPersonBox = showPersonBox;
window.continueBooking = continueBooking;

// Booking submission
window.sendWhatsApp = sendWhatsApp;
window.sendRoomWhatsApp = sendRoomWhatsApp;

// ==========================================
// END OF RAMSETHUYATRA SCRIPT.JS
// ==========================================   