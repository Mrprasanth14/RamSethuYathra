import { db, auth } from "./firebase.js";

import {
    collection,
    getDocs,
    deleteDoc,
    updateDoc,
    getDoc,
    doc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";


// ==========================================
// ADMIN EMAIL
// ==========================================

const ADMIN_EMAIL = "ramsethuyatra2026@gmail.com";


// ==========================================
// COLLECTION CONFIG
// ==========================================

const bookingSections = {

    packageBookings: "packageData",
    templeBookings: "templeData",
    wellBookings: "wellData",
    poojaBookings: "poojaData",
    roomBookings: "roomData",
    cabBookings: "cabData"

};


// ==========================================
// CHECK ADMIN LOGIN
// ==========================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "admin-login.html";

        return;
    }


    console.log("Authenticated:", user.email);


    // Frontend protection

    if (
        !user.email ||
        user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()
    ) {

        await signOut(auth);

        Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Only the administrator can access this page.",
            confirmButtonColor: "#ff7a00"
        }).then(() => {

            window.location.href = "admin-login.html";

        });

        return;
    }


    console.log("Admin verified:", user.email);


    // Load everything

    loadPackageBookings();

    loadBookings("templeBookings", "templeData");

    loadBookings("wellBookings", "wellData");

    loadBookings("poojaBookings", "poojaData");

    loadBookings("roomBookings", "roomData");

    loadBookings("cabBookings", "cabData");

});


// ==========================================
// LOAD NORMAL BOOKINGS
// ==========================================

