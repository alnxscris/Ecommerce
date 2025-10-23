// src/pages/Cart.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/pages/cart.css';

const readCart = () => {
  try { return JSON.parse(localStorage.getItem("cart") || "[]"); }
  catch { return []; }
};
const writeCart = (cart) => localStorage.setItem("cart", JSON.stringify(cart));

const money = (n) => `S/. ${n.toFixed(2).replace(/\.00$/, "")}`;
const whenLabel = (iso) => {
  const d = new Date(iso);
  const f = d.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
  const h = d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
  return `${f} • ${h}`;
};

const SHIPPING_FLAT = 7; // mock

const CartItem = ({ item, onInc, onDec, onRemove }) => (
  <article className="cart-item">
    <figure className="cart-item__media">
      <img src={item.image} alt={item.title} />
    </figure>

    <div className="cart-item__main">
      <h4 className="cart-item__title">{item.title}</h4>
      <small className="cart-item__when">{whenLabel(item.deliveryAt)}</small>
    </div>

    <div className="cart-item__price">{money(item.price)}</div>

    <div className="cart-item__qty">
      <button aria-label="Disminuir" onClick={onDec} disabled={item.qty <= 1}>−</button>
      <span aria-live="polite">{item.qty}</span>
      <button aria-label="Aumentar" onClick={onInc}>+</button>
    </div>

    <div className="cart-item__total">{money(item.price * item.qty)}</div>

    <button className="cart-item__remove" aria-label="Eliminar" onClick={onRemove}>🗑️</button>
  </article>
);

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => readCart());

  // sincronizar con localStorage ante cambios
  useEffect(() => { writeCart(items); }, [items]);

  const subtotal = useMemo(
    () => items.reduce((acc, i) => acc + i.price * i.qty, 0),
    [items]
  );
  const shipping = items.length > 0 ? SHIPPING_FLAT : 0;
  const total = subtotal + shipping;

  const inc = (idx) =>
    setItems((prev) => prev.map((i, k) => (k === idx ? { ...i, qty: i.qty + 1 } : i)));
  const dec = (idx) =>
    setItems((prev) =>
      prev.map((i, k) => (k === idx ? { ...i, qty: Math.max(1, i.qty - 1) } : i))
    );
  const remove = (idx) =>
    setItems((prev) => prev.filter((_, k) => k !== idx));
  const clear = () => setItems([]);

  if (items.length === 0) {
    return (
      <section className="cart-page cart-empty">
        <h2>Tu carrito está vacío</h2>
        <p>Explora nuestros <Link to="/regalos">regalos</Link> y agrega tus favoritos.</p>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="cart-grid">
        {/* Lista */}
        <div className="cart-list">
          <header className="cart-list__head">
            <h2>Carrito</h2>
            <button className="link-danger" onClick={clear}>Vaciar</button>
          </header>

          <div className="cart-list__items">
            {items.map((it, idx) => (
              <CartItem
                key={`${it.id}-${it.deliveryAt}-${idx}`}
                item={it}
                onInc={() => inc(idx)}
                onDec={() => dec(idx)}
                onRemove={() => remove(idx)}
              />
            ))}
          </div>
        </div>

        {/* Resumen */}
        <aside className="cart-summary">
          <h3>Resumen de compra</h3>
          <dl className="summary-rows">
            <div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
            <div><dt>Envío</dt><dd>{money(shipping)}</dd></div>
            <div className="summary-total"><dt>Total</dt><dd>{money(total)}</dd></div>
          </dl>

          <button className="btn btn--primary btn--block" onClick={() => navigate("/envio")}>
          Procede al pago
          </button>
        </aside>
      </div>
    </section>
  );
}
