import { ClientTypes, Track } from '../types';

export interface DefaultPayload {
  issuer: ClientTypes;
  target: ClientTypes;
}

export interface AvailablePlaylistPayload extends DefaultPayload {
  playlist: Track[];
}

export interface PlayNextPayload extends DefaultPayload {
  id: string;
}

export interface SwitchTrackPayload extends DefaultPayload {
  link: string;
  track: Track;
}
