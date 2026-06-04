function selectPackage(packageName) {
  document.getElementById("package").value = packageName;
  document.getElementById("booking").scrollIntoView({
    behavior: "smooth"
  });
}

document.getElementById("bookingForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const mobile = document.getElementById("mobile").value;
  const persons = document.getElementById("persons").value;
  const date = document.getElementById("date").value;
  const packageName = document.getElementById("package").value;
  const message = document.getElementById("message").value;

  const ownerNumber = "918248465645";

  const whatsappMessage =
    `New Rameswaram Package Booking%0A%0A` +
    `Name: ${name}%0A` +
    `Mobile: ${mobile}%0A` +
    `Persons: ${persons}%0A` +
    `Date: ${date}%0A` +
    `Package: ${packageName}%0A` +
    `Message: ${message}`;

  window.open(`https://wa.me/${ownerNumber}?text=${whatsappMessage}`, "_blank");
});
window.onscroll = function () {
  const topBtn = document.getElementById("topBtn");

  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    topBtn.style.display = "block";
  } else {
    topBtn.style.display = "none";
  }
};

function topFunction() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function toggleDark() {
  document.body.classList.toggle("dark");
}

function showPersonBox(seats) {

    const personBox = document.getElementById("personBox");
    const persons = document.getElementById("persons");

    personBox.style.display = "block";

    persons.innerHTML = '<option value="">Select Persons</option>';

    for(let i=1; i<=seats; i++){
        persons.innerHTML += `<option value="${i}">${i} Person${i>1?'s':''}</option>`;
    }
}