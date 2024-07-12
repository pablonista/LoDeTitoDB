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
            await connection.query(`CREATE DATABASE IF NOT EXISTS bg03omiv8u936zu7jfdx`);
            console.log('Database ensured');

            // Cambiar a la base de datos lodetito
            await connection.changeUser({ database: 'bg03omiv8u936zu7jfdx' });
            console.log('Switched to database bg03omiv8u936zu7jfdx');

            // Crear la tabla menues si no existe
            await connection.query(`
                CREATE TABLE IF NOT EXISTS menues (
                    idmenu INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(255) NOT NULL,
                    precio DECIMAL (10,2) NOT NULL,
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
            const [rolesRows] = await connection.query(`SELECT COUNT(*) AS count FROM roles`);
            const { count: rolesCount } = rolesRows[0];

            if (rolesCount === 0) {
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
                    fechanacimiento VARCHAR(10) NOT NULL,
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

            // Verificar si el usuario administrador ya existe
            const [adminRows] = await connection.query(`SELECT COUNT(*) AS count FROM usuarios WHERE email = ?`, ['admin@lodetito.com.ar']);
            const { count: adminCount } = adminRows[0];

            if (adminCount === 0) {
                // Insertar el usuario administrador si no existe
                await connection.query(`
                    INSERT INTO usuarios (nombre, apellido, fechanacimiento, email, contrasena, pregunta, respuesta, idrol, islogueado)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, ['admin', 'LoDeTito', '1977-09-29', 'admin@lodetito.com.ar', '$08$kLGOCMbteYF9wS.RvSbTtOIZ04un8rES/AFVszLXTDsl1wl0iTwK2', '¿En qué ciudad naciste?', 'Tucumán', 2, 0]);
                console.log('Usuario administrador insertado');
            } else {
                console.log('Usuario administrador ya existe, omitiendo inserción');
            }

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