//src/services/api.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
// Asegúrate que VITE_API_BASE_URL apunte al puerto correcto de tu backend (por ejemplo, http://localhost:4000)

export const api = {
  get: async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}`);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw data || { mensaje: "Error al obtener datos (GET)." };
    }
    // Devolvemos directamente el JSON (no res.data)
    return data;
  },

  post: async (endpoint, data) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw json || { mensaje: "Error en la petición (POST)." };
    }
    return json;
  },

  put: async (endpoint, data) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw json || { mensaje: "Error en la petición (PUT)." };
    return json;
  },

  delete: async (endpoint, data) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: data ? { "Content-Type": "application/json" } : undefined,
      body: data ? JSON.stringify(data) : undefined,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw json || { mensaje: "Error en la petición (DELETE)." };
    return json;
  },
};
