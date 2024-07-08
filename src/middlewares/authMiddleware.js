//src/middlewares/authMiddleware.js
//Importa el modulo jsonwebtoken para manejar JWT
import jwt from 'jsonwebtoken';
//Importa el modulo de configuracion (clave secreta y duracion del token)
import config from '../config/config.js';

const authenticateToken = (req, res, next) => {
    // Obtiene el token del header de autentificación
    const authHeader = req.headers['authorization']; // Cambiado de 'autorizacion' a 'authorization' para seguir el estándar
    // Si no hay token en el encabezado
    if (!authHeader) return res.status(403).send({ auth: false, message: 'No se proveyó un token' });

    // Extrae el token del encabezado (formato "bearer <token>")
    const token = authHeader.split(' ')[1];
    // Si el token no está bien formado, envía una respuesta de error 403
    if (!token) return res.status(403).send({ auth: false, message: 'Malformed token.' });

    // Verifica el token usando la clave secreta
    jwt.verify(token, config.secretKey, (err, decoded) => {
        // Si hay un error en la verificación, envía una respuesta de error 500
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        // Si el token es válido, almacena el ID del usuario decodificado en la solicitud
        req.userId = decoded.id;
        // Llama a la siguiente función middleware o controlador
        next();
    });
};

export default authenticateToken;