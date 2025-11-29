// src/pages/GiftDetails.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/inventory";
import { addToCart as addToCartService } from "../services/cart";
import { commentsMongo } from "../services/commentsMongo";
import "../styles/pages/giftdetails.css";

export default function GiftDetails() {
  const { id } = useParams(); // viene desde /regalos/:id
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [info, setInfo] = useState(""); // mensajes informativos

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error("Producto no encontrado:", err);
        navigate("/regalos");
      }
    };
    if (id) fetchProduct();
  }, [id, navigate]);

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

  const addToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id_usuario) {
      setError("Debes iniciar sesión para agregar productos al carrito.");
      setInfo("");
      navigate("/login");
      return;
    }

    try {
      setError("");
      setInfo("");

      await addToCartService({
        id_usuario: user.id_usuario,
        id_producto: product.id_producto,
        cantidad: qty,
      });

      setInfo("¡Producto agregado al carrito!");
    } catch (err) {
      console.error("Error al agregar al carrito:", err);
      setError("Error al agregar el producto. Intenta de nuevo.");
      setInfo("");
    }
  };

  if (!product) return null;

  return (
    <section className="gift-detail">
      <div className="gift-detail__grid">
        {/* Imagen */}
        <aside className="detail-media">
          <div className="detail-media__frame">
            <img src={product.imagen_url} alt={product.nombre_producto} />
          </div>
        </aside>

        {/* Info */}
        <div className="detail-side">
          <h1 className="detail-title">{product.nombre_producto}</h1>

          <div className="detail-desc">
            <h3>Contiene:</h3>
            <p>{product.descripcion_producto}</p>
          </div>

          <div className="detail-price">S/. {product.precio_producto}</div>

          {/* Cantidad */}
          <div className="qty-stepper">
            <button type="button" onClick={dec} aria-label="Disminuir">
              -
            </button>
            <span aria-live="polite">{qty}</span>
            <button type="button" onClick={inc} aria-label="Aumentar">
              +
            </button>
          </div>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          {info && <p className="info-message">{info}</p>}

          <button className="btn" onClick={addToCart} style={{ marginTop: "0.75rem" }}>
            Agregar al carrito
          </button>
        </div>
      </div>

      {/* 🔽 Sección de comentarios por producto */}
      <CommentsSection productId={product.id_producto} />
    </section>
  );
}

/* ---------------- Sección de comentarios ---------------- */

