//src/Controller/authController.js
// Importa el módulo jsonwebtoken para manejar JWT
import jwt from 'jsonwebtoken';

// Importa el módulo bcryptjs para cifrar contraseñas
import bcrypt from 'bcryptjs';

// Importa la conexión a la base de datos
import pool from '../db/db.js';

// Importa la configuración (Clave secreta y duración del token)
import config from '../config/config.js';

const formatDate = (dateString) => {
    if (!dateString) return null; // Maneja el caso cuando la fecha es null o undefined
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
};

const register = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { nombre, apellido, fechaNacimiento, email, contrasena, pregunta, respuesta } = req.body;
        const formattedDate = formatDate(fechaNacimiento);
        const hashedPassword = bcrypt.hashSync(contrasena, 8);
        const idrol = 1;
        const islogueado = 0; // O cualquier otro valor por defecto que sea adecuado para tu lógica

        const [result] = await connection.query(
            'INSERT INTO usuarios (nombre, apellido, fechanacimiento, email, contrasena, pregunta, respuesta, idrol, islogueado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [nombre, apellido, formattedDate, email, hashedPassword, pregunta, respuesta, idrol, islogueado]
        );

        const token = jwt.sign({ id: result.insertId }, config.secretKey, { expiresIn: config.tokenExpiresIn });

        res.status(201).send({ auth: true, token });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send({ message: 'There was a problem registering the user.', error });
    } finally {
        connection.release();
    }
};

const login = async (req, res) => {
    const { email, contrasena } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: user.idusuario, idrol: user.idrol }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.json({
      token,
      user: {
        id: user.idusuario,
        email: user.email,
        idrol: user.idrol
      }
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

const logout = (req, res) => {
    // Aquí puedes implementar la lógica de cierre de sesión, como invalidar el token
    res.status(200).send({ auth: false, token: null });
};

// Función para verificar si un correo electrónico ya está registrado
const checkEmail = async (req, res) => {
    const { email } = req.body;

    try {
        // Consulta para verificar si el correo electrónico ya existe en la base de datos
        const [result] = await pool.query('SELECT COUNT(*) AS count FROM usuarios WHERE email = ?', [email]);

        if (result[0].count > 0) {
            // El correo electrónico ya está registrado
            return res.status(400).json({ message: 'Email already registered' });
        }

        // El correo electrónico no está registrado
        return res.status(200).json({ message: 'Email available' });
    } catch (error) {
        console.error('Error checking email:', error);
        return res.status(500).json({ message: 'Error checking email' });
    }
}

const verifyToken = (req,res,next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        req.userId = decoded.id;
        next();
    });
};

export default { register, login, logout, checkEmail, verifyToken };