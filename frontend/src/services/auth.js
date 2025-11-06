import { api } from "./api";

//registrar nuevo usuario
export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res;
};

//iniciar sesión
export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);

  //guarda el token en localStorage
  if (res.token) {
    localStorage.setItem("token", res.token);
  }

  return res;
};

//obtener token actual
export const getToken = () => localStorage.getItem("token");

//cerrar sesión
export const logout = () => localStorage.removeItem("token");