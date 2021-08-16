export interface Track {
  added: number;
  name: string;
  path: string;
  size: number;
  type: string;
}

export interface SwitchTrackData {
  link: string;
  track: Track;
}
