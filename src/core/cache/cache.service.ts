import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheService implements OnModuleDestroy {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cache.get<T>(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cache.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cache.del(key);
  }

  async reset(): Promise<void> {
    await this.cache.clear();
  }

  async onModuleDestroy() {
    if (this.cache.stores && Array.isArray(this.cache.stores)) {
      for (const store of this.cache.stores) {
        if (typeof (store as any).client?.disconnect === 'function') {
          await (store as any).client.disconnect();
        }
      }
    }
  }
}
