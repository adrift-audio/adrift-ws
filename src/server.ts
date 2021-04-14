import { createServer, Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';

import {
  ALLOWED_ORIGINS,
  ENV,
  PORT,
  SOCKET_EVENTS,
} from './configuration';
import log from './utilities/log';

const httpServer: HTTPServer = createServer();
const io = new Server(
  httpServer,
  {
    cors: {
      origin: ALLOWED_ORIGINS,
      credentials: true,
    },
  },
);

io.on(SOCKET_EVENTS.CONNECTION, (socket: Socket) => log(`connected ${socket.id}`));

httpServer.listen(
  PORT,
  () => log(`-- ADRIFT-WS is running on port ${PORT} [${ENV.toUpperCase()}]`),
);
