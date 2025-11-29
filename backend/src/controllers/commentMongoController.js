// backend/src/controllers/commentMongoController.js
import Comment from '../models/comment.js';

// Obtener comentarios de un producto específico
export const getCommentsByProduct = async (req, res) => {
  const { id_producto } = req.params;

  try {
    const comentarios = await Comment.find({ id_producto: Number(id_producto) })
      .sort({ creado_en: -1 })  // Más recientes primero
      .lean();  // Convierte a objetos JS planos (más rápido)

    res.status(200).json({ comentarios });
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener comentarios.' });
  }
};

// Crear un nuevo comentario
export const createComment = async (req, res) => {
  const { id_producto, id_usuario, nombre_usuario, texto_comentario, calificacion } = req.body;

  try {
    // Validar calificación
    if (calificacion < 1 || calificacion > 5) {
      return res.status(400).json({ mensaje: 'La calificación debe estar entre 1 y 5.' });
    }

    // Validar texto
    if (!texto_comentario || texto_comentario.trim().length < 10) {
      return res.status(400).json({ mensaje: 'El comentario debe tener al menos 10 caracteres.' });
    }

    const nuevoComentario = new Comment({
      id_producto: Number(id_producto),
      id_usuario: Number(id_usuario),
      nombre_usuario,
      texto_comentario: texto_comentario.trim(),
      calificacion: Number(calificacion),
      respuestas: []
    });

    await nuevoComentario.save();

    res.status(201).json({ 
      mensaje: 'Comentario creado con éxito.', 
      comentario: nuevoComentario 
    });
  } catch (error) {
    console.error('Error al crear comentario:', error);
    res.status(500).json({ mensaje: 'Error al crear comentario.' });
  }
};

// Agregar réplica a un comentario
export const addReply = async (req, res) => {
  const { id_comentario } = req.params;
  const { id_usuario, nombre_usuario, texto } = req.body;

  try {
    // Validar texto de réplica
    if (!texto || texto.trim().length < 5) {
      return res.status(400).json({ mensaje: 'La respuesta debe tener al menos 5 caracteres.' });
    }

    const comentario = await Comment.findById(id_comentario);

    if (!comentario) {
      return res.status(404).json({ mensaje: 'Comentario no encontrado.' });
    }

    // Agregar réplica
    comentario.respuestas.push({
      id_usuario: Number(id_usuario),
      nombre_usuario,
      texto: texto.trim(),
      creado_en: new Date()
    });

    await comentario.save();

    res.status(201).json({ 
      mensaje: 'Respuesta agregada con éxito.', 
      comentario 
    });
  } catch (error) {
    console.error('Error al agregar respuesta:', error);
    res.status(500).json({ mensaje: 'Error al agregar respuesta.' });
  }
};

// Eliminar comentario completo (solo el autor)
export const deleteComment = async (req, res) => {
  const { id_comentario } = req.params;
  const { id_usuario } = req.body;

  try {
    const comentario = await Comment.findById(id_comentario);

    if (!comentario) {
      return res.status(404).json({ mensaje: 'Comentario no encontrado.' });
    }

    // Verificar que sea el autor
    if (comentario.id_usuario !== Number(id_usuario)) {
      return res.status(403).json({ mensaje: 'No tienes permiso para eliminar este comentario.' });
    }

    await Comment.findByIdAndDelete(id_comentario);

    res.status(200).json({ mensaje: 'Comentario eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    res.status(500).json({ mensaje: 'Error al eliminar comentario.' });
  }
};

// Eliminar réplica específica (solo el autor de la réplica)
export const deleteReply = async (req, res) => {
  const { id_comentario, id_respuesta } = req.params;
  const { id_usuario } = req.body;

  try {
    const comentario = await Comment.findById(id_comentario);

    if (!comentario) {
      return res.status(404).json({ mensaje: 'Comentario no encontrado.' });
    }

    const respuesta = comentario.respuestas.id(id_respuesta);

    if (!respuesta) {
      return res.status(404).json({ mensaje: 'Respuesta no encontrada.' });
    }

    // Verificar que sea el autor de la réplica
    if (respuesta.id_usuario !== Number(id_usuario)) {
      return res.status(403).json({ mensaje: 'No tienes permiso para eliminar esta respuesta.' });
    }

    comentario.respuestas.pull(id_respuesta);
    await comentario.save();

    res.status(200).json({ mensaje: 'Respuesta eliminada con éxito.' });
  } catch (error) {
    console.error('Error al eliminar respuesta:', error);
    res.status(500).json({ mensaje: 'Error al eliminar respuesta.' });
  }
};