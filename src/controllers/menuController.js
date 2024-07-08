// src/controllers/menuController.js

import db from '../db/db.js';
import pool from '../db/db.js';

const getAllMenues = async (req, res) => {
    try {
        const sql = 'SELECT * FROM menues';
        const result = await db.query(sql);
        res.json(result[0]);
    } catch (error) {
        console.error('Error al obtener los menues:', error);
        res.status(500).send('Error al obtener los menues');
    }
};

const getMenuById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const sql = `SELECT * FROM menues WHERE id = ?`;

    try {
        const [rows] = await pool.query(sql, [id]);

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).send('Menú no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener el menú por ID:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const createMenu = async (req, res) => {
    const { nombre, precio, imagen, descripcion, isdisponible } = req.body;
    const sql = 'INSERT INTO menues (nombre, precio, imagen, descripcion, isdisponible) VALUES (?, ?, ?, ?, ?)';

    try {
        const [result] = await db.query(sql, [nombre, precio, imagen, descripcion, isdisponible]);
        const newMenu = { id: result.insertId, nombre, precio, imagen, descripcion, isdisponible };
        res.json({ message: 'Menu created', movie: newMenu });
    } catch (error) {
        console.error('Error al crear el menú:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const updateMenu = async(req, res) => {
    const id = parseInt(req.params.id, 10);
    const { nombre, precio, imagen, descripcion, isdisponible } = req.body;
    const sql = `UPDATE menues SET nombre = ?, precio = ?, imagen = ?, descripcion = ?, isdisponible = ? WHERE idmenu = ?`
    try {
        const [result] = await db.query(sql, [nombre, precio, imagen, descripcion, isdisponible, id]);

        if (result.affectedRows === 0) {
            res.status(404).send('Menú no encontrado');
        } else {
            const updatedMenu = { id, nombre, precio, imagen, descripcion, isdisponible };
            res.json({ message: 'Menu updated', movie: updatedMenu });
        }
    } catch (error) {
        console.error('Error al actualizar el menú:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const deleteMenu = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const selectSql = 'SELECT * FROM menues WHERE idmenu = ?';
    const deleteSql = 'DELETE FROM menues WHERE idmenu = ?';

    try {
        // Recuperar los datos del menu antes de eliminarlo
        const [rows] = await db.query(selectSql, [id]);

        if (rows.length === 0) {
            res.status(404).send('Menú no encontrado');
            return;
        }

        const menuToDelete = rows[0];

        // Eliminar menu
        const [result] = await db.query(deleteSql, [id]);

        if (result.affectedRows === 0) {
            res.status(404).send('Menú no encontrado');
        } else {
            res.json({ message: 'Menu deleted', movie: menuToDelete });
        }
    } catch (error) {
        console.error('Error al eliminar el menú:', error);
        res.status(500).send('Error interno del servidor');
    }
};



export {getAllMenues,getMenuById,createMenu,updateMenu,deleteMenu};