// src/controllers/commentController.js
import pool from "../db.js";

// Obtener comentarios (todos o por producto)
export const getComments = async (req, res) => {
  let { productId } = req.query;

  try {
    // Normalizar valores raros
    if (productId === "undefined" || productId === "" || productId === null) {
      productId = undefined;
    }

    let sql = `
      SELECT 
        c.id_comentario,
        c.texto_comentario,
        c.calificacion,
        c.creado_en,        
        c.id_usuario,
        c.id_producto,
        u.nombre_usuario
      FROM comentarios c
      JOIN usuarios u ON c.id_usuario = u.id_usuario
    `;
    const params = [];

    if (productId) {
      sql += " WHERE c.id_producto = ?";
      params.push(productId);
    }

    sql += " ORDER BY c.creado_en DESC";

    // mariadb: query devuelve directamente un array de filas
    const rows = await pool.query(sql, params);

    res.status(200).json({ comentarios: rows });
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    res.status(500).json({ mensaje: "Error al obtener comentarios" });
  }
};

// Crear un nuevo comentario (general o por producto)
export const createComment = async (req, res) => {
  const { id_usuario, id_producto, texto_comentario, calificacion } = req.body;

  try {
    if (!id_usuario || !texto_comentario || !calificacion) {
      return res
        .status(400)
        .json({ mensaje: "Faltan datos para crear el comentario." });
    }

    if (calificacion < 1 || calificacion > 5) {
      return res
        .status(400)
        .json({ mensaje: "La calificación debe estar entre 1 y 5." });
    }

    if (!texto_comentario.trim() || texto_comentario.trim().length < 10) {
      return res
        .status(400)
        .json({ mensaje: "El comentario debe tener al menos 10 caracteres." });
    }

    const result = await pool.query(
      `
      INSERT INTO comentarios (id_usuario, id_producto, texto_comentario, calificacion)
      VALUES (?, ?, ?, ?)
    `,
      [id_usuario, id_producto ?? null, texto_comentario.trim(), calificacion]
    );

    // 👇 convertir BigInt a número normal
    const id_comentario = Number(result.insertId);

    res.status(201).json({
      mensaje: "Comentario creado con éxito.",
      id_comentario,
    });
  } catch (error) {
    console.error("Error al crear comentario:", error);
    res.status(500).json({ mensaje: "Error al crear comentario." });
  }
};

// Eliminar comentario (solo el autor puede eliminarlo)
export const deleteComment = async (req, res) => {
  const { id_comentario } = req.params;
  const { id_usuario } = req.body;

  try {
    const rows = await pool.query(
      "SELECT 1 FROM comentarios WHERE id_comentario = ? AND id_usuario = ?",
      [id_comentario, id_usuario]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        mensaje:
          "Comentario no encontrado o no tienes permiso para eliminarlo.",
      });
    }

    await pool.query("DELETE FROM comentarios WHERE id_comentario = ?", [
      id_comentario,
    ]);

    res.status(200).json({ mensaje: "Comentario eliminado con éxito." });
  } catch (error) {
    console.error("Error al eliminar comentario:", error);
    res.status(500).json({ mensaje: "Error al eliminar comentario." });
  }
};
