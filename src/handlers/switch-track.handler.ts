import { Socket } from 'socket.io';
import { SOCKET_EVENTS } from '../configuration';

export default (socket: Socket, data: any) => {
  console.log('inc', data);
  socket.broadcast.emit(
    SOCKET_EVENTS.SWITCH_TRACK,
    {
      data,
    },
  );
};
