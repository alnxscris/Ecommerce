// src/services/comments.js
import { api } from "./api";

/**
 * Obtiene comentarios.
 * - Si pasas productId -> de ese producto.
 * - Si no pasas nada -> todos.
 */
export const getComments = async (productId) => {
  let endpoint = "/api/comments";
  if (productId !== undefined && productId !== null) {
    endpoint += `?productId=${productId}`;
  }
  // api.get devuelve el JSON directo: { comentarios: [...] }
  return await api.get(endpoint);
};

/**
 * Crea un nuevo comentario para un producto
 * data = { id_usuario, id_producto, texto_comentario, calificacion }
 */
export const createComment = async (data) => {
  return await api.post("/api/comments/create", data);
};

/**
 * Elimina un comentario (envía id_usuario en el body)
 */
export const deleteComment = async (id_comentario, id_usuario) => {
  return await api.delete(`/api/comments/${id_comentario}`, {
    id_usuario,
  });
};
