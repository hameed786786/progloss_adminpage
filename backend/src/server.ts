import { createServer } from 'http';
import app from './app';
import { env } from './config/env';
import { connect } from './config/database';
import { logger } from './common/logger';
import { initSocket } from './integrations/socket';

async function start() {
  const server = createServer(app);
  initSocket(server);

  try {
    await connect();
    logger.info('database connected');
  } catch (error) {
    logger.error({ error }, 'database connection failed before server start');
    process.exit(1);
  }

  // Start MongoDB change stream watchers to broadcast realtime changes
  try {
    const { initMongoWatches } = await import('./integrations/mongoWatch.js');
    initMongoWatches().catch((error) => {
      logger.error({ error }, 'mongo watch initialization failed');
    });
  } catch (err) {
    logger.warn({ err }, 'mongo watch module could not be loaded');
  }

  server.on('error', (error) => {
    logger.error({ error }, 'http server error');
  });

  const shutdown = () => {
    logger.info('shutting down');
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  const port = Number(env.PORT);
  server.listen(port, () => {
    logger.info({ port }, `Progloss backend listening on http://localhost:${port}`);
  });
}

void start();
