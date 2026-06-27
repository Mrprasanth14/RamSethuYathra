function adminLogin() {
  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;

  if (email === "ramsethuyatra@gmail.com" && password === "623526") {
    localStorage.setItem("adminLogin", "true");
    window.location.href = "admin.html";
  } else {
    alert("Invalid admin login");
  }
}

window.adminLogin = adminLogin;