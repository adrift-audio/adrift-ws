import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import {
  ALLOWED_ORIGINS,
  ENV,
  PORT,
  SOCKET_EVENTS,
} from './configuration';
import { client as redis } from './utilities/redis';
import log from './utilities/log';
import router from './router';

const httpServer = createServer();
const io = new Server(
  httpServer,
  {
    cors: {
      origin: ALLOWED_ORIGINS,
      credentials: true,
    },
  },
);

io.on(SOCKET_EVENTS.CONNECTION, (connection: Socket): void => router(connection));

redis.on('connect', () => log('-- redis: connected'));

httpServer.listen(
  PORT,
  (): void => log(`-- ADRIFT-WS is running on port ${PORT} [${ENV.toUpperCase()}]`),
);
