import { ClientTypes, Track } from '../types';

export interface DefaultPayload {
  issuer: ClientTypes;
  target: ClientTypes;
}

export interface AvailablePlaylistPayload extends DefaultPayload {
  playlist: Track[];
}

export interface ErrorPayload extends DefaultPayload {
  error: string;
}

export interface PlayNextPayload extends DefaultPayload {
  id: string;
}

export interface RemoveAllPayload {
  issuer: ClientTypes,
  target: ClientTypes,
}

export interface SwitchTrackPayload extends DefaultPayload {
  link: string;
  track: Track;
}
