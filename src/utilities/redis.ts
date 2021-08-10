import { promisify } from 'util';
import redis, { RedisClient } from 'redis';

import { ENV, ENVS, REDIS } from '../configuration';

interface RedisConfiguration {
  host: string;
  password?: string;
  port: number;
}

const configuration: RedisConfiguration = {
  host: REDIS.HOST,
  port: REDIS.PORT,
};

if (ENV !== ENVS.development) {
  configuration.password = REDIS.PASSWORD;
}

const client: RedisClient = redis.createClient(configuration);

const del: (key: string) => Promise<any> = promisify(client.del).bind(client);
const expire: (
  key: string,
  expiration: number,
) => Promise<any> = promisify(client.expire).bind(client);
const get: (key: string) => Promise<any> = promisify(client.get).bind(client);
const set: (
  key: string,
  value: string,
  type: string,
  expiration: number,
) => Promise<any> = promisify(client.set).bind(client);

client.on(REDIS.EVENTS.ERROR, (error: Error): Error => {
  throw error;
});

export {
  client as redisClient,
  del,
  expire,
  get,
  set,
};
