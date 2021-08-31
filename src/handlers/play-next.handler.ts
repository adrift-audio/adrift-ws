import { Socket } from 'socket.io';

import { CLIENT_TYPES, SOCKET_EVENTS } from '../configuration';
import { Identifiers } from '../types';
import { PlayNextPayload } from './types';

export default function playNext(
  socket: Socket,
  identifiers: Identifiers,
  payload: PlayNextPayload,
): boolean {
  return socket.to(identifiers.userId).emit(
    SOCKET_EVENTS.PLAY_NEXT,
    {
      id: payload.id,
      issuer: identifiers.client,
      target: CLIENT_TYPES.desktop,
    },
  );
}
