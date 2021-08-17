import { Server, Socket } from 'socket.io';

import { del, get, set } from '../utilities/redis';
import { Identifiers } from '../types';
import keyFormatter from '../utilities/key-formatter';
import log from '../utilities/log';
import { REDIS, SOCKET_EVENTS } from '../configuration';
import roomService from '../utilities/room-service';

export default async function disconnect(
  reason: string,
  socket: Socket,
  io: Server,
  identifiers: Identifiers,
): Promise<void> {
  const redisKey = keyFormatter(REDIS.PREFIXES.room, identifiers.userId);
  try {
    socket.to(identifiers.userId).emit(
      SOCKET_EVENTS.CLIENT_DISCONNECTED,
      {
        client: identifiers.client,
      },
    );

    socket.disconnect(true);
    const redisRoom = await get(redisKey);
    if (!redisRoom) {
      return null;
    }

    const parsedRoom = JSON.parse(redisRoom);

    const connectedSocketIds = [...await io.allSockets()];
    const actualizedRoom = roomService(connectedSocketIds, parsedRoom);

    const filteredRoom = actualizedRoom.filter(
      (item: Identifiers) => item.socketId !== identifiers.socketId,
    );

    await set(
      redisKey,
      JSON.stringify(filteredRoom),
      'EX',
      REDIS.TTL_ROOM,
    );

    return log(` -> disconnected ${identifiers.userId} [${
      identifiers.client.toUpperCase()
    }] (${reason})`);
  } catch (error) {
    log(error);
    return del(redisKey);
  }
}
