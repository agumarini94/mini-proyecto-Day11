import express from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import pool from '../db/index.js';

const router = express.Router();

// 1. GET /api/stories: Traer todas las historias
router.get('/', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM stories ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. POST /api/stories: Crear una nueva historia
router.post('/', authenticateToken, async (req, res) => {
    const { title, content } = req.body;

    // Validación de entrada (Requerido por la Parte 4)
    if (!title || !content) {
        return res.status(400).json({ error: "Título y contenido son obligatorios" });
    }

    const author_id = req.user.id; // Extraído del JWT por el middleware
    try {
        const result = await pool.query(
            'INSERT INTO stories (title, content, author_id) VALUES ($1, $2, $3) RETURNING *',
            [title, content, author_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Error al crear la historia" });
    }
});

// 3. PATCH /api/stories/:id: Editar historia (Autor o Colaborador)
router.patch('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, content } = req.body;

    try {
        // Validación de permisos: ¿Es el autor o es colaborador?
        const checkAuth = await pool.query(
            `SELECT s.id FROM stories s 
             LEFT JOIN contributors c ON s.id = c.story_id 
             WHERE s.id = $1 AND (s.author_id = $2 OR c.user_id = $2)`,
            [id, userId]
        );

        if (checkAuth.rows.length === 0) {
            return res.status(401).json({ message: "No tienes permiso para editar esta historia" });
        }

        const update = await pool.query(
            'UPDATE stories SET title = COALESCE($1, title), content = COALESCE($2, content) WHERE id = $3 RETURNING *',
            [title, content, id]
        );
        res.json(update.rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 4. DELETE /api/stories/:id: Borrar historia (SOLO el autor)
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        // Intentar borrar solo si el id de la historia y el autor coinciden
        const result = await pool.query(
            'DELETE FROM stories WHERE id = $1 AND author_id = $2',
            [id, userId]
        );

        if (result.rowCount === 0) {
            return res.status(401).json({
                message: "No autorizado (no eres el autor) o la historia no existe"
            });
        }
        res.json({ message: "Historia eliminada correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;