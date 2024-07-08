import db from '../db/db.js';
import pool from '../db/db.js';

const getAllUsers = async (req, res) => {
    try {
        const sql = 'SELECT usuarios.idusuario, usuarios.nombre, usuarios.password, roles.nombre AS rol'
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
    const sql = 'SELECT usuarios.idusuario, usuarios.nombre, usuarios.password, roles.nombre AS rol'
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
    const { nombre, password, idrol } = req.body;
    const sql = 'INSERT INTO usuarios (nombre, password, idrol) VALUES (?, ?, ?)';


    try {
        const [result] = await db.query(sql, [nombre, password, idrol]);
        const newUser = { id: result.insertId, nombre, password, idrol };
        res.json({ message: 'User created', movie: newUser });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const updateUser = async(req, res) => {
    const id = parseInt(req.params.id, 10);
    const { nombre, password, idrol } = req.body;
    const sql = `UPDATE usuarios SET nombre = ?, password = ?, idrol = ? WHERE id = ?`
    try {
        const [result] = await db.query(sql, [nombre, password, idrol, id]);

        if (result.affectedRows === 0) {
            res.status(404).send('Usuario no encontrado');
        } else {
            const updatedUser = { id, nombre, password, idrol };
            res.json({ message: 'User updated', movie: updatedUser });
        }
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const selectSql = 'SELECT * FROM usuarios WHERE id = ?';
    const deleteSql = 'DELETE FROM usuarios WHERE id = ?';

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