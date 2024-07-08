//src/routes/authRoutes.js
// Importa el módulo express
import express from 'express';
// Importa el módulo de autenticación
import authController from '../controllers/authController.js';
// Importa el middleware de autenticación
import authMiddleware from '../middlewares/authMiddleware.js';

// Crea un nuevo enrutador de Express
const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', authController.register);
/* Cuando se realiza una solicitud POST a /auth/register, se ejecuta la función register del controlador de autenticación */

// Ruta para iniciar sesión del usuario
router.post('/login', authController.login);
/* Cuando se realiza una solicitud POST a /auth/login, se ejecuta la función login del controlador de autenticación */

// Ruta para cerrar sesión del usuario
router.get('/logout', authMiddleware, authController.logout);
/* Cuando se realiza una solicitud GET a /auth/logout, se ejecuta la función logout del controlador de autenticación */

// Ruta protegida de ejemplo
router.get('/protected', authMiddleware, (req, res) => {
    res.status(200).send(`Hello user ${req.userId}`);
});
/* Cuando se realiza una solicitud GET a /auth/protected, se ejecuta el middleware de autenticación primero. Si la autenticación es exitosa, se ejecuta la función que envía un mensaje con el ID del usuario */

// Exporta el enrutador
export default router;