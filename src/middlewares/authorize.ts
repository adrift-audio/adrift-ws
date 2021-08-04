import { ExtendedError } from 'socket.io/dist/namespace';
import { Socket } from 'socket.io';

import log from '../utilities/log';

export default function Authorize(socket: Socket, next: (error?: ExtendedError) => void) {
  log('authorize');
  return next();
}
