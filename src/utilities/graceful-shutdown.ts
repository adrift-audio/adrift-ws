import { RedisClient } from 'redis';
import { Server } from 'socket.io';

import log from './log';

export default function gracefulShutdown(
  signal: string,
  io: Server,
  redisClient: RedisClient,
): Error | void {
  log(`-- shutting down the server: ${signal}`);

  io.close((socketError: Error): Error | void => {
    if (socketError) {
      throw socketError;
    }

    log('-- io: stopped the server');

    redisClient.quit((redisError: Error): Error | void => {
      if (redisError) {
        throw redisError;
      }

      log('-- redis: connection closed');
      return process.exit(0);
    });
  });
}
