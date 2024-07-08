//src/Controller/authController.js
// Importa el módulo jsonwebtoken para manejar JWT
import jwt from 'jsonwebtoken';

// Importa el módulo bcryptjs para cifrar contraseñas
import bcrypt from 'bcryptjs';

// Importa la conexión a la base de datos
import pool from '../db/db.js';

// Importa la configuración (Clave secreta y duración del token)
import config from '../config/config.js';

const register = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        // Extrae el nombre de usuario, la contraseña y el idrol del cuerpo de la solicitud
        const { nombre, password, idrol } = req.body;
        // Cifra la contraseña usando bcrypt
        const hashedPassword = bcrypt.hashSync(password, 8);

        // Inserta el nuevo usuario en la base de datos
        const [result] = await connection.query(
            'INSERT INTO usuarios (nombre, password, idrol) VALUES (?, ?, ?)',
            [nombre, hashedPassword, idrol]
        );

        // Genera un token JWT para el nuevo usuario
        const token = jwt.sign({ id: result.insertId }, config.secretKey, { expiresIn: config.tokenExpiresIn });

        // Envía el token como respuesta al cliente
        res.status(201).send({ auth: true, token });
    } catch (error) {
        res.status(500).send({ message: 'There was a problem registering the user.', error });
    } finally {
        connection.release();
    }
};

const login = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        // Extrae el nombre de usuario y la contraseña del cuerpo de la solicitud
        const { nombre, password } = req.body;

        // Busca el usuario en la base de datos
        const [rows] = await connection.query('SELECT * FROM usuarios WHERE nombre = ?', [nombre]);
        const user = rows[0];

        // Si el usuario no existe, envía un mensaje de error 404
        if (!user) return res.status(404).send('User not found');

        // Compara la contraseña proporcionada con la contraseña cifrada almacenada
        const passwordIsValid = bcrypt.compareSync(password, user.password);

        // Si la contraseña no es válida, envía un mensaje de error 401
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        // Genera un token JWT usando el id del usuario
        const token = jwt.sign({ id: user.idusuario }, config.secretKey, { expiresIn: config.tokenExpiresIn });

        // Envía el token al cliente con el estado 200 (ok)
        res.status(200).send({ auth: true, token });
    } catch (error) {
        res.status(500).send({ message: 'There was a problem logging in the user.', error });
    } finally {
        connection.release();
    }
};

const logout = (req, res) => {
    // Aquí puedes implementar la lógica de cierre de sesión, como invalidar el token
    res.status(200).send({ auth: false, token: null });
};

export default { register, login, logout };