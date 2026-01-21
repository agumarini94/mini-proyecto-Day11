import { query } from "../db/index.js";

// 1. Función para crear un nuevo usuario
export const createUser = async (username, email, hashedPassword) => {
    const text = `
    INSERT INTO users (username, email, password) -- ANTES DECÍA password_hash
    VALUES ($1, $2, $3)
    RETURNING id, username, email
    `;
    const values = [username, email, hashedPassword];

    try {
        const res = await query(text, values);
        return res.rows[0];
    } catch (error) {
        console.error("Error en createUser Modelo:", error);
        throw error;
    }
};

// 2. Función para buscar un usuario por su correo
export const findUserByEmail = async (email) => {
    try {
        const res = await query('SELECT * FROM users WHERE email = $1', [email]);
        return res.rows[0];
    } catch (error) {
        console.error("Error en findUserByEmail Modelo:", error);
        throw error;
    }
}