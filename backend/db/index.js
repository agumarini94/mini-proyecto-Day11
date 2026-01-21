import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

// Usamos un Pool para no abrir y cerrar la conexión en cada clic, lo cual es lento.
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Esto es OBLIGATORIO para conectar con Neon
    }
});

// Exportamos una función query segura para usarla en los Models
export const query = (text, params) => pool.query(text, params);