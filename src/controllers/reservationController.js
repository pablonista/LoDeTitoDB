import db from '../db/db.js';
import pool from '../db/db.js';

const getAllReservas = async (req, res) => {
    try {
        const sql = 'SELECT reservas.idreserva, reservas.fullname, reservas.email, reservas.phone, reservas.mesa, menues.nombre AS menu, reservas.date, reservas.horario, usuarios.nombre AS usuario'
        + ' FROM reservas'
        + ' INNER JOIN menues ON reservas.idmenu = menues.idmenu'
        + ' INNER JOIN usuarios ON reservas.idusuario = usuarios.idusuario';
        const result = await db.query(sql);
        res.json(result[0]);
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
        res.status(500).send('Error al obtener las reservas');
    }
};

const getReservaById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const sql = 'SELECT reservas.idreserva, reservas.fullname, reservas.email, reservas.phone, reservas.mesa, menues.nombre AS menu, reservas.date, reservas.horario, usuarios.nombre AS usuario'
        + ' FROM reservas'
        + ' INNER JOIN menues ON reservas.idmenu = menues.idmenu'
        + ' INNER JOIN usuarios ON reservas.idusuario = usuarios.idusuario'
        + ' WHERE idreserva = ?';

    try {
        const [rows] = await pool.query(sql, [id]);

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).send('Reserva no encontrada');
        }
    } catch (error) {
        console.error('Error al obtener la Reserva por ID:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const createReserva = async (req, res) => {
    const { fullname, email, phone, mesa, idmenu, date, horario, idusuario } = req.body;
    const sql = 'INSERT INTO reservas (fullname, email, phone, mesa, idmenu, date, horario, idusuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';


    try {
        const [result] = await db.query(sql, [fullname, email, phone, mesa, idmenu, date, horario, idusuario]);
        const newReservation = { id: result.insertId, fullname, email, phone, mesa, idmenu, date, horario, idusuario };
        res.json({ message: 'Reservation created', Reservation: newReservation });
    } catch (error) {
        console.error('Error al crear la reserva:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const updateReserva = async(req, res) => {
    const id = parseInt(req.params.id, 10);
    const { fullname, email, phone, mesa, idmenu, date, horario, idusuario } = req.body;
    const sql = `UPDATE reservas SET fullname = ?, email = ?, phone = ?, mesa = ?, idmenu = ?, date = ?, horario = ?, idusuario = ? WHERE idreserva = ?`
    try {
        const [result] = await db.query(sql, [fullname, email, phone, mesa, idmenu, date, horario, idusuario, id]);

        if (result.affectedRows === 0) {
            res.status(404).send('Reserva no encontrada');
        } else {
            const updatedReservation = { id, fullname, email, phone, mesa, idmenu, date, horario, idusuario };
            res.json({ message: 'Reservation updated', Reservation: updatedReservation });
        }
    } catch (error) {
        console.error('Error al actualizar la reserva:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const deleteReserva = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const selectSql = 'SELECT * FROM reservas WHERE idreserva = ?';
    const deleteSql = 'DELETE FROM reservas WHERE idreserva = ?';

    try {
        // Recuperar los datos de la reserva antes de eliminarla
        const [rows] = await db.query(selectSql, [id]);

        if (rows.length === 0) {
            res.status(404).send('Reserva no encontrada');
            return;
        }

        const reservationToDelete = rows[0];

        // Eliminar el usuario
        const [result] = await db.query(deleteSql, [id]);

        if (result.affectedRows === 0) {
            res.status(404).send('Reserva no encontrada');
        } else {
            res.json({ message: 'Reservation deleted', Reservation: reservationToDelete });
        }
    } catch (error) {
        console.error('Error al eliminar la reserva:', error);
        res.status(500).send('Error interno del servidor');
    }
};



export {getAllReservas,getReservaById,createReserva,updateReserva,deleteReserva};