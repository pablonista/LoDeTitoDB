//public/js/registroUsuario.js
// Clase Usuario para representar un usuario
class Usuario {
    constructor(nombre, apellido, fechaNacimiento, email, contrasena, pregunta, respuesta) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaNacimiento = fechaNacimiento;
        this.email = email;
        this.contrasena = contrasena;
        this.pregunta = pregunta;
        this.respuesta = respuesta;
    }
}

// Función para manejar el evento de envío del formulario
async function handleFormSubmit(event) {
    event.preventDefault(); // Evita que el formulario se envíe de manera predeterminada

    // Obtener referencias a los campos de entrada del formulario
    let nombre = document.querySelector('input[name="nombre"]').value;
    let apellido = document.querySelector('input[name="apellido"]').value;
    let fechaNacimiento = document.querySelector('input[name="fechaNacimiento"]').value;
    let email = document.querySelector('input[name="email"]').value;
    let contrasena = document.querySelector('input[name="contrasena"]').value;
    let confirmarContrasena = document.querySelector('input[name="confirmarContrasena"]').value;
    let pregunta = document.querySelector('select[name="pregunta"]').value;
    let respuesta = document.querySelector('input[name="respuesta"]').value;

    console.log('Fecha de Nacimiento:', fechaNacimiento); // Añade este log para verificar el valor

    // Validar los campos del formulario
    if (!validarNombreApellido(nombre, apellido)) {
        alert("Por favor, ingrese un nombre y un apellido válidos.");
        return false;
    }
    if (!validarFecha(fechaNacimiento)) {
        alert("Por favor, ingrese una fecha de nacimiento válida en formato dd/mm/yyyy.");
        return false;
    }
    if (!validarCorreo(email)) {
        alert("Por favor, ingrese un correo electrónico válido.");
        return false;
    }
    if (!validarContrasena(contrasena)) {
        alert("La contraseña debe tener entre 6 y 12 caracteres, al menos un número, una letra mayúscula y un carácter especial.");
        return false;
    }
    // Verificar si las contraseñas coinciden
    if (contrasena !== confirmarContrasena) {
        alert("Las contraseñas no coinciden");
        return false; // Retorna false para evitar el envío del formulario
    }
    if (!validarPreguntaRespuesta(pregunta, respuesta)) {
        alert("Por favor, seleccione una pregunta y una respuesta válidas.");
        return false;
    }

    // Verificar si el correo electrónico ya está registrado
    try {
        const response = await fetch('/auth/check-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (errorData.message === 'Email already registered') {
                alert("El correo electrónico ya está registrado.");
            }
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Hubo un error al verificar el correo electrónico. Por favor, inténtelo de nuevo.");
        return false;
    }

    // Crear el nuevo usuario
    let nuevoUsuario = new Usuario(nombre, apellido, fechaNacimiento, email, contrasena, pregunta, respuesta);

    // Enviar el nuevo usuario a la base de datos
    try {
        const registerResponse = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoUsuario)
        });

        if (registerResponse.ok) {
            alert("¡Registro exitoso!");
            window.location.href = "../pages/login.html";
        } else {
            const errorData = await registerResponse.json();
            alert("Error en el registro: " + errorData.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Hubo un error en el registro. Por favor, inténtelo de nuevo.");
    }

    return false;
}

// Función para validar el nombre y apellido
function validarNombreApellido(nombre, apellido) {
    if (nombre.trim() === '' || apellido.trim() === '') {
        return false;
    }
    return true;
}

// Función para validar el formato de fecha (dd/mm/yyyy)
function validarFecha(fecha) {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    return regex.test(fecha);
}

// Función para validar el formato de correo electrónico
function validarCorreo(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Función para validar la contraseña
function validarContrasena(contrasena) {
    if (contrasena.length < 6 || contrasena.length > 12) {
        return false;
    }
    if (!/\d/.test(contrasena)) {
        return false;
    }
    if (!/[A-Z]/.test(contrasena)) {
        return false;
    }
    if (!/[!#$%&/()=?¡¿@]/.test(contrasena)) {
        return false;
    }
    return true;
}

// Función para validar la pregunta y respuesta de seguridad
function validarPreguntaRespuesta(pregunta, respuesta) {
    if (pregunta.trim() === '' || respuesta.trim() === '') {
        return false;
    }
    return true;
}