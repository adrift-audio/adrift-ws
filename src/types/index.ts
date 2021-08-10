import { ExtendedError } from 'socket.io/dist/namespace';

import { CLIENT_TYPES } from '../configuration';

export interface Identifiers {
  client: keyof typeof CLIENT_TYPES;
  socketId: string;
  userId: string;
}

export type Next = (error?: ExtendedError) => void;
