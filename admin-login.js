function adminLogin() {
  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;

  if (email === "admin@gmail.com" && password === "12345") {
    localStorage.setItem("adminLogin", "true");
    window.location.href = "admin.html";
  } else {
    alert("Invalid admin login");
  }
}

window.adminLogin = adminLogin;