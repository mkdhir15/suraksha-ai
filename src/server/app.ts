import express, { Express, Request, Response } from 'express';
import path from 'path';
import { configureSecurityHeaders, configureCors } from './middleware/security';
import { safetyRateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import safetyRoutes from './routes/safety.routes';

export function createApp(): Express {
  const app: Express = express();

  // Basic security middleware
  app.use(configureSecurityHeaders);
  app.use(configureCors);
  app.use(express.json());

  // CRITICAL REQUIREMENT: /healthz MUST be registered BEFORE rate limiters / auth middleware
  app.get('/healthz', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      service: 'Suraksha AI Guardian Engine',
      timestamp: new Date().toISOString(),
    });
  });

  // Apply rate limiter to /api/safety/*
  app.use('/api/safety', safetyRateLimiter);
  app.use('/api/safety', safetyRoutes);

  // Serve static assets from build output in production
  const staticPath = path.join(process.cwd(), 'dist');
  app.use(express.static(staticPath));

  // SPA Fallback for client routes
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(staticPath, 'index.html'), (err) => {
      if (err) {
        res.status(404).send('Suraksha AI Application Asset Not Found');
      }
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
