import { Socket } from 'socket.io';

import { CLIENT_TYPES, SOCKET_EVENTS } from '../configuration';
import { Identifiers } from '../types';

export default (
  socket: Socket,
  identifiers: Identifiers,
): boolean => socket.to(identifiers.userId).emit(
  SOCKET_EVENTS.PLAY_NEXT,
  {
    issuer: identifiers.client,
    target: CLIENT_TYPES.desktop,
  },
);
