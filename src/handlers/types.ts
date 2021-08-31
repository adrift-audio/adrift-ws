import { ClientTypes, Track } from '../types';

export interface AvailablePlaylistPayload {
  issuer: ClientTypes;
  playlist: Track[];
  target: ClientTypes;
}

export interface SwitchTrackPayload {
  issuer: ClientTypes;
  link: string;
  target: ClientTypes;
  track: Track;
}
