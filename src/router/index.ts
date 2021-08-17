import { Server, Socket } from 'socket.io';

import handleDisconnect from '../handlers/disconnect.handler';
import handlePlayNext from '../handlers/play-next.handler';
import handlePlayPrevious from '../handlers/play-previous.handler';
import * as handlerTypes from '../handlers/types';
import handleSwitchTrack from '../handlers/switch-track.handler';
import { Identifiers } from '../types';
import log from '../utilities/log';
import { SOCKET_EVENTS } from '../configuration';
import store from '../store';

export default async function router(io: Server, socket: Socket): Promise<void> {
  const identifiers = store.getStore() as Identifiers;
  log(` -> connected ${identifiers.userId} [${identifiers.client.toUpperCase()}]`);

  await socket.join(identifiers.userId);

  socket.on(SOCKET_EVENTS.PLAY_NEXT, (): boolean => handlePlayNext(socket, identifiers));
  socket.on(SOCKET_EVENTS.PLAY_PREVIOUS, (): boolean => handlePlayPrevious(socket, identifiers));
  socket.on(
    SOCKET_EVENTS.SWITCH_TRACK,
    (data: handlerTypes.SwitchTrackData): boolean => handleSwitchTrack(socket, data, identifiers),
  );

  socket.on(
    SOCKET_EVENTS.DISCONNECT,
    (reason: string): Promise<void> => handleDisconnect(reason, socket, io, identifiers),
  );
}
