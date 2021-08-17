import { Socket } from 'socket.io';

import { Identifiers } from '../types';
import { CLIENT_TYPES, SOCKET_EVENTS } from '../configuration';

export default function playPrevious(socket: Socket, identifiers: Identifiers): boolean {
  return socket.broadcast.emit(
    SOCKET_EVENTS.PLAY_PREVIOUS,
    {
      issuer: identifiers.client,
      target: CLIENT_TYPES.desktop,
    },
  );
}
