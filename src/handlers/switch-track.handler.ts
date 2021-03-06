import { Socket } from 'socket.io';

import { CLIENT_TYPES, SOCKET_EVENTS } from '../configuration';
import { Identifiers } from '../types';
import { SwitchTrackPayload } from './types';

export default function switchTrack(
  socket: Socket,
  identifiers: Identifiers,
  payload: SwitchTrackPayload,
): boolean {
  return socket.to(identifiers.userId).emit(
    SOCKET_EVENTS.SWITCH_TRACK,
    {
      issuer: identifiers.client,
      link: payload.link,
      target: CLIENT_TYPES.mobile,
      track: payload.track,
    },
  );
}
