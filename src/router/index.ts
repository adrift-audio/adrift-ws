import { Socket } from 'socket.io';

import handlePlayNext from '../handlers/play-next.handler';
import handlePlayPause from '../handlers/play-pause.handler';
import handlePlayPrevious from '../handlers/play-previous.handler';
import { SOCKET_EVENTS } from '../configuration';

export default (socket: Socket): void => {
  socket.on(SOCKET_EVENTS.PLAY_NEXT, handlePlayNext);
  socket.on(SOCKET_EVENTS.PLAY_PAUSE, handlePlayPause);
  socket.on(SOCKET_EVENTS.PLAY_PREVIOUS, handlePlayPrevious);
};
