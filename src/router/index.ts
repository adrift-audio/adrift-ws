import { Socket } from 'socket.io';

import handlePlayNext from '../handlers/play-next.handler';
import handlePlayPause from '../handlers/play-pause.handler';
import handlePlayPrevious from '../handlers/play-previous.handler';
import handleSwitchTrack from '../handlers/switch-track.handler';
import log from '../utilities/log';
import { SOCKET_EVENTS } from '../configuration';

export default function router(socket: Socket): void {
  log(`-- connected ${socket.id}`);
  socket.on(SOCKET_EVENTS.PLAY_NEXT, () => handlePlayNext(socket));
  socket.on(SOCKET_EVENTS.PLAY_PAUSE, () => handlePlayPause(socket));
  socket.on(SOCKET_EVENTS.PLAY_PREVIOUS, () => handlePlayPrevious(socket));
  socket.on(SOCKET_EVENTS.SWITCH_TRACK, (data) => handleSwitchTrack(socket, data));
}
