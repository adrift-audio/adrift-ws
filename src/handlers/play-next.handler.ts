import { Socket } from 'socket.io';
import { SOCKET_EVENTS } from '../configuration';

export default (socket: Socket) => socket.broadcast.emit(
  SOCKET_EVENTS.PLAY_NEXT,
  // TODO: pass a custom object with data (target, issuer)
);
