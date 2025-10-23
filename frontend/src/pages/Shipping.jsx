import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/shipping.css";

export default function Shipping() {
  const navigate = useNavigate();

  // 🧹 Limpiar los datos guardados al entrar o refrescar
  useEffect(() => {
    localStorage.removeItem("shipping");
  }, []);

  // Si no hay carrito, vuelve a regalos
  const cart = useMemo(() => {
    const raw = localStorage.getItem("cart");
    return raw ? JSON.parse(raw) : [];
  }, []);
  useEffect(() => {
    if (!cart.length) navigate("/regalos");
  }, [cart, navigate]);

  // Campos del formulario
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Estados de interacción y submit
  const [touchedName, setTouchedName] = useState(false);
  const [touchedPhone, setTouchedPhone] = useState(false);
  const [touchedAddress, setTouchedAddress] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Validaciones
  const isValidName = fullName.trim().length >= 4;
  const isValidPhone = /^\+?51?\s?9\d{8}$/.test(phone.trim()); // +51 9xxxxxxxx o 51 9xxxxxxxx
  const isValidAddress = address.trim().length >= 6;
  const isFormValid = isValidName && isValidPhone && isValidAddress;

  // Mostrar errores
  const showNameError = (touchedName || submitted) && !isValidName;
  const showPhoneError = (touchedPhone || submitted) && !isValidPhone;
  const showAddressError = (touchedAddress || submitted) && !isValidAddress;

  const handleNext = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isFormValid) return;

    // Guardar datos (solo para el flujo actual, no se mantienen al refrescar)
    localStorage.setItem(
      "shipping",
      JSON.stringify({
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
      })
    );

    navigate("/pago");
  };

  // Texto del aviso general
  const missing = [];
  if (submitted && !isValidName) missing.push("nombre");
  if (submitted && !isValidPhone) missing.push("celular (+51 9XXXXXXXX)");
  if (submitted && !isValidAddress) missing.push("dirección");

  return (
    <section className="checkout-page">
      <h2 className="checkout-title">Datos del destinatario</h2>

      <form className="form" onSubmit={handleNext} noValidate>
        <div className="grid-2">
          {/* Nombre */}
          <label className="field">
            <span>Nombre Completo</span>
            <input
              type="text"
              placeholder="Nombres y apellidos"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={() => setTouchedName(true)}
              aria-invalid={showNameError}
            />
            <small
              className={`msg ${showNameError ? "is-visible" : ""}`}
              aria-live="polite"
            >
              {showNameError
                ? "Ingresa un nombre válido (mínimo 4 caracteres)."
                : "\u00A0"}
            </small>
          </label>

          {/* Celular */}
          <label className="field">
            <span>Celular</span>
            <input
              type="tel"
              placeholder="+51 9xxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => setTouchedPhone(true)}
              aria-invalid={showPhoneError}
            />
            <small
              className={`msg ${showPhoneError ? "is-visible" : ""}`}
              aria-live="polite"
            >
              {showPhoneError
                ? "Formato válido: +51 9XXXXXXXX (9 y 8 dígitos más)."
                : "\u00A0"}
            </small>
          </label>
        </div>

        {/* Dirección */}
        <label className="field">
          <span>Dirección</span>
          <input
            type="text"
            placeholder="Calle, número, referencia"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onBlur={() => setTouchedAddress(true)}
            aria-invalid={showAddressError}
          />
          <small
            className={`msg ${showAddressError ? "is-visible" : ""}`}
            aria-live="polite"
          >
            {showAddressError
              ? "Ingresa una dirección más detallada (mínimo 6 caracteres)."
              : "\u00A0"}
          </small>
        </label>

        {/* Aviso general */}
        {submitted && !isFormValid && (
          <p className="hint" role="alert">
            Falta completar: {missing.join(", ")}.
          </p>
        )}

        <button
          className="btn btn--block btn--primary"
          type="submit"
          disabled={!isFormValid}
        >
          Siguiente <span className="btn-arrow" aria-hidden>›</span>
        </button>
      </form>
    </section>
  );
}
