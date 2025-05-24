import IORedis from 'ioredis';
import { REDIS_URL } from '../../../config';
import { ICacheProvider } from '../../../../domain/providers/cache';

export class RedisCacheProvider implements ICacheProvider {
  private client = new IORedis(REDIS_URL);

  async get<T>(key: string): Promise<T | null> {
    const raw = await this.client.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const payload = JSON.stringify(value);
    if (ttlSeconds) {
      await this.client.set(key, payload, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, payload);
    }
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  disconnect(): void {
    this.client.disconnect();
  }
}

export const redisCacheProvider = new RedisCacheProvider();
