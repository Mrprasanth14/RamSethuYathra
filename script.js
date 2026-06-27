import { db, collection, addDoc } from "./firebase.js";

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
function sendWhatsApp() {

  const cab = document.querySelector('input[name="cab"]:checked')?.value;
  const persons = document.getElementById("persons").value;
  const name = document.getElementById("name").value;
  const mobile = document.getElementById("mobile").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const pickup = document.getElementById("pickup").value;

  if (!name || !mobile || !date || !time || !pickup) {
    Swal.fire({
  icon: "warning",
  title: "Missing Details",
  text: "Please fill all booking details",
  confirmButtonColor: "#ff7a00"
});
    return;
  }

  const message =
`🚖 New Booking Request

👤 Name: ${name}
📞 Mobile: ${mobile}

🚗 Cab: ${cab} Seater
👥 Persons: ${persons}

📍 Pickup: ${pickup}
📅 Date: ${date}
⏰ Time: ${time}`;

  const whatsappURL =
  `https://wa.me/918838170745?text=${encodeURIComponent(message)}`;

  openWhatsAppWithSuccess(message);
}
async function sendRoomWhatsApp() {

  const room = document.querySelector('input[name="room"]:checked')?.value;
  const persons = document.getElementById("roomPersons").value;
  const checkin = document.getElementById("checkin").value;
  const checkout = document.getElementById("checkout").value;
  const mobile = document.getElementById("roomMobile").value.trim();
  const email = document.getElementById("roomEmail").value.trim();
  const request = document.getElementById("request").value.trim();

  if (!room) {
    Swal.fire("Room Not Selected", "Please select a room", "warning");
    return;
  }

  if (!persons || !checkin || !checkout || !mobile || !email) {
    Swal.fire("Incomplete Form", "Please fill all booking details", "warning");
    return;
  }

  if (!/^[6-9][0-9]{9}$/.test(mobile)) {
    Swal.fire("Invalid Mobile Number", "Please enter valid 10-digit mobile number", "error");
    return;
  }

  const message =
`🏨 New Room Booking Request

🛏️ Room: ${room}
👥 Persons: ${persons}

📅 Check In: ${checkin}
📅 Check Out: ${checkout}

📞 Mobile: ${mobile}
📧 Email: ${email}

📝 Request: ${request || "No Special Request"}`;

  try {
    await addDoc(collection(db, "roomBookings"), {
      room,
      persons,
      checkin,
      checkout,
      mobile,
      email,
      request: request || "No Special Request",
      service: "Room Booking",
      createdAt: new Date()
    });

   Swal.fire("Saved", "Room booking saved in Firebase", "success");

  } catch (error) {
    console.error(error);
    Swal.fire("Error", error.message, "error");
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

try {
  await addDoc(collection(db, "templeBookings"), {
    persons,
    date,
    time,
    mobile,
    service: "Temple Visit",
    bookingTime: new Date().toLocaleTimeString(),
    createdAt: new Date()
  });

  Swal.fire("Saved", "Temple booking saved in Firebase", "success");

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

  try {
    await addDoc(collection(db, "wellBookings"), {
      persons,
      date,
      time,
      mobile,
      service: "22 Holy Wells",
      createdAt: new Date()
    });

    Swal.fire("Saved", "Booking saved in Firebase", "success");
  } catch (error) {
    console.error(error);
    Swal.fire("Error", error.message, "error");
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

  try {
    await addDoc(collection(db, "poojaBookings"), {
      persons,
      date,
      time,
      mobile,
      service: "Temple Poojai",
      createdAt: new Date()
    });

    Swal.fire("Saved", "Booking saved in Firebase", "success");
  } catch (error) {
    console.error(error);
    Swal.fire("Error", error.message, "error");
  }
}
function showTempleDetails() {
  const box = document.getElementById("templeDetails");

  if (box.style.display === "none" || box.style.display === "") {
    box.style.display = "block";
  } else {
    box.style.display = "none";
  }
}

function showWellDetails() {
  const box = document.getElementById("WellDetails");

  if (box.style.display === "none" || box.style.display === "") {
    box.style.display = "block";
  } else {
    box.style.display = "none";
  }
}

function showPoojaDetails() {
  const box = document.getElementById("PoojaDetails");

  if (box.style.display === "none" || box.style.display === "") {
    box.style.display = "block";
  } else {
    box.style.display = "none";
  }
}
window.showPersonBox = showPersonBox;
window.continueBooking = continueBooking;
window.sendWhatsApp = sendWhatsApp;
window.sendRoomWhatsApp = sendRoomWhatsApp;
window.showTempleDetails = showTempleDetails;
window.showTempleDetailsform = showTempleDetailsform;
window.showWellDetails = showWellDetails;
window.showWellDetailsform = showWellDetailsform;
window.showPoojaDetails = showPoojaDetails;
window.showPoojaDetailsform = showPoojaDetailsform;
