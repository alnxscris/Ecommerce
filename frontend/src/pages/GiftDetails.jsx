import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../services/products";
import "../styles/pages/giftdetails.css";

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};
const toInputDate = (d) =>
  d.toISOString().slice(0, 10); // YYYY-MM-DD

export default function GiftDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useMemo(() => getProduct(id), [id]);

  // fallback si no existe
  useEffect(() => {
    if (!product) navigate("/regalos");
  }, [product, navigate]);


  const [qty, setQty] = useState(1);
  const [dateStr, setDateStr] = useState(""); // YYYY-MM-DD
  const [timeStr, setTimeStr] = useState(""); // HH:mm
  const [error, setError] = useState("");
  const [tried, setTried] = useState(false); // ← el usuario ya intentó agregar

  // Mínimo 48h
  const minDate = useMemo(() => addDays(new Date(), 2), []);
  const minDateStr = toInputDate(minDate); // renombré para evitar conflicto con const minDate

  // Combinar fecha y hora en hora LOCAL
  const combinedDate = useMemo(() => {
    if (!dateStr || !timeStr) return null;

  const [y, m, d] = dateStr.split('-').map(Number);
  const [hh, mm] = timeStr.split(':').map(Number);

  return new Date(y, m - 1, d, hh, mm, 0, 0); // hora LOCAL
  }, [dateStr, timeStr]);

  const isDeliveryValid = useMemo(() => {
    if (!combinedDate) return false;
    return combinedDate.getTime() >= minDate.getTime();
  }, [combinedDate, minDate]);

  useEffect(() => {
  if (!tried) return; // no mostrar nada hasta que intente

  if (!dateStr || !timeStr) {
    setError("Debes seleccionar fecha y hora para agregar el producto al carrito.");
    return;
  }

  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  const delivery = new Date(y, m - 1, d, hh, mm, 0, 0);

  setError(
    delivery.getTime() < minDate.getTime()
      ? "La entrega debe ser con al menos 48 horas de anticipación."
      : ""
  );
  }, [dateStr, timeStr, tried, minDate]);


  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

  const addToCart = () => {
  setTried(true);

  // 1) Validar que haya fecha y hora
  if (!dateStr || !timeStr) {
    setError("Debes seleccionar fecha y hora para agregar el producto al carrito.");
    return;
  }

  // 2) Construir fecha/hora en zona local
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  const delivery = new Date(y, m - 1, d, hh, mm, 0, 0);

  // 3) Validar 48h
  if (delivery.getTime() < minDate.getTime()) {
    setError("La entrega debe ser con al menos 48 horas de anticipación.");
    return;
  }

  // 4) OK → limpiar error y guardar en carrito
  setError("");

  const item = {
    id: product.id,
    title: product.title,
    price: product.price,
    qty,
    deliveryAt: delivery.toISOString(),
    image: product.image,
  };

  const raw = localStorage.getItem("cart");
  const cart = raw ? JSON.parse(raw) : [];
  const idx = cart.findIndex((i) => i.id === item.id && i.deliveryAt === item.deliveryAt);

  if (idx >= 0) cart[idx].qty += qty;
  else cart.push(item);

  localStorage.setItem("cart", JSON.stringify(cart));
  navigate("/carrito");
  };

  if (!product) return null;

  return (
    <section className="gift-detail">
      <div className="gift-detail__grid">
        {/* Imagen */}
        <aside className="detail-media">
          <div className="detail-media__frame">
            <img src={product.image} alt={product.title} />
          </div>
        </aside>

        {/* Info */}
        <div className="detail-side">
          <h1 className="detail-title">{product.title}</h1>

          <div className="detail-desc">
            <h3>Contiene:</h3>
            <p>{product.description}</p>
          </div>

          <div className="detail-price">S/. {product.price}</div>

          {/* Cantidad */}
          <div className="qty-stepper">
            <button type="button" onClick={dec} aria-label="Disminuir">-</button>
            <span aria-live="polite">{qty}</span>
            <button type="button" onClick={inc} aria-label="Aumentar">+</button>
          </div>

          {/* Fecha / Hora */}
          <div className="detail-when">
            <label>
              <span>Fecha</span>
              <input
                type="date"
                min={minDateStr}
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
              />
            </label>

            <label>
              <span>Hora</span>
              <input
                type="time"
                value={timeStr}
                onChange={(e) => setTimeStr(e.target.value)}
              />
            </label>
          </div>

          {error && <p className="error" role="alert">{error}</p>}

          <button className="btn" onClick={addToCart}>
          Agregar al carrito
          </button>
        </div>
      </div>
    </section>
  );
}