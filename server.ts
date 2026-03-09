import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import storeRoutes from './server/routes/storeRoutes.js';
import adminRoutes from './server/routes/adminRoutes.js';
import productRoutes from './server/routes/productRoutes.js';
import paymentRoutes from './server/routes/paymentRoutes.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.use('/api/store', storeRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/payment', paymentRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
