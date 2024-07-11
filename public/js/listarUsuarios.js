//public/js/listarUsuarios.js
// Función para cargar los usuarios desde la base de datos
async function cargarUsuariosDesdeDB() {
    try {
        const response = await fetch('/usuarios');
        if (!response.ok) {
            throw new Error('Error en la respuesta de la base de datos');
        }
        const usuarios = await response.json();
        return usuarios;
    } catch (error) {
        console.error('Error al cargar los usuarios desde la base de datos:', error);
    }
}

// Función para eliminar un usuario de la base de datos
async function eliminarUsuarioDeDB(idusuario) {
    try {
        const response = await fetch(`/usuarios/${idusuario}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error al eliminar el usuario:', response.statusText);
        }
    } catch (error) {
        console.error('Error al eliminar el usuario desde la base de datos:', error);
    }
}

// Función para formatear la fecha de nacimiento a dd/mm/yyyy
function formatearFecha(fecha) {
    if (!fecha) return '';
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Función para cargar la tabla de usuarios
async function cargarTablaUsuarios() {
    // Obtener referencia a la tabla y el cuerpo de la tabla
    let tablaUsuarios = document.getElementById('tablaUsuarios');
    let tbody = tablaUsuarios.querySelector('tbody');

    // Limpiar contenido existente en el cuerpo de la tabla
    tbody.innerHTML = '';

    // Cargar usuarios desde la base de datos
    const usuariosRegistrados = await cargarUsuariosDesdeDB();

    if (!usuariosRegistrados) {
        console.error('No se pudieron cargar los usuarios desde la base de datos.');
        return;
    }

    // Iterar sobre el array de usuarios registrados
    usuariosRegistrados.forEach(usuario => {
        // Crear nueva fila
        let fila = document.createElement('tr');

        // Crear y agregar celdas para cada atributo del usuario
        for (let key in usuario) {
            if (key !== 'idusuario' && key !== 'islogueado' && key !== 'contrasena') {
                let cell = document.createElement('td');

                // Formatear la fecha de nacimiento
                if (key === 'fechanacimiento') {
                    cell.textContent = formatearFecha(usuario[key]);
                } else {
                    cell.textContent = usuario[key];
                }
                
                fila.appendChild(cell);
            }
        }

        // Crear celda para los botones de acción
        let accionesCell = document.createElement('td');

        // Crear botón de "Editar" y asignarle un listener
        let editarBtn = document.createElement('button');
        editarBtn.textContent = 'Editar ';
        let iconoEditar = document.createElement('i');
        iconoEditar.classList.add('fas', 'fa-edit');
        editarBtn.appendChild(iconoEditar);
        editarBtn.addEventListener('click', function() {
            localStorage.setItem('usuarioAEditar', JSON.stringify(usuario));
            window.location.href = "./editar_usuario.html";
        });
        accionesCell.appendChild(editarBtn);
        editarBtn.classList.add('btn-editar-usuario');

        // Crear botón de "Eliminar" y asignarle un listener
        let eliminarBtn = document.createElement('button');
        eliminarBtn.textContent = 'Eliminar ';
        let iconoBorrar = document.createElement('i');
        iconoBorrar.classList.add('fas', 'fa-trash-alt');
        eliminarBtn.appendChild(iconoBorrar);
        eliminarBtn.addEventListener('click', async function() {
            const mensajeConfirmacion = `¿Está seguro de que desea eliminar al siguiente usuario?\n\n` +
                `Nombre: ${usuario.nombre}\n` +
                `Apellido: ${usuario.apellido}\n` +
                `Email: ${usuario.email}\n` +
                `Tipo de usuario: ${usuario.rol}\n`;
            if (confirm(mensajeConfirmacion)) {
                await eliminarUsuarioDeDB(usuario.idusuario);
                cargarTablaUsuarios();
            }
        });
        accionesCell.appendChild(eliminarBtn);
        eliminarBtn.classList.add('btn-eliminar-usuario');

        // Agregar celda de acciones a la fila
        fila.appendChild(accionesCell);

        // Agregar fila al cuerpo de la tabla
        tbody.appendChild(fila);
    });

    console.log('Tabla de usuarios cargada');
}

// Función para manejar el acceso según el tipo de usuario
function manejarAccesoUsuario() {
    const loginItem = document.getElementById("loginLink");
    const registerItem = document.getElementById("registerLink");
    const adminItem = document.getElementById("admin-item");
    const reservaItem = document.getElementById("reservaLink");
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
            } else if (user.idrol === 1) {
                adminItem.style.display = "none";
                reservaItem.style.display = "block";
            } else {
                adminItem.style.display = "none";
                reservaItem.style.display = "none";
            }
        } else {
            loginItem.style.display = "block";
            registerItem.style.display = "block";
            logoutItem.style.display = "none";
            adminItem.style.display = "none";
            reservaItem.style.display = "none";
        }

        console.log("Token:", token);
        console.log("User:", user);
    }

    updateNavbar();

    logoutItem.addEventListener("click", function() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        updateNavbar();
        window.location.href = "/";
    });
}

// Ejecutar funciones al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si el usuario está autenticado antes de cargar la tabla
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    function cambiarFondo(){
        var elemento = document.getElementById("miDiv");
        // Cambia el fondo usando CSS a través de JavaScript
        elemento.style.backgroundImage = "url('../assets/imagenes/Noaccess01.jpeg')";
        elemento.style.backgroundSize = "cover"; // Esto asegura que la imagen cubra todo el div
        elemento.style.backgroundPosition = "center"; // Centra la imagen en el div
        elemento.style.height = "100vh"; // Ajusta la altura del div si es necesario
    }
    

    if (!token || !userString) {
        cambiarFondo();
        alert('No tiene acceso a la página');
        window.location.href = "/";
        return;
    }

    // Si está autenticado, cargar la tabla y manejar el acceso
    cargarTablaUsuarios();
    manejarAccesoUsuario();

    // Asignar evento al botón de agregar usuario
    const agregarUsuarioBtn = document.getElementById('agregarUsuarioBtn');
    if (agregarUsuarioBtn) {
        agregarUsuarioBtn.addEventListener('click', function() {
            window.location.href = './nuevo_usuario.html';
        });
    }

});