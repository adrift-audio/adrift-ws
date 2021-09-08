import { Server, Socket } from 'socket.io';

import handleAvailablePlaylist from '../handlers/available-playlist.handler';
import handleDisconnect from '../handlers/disconnect.handler';
import handlePlayNext from '../handlers/play-next.handler';
import * as handlerTypes from '../handlers/types';
import handleSwitchTrack from '../handlers/switch-track.handler';
import { Identifiers } from '../types';
import notifyRoom from '../utilities/notify-room';
import log from '../utilities/log';
import { SOCKET_EVENTS } from '../configuration';
import store from '../store';

export default async function router(io: Server, socket: Socket): Promise<void> {
  const identifiers = store.getStore() as Identifiers;
  log(` -> connected ${identifiers.userId} [${identifiers.client.toUpperCase()}]`);

  await socket.join(identifiers.userId);
  notifyRoom(socket, identifiers);

  socket.on(
    SOCKET_EVENTS.AVAILABLE_PLAYLIST,
    (payload: handlerTypes.AvailablePlaylistPayload): boolean => handleAvailablePlaylist(
      socket,
      identifiers,
      payload,
    ),
  );
  socket.on(
    SOCKET_EVENTS.PLAY_NEXT,
    (payload: handlerTypes.PlayNextPayload): boolean => handlePlayNext(
      socket,
      identifiers,
      payload,
    ),
  );
  socket.on(
    SOCKET_EVENTS.SWITCH_TRACK,
    (payload: handlerTypes.SwitchTrackPayload): boolean => handleSwitchTrack(
      socket,
      identifiers,
      payload,
    ),
  );

  socket.on(
    SOCKET_EVENTS.DISCONNECT,
    (reason: string): Promise<void> => handleDisconnect(reason, socket, io, identifiers),
  );
}
