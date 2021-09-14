import { Socket } from 'socket.io';

import { SOCKET_EVENTS } from '../configuration';
import { Identifiers } from '../types';
import { ErrorPayload } from './types';

export default function errorHandler(
  socket: Socket,
  identifiers: Identifiers,
  payload: ErrorPayload,
): boolean {
  const { error, target } = payload;
  return socket.to(identifiers.userId).emit(
    SOCKET_EVENTS.ERROR,
    {
      error,
      issuer: identifiers.client,
      target,
    },
  );
}
