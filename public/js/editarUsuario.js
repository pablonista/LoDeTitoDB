// public/js/editarUsuario.js
// Clase Usuario para representar los datos del usuario
class Usuario {
    constructor(nombre, apellido, fechanacimiento, email, contrasena, pregunta, respuesta, idrol, islogueado) {
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

    let nombre = document.querySelector('input[name="nombre"]').value;
    let apellido = document.querySelector('input[name="apellido"]').value;
    let fechanacimiento = document.querySelector('input[name="fecha_nacimiento"]').value;
    let email = document.querySelector('input[name="email"]').value;
    let contrasena = document.querySelector('input[name="contrasena"]').value; // Contraseña en texto plano
    let confirmarContrasena = document.querySelector('input[name="confirmar_contrasena"]').value; // Contraseña en texto plano
    let pregunta = document.querySelector('select[name="pregunta"]').value;
    let respuesta = document.querySelector('input[name="respuesta"]').value;
    let idrol = document.querySelector('select[name="idrol"]').value;

    // Validaciones de los campos del formulario
    if (!validarNombreApellido(nombre, apellido)) {
        alert("Por favor, ingrese un nombre y un apellido válidos.");
        return false;
    }
    if (!validarFecha(fechanacimiento)) {
        alert("Por favor, ingrese una fecha de nacimiento válida en formato dd/mm/yyyy.");
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
    if (!validarTipoUsuario(idrol)) {
        alert("Por favor, seleccione el tipo de Usuario.");
        return false;
    }

    // Crear objeto de usuario con los datos actualizados
    const usuarioActualizado = {
        nombre,
        apellido,
        fechanacimiento: convertirFechaFormatoISO(fechanacimiento), // Convertir a formato ISO (yyyy-mm-dd)
        email,
        contrasena, // Contraseña sin encriptar en el cliente
        pregunta,
        respuesta,
        idrol
    };

    try {
        // Enviar la solicitud PUT al servidor para actualizar el usuario
        const response = await fetch(`/usuarios/${usuarioActualizado}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuarioActualizado)
        });

        if (response.ok) {
            alert("¡Modificación exitosa!");
            window.location.href = "./lista_usuarios.html";
        } else {
            const errorData = await response.json();
            alert(`Error al actualizar el usuario: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        alert('Error al actualizar el usuario');
    }
}

// Función para cargar los datos del usuario en el formulario para editar
function cargarDatosEnFormulario(usuario) {
    if (usuario) {
        document.querySelector('input[name="nombre"]').value = usuario.nombre;
        document.querySelector('input[name="apellido"]').value = usuario.apellido;
        document.querySelector('input[name="fecha_nacimiento"]').value = formatearFecha(usuario.fechanacimiento); // Mostrar en formato dd/mm/yyyy
        document.querySelector('input[name="email"]').value = usuario.email;
        document.querySelector('input[name="contrasena"]').value = ''; // Limpiar campo de contraseña por seguridad
        document.querySelector('input[name="confirmar_contrasena"]').value = ''; // Limpiar campo de confirmar contraseña por seguridad
        document.querySelector('select[name="pregunta"]').value = usuario.pregunta;
        document.querySelector('input[name="respuesta"]').value = usuario.respuesta;
        document.querySelector('select[name="idrol"]').value = String(usuario.idrol);

    } else {
        console.log("Usuario a editar no encontrado");
    }
}

// Función para convertir fecha de dd/mm/yyyy a yyyy-mm-dd
// Función para formatear la fecha de nacimiento a dd/mm/yyyy
function formatearFecha(fecha) {
    if (!fecha) return '';
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Función para convertir fecha de yyyy-mm-dd a dd/mm/yyyy
function convertirFechaParaMostrar(fecha) {
    const partes = fecha.split('-');
    if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`; // dd/mm/yyyy
    }
    return fecha; // En caso de formato incorrecto, devolver la misma fecha
}

// Funciones de validación del formulario
function validarNombreApellido(nombre, apellido) {
    return nombre.trim() !== '' && apellido.trim() !== '';
}

function validarFecha(fecha) {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    return regex.test(fecha);
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

function validarTipoUsuario(idrol) {
    return idrol.trim() !== '';
}

// Cargar datos del usuario al cargar la página
window.addEventListener('DOMContentLoaded', function() {
    let usuarioAEditarString = localStorage.getItem('usuarioAEditar');
    if (usuarioAEditarString) {
        let usuarioAEditar = JSON.parse(usuarioAEditarString);
        cargarDatosEnFormulario(usuarioAEditar);
    } else {
        console.log("No se encontró el usuario a editar en localStorage");
    }

    // Agregar evento al formulario
    document.querySelector('form').addEventListener('submit', handleFormSubmit);
});