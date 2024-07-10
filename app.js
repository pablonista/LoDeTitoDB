//src/app.js
// Importamos los módulos necesarios
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import menuesRouter from './src/routes/menuRoutes.js';
import usersRouter from './src/routes/userRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import reservationsRoutes from './src/routes/reservationRoutes.js'
import authenticateToken from './src/middlewares/authMiddleware.js'; 
import authController from './src/controllers/authController.js';
import path from 'path';
// Configuramos las variables de entorno desde el archivo .env
dotenv.config();

// Creamos una instancia de la aplicación Express
const app = express();

// Middleware para analizar cuerpos JSON en las solicitudes entrantes
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(express.static('public'));


// Route al serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
});


// Definimos la ruta para películas y llamamos al router de películas de manera autentificada
app.use('/menues',authenticateToken, menuesRouter);

//Definimos la ruta para las reservas y llamomos al router de reservas
app.use('/reservas',authenticateToken, reservationsRoutes);

// Definimos la ruta para usuarios y llamamos al router de usuarios
app.use('/usuarios', usersRouter);

//Definimos la ruta de la autentificacion
app.use('/auth',authRoutes);

app.get('/user', authController.verifyToken, (req, res) => {
    db.query('SELECT * FROM usuarios WHERE idusuario = ?', [req.userId], (err, result) => {
        if (err) return res.status(500).send('There was a problem finding the user.');
        if (!result) return res.status(404).send('No user found.');
        
        res.status(200).send(result);
    });
});

// Definimos el puerto en el que nuestro servidor escuchará las solicitudes
const PORT = process.env.PORT || 3000;

// Iniciamos el servidor y lo configuramos para que escuche en el puerto definido
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});