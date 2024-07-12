//public/js/recuperoUsuario.js
// Clase Usuario para representar los datos del usuario
class Usuario {
    constructor(id, nombre, apellido, fechanacimiento, email, contrasena, pregunta, respuesta, idrol, islogueado) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechanacimiento = fechanacimiento; // Formato dd/mm/yyyy
        this.email = email;
        this.contrasena = contrasena; // Contraseña sin encriptar en el cliente
        this.pregunta = pregunta;
        this.respuesta = respuesta;
        this.idrol = idrol;
        this.islogueado = islogueado;
    }
}

// Función para manejar el evento de envío del formulario
async function handleFormSubmit(event) {
    event.preventDefault();

    let email = document.querySelector('input[name="email"]').value;
    let contrasena = document.querySelector('input[name="contrasena"]').value;
    let confirmarContrasena = document.querySelector('input[name="confirmar_contrasena"]').value;
    let pregunta = document.querySelector('select[name="pregunta"]').value;
    let respuesta = document.querySelector('input[name="respuesta"]').value;

    // Validaciones de los campos del formulario
    if (!validarCorreo(email)) {
        alert("Por favor, ingrese un correo electrónico válido.");
        return false;
    }
    if (!validarContrasena(contrasena)) {
        alert("La contraseña debe tener entre 6 y 12 caracteres, al menos un número, una letra mayúscula y un carácter especial.");
        return false;
    }
    if (contrasena !== confirmarContrasena) {
        alert("Las contraseñas no coinciden");
        return false;
    }
    if (!validarPreguntaRespuesta(pregunta, respuesta)) {
        alert("Por favor, seleccione una pregunta y una respuesta válidas.");
        return false;
    }

    // Buscar y actualizar la contraseña del usuario en la base de datos
    try {
        const response = await fetch(`/usuarios/email/${email}`);
        if (!response.ok) {
            throw new Error('Usuario no encontrado');
        }

        const usuario = await response.json();
        let fechaformateada = formatearFecha(usuario.fechanacimiento);
        usuario.fechanacimiento = fechaformateada;
        console.log(usuario);
        if (usuario.respuesta !== respuesta) {
            alert("Respuesta incorrecta.");
            return false;
        }
        // Asignación del valor numérico a idrol según el rol del usuario en una sola línea
        const idrol = usuario.rol === 'admin' ? 2 : 1;
        // Construir objeto con todos los datos actualizados del usuario
        const updateData = {
            idusuario: usuario.idusuario,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            fechanacimiento: usuario.fechanacimiento,
            email: usuario.email,
            contrasena: contrasena, // Nueva contraseña
            pregunta: pregunta,
            respuesta: respuesta,
            idrol: idrol, // Asegúrate de incluir idrol
            islogueado: usuario.islogueado
        };
        console.log(updateData);
        const updateResponse = await fetch(`/usuarios/${usuario.idusuario}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        if (updateResponse.ok) {
            alert("¡Cambio de contraseña exitoso!");
            window.location.href = "../pages/login.html";
        } else {
            throw new Error('Error al actualizar la contraseña');
        }
    } catch (error) {
        alert(error.message);
        return false;
    }

    return false;
}

// Función para asignar la pregunta de seguridad correspondiente al email
async function asignarPreguntaSeguridad(email) {
    try {
        const response = await fetch(`/usuarios/email/${email}`);
        if (!response.ok) {
            throw new Error('Usuario no encontrado');
        }

        const usuario = await response.json();
        let selectPregunta = document.getElementById("preguntas");
        selectPregunta.value = usuario.pregunta;
    } catch (error) {
        alert(error.message);
    }
}

// Funciones de validación del formulario
function validarCorreo(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

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

function validarPreguntaRespuesta(pregunta, respuesta) {
    return pregunta.trim() !== '' && respuesta.trim() !== '';
}

// Verificar si el usuario tiene el token y está logueado
window.addEventListener('DOMContentLoaded', function() {
    // Asignar evento al formulario
    document.querySelector('form').addEventListener('submit', handleFormSubmit);

    // Asignar pregunta de seguridad si el email está presente en el formulario
    const emailInput = document.querySelector('input[name="email"]');
    emailInput.addEventListener('blur', function() {
        if (emailInput.value) {
            asignarPreguntaSeguridad(emailInput.value);
        }
    });
});

// Función para formatear la fecha de nacimiento a dd/mm/yyyy
function formatearFecha(fecha) {
    if (!fecha) return '';
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}