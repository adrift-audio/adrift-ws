import { Server, Socket } from 'socket.io';

import handleDisconnect from '../handlers/disconnect.handler';
import handlePlayNext from '../handlers/play-next.handler';
import handlePlayPause from '../handlers/play-pause.handler';
import handlePlayPrevious from '../handlers/play-previous.handler';
import handleSwitchTrack from '../handlers/switch-track.handler';
import { Identifiers } from '../types';
import log from '../utilities/log';
import { SOCKET_EVENTS } from '../configuration';
import store from '../store';

export default async function router(io: Server, socket: Socket): Promise<void> {
  const identifiers = store.getStore() as Identifiers;
  log(` -> connected ${identifiers.userId} [${identifiers.client.toUpperCase()}]`);

  await socket.join(identifiers.userId);

  socket.on(SOCKET_EVENTS.PLAY_NEXT, () => handlePlayNext(socket));
  socket.on(SOCKET_EVENTS.PLAY_PAUSE, () => handlePlayPause(socket));
  socket.on(SOCKET_EVENTS.PLAY_PREVIOUS, () => handlePlayPrevious(socket));
  socket.on(SOCKET_EVENTS.SWITCH_TRACK, (data) => handleSwitchTrack(socket, data));

  socket.on(
    SOCKET_EVENTS.DISCONNECT,
    (reason: string): Promise<void> => handleDisconnect(reason, socket, io, identifiers),
  );
}
