import axios from 'axios';
import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';

import {
  BACKEND_ENDPOINT,
  CLIENT_TYPES,
  MICROSERVICES_PASSPHRASE,
  REDIS,
  RESPONSE_MESSAGES,
} from '../configuration';
import errorResponse from '../utilities/error-response';
import { expire, get, set } from '../utilities/redis';
import { Identifiers, Next } from '../types';
import keyFormatter from '../utilities/key-formatter';
import store from '../store';

export default async function Authorize(socket: Socket, next: Next) {
  const { handshake: { query: { token: rawToken = '' } = {} } = {} } = socket;
  if (!rawToken) {
    return next(errorResponse(RESPONSE_MESSAGES.MISSING_TOKEN));
  }

  const token = String(rawToken);

  try {
    const decoded = await jwt.decode(token);
    if (!decoded || typeof decoded === 'string') {
      return next(errorResponse(RESPONSE_MESSAGES.INVALID_TOKEN));
    }

    const { client, userId } = decoded;
    if (!(client && userId)) {
      return next(errorResponse(RESPONSE_MESSAGES.INVALID_TOKEN));
    }

    const clientTypes = Object.values(CLIENT_TYPES);
    if (!clientTypes.includes(client)) {
      return next(errorResponse(RESPONSE_MESSAGES.INVALID_TOKEN));
    }

    const secretKey = keyFormatter(REDIS.PREFIXES.secret, userId);
    const redisSecret = await get(secretKey);

    if (redisSecret) {
      await jwt.verify(String(token), String(redisSecret));
      await expire(secretKey, REDIS.TTL);

      store.enterWith({
        client,
        socketId: socket.id,
        userId,
      } as Identifiers);

      return next();
    }

    const response = await axios({
      headers: {
        Passphrase: MICROSERVICES_PASSPHRASE,
      },
      method: 'GET',
      url: `${BACKEND_ENDPOINT}/api/auth/secret/${userId}`,
    });

    const { data: { data: { secret = '' } = {} } = {} } = response;
    if (!secret) {
      return next(errorResponse(RESPONSE_MESSAGES.ACCESS_DENIED));
    }

    await jwt.verify(String(token), secret);

    await set(secretKey, secret, 'EX', REDIS.TTL);

    store.enterWith({
      client,
      socketId: socket.id,
      userId,
    } as Identifiers);

    return next();
  } catch {
    return next(errorResponse(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR));
  }
}
