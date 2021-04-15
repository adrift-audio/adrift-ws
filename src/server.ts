import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import {
  ALLOWED_ORIGINS,
  ENV,
  PORT,
  SOCKET_EVENTS,
} from './configuration';
import log from './utilities/log';

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

io.on(SOCKET_EVENTS.CONNECTION, (connection: Socket): void => {
  log(`connected ${connection.id}`);

  connection.on(SOCKET_EVENTS.PLAY_NEXT, (): void => {
    log('play next');
  });
});

httpServer.listen(
  PORT,
  (): void => log(`-- ADRIFT-WS is running on port ${PORT} [${ENV.toUpperCase()}]`),
);
