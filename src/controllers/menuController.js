// src/controllers/menuController.js
import db from '../db/db.js';
import pool from '../db/db.js';

const getAllMenues = async (req, res) => {
    try {
        const sql = 'SELECT * FROM menues';
        const result = await pool.query(sql);
        res.json(result[0]);
    } catch (error) {
        console.error('Error al obtener los menús:', error);
        res.status(500).send('Error al obtener los menús');
    }
};

const getMenuById = async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        return res.status(400).send('ID no válido');
    }

    const sql = 'SELECT * FROM menues WHERE idmenu = ?';

    try {
        const [rows] = await pool.query(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).send('Menú no encontrado');
        } else {
            return res.json(rows[0]);
        }
    } catch (error) {
        console.error('Error al obtener el menú por ID:', error);
        return res.status(500).send('Ocurrió un error al obtener el menú. Por favor, intente nuevamente.');
    }
};

const createMenu = async (req, res) => {
    const { nombre, precio, imagen, descripcion, isdisponible } = req.body;
    const sql = 'INSERT INTO menues (nombre, precio, imagen, descripcion, isdisponible) VALUES (?, ?, ?, ?, ?)';

    try {
        const [result] = await pool.query(sql, [nombre, precio, imagen, descripcion, isdisponible]);
        const newMenu = { id: result.insertId, nombre, precio, imagen, descripcion, isdisponible };
        res.json({ message: 'Menú creado', menu: newMenu });
    } catch (error) {
        console.error('Error al crear el menú:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const updateMenu = async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        return res.status(400).send('ID no válido');
    }

    const { nombre, precio, imagen, descripcion, isdisponible } = req.body;

    if (!nombre || !precio || !descripcion || typeof isdisponible === 'undefined') {
        return res.status(400).send('Todos los campos requeridos deben estar presentes');
    }

    const sql = `UPDATE menues SET nombre = ?, precio = ?, imagen = ?, descripcion = ?, isdisponible = ? WHERE idmenu = ?`;

    try {
        const [result] = await pool.query(sql, [nombre, precio, imagen, descripcion, isdisponible, id]);

        if (result.affectedRows === 0) {
            return res.status(404).send('Menú no encontrado');
        } else {
            const updatedMenu = { id, nombre, precio, imagen, descripcion, isdisponible };
            return res.json({ message: 'Menú actualizado', menu: updatedMenu });
        }
    } catch (error) {
        console.error('Error al actualizar el menú:', error);
        return res.status(500).send('Ocurrió un error al editar el menú. Por favor, intente nuevamente.');
    }
};

const deleteMenu = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const selectSql = 'SELECT * FROM menues WHERE idmenu = ?';
    const deleteSql = 'DELETE FROM menues WHERE idmenu = ?';

    try {
        const [rows] = await pool.query(selectSql, [id]);

        if (rows.length === 0) {
            res.status(404).send('Menú no encontrado');
            return;
        }

        const menuToDelete = rows[0];

        const [result] = await pool.query(deleteSql, [id]);

        if (result.affectedRows === 0) {
            res.status(404).send('Menú no encontrado');
        } else {
            res.json({ message: 'Menú eliminado', menu: menuToDelete });
        }
    } catch (error) {
        console.error('Error al eliminar el menú:', error);
        res.status(500).send('Error interno del servidor');
    }
};

export { getAllMenues, getMenuById, createMenu, updateMenu, deleteMenu };