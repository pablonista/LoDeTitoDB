// src/routes/reservationRoutes.js
import express from 'express';
import { getAllReservas, getReservaById, createReserva, updateReserva, deleteReserva } from '../controllers/reservationController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

//creamos una instancia del router de Express
const router = express.Router();


router.get('/', authenticateToken, getAllReservas);
router.get('/:id', authenticateToken, getReservaById);
router.post('/', authenticateToken, createReserva);
router.put('/:id', authenticateToken, updateReserva);
router.delete('/:id', authenticateToken, deleteReserva);


export default router; // Exportar el router de Express