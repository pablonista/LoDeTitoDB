// src/routes/authRoutes.js

// Importa el módulo express
import express from 'express';

// Importa el controlador de autenticación
import authController from '../controllers/authController.js';

// Importa el middleware de autenticación
import authMiddleware from '../middlewares/authMiddleware.js';

// Crea un nuevo enrutador de Express
const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', authController.register);

// Ruta para iniciar sesión del usuario
router.post('/login', authController.login);

// Ruta para cerrar sesión del usuario
router.post('/logout', authMiddleware, authController.logout);

// Ruta para verificar si un correo electrónico está disponible
router.post('/check-email', authController.checkEmail);

// Ruta para verificar el token
router.get('/user', authMiddleware, authController.verifyToken);

// Ruta protegida de ejemplo
router.get('/protected', authMiddleware, (req, res) => {
    res.status(200).send(`Hello user ${req.userId}`);
});

// Exporta el enrutador
export default router;