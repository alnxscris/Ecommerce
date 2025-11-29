// server.js
import dotenv from "dotenv";
import connectMongoDB from "./src/mongoDB.js";
import app from "./src/app.js"; // Importamos la app configurada

dotenv.config();
const PORT = process.env.PORT || 3000;

connectMongoDB();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});