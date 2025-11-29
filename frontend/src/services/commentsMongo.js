// src/services/commentsMongo.js
import { api } from "./api";

export const commentsMongo = {
  getByProduct: async (id_producto) => {
    return await api.get(`/api/comments-mongo/producto/${id_producto}`);
  },

  create: async (body) => {
    return await api.post(`/api/comments-mongo/create`, body);
  },

  delete: async (id_comentario, id_usuario) => {
    return await api.delete(`/api/comments-mongo/${id_comentario}`, {
      id_usuario: Number(id_usuario),
    });
  },

  addReply: async (id_comentario, body) => {
    return await api.post(`/api/comments-mongo/${id_comentario}/reply`, body);
  },

  deleteReply: async (id_comentario, id_respuesta, id_usuario) => {
    return await api.delete(`/api/comments-mongo/${id_comentario}/reply/${id_respuesta}`, {
      id_usuario: Number(id_usuario),
    });
  },
};

