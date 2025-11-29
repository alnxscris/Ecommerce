// backend/src/models/comment.js
import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  id_usuario: {
    type: Number,
    required: true
  },
  nombre_usuario: {
    type: String,
    required: true
  },
  texto: {
    type: String,
    required: true,
    minlength: 5
  },
  creado_en: {
    type: Date,
    default: Date.now
  }
});

const commentSchema = new mongoose.Schema({
  id_producto: {
    type: Number,
    required: true,
    index: true  // Índice para búsquedas rápidas por producto
  },
  id_usuario: {
    type: Number,
    required: true
  },
  nombre_usuario: {
    type: String,
    required: true
  },
  texto_comentario: {
    type: String,
    required: true,
    minlength: 10
  },
  calificacion: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  respuestas: [replySchema],  // Array de réplicas
  creado_en: {
    type: Date,
    default: Date.now
  }
});

// Índice compuesto para consultas eficientes
commentSchema.index({ id_producto: 1, creado_en: -1 });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;