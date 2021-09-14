import { Socket } from 'socket.io';

import { CLIENT_TYPES, SOCKET_EVENTS } from '../configuration';
import { Identifiers } from '../types';
import { RemoveAllPayload } from './types';

export default function removeAll(
  socket: Socket,
  identifiers: Identifiers,
  payload: RemoveAllPayload,
): void {
  const { issuer, target } = payload;
  if (issuer !== CLIENT_TYPES.web && target !== CLIENT_TYPES.web) {
    socket.to(identifiers.userId).emit(
      SOCKET_EVENTS.REMOVE_ALL,
      {
        issuer: identifiers.client,
        target,
      },
    );
  }
}
