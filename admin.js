import { db, auth } from "./firebase.js";

import {
    collection,
    getDocs,
    deleteDoc,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";


// ===============================
// ADMIN EMAIL
// ===============================

const ADMIN_EMAIL = "ramsethuyatra2026@gmail.com";


// ===============================
// CHECK FIREBASE LOGIN
// ===============================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        console.log("No authenticated user");

        window.location.href = "admin-login.html";

        return;
    }


    console.log("Authenticated user:", user.email);


    // Extra admin protection on frontend

    if (
        !user.email ||
        user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()
    ) {

        console.log("Access denied:", user.email);

        signOut(auth);

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


    // ===============================
    // LOAD ALL BOOKINGS
    // ===============================

    loadBookings("templeBookings", "templeData");

    loadBookings("wellBookings", "wellData");

    loadBookings("poojaBookings", "poojaData");

    loadBookings("roomBookings", "roomData");

    loadBookings("cabBookings", "cabData");

    loadPackageBookings();

});


// ===============================
// LOAD NORMAL BOOKINGS
// ===============================

async function loadBookings(collectionName, divId) {

    const box = document.getElementById(divId);

    if (!box) return;


    box.innerHTML = "Loading...";


    try {

        const querySnapshot =
            await getDocs(
                collection(db, collectionName)
            );


        if (querySnapshot.empty) {

            box.innerHTML =
                `<div class="empty-msg">
                    No bookings found
                </div>`;

            return;
        }


        box.innerHTML = "";


        querySnapshot.forEach((bookingDoc) => {

            const data = bookingDoc.data();

            const bookingId = bookingDoc.id;


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


                    <button
                        class="delete-btn"
                        onclick="deleteBooking(
                            '${collectionName}',
                            '${bookingId}'
                        )">

                        🗑️ Delete Booking

                    </button>

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


// ======================================================
// LOAD PACKAGE BOOKINGS
// ======================================================

async function loadPackageBookings() {

    const box =
        document.getElementById("packageData");


    if (!box) return;


    box.innerHTML = "Loading package bookings...";


    try {

        const querySnapshot =
            await getDocs(
                collection(db, "packageBookings")
            );


        if (querySnapshot.empty) {

            box.innerHTML =
                `<div class="empty-msg">
                    No package bookings found
                </div>`;

            return;
        }


        box.innerHTML = "";


        querySnapshot.forEach((bookingDoc) => {

            const data = bookingDoc.data();

            const bookingId = bookingDoc.id;


            // Package information

            const packageName =
                data.packageName ||
                data.package ||
                "Package";


            const persons =
                data.persons || "-";


            const totalPrice =
                Number(data.totalPrice || 0);


            const status =
                data.status || "pending";


            // Status class

            let statusClass =
                "status-pending";


            if (status === "confirmed") {

                statusClass =
                    "status-confirmed";

            } else if (status === "cancelled") {

                statusClass =
                    "status-cancelled";

            }


            box.innerHTML += `

                <div class="admin-card package-card">


                    <div class="package-header">

                        <h3>
                            🧳 ${packageName}
                        </h3>

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
                        <b>📱 Mobile:</b>
                        ${data.customerMobile || "-"}
                    </p>


                    <p>
                        <b>👨‍👩‍👧 Persons:</b>
                        ${persons}
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


                    <div class="package-actions">


                        <button
                            class="confirm-btn"
                            onclick="updatePackageStatus(
                                '${bookingId}',
                                'confirmed'
                            )">

                            ✅ Confirm

                        </button>


                        <button
                            class="cancel-btn"
                            onclick="updatePackageStatus(
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
            "Error loading package bookings:",
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


// ======================================================
// UPDATE PACKAGE STATUS
// ======================================================

async function updatePackageStatus(
    bookingId,
    newStatus
) {

    const actionText =
        newStatus === "confirmed"
            ? "confirm"
            : "cancel";


    const result = await Swal.fire({

        icon:
            newStatus === "confirmed"
                ? "question"
                : "warning",

        title:
            newStatus === "confirmed"
                ? "Confirm Booking?"
                : "Cancel Booking?",

        text:
            `Are you sure you want to ${actionText} this package booking?`,

        showCancelButton: true,

        confirmButtonText:
            newStatus === "confirmed"
                ? "Yes, Confirm"
                : "Yes, Cancel",

        cancelButtonText: "Go Back",

        confirmButtonColor:
            newStatus === "confirmed"
                ? "#198754"
                : "#dc3545",

        cancelButtonColor: "#555",

        reverseButtons: true

    });


    if (!result.isConfirmed) {
        return;
    }


    try {

        await updateDoc(
            doc(
                db,
                "packageBookings",
                bookingId
            ),
            {
                status: newStatus
            }
        );


        await Swal.fire({

            icon: "success",

            title:
                newStatus === "confirmed"
                    ? "Booking Confirmed! ✅"
                    : "Booking Cancelled ❌",

            text:
                newStatus === "confirmed"
                    ? "The package booking has been confirmed."
                    : "The package booking has been cancelled.",

            confirmButtonColor: "#ff7a00",

            timer: 1800,

            timerProgressBar: true

        });


        // Reload packages

        loadPackageBookings();


    } catch (error) {

        console.error(
            "Status update error:",
            error
        );


        Swal.fire({

            icon: "error",

            title: "Update Failed",

            text:
                error.message,

            confirmButtonColor: "#d33"

        });

    }
}


// ======================================================
// DELETE BOOKING
// ======================================================

async function deleteBooking(
    collectionName,
    bookingId
) {

    const result = await Swal.fire({

        icon: "warning",

        title: "Delete Booking?",

        text:
            "This booking will be permanently removed from your records.",

        showCancelButton: true,

        confirmButtonText: "Yes, Delete",

        cancelButtonText: "Cancel",

        confirmButtonColor: "#d33",

        cancelButtonColor: "#555",

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

            title: "Booking Deleted ✨",

            text:
                "The booking has been successfully removed.",

            confirmButtonText: "Done",

            confirmButtonColor: "#ff7a00",

            timer: 2000,

            timerProgressBar: true

        });


        // Find correct section

        let divId;


        if (collectionName === "templeBookings") {

            divId = "templeData";

        } else if (collectionName === "wellBookings") {

            divId = "wellData";

        } else if (collectionName === "poojaBookings") {

            divId = "poojaData";

        } else if (collectionName === "roomBookings") {

            divId = "roomData";

        } else if (collectionName === "cabBookings") {

            divId = "cabData";

        } else if (collectionName === "packageBookings") {

            loadPackageBookings();

            return;
        }


        loadBookings(
            collectionName,
            divId
        );


    } catch (error) {

        console.error(
            "Delete booking error:",
            error
        );


        Swal.fire({

            icon: "error",

            title: "Delete Failed",

            text:
                "We couldn't remove this booking. Please try again.",

            confirmButtonText: "Close",

            confirmButtonColor: "#d33"

        });

    }
}


// ======================================================
// LOGOUT
// ======================================================

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


// ======================================================
// MAKE FUNCTIONS AVAILABLE TO HTML
// ======================================================

window.deleteBooking =
    deleteBooking;

window.updatePackageStatus =
    updatePackageStatus;

window.logout =
    logout;