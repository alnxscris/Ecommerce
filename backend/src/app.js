import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import metricsRoutes from "./routes/metrics.js";
import nodesRoutes from "./routes/nodes.js";
import authRoutes from "./routes/auth.js"; //autenticacion 

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/nodes", nodesRoutes);

app.get('/status', (req, res) => {
  res.json({ status: 'Servidor operativo y escuchando conexiones.' });
});

export default app;