async function loadBookings(collectionName, divId) {

    const box =
        document.getElementById(divId);

    if (!box) return;


    box.innerHTML =
        `<div class="loading-msg">
            Loading bookings...
        </div>`;


    try {

        const snapshot =
            await getDocs(
                collection(db, collectionName)
            );


        if (snapshot.empty) {

            box.innerHTML =
                `<div class="empty-msg">
                    No bookings found
                </div>`;

            return;
        }


        box.innerHTML = "";


        snapshot.forEach((bookingDoc) => {

            const data =
                bookingDoc.data();

            const bookingId =
                bookingDoc.id;


            const status =
                data.status || "pending";


            const statusClass =
                getStatusClass(status);


            box.innerHTML += `

                <div class="admin-card">

                    <div class="admin-card-header">

                        <div>

                            <span class="booking-type">
                                ${data.service || collectionName}
                            </span>

                            <h3>
                                ${data.name || "Customer Booking"}
                            </h3>

                        </div>

                        <span class="${statusClass}">
                            ${status.toUpperCase()}
                        </span>

                    </div>


                    <hr>


                    <p>
                        <b>👤 Customer:</b>
                        ${data.name || data.customerName || "-"}
                    </p>


                    <p>
                        <b>📧 Email:</b>
                        ${data.customerEmail || data.email || "-"}
                    </p>


                    <p>
                        <b>📱 Mobile:</b>
                        ${data.mobile || data.customerMobile || "-"}
                    </p>


                    <p>
                        <b>👥 Persons:</b>
                        ${data.persons || "-"}
                    </p>


                    <p>
                        <b>📅 Date:</b>
                        ${data.date || "-"}
                    </p>


                    <p>
                        <b>⏰ Time:</b>
                        ${data.time || "-"}
                    </p>


                    ${renderExtraDetails(
                        collectionName,
                        data
                    )}


                    <div class="booking-id">

                        <b>Booking ID:</b>

                        <span>
                            ${bookingId}
                        </span>

                    </div>


                    <div class="package-actions">

                        <button
                            class="confirm-btn"
                            onclick="updateBookingStatus(
                                '${collectionName}',
                                '${bookingId}',
                                'confirmed'
                            )">

                            ✅ Confirm

                        </button>


                        <button
                            class="cancel-btn"
                            onclick="updateBookingStatus(
                                '${collectionName}',
                                '${bookingId}',
                                'cancelled'
                            )">

                            ❌ Cancel

                        </button>


                        <button
                            class="delete-btn"
                            onclick="deleteBooking(
                                '${collectionName}',
                                '${bookingId}'
                            )">

                            🗑️ Delete

                        </button>

                    </div>

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

                Unable to load bookings.

                <br><br>

                ${error.message}

            </div>`;
    }

}


// ==========================================
// EXTRA BOOKING DETAILS
// ==========================================

function renderExtraDetails(
    collectionName,
    data
) {

    if (collectionName === "cabBookings") {

        return `

            <p>
                <b>🚖 Cab:</b>
                ${data.cab || "-"} Seater
            </p>

            <p>
                <b>📍 Pickup:</b>
                ${data.pickup || "-"}
            </p>

        `;

    }


    if (collectionName === "roomBookings") {

        return `

            <p>
                <b>🏨 Room:</b>
                ${data.room || "-"}
            </p>

            <p>
                <b>📅 Check-in:</b>
                ${data.checkin || "-"}
            </p>

            <p>
                <b>📅 Check-out:</b>
                ${data.checkout || "-"}
            </p>

            <p>
                <b>📝 Request:</b>
                ${data.request || "None"}
            </p>

        `;

    }


    if (
        collectionName === "templeBookings" ||
        collectionName === "wellBookings" ||
        collectionName === "poojaBookings"
    ) {

        return `

            <p>
                <b>🛕 Service:</b>
                ${data.service || "-"}
            </p>

        `;

    }


    return "";

}


// ==========================================
// LOAD PACKAGE BOOKINGS
// ==========================================

async function loadPackageBookings() {

    const box =
        document.getElementById("packageData");

    if (!box) return;


    box.innerHTML =
        `<div class="loading-msg">
            Loading package bookings...
        </div>`;


    try {

        const snapshot =
            await getDocs(
                collection(db, "packageBookings")
            );


        if (snapshot.empty) {

            box.innerHTML =
                `<div class="empty-msg">
                    No package bookings found
                </div>`;

            return;
        }


        box.innerHTML = "";


        snapshot.forEach((bookingDoc) => {

            const data =
                bookingDoc.data();

            const bookingId =
                bookingDoc.id;


            const packageName =
                data.packageName ||
                data.package ||
                "Package";


            const totalPrice =
                Number(
                    data.totalPrice || 0
                );


            const status =
                data.status ||
                "pending";


            const statusClass =
                getStatusClass(status);


            box.innerHTML += `

                <div class="admin-card package-card">

                    <div class="admin-card-header">

                        <div>

                            <span class="booking-type">
                                PACKAGE BOOKING
                            </span>

                            <h3>
                                🧳 ${packageName}
                            </h3>

                        </div>


                        <span class="${statusClass}">
                            ${status.toUpperCase()}
                        </span>

                    </div>


                    <hr>


                    <p>
                        <b>👤 Customer:</b>
                        ${data.customerName || "-"}
                    </p>


                    <p>
                        <b>📧 Email:</b>
                        ${data.customerEmail || "-"}
                    </p>


                    <p>
                        <b>📱 Mobile:</b>
                        ${data.customerMobile || "-"}
                    </p>


                    <p>
                        <b>👥 Persons:</b>
                        ${data.persons || "-"}
                    </p>


                    <p>
                        <b>📅 Travel Date:</b>
                        ${data.travelDate || "-"}
                    </p>


                    <p>
                        <b>⏰ Pickup Time:</b>
                        ${data.pickupTime || "-"}
                    </p>


                    <p>
                        <b>📍 Pickup Location:</b>
                        ${data.pickupLocation || "-"}
                    </p>


                    <p>
                        <b>📝 Special Request:</b>
                        ${data.specialRequest || "None"}
                    </p>


                    <div class="package-price">

                        Total Package:

                        <strong>
                            ₹${totalPrice.toLocaleString("en-IN")}
                        </strong>

                    </div>


                    <div class="booking-id">

                        <b>Booking ID:</b>

                        <span>
                            ${bookingId}
                        </span>

                    </div>


                    <div class="package-actions">

                        <button
                            class="confirm-btn"
                            onclick="updateBookingStatus(
                                'packageBookings',
                                '${bookingId}',
                                'confirmed'
                            )">

                            ✅ Confirm

                        </button>


                        <button
                            class="cancel-btn"
                            onclick="updateBookingStatus(
                                'packageBookings',
                                '${bookingId}',
                                'cancelled'
                            )">

                            ❌ Cancel

                        </button>


                        <button
                            class="delete-btn"
                            onclick="deleteBooking(
                                'packageBookings',
                                '${bookingId}'
                            )">

                            🗑️ Delete

                        </button>

                    </div>

                </div>

            `;

        });


    } catch (error) {

        console.error(
            "Package loading error:",
            error
        );


        box.innerHTML =
            `<div class="empty-msg">
                Unable to load package bookings.
                <br><br>
                ${error.message}
            </div>`;
    }

}


// ==========================================
// STATUS CLASS
// ==========================================

function getStatusClass(status) {

    if (status === "confirmed") {

        return "status-confirmed";

    }

    if (status === "cancelled") {

        return "status-cancelled";

    }

    return "status-pending";

}
// ==========================================
// WHATSAPP BOOKING CONFIRMATION
// ==========================================

function sendBookingConfirmationWhatsApp(
    data,
    bookingId,
    collectionName
) {

    // Get customer mobile number
    let mobile =
        data.customerMobile ||
        data.mobile ||
        "";

    mobile = String(mobile).trim();

    if (!mobile) {
        Swal.fire({
            icon: "warning",
            title: "WhatsApp Number Missing",
            text: "This customer does not have a mobile number.",
            confirmButtonColor: "#ff7a00"
        });

        return;
    }

    // Convert Indian number to international format
    mobile = mobile.replace(/\D/g, "");

    if (mobile.startsWith("0")) {
        mobile = mobile.substring(1);
    }

    if (mobile.length === 10) {
        mobile = "91" + mobile;
    }

    // Customer name
    const customerName =
        data.customerName ||
        data.name ||
        "Customer";

    // Booking details
    const packageName =
        data.packageName ||
        data.package ||
        data.service ||
        "Booking";

    const persons =
        data.persons ||
        "-";

    const travelDate =
        data.travelDate ||
        data.date ||
        data.checkin ||
        "-";

    const pickupTime =
        data.pickupTime ||
        data.time ||
        "-";

    const pickupLocation =
        data.pickupLocation ||
        data.pickup ||
        "-";

    const totalPrice =
        data.totalPrice
            ? `₹${Number(data.totalPrice).toLocaleString("en-IN")}`
            : "As discussed";

    // Confirmation message
    const message = `
🎉 *Congratulations! Your RamSethuYatra booking has been confirmed!*

Dear ${customerName},

🙏 Your booking has been successfully confirmed.

📦 *Booking:* ${packageName}
👥 *Persons:* ${persons}
📅 *Date:* ${travelDate}
⏰ *Time:* ${pickupTime}
📍 *Pickup:* ${pickupLocation}
💰 *Amount:* ${totalPrice}

🆔 *Booking ID:* ${bookingId}

Thank you for choosing *RamSethuYatra*.

🌴 We look forward to welcoming you to Rameswaram!

🙏 Have a wonderful journey!
`;

    // WhatsApp Click-to-Chat
    const whatsappURL =
        `https://wa.me/${mobile}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(whatsappURL, "_blank");
}


// ==========================================
// UPDATE ANY BOOKING STATUS
// ==========================================

async function updateBookingStatus(
    collectionName,
    bookingId,
    newStatus
) {

    const action =
        newStatus === "confirmed"
            ? "confirm"
            : "cancel";


    const result =
        await Swal.fire({

            icon:
                newStatus === "confirmed"
                    ? "question"
                    : "warning",

            title:
                newStatus === "confirmed"
                    ? "Confirm Booking?"
                    : "Cancel Booking?",

            text:
                `Are you sure you want to ${action} this booking?`,

            showCancelButton: true,

            confirmButtonText:
                newStatus === "confirmed"
                    ? "Yes, Confirm"
                    : "Yes, Cancel",

            cancelButtonText:
                "Go Back",

            confirmButtonColor:
                newStatus === "confirmed"
                    ? "#198754"
                    : "#dc3545",

            cancelButtonColor:
                "#555",

            reverseButtons: true

        });


    if (!result.isConfirmed) {
        return;
    }


    try {

        // ==========================================
        // GET BOOKING DATA BEFORE UPDATE
        // ==========================================

        const bookingReference =
            doc(
                db,
                collectionName,
                bookingId
            );

        const bookingSnapshot =
            await getDoc(bookingReference);


        if (!bookingSnapshot.exists()) {

            throw new Error(
                "Booking not found."
            );

        }


        const bookingData =
            bookingSnapshot.data();


        // ==========================================
        // UPDATE FIRESTORE STATUS
        // ==========================================

        await updateDoc(
            bookingReference,
            {
                status: newStatus
            }
        );


        // ==========================================
        // WHATSAPP CONFIRMATION
        // ONLY WHEN CONFIRMED
        // ==========================================

        if (
            newStatus === "confirmed" &&
            bookingData.status !== "confirmed"
        ) {

            sendBookingConfirmationWhatsApp(
                bookingData,
                bookingId,
                collectionName
            );

        }


        // ==========================================
        // SUCCESS MESSAGE
        // ==========================================

        await Swal.fire({

            icon: "success",

            title:
                newStatus === "confirmed"
                    ? "Booking Confirmed! ✅"
                    : "Booking Cancelled ❌",

            text:
                newStatus === "confirmed"
                    ? "The booking has been confirmed and WhatsApp has been opened."
                    : "The booking has been cancelled.",

            confirmButtonColor:
                "#ff7a00",

            timer: 1800,

            timerProgressBar: true

        });


        // ==========================================
        // REFRESH CORRECT SECTION
        // ==========================================

        if (
            collectionName ===
            "packageBookings"
        ) {

            loadPackageBookings();

        } else {

            loadBookings(
                collectionName,
                bookingSections[
                    collectionName
                ]
            );

        }


    } catch (error) {

        console.error(
            "Status update error:",
            error
        );


        Swal.fire({

            icon: "error",

            title: "Update Failed",

            text: error.message,

            confirmButtonColor: "#d33"

        });

    }

}


// ==========================================
// DELETE BOOKING
// ==========================================

async function deleteBooking(
    collectionName,
    bookingId
) {

    const result =
        await Swal.fire({

            icon: "warning",

            title: "Delete Booking?",

            text:
                "This booking will be permanently removed from your records.",

            showCancelButton: true,

            confirmButtonText:
                "Yes, Delete",

            cancelButtonText:
                "Cancel",

            confirmButtonColor:
                "#d33",

            cancelButtonColor:
                "#555",

            reverseButtons: true

        });


    if (!result.isConfirmed) {
        return;
    }


    try {

        await deleteDoc(

            doc(
                db,
                collectionName,
                bookingId
            )

        );


        await Swal.fire({

            icon: "success",

            title:
                "Booking Deleted ✨",

            text:
                "The booking has been successfully removed.",

            confirmButtonText:
                "Done",

            confirmButtonColor:
                "#ff7a00",

            timer: 1800,

            timerProgressBar: true

        });


        if (
            collectionName ===
            "packageBookings"
        ) {

            loadPackageBookings();

        } else {

            loadBookings(
                collectionName,
                bookingSections[
                    collectionName
                ]
            );

        }


    } catch (error) {

        console.error(
            "Delete booking error:",
            error
        );


        Swal.fire({

            icon: "error",

            title: "Delete Failed",

            text:
                error.message,

            confirmButtonColor:
                "#d33"

        });

    }

}


// ==========================================
// LOGOUT
// ==========================================

async function logout() {

    try {

        await signOut(auth);

        window.location.href =
            "admin-login.html";

    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

    }

}


// ==========================================
// HTML ACCESS
// ==========================================

window.updateBookingStatus =
    updateBookingStatus;

window.deleteBooking =
    deleteBooking;

window.logout =
    logout;