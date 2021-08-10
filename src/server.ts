import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import {
  ALLOWED_ORIGINS,
  ENV,
  PORT,
  REDIS,
  SOCKET_EVENTS,
} from './configuration';
import authorize from './middlewares/authorize';
import gracefulShutdown from './utilities/graceful-shutdown';
import log from './utilities/log';
import { redisClient } from './utilities/redis';
import router from './router';

const httpServer = createServer();
const io = new Server(
  httpServer,
  {
    cors: {
      credentials: true,
      origin: ALLOWED_ORIGINS,
    },
  },
);

io.use(authorize);

io.on(SOCKET_EVENTS.CONNECTION, (connection: Socket): void => router(connection));

redisClient.on(REDIS.EVENTS.CONNECT, () => log('-- redis: connected'));

process.on('SIGTERM', (signal: string): Error | void => gracefulShutdown(signal, io, redisClient));
process.on('SIGINT', (signal: string): Error | void => gracefulShutdown(signal, io, redisClient));

httpServer.listen(
  PORT,
  (): void => log(`-- ADRIFT-WS is running on port ${PORT} [${ENV.toUpperCase()}]`),
);
