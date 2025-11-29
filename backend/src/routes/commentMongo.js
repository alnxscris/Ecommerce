// backend/src/routes/commentMongo.js
import { Router } from 'express';
import { 
  getCommentsByProduct, 
  createComment, 
  addReply, 
  deleteComment,
  deleteReply 
} from '../controllers/commentMongoController.js';

const router = Router();

// Obtener comentarios de un producto
router.get('/producto/:id_producto', getCommentsByProduct);

// Crear comentario
router.post('/create', createComment);

// Agregar réplica a un comentario
router.post('/:id_comentario/reply', addReply);

// Eliminar comentario completo
router.delete('/:id_comentario', deleteComment);

// Eliminar réplica específica
router.delete('/:id_comentario/reply/:id_respuesta', deleteReply);

export default router;