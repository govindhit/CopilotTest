

import express, { Application } from 'express';
import healthRoutes from './routes/health.routes';
import taskRoutes from './routes/task.routes';
import { errorHandler } from './middleware/errorHandler';
import logger from './middleware/logger';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
	const start = Date.now();
	res.on('finish', () => {
		const duration = Date.now() - start;
		logger.info(`[${req.method}] ${req.originalUrl} - Execution time: ${duration}ms`);
	});
	next();
});

// Routes

app.use('/', healthRoutes);
app.use('/tasks', taskRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
