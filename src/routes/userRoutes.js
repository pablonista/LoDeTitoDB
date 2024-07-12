//src/routes/userRoutes.js
import express from 'express';
import {getAllUsers,getUserById,getUserByEmail,createUser,updateUser,deleteUser} from '../controllers/userController.js';

//creamos una instancia del router de Express
const router = express.Router();


router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.get('/email/:email',getUserByEmail)
router.delete('/:id', deleteUser);


export default router; // Exportar el router de Express