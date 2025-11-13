import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ui/ProductCard";
import { getInventory } from "../services/inventory";
import "../styles/pages/gifts.css";

const Row = ({ title, items, navigate}) => {
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
        {items.map((p) => (
          <ProductCard
            key={p.id_producto}
            product={{
              id: p.id_producto,
              title: p.nombre_producto,
              price: p.precio_producto,
              image: p.imagen_url,
              descripcion: p.descripcion_producto,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default function Gifts() {
  const [products, setProducts] = useState([]);
  const [detail, setDetail] = useState(null); // producto activo para el modal
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const { inventario } = await getInventory();
        setProducts(inventario);
      } catch (err) {
        console.error("Error al cargar productos:", err);
      }
    };
    fetchInventory();
  }, []);

  return (
    <div className="gifts-page">
        <Row
          title="Regalos disponibles"
          items={products} 
          navigate={navigate} 
          onOpen={(p) => navigate(`/regalos/${p.id_producto}`)} />

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