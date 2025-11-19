// src/services/comments.js
import { api } from "./api";

export async function getComments() {
  return await api.get("/api/comments");
}

export async function createComment(data) {
  return await api.post("/api/comments/create", data);
}

export async function deleteComment(id_comentario, id_usuario) {
  return await api.delete(`/api/comments/${id_comentario}`, { id_usuario });
}