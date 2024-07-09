//src/routes/userRoutes.js
import express from 'express';
import {getAllReservas,getReservaById,createReserva,updateReserva,deleteReserva} from '../controllers/reservationController.js';

//creamos una instancia del router de Express
const router = express.Router();


router.get('/', getAllReservas);
router.get('/:id', getReservaById);
router.post('/', createReserva);
router.put('/:id', updateReserva);
router.delete('/:id', deleteReserva);


export default router; // Exportar el router de Express