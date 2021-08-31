import { ExtendedError } from 'socket.io/dist/namespace';

import { CLIENT_TYPES } from '../configuration';

export type ClientTypes = keyof typeof CLIENT_TYPES;

export interface Identifiers {
  client: ClientTypes;
  socketId: string;
  userId: string;
}

export type Next = (error?: ExtendedError) => void;

export interface Track {
  added: number;
  duration: number;
  id: string;
  name: string;
  size: number;
  type: string;
}
