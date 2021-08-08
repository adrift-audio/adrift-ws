import axios from 'axios';
import { ExtendedError } from 'socket.io/dist/namespace';
import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';

import ErrorResponse from '../utilities/error-response';
import {
  BACKEND_ENDPOINT,
  CLIENT_TYPES,
  REDIS,
  RESPONSE_MESSAGES,
  SOCKET_EVENTS,
} from '../configuration';
import keyFormatter from '../utilities/key-formatter';
import { redisClient } from '../utilities/redis';
import store from '../store';

type Next = (error?: ExtendedError) => void;

export default async function Authorize(socket: Socket, next: Next) {
  const { handshake: { query: { token: rawToken = '' } = {} } = {} } = socket;
  if (!rawToken) {
    socket.emit(
      SOCKET_EVENTS.ERROR,
      ErrorResponse(RESPONSE_MESSAGES.MISSING_TOKEN),
    );
    return socket.disconnect(true);
  }

  const token = String(rawToken);

  try {
    const decoded = await jwt.decode(token);
    if (!decoded || typeof decoded === 'string') {
      socket.emit(
        SOCKET_EVENTS.ERROR,
        ErrorResponse(RESPONSE_MESSAGES.INVALID_TOKEN),
      );
      return socket.disconnect(true);
    }

    const { client, userId } = decoded;
    if (!(client && userId)) {
      socket.emit(
        SOCKET_EVENTS.ERROR,
        ErrorResponse(RESPONSE_MESSAGES.INVALID_TOKEN),
      );
      return socket.disconnect(true);
    }

    const clientTypes = Object.values(CLIENT_TYPES);
    if (!clientTypes.includes(client)) {
      socket.emit(
        SOCKET_EVENTS.ERROR,
        ErrorResponse(RESPONSE_MESSAGES.INVALID_TOKEN),
      );
      return socket.disconnect(true);
    }

    const secretKey = keyFormatter(REDIS.PREFIXES.secret, userId);
    const redisSecret = await redisClient.get(secretKey);
    if (redisSecret) {
      await jwt.verify(String(token), String(redisSecret));
      await redisClient.expire(secretKey, REDIS.TTL);

      store.enterWith({
        client,
        socketId: socket.id,
        userId,
      });

      return next();
    }

    const response = await axios({
      method: 'GET',
      url: `${BACKEND_ENDPOINT}/api/auth/secret/${userId}`,
    });

    const { data: { secret = '' } = {} } = response;
    if (!secret) {
      socket.emit(
        SOCKET_EVENTS.ERROR,
        ErrorResponse(RESPONSE_MESSAGES.ACCESS_DENIED),
      );
      return socket.disconnect(true);
    }

    await jwt.verify(String(token), secret);

    store.enterWith({
      client,
      socketId: socket.id,
      userId,
    });

    return next();
  } catch {
    socket.emit(
      SOCKET_EVENTS.ERROR,
      ErrorResponse(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR),
    );
    return socket.disconnect(true);
  }
}
