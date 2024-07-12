// public/pages/registroMenu.js

class Menu {
    constructor(id, nombre, precio, imagen, descripcion, isDisponible) {
        this.id = id;
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
    let nombre = document.querySelector('input[name="nombre"]').value;
    let precio = document.querySelector('input[name="precio"]').value;
    let imagenMenu = document.querySelector('input[name="imagenMenu"]').files[0];
    let descripcion = document.querySelector('textarea[name="comentarios"]').value;
    let isdisponible = 1;
    // Validar campos del formulario
    if (!validarNombre(nombre)) {
        alert("Por favor, ingrese un nombre para el menú.");
        return false;
    }
    if (!validarComentario(descripcion)) {
        alert("Por favor, ingrese la descripción del menú.");
        return false;
    }

    // Validar que el menú sea único
    if (await validarMenuUnico(nombre)) {
        alert("El menú ya está registrado.");
        return false;
    }

    // Convertir imagen a base64 para enviarla
    let reader = new FileReader();
    reader.onload = async function() {
        let imagenBase64 = reader.result;

        let nuevoMenu = {
            nombre,
            precio,
            imagen: imagenBase64,
            descripcion,
            isdisponible: isdisponible === 1 // Cambiado a isDisponible en vez de isdisponible
        };

        try {
            // Enviar datos del nuevo menú al backend
            const response = await fetch('/menues', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(nuevoMenu)
            });

            if (response.ok) {
                event.target.reset();
                alert("¡Menú registrado exitosamente!");
                window.location.href = "../pages/lista_menues.html";
            } else {
                throw new Error('Error al registrar el menú');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Ocurrió un error al registrar el menú. Por favor, intente nuevamente.');
        }
    };
    reader.readAsDataURL(imagenMenu);

    return false;
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

    // Regex actualizado para permitir números enteros o decimales con punto como separador decimal, sin símbolo $
    var currencyRegex = /^(?!.*\$)\d{1,3}(,\d{3})*(\.\d{2})?$/;

    // Eliminar las comas antes de verificar el valor numérico
    var numericValue = parseFloat(input.replace(/,/g, ''));

    if (currencyRegex.test(input) && numericValue > 0) {
        message.style.color = "green";
        message.textContent = "El formato de moneda es válido y positivo.";
    } else {
        message.style.color = "red";
        message.textContent = "El formato de moneda no es válido o no es positivo.";
    }
}