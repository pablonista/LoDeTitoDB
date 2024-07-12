//src/app.js
// Importamos los módulos necesarios
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import menuesRouter from './src/routes/menuRoutes.js';
import usersRouter from './src/routes/userRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import reservationsRoutes from './src/routes/reservationRoutes.js';
import authenticateToken from './src/middlewares/authMiddleware.js';
import authController from './src/controllers/authController.js';
import path from 'path';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
});

// Rutas
app.use('/menues', menuesRouter);
app.use('/reservas', reservationsRoutes);
app.use('/usuarios', usersRouter);
app.use('/auth', authRoutes);

app.get('/user', authController.verifyToken, (req, res) => {
    db.query('SELECT * FROM usuarios WHERE idusuario = ?', [req.userId], (err, result) => {
        if (err) return res.status(500).send('There was a problem finding the user.');
        if (!result) return res.status(404).send('No user found.');

        res.status(200).send(result);
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});