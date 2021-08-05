import axios from 'axios';
import { ExtendedError } from 'socket.io/dist/namespace';
import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';

import ErrorResponse from '../utilities/error-response';
import Log from '../utilities/log';
import {
  BACKEND_ENDPOINT,
  CLIENT_TYPES,
  RESPONSE_MESSAGES,
  SOCKET_EVENTS,
} from '../configuration';

export default async function Authorize(socket: Socket, next: (error?: ExtendedError) => void) {
  const { handshake: { query: { token: rawToken = '' } = {} } = {} } = socket;
  if (!rawToken) {
    socket.emit(
      SOCKET_EVENTS.ERROR,
      ErrorResponse(RESPONSE_MESSAGES.MISSING_TOKEN),
    );
    return socket.disconnect();
  }

  const token = String(rawToken);

  try {
    const decoded = await jwt.decode(token);
    if (!decoded || typeof decoded === 'string') {
      socket.emit(
        SOCKET_EVENTS.ERROR,
        ErrorResponse(RESPONSE_MESSAGES.INVALID_TOKEN),
      );
      return socket.disconnect();
    }

    const { client, userId } = decoded;
    if (!(client && userId)) {
      socket.emit(
        SOCKET_EVENTS.ERROR,
        ErrorResponse(RESPONSE_MESSAGES.INVALID_TOKEN),
      );
      return socket.disconnect();
    }

    const clientTypes = Object.values(CLIENT_TYPES);
    if (!clientTypes.includes(client)) {
      socket.emit(
        SOCKET_EVENTS.ERROR,
        ErrorResponse(RESPONSE_MESSAGES.INVALID_TOKEN),
      );
      return socket.disconnect();
    }

    // TODO: load secret from Redis


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
      return socket.disconnect();
    }

    await jwt.verify(String(token), secret);

    return next();
  } catch (error) {
    Log(error);
  }
}
