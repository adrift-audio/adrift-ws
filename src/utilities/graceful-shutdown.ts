import { RedisClient } from 'redis';
import { Server } from 'socket.io';

import log from './log';

export default function gracefulShutdown(
  signal: string,
  io: Server,
  redisClient: RedisClient,
): Error | void {
  log(`-- shutting down the server: ${signal}`);

  io.close((error: Error): Error | void => {
    if (error) {
      throw error;
    }

    return log('-- io: stopped the server');
  });

  redisClient.quit((error: Error): Error | void => {
    if (error) {
      throw error;
    }

    return log('-- redis: connection closed');
  });
}