function CommentsSection({ productId }) {
  const [comments, setComments] = useState([]);
  const [texto, setTexto] = useState("");
  const [rating, setRating] = useState(5);
  const [error, setError] = useState("");
  const [info, setInfo] = useState(""); // mensajes informativos
  const [openReply, setOpenReply] = useState(null); // ID del comentario abierto
  const [replyText, setReplyText] = useState("");


  const loadComments = async () => {
    try {
      const res = await commentsMongo.getByProduct(productId); //con mongodb
      setComments(res.comentarios || []);
      setError("");
    } catch (err) {
      console.error("Error cargando comentarios:", err);
      setError("No se pudieron cargar los comentarios.");
      setInfo("");
    }
  };

  useEffect(() => {
    if (productId) loadComments();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id_usuario) {
      setError("Debes iniciar sesión para comentar.");
      setInfo("");
      return;
    }

    if (!texto.trim()) return;

    try {
      setError("");
      setInfo("");

      await commentsMongo.create({
        id_usuario: user.id_usuario,
        nombre_usuario: user.nombre_usuario,
        id_producto: productId,
        texto_comentario: texto,
        calificacion: rating,
      });

      setTexto("");
      setRating(5);
      setInfo("Comentario publicado con éxito.");
      await loadComments();
    } catch (err) {
      console.error("Error creando comentario:", err);
      const msg =
        err?.mensaje ||
        err?.response?.data?.mensaje ||
        "No se pudo enviar tu comentario. Intenta otra vez.";
      setError(msg);
      setInfo("");
    }
  };

     const handleReply = async (e, id_comentario) => {
      e.preventDefault();

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id_usuario) {
        setError("Debes iniciar sesión para responder.");
        return;
      }

      if (replyText.trim().length < 5) {
        setError("La respuesta debe tener al menos 5 caracteres.");
        return;
      }

      try {
        await commentsMongo.addReply(id_comentario, {
          id_usuario: user.id_usuario,
          nombre_usuario: user.nombre_usuario,
          texto: replyText,
        });

        setReplyText("");
        setOpenReply(null);
        await loadComments();
      } catch (err) {
        console.error("Error creando respuesta:", err);
        setError("No se pudo enviar la respuesta.");
      }
    };

  const handleDelete = async (id_comentario) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id_usuario) {
      setError("Debes iniciar sesión para eliminar comentarios.");
      setInfo("");
      return;
    }

    try {
      setError("");
      await commentsMongo.delete(id_comentario, user.id_usuario);
      setInfo("Comentario eliminado.");
      await loadComments();
    } catch (err) {
      console.error("Error eliminando comentario:", err);
      setError("No se pudo eliminar el comentario.");
      setInfo("");
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <section className="comments-section">
      <h2>Opiniones sobre este producto</h2>

      {error && <p className="error">{error}</p>}
      {info && <p className="info-message">{info}</p>}

      {/* 👉 PRIMERO el formulario, dentro de una tarjeta */}
      <form className="comment-form" onSubmit={handleSubmit}>
        <label className="comment-field">
          <span>Calificación:</span>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <label className="comment-field">
          <span>Tu comentario:</span>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe tu opinión sobre este producto..."
          />
        </label>

        <button type="submit" className="btn comment-submit">
          Enviar comentario
        </button>
      </form>

      {/* DEBAJO, la lista de comentarios, cada uno en su tarjeta */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="comments-empty">Aún no hay comentarios.</p>
        ) : (
          comments.map((c) => (
            <article key={c._id} className="comment-card">
              <header className="comment-header">
                <div>
                  <h4 className="comment-author">{c.nombre_usuario || "Cliente"}</h4>
                  <span className="comment-rating">⭐ {c.calificacion}</span>
                </div>
              </header>

              <p className="comment-text">{c.texto_comentario}</p>

              {/*Acciones del comentario */}
              <div className="comment-actions">
                <button
                  type="button"
                  className="btn-reply"
                  onClick={() => setOpenReply(openReply === c._id ? null : c._id)}
                >
                  Responder
                </button>

                {user?.id_usuario === c.id_usuario && (
                  <button
                    type="button"
                    className="btn-delete-comment"
                    onClick={() => handleDelete(c._id)}
                  >
                    Eliminar
                  </button>
                )}
              </div>

              {/*Formulario de respuesta (si está abierto) */}
              {openReply === c._id && (
                <form
                  className="reply-form"
                  onSubmit={(e) => handleReply(e, c._id)}
                >
                  <textarea
                    placeholder="Escribe una respuesta..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button type="submit" className="btn-reply-submit">Enviar</button>
                </form>
              )}

              {/*Renderizar respuestas */}
              {c.respuestas?.length > 0 && (
                <div className="reply-list">
                  {c.respuestas.map((r) => (
                    <div key={r._id} className="reply-item">
                      <div className="reply-content">
                        <strong>{r.nombre_usuario}</strong> — {r.texto}
                      </div>

                      {user?.id_usuario === r.id_usuario && (
                        <button
                          className="btn-delete-reply"
                          onClick={() =>
                            commentsMongo
                              .deleteReply(c._id, r._id, user.id_usuario)
                              .then(loadComments)
                          }
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </article>

          ))
        )}
      </div>
    </section>
  );
}

/* ---------------- Sección de comentarios ---------------- */

function CommentsSection({ productId }) {
  const [comments, setComments] = useState([]);
  const [texto, setTexto] = useState("");
  const [rating, setRating] = useState(5);
  const [error, setError] = useState("");
  const [info, setInfo] = useState(""); // mensajes informativos

  const loadComments = async () => {
    try {
      const res = await getComments(productId);
      setComments(res.comentarios || []);
      setError("");
    } catch (err) {
      console.error("Error cargando comentarios:", err);
      setError("No se pudieron cargar los comentarios.");
      setInfo("");
    }
  };

  useEffect(() => {
    if (productId) loadComments();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id_usuario) {
      setError("Debes iniciar sesión para comentar.");
      setInfo("");
      return;
    }

    if (!texto.trim()) return;

    try {
      setError("");
      setInfo("");

      await createComment({
        id_usuario: user.id_usuario,
        id_producto: productId,
        texto_comentario: texto,
        calificacion: rating,
      });

      setTexto("");
      setRating(5);
      setInfo("Comentario publicado con éxito.");
      await loadComments();
    } catch (err) {
      console.error("Error creando comentario:", err);
      const msg =
        err?.mensaje ||
        err?.response?.data?.mensaje ||
        "No se pudo enviar tu comentario. Intenta otra vez.";
      setError(msg);
      setInfo("");
    }
  };

  const handleDelete = async (id_comentario) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id_usuario) {
      setError("Debes iniciar sesión para eliminar comentarios.");
      setInfo("");
      return;
    }

    try {
      setError("");
      await deleteComment(id_comentario, user.id_usuario);
      setInfo("Comentario eliminado.");
      await loadComments();
    } catch (err) {
      console.error("Error eliminando comentario:", err);
      setError("No se pudo eliminar el comentario.");
      setInfo("");
    }
  };

  return (
    <section className="comments-section">
      <h2>Opiniones sobre este producto</h2>

      {error && <p className="error">{error}</p>}
      {info && <p className="info-message">{info}</p>}

      {/* 👉 PRIMERO el formulario, dentro de una tarjeta */}
      <form className="comment-form" onSubmit={handleSubmit}>
        <label className="comment-field">
          <span>Calificación:</span>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <label className="comment-field">
          <span>Tu comentario:</span>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe tu opinión sobre este producto..."
          />
        </label>

        <button type="submit" className="btn comment-submit">
          Enviar comentario
        </button>
      </form>

      {/* 👉 DEBAJO, la lista de comentarios, cada uno en su tarjeta */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="comments-empty">Aún no hay comentarios.</p>
        ) : (
          comments.map((c) => (
            <article key={c.id_comentario} className="comment-card">
              <header className="comment-header">
                <div>
                  <h4 className="comment-author">
                    {c.nombre_usuario || "Cliente"}
                  </h4>
                  <span className="comment-rating">⭐ {c.calificacion}</span>
                </div>
              </header>

              <p className="comment-text">{c.texto_comentario}</p>

              <div className="comment-actions">
                <button
                  type="button"
                  className="btn-delete-comment"
                  onClick={() => handleDelete(c.id_comentario)}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
