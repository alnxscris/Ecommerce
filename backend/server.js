// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import metricsRoutes from './src/routes/metrics.js';
import nodesRoutes from './src/routes/nodes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/status', (req, res) => {
  res.json({ status: 'Servidor operativo y escuchando conexiones.' });
});

app.use('/metrics', metricsRoutes);
app.use('/nodes', nodesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
