import { Socket } from 'socket.io';

import { Identifiers } from '../types';
import { SOCKET_EVENTS } from '../configuration';

export default function notifyRoom(socket: Socket, identifiers: Identifiers): boolean {
  return socket.to(identifiers.userId).emit(
    SOCKET_EVENTS.CLIENT_CONNECTED,
    {
      client: identifiers.client,
    },
  );
}
