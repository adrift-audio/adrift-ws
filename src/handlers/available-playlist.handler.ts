import { Socket } from 'socket.io';

import { AvailablePlaylistPayload } from './types';
import { CLIENT_TYPES, SOCKET_EVENTS } from '../configuration';
import { Identifiers } from '../types';

export default function availablePlaylist(
  socket: Socket,
  identifiers: Identifiers,
  payload: AvailablePlaylistPayload,
): boolean {
  return socket.to(identifiers.userId).emit(
    SOCKET_EVENTS.AVAILABLE_PLAYLIST,
    {
      issuer: identifiers.client,
      playlist: payload.playlist,
      target: CLIENT_TYPES.mobile,
    },
  );
}
