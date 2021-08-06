import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import {
  ALLOWED_ORIGINS,
  ENV,
  PORT,
  SOCKET_EVENTS,
} from './configuration';
import authorize from './middlewares/authorize';
import { RedisClient } from './utilities/redis';
import log from './utilities/log';
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

io.on(SOCKET_EVENTS.CONNECTION, (connection: Socket): void => router(connection, io));

RedisClient.on('connect', () => log('-- redis: connected'));

httpServer.listen(
  PORT,
  (): void => log(`-- ADRIFT-WS is running on port ${PORT} [${ENV.toUpperCase()}]`),
);
