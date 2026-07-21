import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import resumeRoutes from './server/routes/resumeRoutes.js';

// Resolve directory paths in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// Apply global middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Register API routes
app.use('/api/resume', resumeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Serve frontend build in production
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));

  // Fallback to React index.html for clientside routing
  app.get('*', (req, res, next) => {
    // If request is an API request, delegate to router or 404
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start listening on correct port
const PORT = isProduction ? 3000 : 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Fullstack App] Server running in ${isProduction ? 'production' : 'development'} mode on port ${PORT}`);
});
