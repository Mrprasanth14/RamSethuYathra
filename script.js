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

    window.open(
      `https://wa.me/${ownerNumber}?text=${encodeURIComponent(whatsappMessage)}`,
      "_blank"
    );
  });
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

  window.open(whatsappURL, "_blank");
}
function sendRoomWhatsApp() {
  const room = document.querySelector('input[name="room"]:checked')?.value;
  const persons = document.getElementById("roomPersons").value;
  const checkin = document.getElementById("checkin").value;
  const checkout = document.getElementById("checkout").value;
  const mobile = document.getElementById("roomMobile").value;
  const email = document.getElementById("roomEmail").value;
  const request = document.getElementById("request").value;

  if (!room) {
    alert("Please select a room");
    return;
  }

  if (!persons || !checkin || !checkout || !mobile || !email) {
    alert("Please fill all booking details");
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

📝 Request: ${request}`;

  const whatsappURL =
    `https://wa.me/918838170745?text=${encodeURIComponent(message)}`;

  window.location.href = whatsappURL;
}
function showTempleDetails() {
  const box = document.getElementById("templeDetails");

  if (box.style.display === "none") {
    box.style.display = "block";
  } else {
    box.style.display = "none";
  }
}
function showTempleDetailsform() {
  const persons = document.getElementById("templePersons").value;
  const date = document.getElementById("templeDate").value;
  const time = document.getElementById("templeTime").value;
  const mobile = document.getElementById("templeMobile").value.trim();

  if (persons === "" || date === "" || time === "" || mobile === "") {
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
`🛕 Temple Booking Request

👥 Persons: ${persons}
📅 Date: ${date}
⏰ Time: ${time}
📞 Mobile: ${mobile}`;

  window.open(
    `https://wa.me/918838170745?text=${encodeURIComponent(message)}`,
    "_blank"
  );
}
function showWellDetailsform() {

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

  const message =
`🚿 22 Wells Booking Request

👥 Persons: ${persons}
📅 Date: ${date}
⏰ Time: ${time}
📞 Mobile: ${mobile}`;

  window.open(
    `https://wa.me/918838170745?text=${encodeURIComponent(message)}`,
    "_blank"
  );
}
function showPoojaDetailsform() {

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

  const message =
`🙏 Temple Poojai Booking Request

👥 Persons: ${persons}
📅 Date: ${date}
⏰ Time: ${time}
📞 Mobile: ${mobile}`;

  window.open(
    `https://wa.me/918838170745?text=${encodeURIComponent(message)}`,
    "_blank"
  );
}
function showWellDetails() {
  const box = document.getElementById("WellDetails");

  if (box.style.display === "none") {
    box.style.display = "block";
  } else {
    box.style.display = "none";
  }
}
function showPoojaDetails() {
  const box = document.getElementById("PoojaDetails");

  if (box.style.display === "none") {
    box.style.display = "block";
  } else {
    box.style.display = "none";
  }
}