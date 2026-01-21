import express from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import pool from '../db/index.js'; // Tu archivo de conexión a la base de datos

const router = express.Router();

// 1. POST /contributors: Añadir un colaborador
router.post('/', authenticateToken, async (req, res) => {
    const { story_id, user_id } = req.body;
    try {
        // Opcional: Validar que el que añade sea el autor
        const result = await pool.query(
            'INSERT INTO contributors (story_id, user_id) VALUES ($1, $2) RETURNING *',
            [story_id, user_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: "Error al añadir colaborador o ya existe." });
    }
});

// 2. GET /contributors/:story_id: Ver todos los colaboradores de una historia
router.get('/:story_id', authenticateToken, async (req, res) => {
    const { story_id } = req.params;
    try {
        const result = await pool.query(
            `SELECT u.id, u.username, u.email 
             FROM users u 
             JOIN contributors c ON u.id = c.user_id 
             WHERE c.story_id = $1`,
            [story_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. DELETE /contributors/:id: Quitar un colaborador (Solo el autor de la historia)
router.delete('/:id', authenticateToken, async (req, res) => {
    const contributorId = req.params.id; // El ID de la fila en la tabla contributors
    const userId = req.user.id; // ID del usuario autenticado (JWT)

    try {
        // Validamos que el usuario que intenta borrar sea el autor de la historia asociada
        const checkAuthor = await pool.query(
            `SELECT s.author_id FROM stories s
             JOIN contributors c ON s.id = c.story_id
             WHERE c.id = $1`, [contributorId]
        );

        if (checkAuthor.rows.length === 0) {
            return res.status(404).json({ message: "Colaborador no encontrado" });
        }

        if (checkAuthor.rows[0].author_id !== userId) {
            return res.status(401).json({ message: "Solo el autor de la historia puede quitar colaboradores" });
        }

        await pool.query('DELETE FROM contributors WHERE id = $1', [contributorId]);
        res.json({ message: "Colaborador eliminado correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;