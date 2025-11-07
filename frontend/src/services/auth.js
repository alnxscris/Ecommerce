import { api } from "./api";

//registrar nuevo usuario
export const registerUser = async (data) => {
  const res = await api.post("/api/auth/register", data);
  return res;
};

//iniciar sesión
export const loginUser = async (data) => {
  try {
    const res = await api.post("/api/auth/login", data);

    //guarda el token en localStorage
    if (res.token) {
      localStorage.setItem("token", res.token);
    }
    return res;
  } catch (err) {
    throw err.response?.data || { mensaje: "Error desconocido." };
  }
};

//obtener token actual
export const getToken = () => localStorage.getItem("token");

//cerrar sesión
export const logout = () => localStorage.removeItem("token");