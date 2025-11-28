// src/controllers/commentController.js
import pool from '../db.js';

// Obtener todos los comentarios con info del usuario
export const getComments = async (req, res) => {
  try {
    const comentarios = await pool.query(`
      SELECT 
        c.id_comentario,
        c.texto_comentario,
        c.calificacion,
        c.creado_en,
        c.id_usuario,
        u.nombre_usuario
      FROM comentarios c
      JOIN usuarios u ON c.id_usuario = u.id_usuario
      ORDER BY c.creado_en DESC
    `);

    res.status(200).json({ comentarios });
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener comentarios.' });
  }
};

// Crear un nuevo comentario
export const createComment = async (req, res) => {
  const { id_usuario, texto_comentario, calificacion } = req.body;

  try {
    // Validar calificación
    if (calificacion < 1 || calificacion > 5) {
      return res.status(400).json({ mensaje: 'La calificación debe estar entre 1 y 5.' });
    }

    // Validar texto
    if (!texto_comentario || texto_comentario.trim().length < 10) {
      return res.status(400).json({ mensaje: 'El comentario debe tener al menos 10 caracteres.' });
    }

    const result = await pool.query(
      'INSERT INTO comentarios (id_usuario, texto_comentario, calificacion) VALUES (?, ?, ?)',
      [id_usuario, texto_comentario.trim(), calificacion]
    );

    const id_comentario = Number(result.insertId);

    res.status(201).json({ 
      mensaje: 'Comentario creado con éxito.', 
      id_comentario 
    });
  } catch (error) {
    console.error('Error al crear comentario:', error);
    res.status(500).json({ mensaje: 'Error al crear comentario.' });
  }
};

// Eliminar comentario (solo el autor puede eliminarlo)
export const deleteComment = async (req, res) => {
  const { id_comentario } = req.params;
  const { id_usuario } = req.body;

  try {
    // Verificar que el comentario existe y pertenece al usuario
    const comentario = await pool.query(
      'SELECT * FROM comentarios WHERE id_comentario = ? AND id_usuario = ?',
      [id_comentario, id_usuario]
    );

    if (comentario.length === 0) {
      return res.status(404).json({ mensaje: 'Comentario no encontrado o no tienes permiso para eliminarlo.' });
    }

    await pool.query('DELETE FROM comentarios WHERE id_comentario = ?', [id_comentario]);

    res.status(200).json({ mensaje: 'Comentario eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    res.status(500).json({ mensaje: 'Error al eliminar comentario.' });
  }
};