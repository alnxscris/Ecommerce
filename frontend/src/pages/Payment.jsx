import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/payment.css";

export default function Payment() {
  const navigate = useNavigate();
  const shipping = useMemo(() => {
    const raw = localStorage.getItem("shipping");
    return raw ? JSON.parse(raw) : null;
  }, []);

  useEffect(() => {
    // Si llegan directo sin llenar datos, redirige
    if (!shipping) navigate("/envio");
  }, [shipping, navigate]);

  const handleConfirm = () => {
    // Aquí solo simulamos la confirmación
    alert("¡Gracias! Confirmamos tu pago. Te contactaremos para la entrega.");
    localStorage.removeItem("cart");
    // Podrías guardar una orden en backend aquí si tuvieras API
    navigate("/home");
  };

  return (
    <section className="payment-page">
      <h2 className="payment-title">Paga con Yape </h2>

      <div className="qr-card">
        <img src="/images/imagen19.jpg" alt="Código QR para pagar" className="qr-img" />
        <p className="qr-hint">
          Confirma tu pago únicamente después de haber completado la transacción.
        </p>
      </div>

      <button className="btn btn--primary btn--block" onClick={handleConfirm}>
        Confirmar pago
      </button>
    </section>
  );
}
