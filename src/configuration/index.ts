const { env: environment } = process;

export const ALLOWED_ORIGINS: string[] = environment.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((value: string): string => value.trim())
  : [];

export const ENVS = {
  development: 'development',
  heroku: 'heroku',
  production: 'production',
} as const;

export const { ENV = ENVS.development } = environment;

export const CLIENT_TYPES = {
  desktop: 'desktop',
  mobile: 'mobile',
  web: 'web',
} as const;

export const PORT = Number(environment.PORT) || 5622;

export const REDIS = {
  HOST: environment.REDIS_HOST || '',
  PASSWORD: environment.REDIS_PASSWORD || '',
  PORT: Number(environment.REDIS_PORT) || 6379,
  PREFIXES: {
    room: 'room',
    user: 'user',
  },
  TTL: 8 * 60 * 60, // 8 hours
  TTL_ROOM: 24 * 60 * 60, // 24 hours
} as const;

export const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  PLAY_NEXT: 'PLAY_NEXT',
  PLAY_PAUSE: 'PLAY_PAUSE',
  PLAY_PREVIOUS: 'PLAY_PREVIOUS',
  SWITCH_TRACK: 'SWITCH_TRACK',
} as const;
