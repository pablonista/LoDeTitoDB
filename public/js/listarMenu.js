// public/js/listarMenues.js
// Función para cargar los menús desde la base de datos
async function cargarMenuesDesdeDB() {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch('/menues', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta de la base de datos');
        }

        const menues = await response.json();
        return menues;
    } catch (error) {
        console.error('Error al cargar los menús desde la base de datos:', error);
        return null; // Devolver null en caso de error
    }
}

// Función para eliminar un menú de la base de datos
async function eliminarMenuDeDB(idmenu) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/menues/${idmenu}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error al eliminar el menú:', response.statusText);
            return null; // Devolver null en caso de error
        }
    } catch (error) {
        console.error('Error al eliminar el menú desde la base de datos:', error);
        return null; // Devolver null en caso de error
    }
}

// Función para cargar la tabla de menús
// Función para cargar la tabla de menús desde la base de datos
/*async function cargarTablaMenues() {
    try {
        let tablaMenues = document.getElementById('tablaMenues');
        let tbody = tablaMenues.querySelector('tbody');
        tbody.innerHTML = ''; // Limpiar contenido existente

        const menuesRegistrados = await cargarMenuesDesdeDB();
        if (!menuesRegistrados) {
            console.error('No se pudieron cargar los menús desde la base de datos.');
            return;
        }

        menuesRegistrados.forEach(menu => {
            let fila = document.createElement('tr');

            Object.keys(menu).forEach(key => {
                if (key !== 'isDisponible') {
                    let cell = document.createElement('td');
                    if (key === 'imagen') {
                        let img = document.createElement('img');
                        // Convierte los datos binarios a una URL de imagen
                        img.src = `data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(menu[key])))}`;
                        img.alt = 'Imagen del menú';
                        img.style.maxWidth = '150px';
                        cell.appendChild(img);
                        img.classList.add('imagen-menu');
                    } else {
                        cell.textContent = menu[key];
                    }
                    fila.appendChild(cell);
                }
            });

            let accionesCell = document.createElement('td');

            let editarBtn = document.createElement('button');
            editarBtn.textContent = 'Editar ';
            let iconoEditar = document.createElement('i');
            iconoEditar.classList.add('fas', 'fa-edit');
            editarBtn.appendChild(iconoEditar);
            editarBtn.classList.add('btn', 'btn-warning', 'btn-sm', 'mr-2');
            editarBtn.addEventListener('click', function () {
                editarMenu(menu.id);
            });
            accionesCell.appendChild(editarBtn);
            editarBtn.classList.add('btn-editar-menu');

            let eliminarBtn = document.createElement('button');
            eliminarBtn.textContent = 'Eliminar ';
            let iconoEliminar = document.createElement('i');
            iconoEliminar.classList.add('fas', 'fa-trash-alt');
            eliminarBtn.appendChild(iconoEliminar);
            eliminarBtn.classList.add('btn', 'btn-danger', 'btn-sm');
            eliminarBtn.addEventListener('click', function () {
                eliminarMenu(menu.id);
            });
            accionesCell.appendChild(eliminarBtn);
            eliminarBtn.classList.add('btn-eliminar-menu');

            fila.appendChild(accionesCell);
            tbody.appendChild(fila);
        });

        console.log('Tabla de menús cargada desde la base de datos');
    } catch (error) {
        console.error('Error al cargar la tabla de menús desde la base de datos:', error);
    }
} */
async function cargarTablaMenues() {
    try {
        let tablaMenues = document.getElementById('tablaMenues');
        let tbody = tablaMenues.querySelector('tbody');
        tbody.innerHTML = ''; // Limpiar contenido existente

        const menuesRegistrados = await cargarMenuesDesdeDB();
        if (!menuesRegistrados) {
            console.error('No se pudieron cargar los menús desde la base de datos.');
            return;
        }

        menuesRegistrados.forEach(menu => {
            let fila = document.createElement('tr');

            for (let key in menu) {
                if (key === 'idmenu' || key === 'nombre' || key === 'precio' || key === 'descripcion' || key === 'imagen') {
                    let cell = document.createElement('td');
                    if (key === 'imagen') {
                        let img = document.createElement('img');
                        // Convierte los datos binarios a una URL de imagen
                        img.src = `data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(menu[key])))}`;
                        img.alt = 'Imagen del menú';
                        img.style.maxWidth = '150px';

                        cell.appendChild(img);
                        img.classList.add('imagen-menu');
                    } else {
                        cell.textContent = menu[key];
                    }
                    fila.appendChild(cell);
                }
            }

            let accionesCell = document.createElement('td');

            let editarBtn = document.createElement('button');
            editarBtn.textContent = 'Editar ';
            let iconoEditar = document.createElement('i');
            iconoEditar.classList.add('fas', 'fa-edit');
            editarBtn.appendChild(iconoEditar);
            editarBtn.addEventListener('click', function() {
                localStorage.setItem('menuAEditar', JSON.stringify(menu));
                window.location.href = "./editar_menu.html";
            });
            accionesCell.appendChild(editarBtn);
            editarBtn.classList.add('btn-editar-menu');

            let eliminarBtn = document.createElement('button');
            eliminarBtn.textContent = 'Eliminar ';
            let iconoBorrar = document.createElement('i');
            iconoBorrar.classList.add('fas', 'fa-trash-alt');
            eliminarBtn.appendChild(iconoBorrar);
            eliminarBtn.addEventListener('click', async function() {
                const mensajeConfirmacion = `¿Está seguro de que desea eliminar el siguiente menú?\n\n` +
                    `Nombre: ${menu.nombre}\n` +
                    `Precio: ${menu.precio}\n` +
                    `Descripción: ${menu.descripcion}\n`;
                if (confirm(mensajeConfirmacion)) {
                    await eliminarMenuDeDB(menu.idmenu);
                    await cargarTablaMenues(); // Cargar de nuevo la tabla después de eliminar
                }
            });
            accionesCell.appendChild(eliminarBtn);
            eliminarBtn.classList.add('btn-eliminar-menu');

            fila.appendChild(accionesCell);
            tbody.appendChild(fila);
        });

        console.log('Tabla de menús cargada');
    } catch (error) {
        console.error('Error al cargar la tabla de menús:', error);
    }
}

// Función para manejar el acceso según el tipo de usuario
function manejarAccesoUsuario() {
    const loginItem = document.getElementById("loginLink");
    const registerItem = document.getElementById("registerLink");
    const adminItem = document.getElementById("admin-item");
    const reservaItem = document.getElementById("reservaLink");
    const logoutItem = document.getElementById("closeLink");

    function updateNavbar() {
        const token = localStorage.getItem("token");
        const userString = localStorage.getItem("user");
        const user = JSON.parse(userString);

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
    }

    updateNavbar();

    logoutItem.addEventListener("click", function() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        updateNavbar();
        window.location.href = "/";
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token || !userString) {
        alert('No tiene acceso a la página');
        window.location.href = "/";
        return;
    }

    cargarTablaMenues();
    manejarAccesoUsuario();

    const agregarMenuBtn = document.getElementById('agregarMenuBtn');
    if (agregarMenuBtn) {
        agregarMenuBtn.addEventListener('click', function() {
            window.location.href = './nuevo_menu.html';
        });
    }
});