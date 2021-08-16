import { Socket } from 'socket.io';

import { CLIENT_TYPES, SOCKET_EVENTS } from '../configuration';
import { Identifiers } from '../types';
import { SwitchTrackData } from './types';

export default (
  socket: Socket,
  data: SwitchTrackData,
  identifiers: Identifiers,
): boolean => socket.to(identifiers.userId).emit(
  SOCKET_EVENTS.SWITCH_TRACK,
  {
    ...data,
    issuer: identifiers.client,
    target: CLIENT_TYPES.mobile,
  },
);
