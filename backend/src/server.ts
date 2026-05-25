import { createServer } from 'http';
import app from './app';
import { env } from './config/env';
import { connect } from './config/database';
import { logger } from './common/logger';
import { initSocket } from './integrations/socket';

async function start() {
  const server = createServer(app);
  initSocket(server);

  server.listen(Number(env.PORT), () => {
    logger.info({ port: env.PORT }, `Progloss backend listening on http://localhost:${env.PORT}`);
  });

  connect().catch((error) => {
    logger.error({ error }, 'database connection failed after server start');
  });

  // Start MongoDB change stream watchers to broadcast realtime changes
  try {
    const { initMongoWatches } = await import('./integrations/mongoWatch.js');
    initMongoWatches().catch(() => undefined);
  } catch (err) {
    // ignore
  }

  const shutdown = () => {
    logger.info('shutting down');
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

void start();
