import { promisify } from 'util';
import redis, { RedisClient } from 'redis';

import { REDIS } from '../configuration';

const client: RedisClient = redis.createClient({
  host: REDIS.HOST,
  password: REDIS.PASSWORD,
  port: REDIS.PORT,
});

const del: Promise<any> = promisify(client.del).bind(client);
const expire: Promise<any> = promisify(client.expire).bind(client);
const get: Promise<any> = promisify(client.get).bind(client);
const set: Promise<any> = promisify(client.set).bind(client);

client.on('error', (error: Error): Error => {
  throw error;
});

export {
  client as RedisClient,
  del,
  expire,
  get,
  set,
};
