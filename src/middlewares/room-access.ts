import { CLIENT_TYPES, REDIS, RESPONSE_MESSAGES } from '../configuration';
import errorResponse from '../utilities/error-response';
import { get, set } from '../utilities/redis';
import { Identifiers, Next } from '../types';
import keyFormatter from '../utilities/key-formatter';
import store from '../store';
import roomService from '../utilities/room-service';

export default async function roomAccess(io: any, next: Next): Promise<void> {
  try {
    const identifiers = store.getStore() as Identifiers;
    const roomKey = keyFormatter(REDIS.PREFIXES.room, identifiers.userId);
    const redisRoom = await get(roomKey);

    if (!redisRoom || typeof redisRoom !== 'string') {
      await set(roomKey, JSON.stringify([identifiers]), 'EX', REDIS.TTL_ROOM);
      return next();
    }

    let room: Identifiers[];
    try {
      room = JSON.parse(redisRoom);
    } catch {
      await set(roomKey, JSON.stringify([identifiers]), 'EX', REDIS.TTL_ROOM);
      return next();
    }

    if (!Array.isArray(room) || room.length === 0) {
      await set(roomKey, JSON.stringify([identifiers]), 'EX', REDIS.TTL_ROOM);
      return next();
    }

    const connectedSocketIds = [...await io.allSockets()];
    console.log('connected', connectedSocketIds);
    const actualizedRoom = roomService(connectedSocketIds, room);
    console.log(actualizedRoom);

    if (identifiers.client === CLIENT_TYPES.web) {
      actualizedRoom.push(identifiers);
      await set(roomKey, JSON.stringify(actualizedRoom), 'EX', REDIS.TTL_ROOM);
      return next();
    }

    const connectedRoomClients = actualizedRoom.map((item: Identifiers): string => item.client);
    if (!connectedRoomClients.includes(identifiers.client)) {
      actualizedRoom.push(identifiers);
      await set(roomKey, JSON.stringify(actualizedRoom), 'EX', REDIS.TTL_ROOM);
      return next();
    }

    const [alreadyConnected] = actualizedRoom.filter(
      (item: Identifiers): boolean => item.client === identifiers.client,
    );
    if (connectedSocketIds.includes(alreadyConnected.socketId)) {
      return next(errorResponse(RESPONSE_MESSAGES.CLIENT_TYPE_IS_ALREADY_ONLINE));
    }

    const filteredRoom = actualizedRoom.filter(
      (item: Identifiers): boolean => item.client !== identifiers.client,
    );
    filteredRoom.push(identifiers);
    await set(roomKey, JSON.stringify(filteredRoom), 'EX', REDIS.TTL_ROOM);

    return next();
  } catch (error) {
    console.log('err', error);
    return next(errorResponse(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR));
  }
}
