import express from "express";
import cors from "cors";
import morgan from "morgan";
import apiRouter from "./routes/index";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.json';
import { securityMiddleware } from './middleware/security';
import { requestId } from './middleware/requestId';
import { errorHandler } from './middleware/error.middleware';
import { env } from './config/env';
import { logger } from './common/logger';
import { sendSuccess } from './utils';
import healthRouter from './routes/health.route';

const app = express();

app.use(requestId);
app.use(cors({ origin: true, credentials: true }));
app.use(...securityMiddleware);
app.use(morgan("combined"));
app.use(express.json());

app.use('/health', healthRouter);
app.use("/api", apiRouter);
app.use('/api/v1', apiRouter);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (_req, res) => sendSuccess(res, { message: "Progloss backend" }));

app.use(errorHandler);

logger.info({ env: env.NODE_ENV }, 'app configured');

export default app;
