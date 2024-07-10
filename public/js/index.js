//public/js/index.js
document.addEventListener("DOMContentLoaded", function() {
    const loginItem = document.getElementById("loginLink");
    const registerItem = document.getElementById("registerLink");
    const adminItem = document.getElementById("admin-item");
    const reservaItem = document.getElementById("reservaLink");
    const reservaBoton = document.getElementById("reservaBoton");
    const logoutItem = document.getElementById("logout-item");
  
    function updateNavbar() {
      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");
      const user = JSON.parse(userString);
      console.log(user);
  
      if (token && user) {
        loginItem.style.display = "none";
        registerItem.style.display = "none";
        logoutItem.style.display = "block";
  
        if (user.idrol === 2) {
          adminItem.style.display = "block";
          reservaItem.style.display = "block";
          reservaBoton.style.display = "block";
        } else if (user.idrol === 1) {
          adminItem.style.display = "none";
          reservaItem.style.display = "block";
          reservaBoton.style.display = "block";
        } else {
          adminItem.style.display = "none";
          reservaItem.style.display = "none";
          reservaBoton.style.display = "none";
        }
      } else {
        loginItem.style.display = "block";
        registerItem.style.display = "block";
        logoutItem.style.display = "none";
        adminItem.style.display = "none";
        reservaItem.style.display = "none";
        reservaBoton.style.display = "none";
      }
      
      console.log("Token:", token);
      console.log("User:", user);
    }
  
    updateNavbar();
  
    logoutItem.addEventListener("click", function() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      updateNavbar();
      window.location.href = "./index.html";
    });
});