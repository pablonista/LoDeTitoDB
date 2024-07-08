
//src/routes/menuRoutes.js
import express from 'express';
import {getAllMenues,getMenuById,createMenu,updateMenu,deleteMenu} from '../controllers/menuController.js';
import upload from '../upload.js'; // Importar la configuración de multer

//creamos una instancia del router de Express
const router = express.Router();


router.get('/', getAllMenues);
router.get('/:id', getMenuById);
router.post('/', createMenu);
router.put('/:id', updateMenu);
router.delete('/:id', deleteMenu);

// Nueva ruta para la subida de archivos
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.status(200).json({ message: 'File uploaded successfully', file: req.file });
});

// Nueva ruta para la carga de múltiples archivos
router.post('/upload-multiple', upload.array('files', 10), (req, res) => { // 'files' es el nombre del campo, y 10 es el número máximo de archivos permitidos
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }
    res.status(200).json({ message: 'Files uploaded successfully', files: req.files });
});

export default router; // Exportar el router de Express