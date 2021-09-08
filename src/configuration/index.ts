const { env: environment } = process;

export const ALLOWED_ORIGINS: string[] = environment.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((value: string): string => value.trim())
  : [];

export const ENVS = {
  development: 'development',
  heroku: 'heroku',
  production: 'production',
} as const;

export const {
  BACKEND_ENDPOINT = 'http://localhost:5611',
  ENV = ENVS.development,
  MICROSERVICES_PASSPHRASE = '',
} = environment;

export const CLIENT_TYPES = {
  desktop: 'desktop',
  mobile: 'mobile',
  web: 'web',
} as const;

export const PORT = Number(environment.PORT) || 5622;

export const REDIS = {
  EVENTS: {
    CONNECT: 'connect',
    ERROR: 'error',
  },
  HOST: environment.REDIS_HOST || '',
  PASSWORD: environment.REDIS_PASSWORD || '',
  PORT: Number(environment.REDIS_PORT) || 6379,
  PREFIXES: {
    room: 'room',
    secret: 'secret',
    user: 'user',
  },
  TTL: 8 * 60 * 60, // 8 hours
  TTL_ROOM: 24 * 60 * 60, // 24 hours
} as const;

export const RESPONSE_MESSAGES = {
  ACCESS_DENIED: 'ACCESS_DENIED',
  CLIENT_TYPE_IS_ALREADY_ONLINE: 'CLIENT_TYPE_IS_ALREADY_ONLINE',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  INVALID_TOKEN: 'INVALID_TOKEN',
  MISSING_TOKEN: 'MISSING_TOKEN',
} as const;

export const SOCKET_EVENTS = {
  ADD_FILE: 'ADD_FILE',
  AVAILABLE_PLAYLIST: 'AVAILABLE_PLAYLIST',
  CLIENT_CONNECTED: 'CLIENT_CONNECTED',
  CLIENT_DISCONNECTED: 'CLIENT_DISCONNECTED',
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  ERROR: 'ERROR',
  PLAY_NEXT: 'PLAY_NEXT',
  REMOVE_FILE: 'REMOVE_FILE',
  SWITCH_TRACK: 'SWITCH_TRACK',
} as const;
