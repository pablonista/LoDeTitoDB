//public/js/editarMenu.js
class Menu {
    constructor(idmenu, nombre, precio, imagen, descripcion, isdisponible) {
        this.idmenu = idmenu;
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.descripcion = descripcion;
        this.isdisponible = isdisponible;
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    // Obtener datos del formulario

    let id = document.querySelector('input[name="id"]').value;
    let nombre = document.querySelector('input[name="nombre"]').value;
    let precio = document.querySelector('input[name="precio"]').value;
    let imagenMenu = document.querySelector('input[name="imagenMenu"]').files[0];
    let descripcion = document.querySelector('textarea[name="comentarios"]').value;
    let isDisponible = document.querySelector('select[name="disponibilidad"]').value;

    // Validar campos del formulario
    if (!validarNombre(nombre)) {
        alert("Por favor, ingrese un nombre para el menú.");
        return false;
    }
    if (!validarComentario(descripcion)) {
        alert("Por favor, ingrese la descripción del menú.");
        return false;
    }
    const menu = JSON.parse(localStorage.getItem('menuAEditar'));
    let editadoMenu = {
        idmenu: menu.idmenu,
        nombre,
        precio,
        descripcion,
        isdisponible: isDisponible === '1' // Convertir a booleano
    };
    //console.log(editadoMenu);
    if (imagenMenu) {
        // Convertir imagen a base64 para enviarla
        let reader = new FileReader();
        reader.onload = async function() {
            let imagenBase64 = reader.result;
            editadoMenu.imagen = imagenBase64;

            await enviarDatos(editadoMenu);
        };
        reader.readAsDataURL(imagenMenu);
    } else {
        // Si no se selecciona nueva imagen, enviar el menú sin la propiedad de imagen
        await enviarDatos(editadoMenu);
    }

    return false;
}

async function enviarDatos(datosMenu) {
    const token = localStorage.getItem("token");
    const idMenu = parseInt(datosMenu.idmenu);
    
    try {
        const response = await fetch(`/menues/${idMenu}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(datosMenu)
        });

        if (!response.ok) {
            throw new Error('Error al editar el menú');
        }

        const data = await response.json();
        console.log('Menú actualizado:', data.menu);
        window.location.href = "./lista_menues.html";

    } catch (error) {
        console.error('Error al editar el menú:', error.message);
        // Manejar el error según sea necesario en el cliente
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar token y usuario al cargar la página
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");


    if (!token || !userString) {
        // Manejar caso de usuario no autenticado
        cambiarFondo();
        alert('No tiene acceso a la página');
        window.location.href = "/";
        return;
    }

    const menu = JSON.parse(localStorage.getItem('menuAEditar'));
    if (menu) {
        document.querySelector('input[name="id"]').value = menu.id;
        document.querySelector('input[name="nombre"]').value = menu.nombre;
        document.querySelector('input[name="precio"]').value = menu.precio;
        document.querySelector('textarea[name="comentarios"]').value = menu.descripcion;
        document.querySelector('select[name="disponibilidad"]').value = menu.isDisponible ? '1' : '0';
    }
});

function cambiarFondo() {
    var elemento = document.getElementById("miDiv");
    elemento.style.backgroundImage = "url('../assets/imagenes/Noaccess01.jpeg')";
    elemento.style.backgroundSize = "cover";
    elemento.style.backgroundPosition = "center";
    elemento.style.height = "100vh";
}

// Funciones de validación
function validarNombre(nombre) {
    return nombre.trim() !== '';
}

function validarComentario(descripcion) {
    return descripcion.trim() !== '';
}

async function validarMenuUnico(nombre) {
    try {
        const response = await fetch('/menues', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const menues = await response.json();
        return menues.some(menu => menu.nombre === nombre);
    } catch (error) {
        console.error('Error al validar el menú:', error);
        return false;
    }
}
function validateCurrency() {
    var input = document.getElementById("currencyInput").value;
    var message = document.getElementById("currencyMessage");

    var currencyRegex = /^\$?\d{1,3}(,\d{3})*(\.\d{2})?$/;

    if (currencyRegex.test(input) && parseFloat(input.replace(/[$,]/g, '')) > 0) {
        message.style.color = "green";
        message.textContent = "El formato de moneda es válido y positivo.";
    } else {
        message.style.color = "red";
        message.textContent = "El formato de moneda no es válido o no es positivo.";
    }
}