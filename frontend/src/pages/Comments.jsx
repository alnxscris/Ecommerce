import { useEffect, useState } from "react";
import { getComments, createComment, deleteComment } from "../services/comments";
import "../styles/pages/comments.css";

// Componente para mostrar estrellas
const Stars = ({ rating, onRate, readOnly = false }) => {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star ${star <= rating ? 'star--filled' : ''}`}
          onClick={() => !readOnly && onRate(star)}
          disabled={readOnly}
          aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

// Componente para un comentario individual
const CommentCard = ({ comment, currentUserId, onDelete }) => {
  const isOwner = comment.id_usuario === currentUserId;
  const fecha = new Date(comment.creado_en).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <article className="comment-card">
      
      <div className="comment-content">
        <header className="comment-header">
          <div>
            <h4 className="comment-author">{comment.nombre_usuario}</h4>
            <Stars rating={comment.calificacion} readOnly />
          </div>
          {isOwner && (
            <button 
              className="btn-delete"
              onClick={() => onDelete(comment.id_comentario)}
              aria-label="Eliminar comentario"
            >
              🗑️
            </button>
          )}
        </header>
        
        <p className="comment-text">{comment.texto_comentario}</p>
        <time className="comment-date">{fecha}</time>
      </div>
    </article>
  );
};

export default function Comments() {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [calificacion, setCalificacion] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const id_usuario = user?.id_usuario;

  // Cargar comentarios
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { comentarios } = await getComments();
        setComentarios(comentarios);
      } catch (err) {
        console.error("Error al cargar comentarios:", err);
      }
    };
    fetchComments();
  }, []);

  // Agregar comentario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!id_usuario) {
      setError("Debes iniciar sesión para comentar.");
      return;
    }

    if (nuevoComentario.trim().length < 10) {
      setError("El comentario debe tener al menos 10 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await createComment({
        id_usuario,
        texto_comentario: nuevoComentario.trim(),
        calificacion
      });

      // Recargar comentarios
      const { comentarios } = await getComments();
      setComentarios(comentarios);

      // Limpiar formulario
      setNuevoComentario("");
      setCalificacion(5);
      alert("¡Comentario publicado con éxito!");
    } catch (err) {
      console.error("Error al crear comentario:", err);
      setError("No se pudo publicar el comentario.");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar comentario
  const handleDelete = async (id_comentario) => {
    if (!confirm("¿Estás seguro de eliminar este comentario?")) return;

    try {
      await deleteComment(id_comentario, id_usuario);
      setComentarios(comentarios.filter(c => c.id_comentario !== id_comentario));
      alert("Comentario eliminado.");
    } catch (err) {
      console.error("Error al eliminar comentario:", err);
      alert("No se pudo eliminar el comentario.");
    }
  };

  return (
    <section className="comments-page">
      <h2 className="comments-title">Comentarios</h2>

      {/* Formulario para nuevo comentario */}
      {id_usuario ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <h3>Deja tu opinión</h3>
          
          <label>
            <span>Tu calificación:</span>
            <Stars rating={calificacion} onRate={setCalificacion} />
          </label>

          <label>
            <span>Tu comentario:</span>
            <textarea
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              placeholder="Comparte tu experiencia con MiAri Detalles..."
              rows="4"
              required
              minLength="10"
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? "Publicando..." : "Publicar comentario"}
          </button>
        </form>
      ) : (
        <p className="login-prompt">
          <a href="/login">Inicia sesión</a> para dejar tu comentario.
        </p>
      )}

      {/* Lista de comentarios */}
      <div className="comments-list">
        {comentarios.length === 0 ? (
          <p className="no-comments">Aún no hay comentarios. ¡Sé el primero!</p>
        ) : (
          comentarios.map((comment) => (
            <CommentCard
              key={comment.id_comentario}
              comment={comment}
              currentUserId={id_usuario}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </section>
  );
}
