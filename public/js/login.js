//public/js/login.js
document.addEventListener("DOMContentLoaded", function() {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = loginForm.email.value;
    const contrasena = loginForm.contrasena.value;

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, contrasena })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Guardar todos los datos del usuario en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log(data.user.idrol);
        window.location.href = "../index.html";
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error al iniciar sesión. Por favor, inténtelo de nuevo.");
    }
  });
});