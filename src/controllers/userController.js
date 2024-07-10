//src/controllers/userController.js
import db from '../db/db.js';
import pool from '../db/db.js';

const getAllUsers = async (req, res) => {
    try {
        const sql = 'SELECT usuarios.idusuario, usuarios.nombre, usuarios.apellido, usuarios.fechanacimiento, usuarios.email, usuarios.contrasena, usuarios.pregunta, usuarios.respuesta, roles.nombre AS rol, usuarios.islogueado'
        +' FROM usuarios'
        +' INNER JOIN roles ON usuarios.idrol = roles.idrol';
        const result = await db.query(sql);
        res.json(result[0]);
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).send('Error al obtener los usuarios');
    }
};

const getUserById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const sql = 'SELECT usuarios.idusuario, usuarios.nombre, usuarios.apellido, usuarios.fechanacimiento, usuarios.email, usuarios.contrasena, usuarios.pregunta, usuarios.respuesta, roles.nombre AS rol, usuarios.islogueado'
        +' FROM usuarios'
        +' INNER JOIN roles ON usuarios.idrol = roles.idrol'+ ' WHERE idusuario = ?';

    try {
        const [rows] = await pool.query(sql, [id]);

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener el usuario por ID:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const createUser = async (req, res) => {
    const { nombre, apellido, fechaNacimiento, email, contrasena, pregunta, respuesta, idrol, islogueado } = req.body;
    const sql = 'INSERT INTO usuarios (nombre, apellido, fechanacimiento, email, contrasena, pregunta, respuesta, idrol, islogueado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';


    try {
        const [result] = await db.query(sql, [nombre, apellido, fechaNacimiento, email, contrasena, pregunta, respuesta, idrol, islogueado]);
        const newUser = { id: result.insertId, nombre, apellido, fechaNacimiento, email, contrasena, pregunta, respuesta, idrol, islogueado };
        res.json({ message: 'User created', User: newUser });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const updateUser = async(req, res) => {
    const id = parseInt(req.params.id, 10);
    const { nombre, apellido, fechanacimiento, email, contrasena, pregunta, respuesta, idrol, islogueado } = req.body;
    const sql = `UPDATE usuarios SET nombre = ?, apellido = ?, fechanacimiento = ?, email = ?, password = ?, pregunta = ?, respuesta = ?, idrol = ?, islogueado = ? WHERE idusuario = ?`
    try {
        const [result] = await db.query(sql, [nombre, apellido, fechanacimiento, email, contrasena, pregunta, respuesta, idrol, islogueado, id]);

        if (result.affectedRows === 0) {
            res.status(404).send('Usuario no encontrado');
        } else {
            const updatedUser = { id, nombre, apellido, fechanacimiento, email, contrasena, pregunta, respuesta, idrol, islogueado };
            res.json({ message: 'User updated', User: updatedUser });
        }
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const selectSql = 'SELECT * FROM usuarios WHERE idusuario = ?';
    const deleteSql = 'DELETE FROM usuarios WHERE idusuario = ?';

    try {
        // Recuperar los datos del usuario antes de eliminarlo
        const [rows] = await db.query(selectSql, [id]);

        if (rows.length === 0) {
            res.status(404).send('Usuario no encontrado');
            return;
        }

        const userToDelete = rows[0];

        // Eliminar el usuario
        const [result] = await db.query(deleteSql, [id]);

        if (result.affectedRows === 0) {
            res.status(404).send('Usuario no encontrado');
        } else {
            res.json({ message: 'User deleted', User: userToDelete });
        }
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};



export {getAllUsers,getUserById,createUser,updateUser,deleteUser};