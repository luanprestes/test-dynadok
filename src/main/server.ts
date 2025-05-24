import express from 'express';
import { registerRoutes } from './routes';
import { connectMongo } from '../infra/database/mongodb';

async function startApplication() {
  await connectMongo();

  const app = express();
  app.use(express.json());
  await registerRoutes(app);

  const port = process.env['PORT'] ?? 3000;
  app.listen(port, () => console.log(`🚀 HTTP server running on port ${port}`));
}

startApplication().catch((err) => {
  console.error('❌ Failed to start HTTP server:', err);
  process.exit(1);
});
