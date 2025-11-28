// src/routes/comment.js
import { Router } from 'express';
import { getComments, createComment, deleteComment } from '../controllers/commentController.js';

const router = Router();

// Obtener todos los comentarios
router.get('/', getComments);

// Crear un nuevo comentario
router.post('/create', createComment);

// Eliminar un comentario
router.delete('/:id_comentario', deleteComment);

export default router;