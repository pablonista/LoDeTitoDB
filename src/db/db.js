// src/db/db.js
import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool
const pool = createPool({
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB,
    connectionLimit: 5 // Adjust the connection limit as per your requirements
});

// Test connection and setup database
pool.getConnection()
    .then(async (connection) => {
        console.log('Connected to the database');

        try {
            // Crear la base de datos si no existe
            await connection.query(`CREATE DATABASE IF NOT EXISTS lodetito`);
            console.log('Database ensured');

            // Cambiar a la base de datos lodetito
            await connection.changeUser({ database: 'lodetito' });
            console.log('Switched to database lodetito');

            // Crear la tabla movies si no existe
            await connection.query(`
                CREATE TABLE IF NOT EXISTS menues (
                    idmenu INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(255) NOT NULL,
                    precio DOUBLE NOT NULL,
                    imagen LONGBLOB NOT NULL,
                    descripcion VARCHAR(255) NOT NULL,
                    isdisponible TINYINT NOT NULL
                )
            `);
            console.log('Table menues ensured');

            // Crear la tabla roles si no existe
            await connection.query(`
                CREATE TABLE IF NOT EXISTS roles (
                    idrol INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(255) NOT NULL
                )
            `);
            console.log('Table roles ensured');

            // Verificar si la tabla roles está vacía
            const [rows] = await connection.query(`SELECT COUNT(*) AS count FROM roles`);
            const { count } = rows[0];

            if (count === 0) {
                // Insertar valores por defecto en la tabla roles si está vacía
                await connection.query(`
                    INSERT INTO roles (nombre) VALUES 
                    ('user'),
                    ('admin')
                `);
                console.log('Default roles inserted');
            } else {
                console.log('Roles already exist, skipping insert');
            }

            // Crear la tabla usuarios si no existe
            await connection.query(`
                CREATE TABLE IF NOT EXISTS usuarios (
                    idusuario INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(255) NOT NULL,
                    apellido VARCHAR(255) NOT NULL,
                    fechanacimiento DATE,
                    email VARCHAR(255) NOT NULL,
                    contrasena VARCHAR(255) NOT NULL,
                    pregunta VARCHAR(255) NOT NULL,
                    respuesta VARCHAR(255) NOT NULL,
                    idrol INT,
                    islogueado TINYINT NOT NULL,
                    FOREIGN KEY (idrol) REFERENCES roles(idrol)
                )
            `);
            console.log('Table usuarios ensured');

            // Crear la tabla reservas si no existe
            await connection.query(`
                CREATE TABLE IF NOT EXISTS reservas (
                    idreservas INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    fullname VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    phone VARCHAR(255) NOT NULL,
                    table INT NOT NULL,
                    food VARCHAR(255) NOT NULL,
                    date DATE NOT NULL,
                    horario VARCHAR(255) NOT NULL,
                    idusuario VARCHAR(45) NOT NULL,
                    FOREIGN KEY (idusuario) REFERENCES usuarios (idusuario)
                )
            `);
            console.log('Table reservas ensured');

        } catch (error) {
            console.error('Error during database setup:', error);
        } finally {
            connection.release();
        }
    })
    .catch((error) => {
        console.error('Error connecting to the database:', error);
    });

export default pool;



