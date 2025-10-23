import { useRef, useState } from "react";
import ProductCard from "../components/ui/ProductCard";
import { SECTIONS } from "../services/products";
import "../styles/pages/gifts.css";

const Row = ({ title, items, onOpen }) => {
  const scrollerRef = useRef(null);
  const scrollBy = (dir) =>
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <section className="gifts-section">
      <header className="gifts-head">
        <h2 className="gifts-title">{title}</h2>
        <div className="gifts-nav">
          <button className="arrow" aria-label="Anterior" onClick={() => scrollBy(-1)}>‹</button>
          <button className="arrow" aria-label="Siguiente" onClick={() => scrollBy(1)}>›</button>
        </div>
      </header>

      <div className="gifts-row" ref={scrollerRef}>
        {items.map((p, idx) => (
          <ProductCard
            key={`${title}-${idx}`}
            product={p}
            onDetails={() => onOpen(p)}
          />
        ))}
      </div>
    </section>
  );
};

const Gifts = () => {
  const [detail, setDetail] = useState(null); // producto activo para el modal

  return (
    <div className="gifts-page">
      {SECTIONS.map(({ title, items }) => (
        <Row key={title} title={title} items={items} onOpen={setDetail} />
      ))}

      {/* Modal de detalles (solo frontend) */}
      {detail && (
        <div className="modal" role="dialog" aria-modal="true" onClick={() => setDetail(null)}>
          <div className="modal__dialog" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" aria-label="Cerrar" onClick={() => setDetail(null)}>×</button>

            <div className="modal__grid">
              <figure className="modal__media">
                <img src={detail.image} alt={detail.title} />
              </figure>

              <div className="modal__info">
                <h3 className="modal__title">{detail.title}</h3>
                <p className="modal__price">S/. {detail.price}</p>
                <p className="modal__desc">{detail.descripcion}</p>
                <div className="modal__actions">
                  <button className="btn">Añadir al carrito</button>
                  <button className="btn btn--secondary" onClick={() => setDetail(null)}>Cerrar</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Gifts;
